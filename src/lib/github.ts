import { getDoc, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";
import { isAdmin } from "./firestore"; // Importar a função isAdmin

// Interface para dados brutos da API do GitHub
interface GithubApiRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  topics: string[];
  pushed_at: string;
  language: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  default_branch: string; // Add default_branch
}

// Interface para os dados do projeto como usados no frontend
interface GithubPagesRepo {
  id: number;
  name: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  hasDemo: boolean; // Novo campo
  topics: string[];
  lastUpdated: string;
  language: string;
  stars: number;
  imageUrl: string;
}

// Interface para os dados armazenados no cache (localStorage e Firestore)
interface CachedProjects {
  projects: GithubPagesRepo[];
  timestamp: number | any; // number para localStorage, Firestore Timestamp para Firestore
}

const localStorageKey = "githubProjects";
const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";

/**
 * Extrai metadados (categoria, hospedagem) de um conteúdo README.
 */
const extractReadmeMetadata = (readmeContent: string): { category?: string; demoUrl?: string } => {
  const categoryMatch = readmeContent.match(/<!--\s*categoria:\s*([^->]+)\s*-->/);
  const demoUrlMatch = readmeContent.match(/<!--\s*hospedagem:\s*([^->]+)\s*-->/);

  return {
    category: categoryMatch?.[1]?.trim(),
    demoUrl: demoUrlMatch?.[1]?.trim(),
  };
};

/**
 * Procura qualquer link no README.
 */
function findProjectDemoLink(readme: string, username: string, repoName: string): string | null {
  const pattern = new RegExp(`https?:\\/\\/${username}\\.github\\.io\\/${repoName}\\/?`, "i");
  const match = readme.match(pattern);
  return match ? match[0] : null;
}

/**
 * Busca o conteúdo do README de um repositório específico.
 */
const fetchReadmeContent = async (username: string, repoName: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`, {
      headers: {
        Accept: "application/vnd.github.v3.raw", // Solicita o conteúdo raw
        Authorization: `Bearer ${GITHUB_TOKEN}`
      },
      cache: 'no-store' // Garante que estamos buscando o README mais recente
    });
    if (!response.ok) {
      // README pode não existir, não tratar como erro fatal
      if (response.status === 404) {
        console.warn(`README not found for ${username}/${repoName}`);
        return null;
      }
      throw new Error(`Failed to fetch README for ${repoName}: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching README for ${repoName}:`, error);
    return null; // Retorna null em caso de erro para não interromper o processo
  }
};

/**
 * Extrai a primeira URL de imagem correspondente ao padrão do README.
 * Prioritiza URLs absolutas raw.githubusercontent.com, depois tenta converter
 * URLs relativas começando com './public/', '/public/', ou 'public/' dentro de markdown ![alt](url) ou HTML <img>.
 * Uses the provided defaultBranch for constructing absolute URLs from relative paths.
 */
const extractImageUrlFromReadme = (readmeContent: string | null, username: string, repoName: string, defaultBranch: string): string | null => {
  if (!readmeContent) {
    console.log(`[${username}/${repoName}] No README content.`);
    return null;
  }
  console.log(`[${username}/${repoName}] Using default branch: ${defaultBranch}`);

  // 1. Tenta encontrar URLs absolutas raw.githubusercontent.com
  // Regex now includes the dynamic defaultBranch
  const absoluteRegex = new RegExp(
    `(?:!\\[.*?\\]\\(|\\s|^)(https:\/\/raw\\.githubusercontent\\.com\/${username}\/${repoName}\/${defaultBranch}\/[^\\s()]*\\.(?:png|jpg|jpeg|gif|webp|svg))`,
    'i'
  );
  let match = readmeContent.match(absoluteRegex);
  if (match && match[1]) {
    console.log(`[${username}/${repoName}] Found absolute URL: ${match[1]}`);
    return match[1];
  }

  // 2. Tenta encontrar relativa em Markdown ![alt](url)
  // Refined regex: explicitly look for ./ or / or nothing before public/
  const relativeMdRegex = /!\[.*?\]\(\s*((?:\.\/|\/|)public\/[^)]+\.(?:png|jpg|jpeg|gif|webp|svg))\s*\)/i;
  // Log right before attempting the relative MD match
  console.log(`[${username}/${repoName}] Attempting relative MD regex match...`);
  match = readmeContent.match(relativeMdRegex);
  if (match && match[1]) {
    // Path captured in group 1, remove leading ./ or / if present
    const relativePath = match[1].replace(/^\.?\//, '');
    const absoluteUrl = `https://raw.githubusercontent.com/${username}/${repoName}/${defaultBranch}/${relativePath}`;
    console.log(`[${username}/${repoName}] Found relative MD URL: ${match[1]}, Converted to: ${absoluteUrl}`);
    return absoluteUrl;
  } else {
    console.log(`[${username}/${repoName}] Relative MD regex did not match.`);
  }

  // 3. Tenta encontrar relativa em HTML <img src="...">
  const relativeHtmlRegex = /<img\s+[^>]*?src\s*=\s*["']\s*(\.?\/?public\/[^"']+\.(?:png|jpg|jpeg|gif|webp|svg))\s*["'][^>]*?>/i;
  // Log right before attempting the relative HTML match
  console.log(`[${username}/${repoName}] Attempting relative HTML regex match...`);
  match = readmeContent.match(relativeHtmlRegex);
  if (match && match[1]) {
    const relativePath = match[1].replace(/^\.?\//, '');
    const absoluteUrl = `https://raw.githubusercontent.com/${username}/${repoName}/${defaultBranch}/${relativePath}`;
    console.log(`[${username}/${repoName}] Found relative HTML URL: ${match[1]}, Converted to: ${absoluteUrl}`);
    return absoluteUrl;
  } else {
    console.log(`[${username}/${repoName}] Relative HTML regex did not match.`);
  }


  // 4. Se não encontrou nenhum dos padrões
  console.log(`[${username}/${repoName}] No matching image URL found in README after all checks.`);
  return null;
};


/**
 * Busca e processa os projetos do GitHub, utilizando cache e API.
 */
export async function fetchGithubPagesProjects(username: string): Promise<GithubPagesRepo[]> {
  // --- 1. Tentar carregar do localStorage ---
  try {
    const localData = localStorage.getItem(localStorageKey);
    if (localData) {
      const parsedData: CachedProjects = JSON.parse(localData);
      // Verifica se o cache local é válido (menos de 1 semana)
      if (Date.now() - parsedData.timestamp < oneWeekInMs) {
        console.log("Loading projects from localStorage cache.");
        // Log the imageUrl of the first project from cache
        if (parsedData.projects && parsedData.projects.length > 0) {
            console.log(`[Cache - localStorage] First project imageUrl: ${parsedData.projects[0].imageUrl}`);
        }
        return parsedData.projects;
      } else {
        console.log("localStorage cache expired.");
      }
    }
  } catch (error) {
    console.error("Error reading localStorage:", error);
    // Continua para a próxima fonte de dados
  }

  // --- 2. Tentar carregar do Firestore ---
  const firestoreRef = doc(db, "github", "repositories");
  try {
    const firestoreSnap = await getDoc(firestoreRef);
    if (firestoreSnap.exists()) {
      const firestoreData = firestoreSnap.data() as CachedProjects;
      // Verifica se o cache do Firestore é válido (menos de 1 semana)
      if (firestoreData.timestamp && Date.now() - firestoreData.timestamp.toMillis() < oneWeekInMs) {
        console.log("Loading projects from Firestore cache.");
        // Log the imageUrl of the first project from cache
        if (firestoreData.projects && firestoreData.projects.length > 0) {
            console.log(`[Cache - Firestore] First project imageUrl: ${firestoreData.projects[0].imageUrl}`);
        }
        // Atualiza o localStorage com os dados do Firestore
        localStorage.setItem(
          localStorageKey,
          JSON.stringify({ projects: firestoreData.projects, timestamp: Date.now() })
        );
        return firestoreData.projects;
      } else {
         console.log("Firestore cache expired.");
      }
    }
  } catch (error) {
    console.error("Error reading Firestore:", error);
    // Continua para a próxima fonte de dados
  }

  // --- 3. Buscar da API do GitHub (se cache inválido ou inexistente) ---
  console.log("Fetching fresh projects from GitHub API.");
  try {
    // Busca a lista de repositórios
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, {
      headers: { 
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`
      },
      cache: 'no-store' // Garante dados frescos da lista de repos
    });

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error (repos): ${reposResponse.status}`);
    }

    const repos: GithubApiRepo[] = await reposResponse.json();
    const relevantRepos = repos.filter(repo => !repo.fork && !repo.archived);
    let defaultImageIndex = 0;

    // Processa cada repositório para buscar README e formatar
    const processedProjects = await Promise.all(
      relevantRepos.map(async (repo): Promise<GithubPagesRepo | null> => {
        // Busca o conteúdo do README
        const readmeContent = await fetchReadmeContent(username, repo.name);
        const metadata = readmeContent ? extractReadmeMetadata(readmeContent) : {};

        // Determina a URL de demonstração
        const linkInReadme = readmeContent ? findProjectDemoLink(readmeContent, username, repo.name) : null;
        const demoUrl = metadata.demoUrl || repo.homepage || linkInReadme || `https://${username}.github.io/${repo.name}/`;

        // Adiciona a categoria às topics, se existir
        const topics = repo.topics || [];
        if (metadata.category && !topics.map(t => t.toLowerCase()).includes(metadata.category.toLowerCase())) {
          topics.push(metadata.category); // Mantém o caso original ao adicionar, mas verifica em minúsculas
        }

        // Verifica e adiciona "web" em minúsculas se houver demo
        const lowerCaseTopics = topics.map(t => t.toLowerCase());
        if (linkInReadme && !lowerCaseTopics.includes("web")) {
          topics.push("web"); // Adiciona "web" em minúsculas como flag
        }

        // Verifica e adiciona a linguagem principal em minúsculas
        const mainLang = repo.language?.toLowerCase();
        if (mainLang && mainLang !== "n/a" && !lowerCaseTopics.includes(mainLang)) {
          topics.push(mainLang); // Adiciona a linguagem em minúsculas para filtro
        }

        // Extrai a imagem do README, passing the repo's default_branch
        let imageUrl = extractImageUrlFromReadme(readmeContent, username, repo.name, repo.default_branch || 'main'); // Pass default branch, fallback to 'main'
        if (!imageUrl) {
          imageUrl = defaultImageIndex % 2 === 0 ? '/images/projects/code.png' : '/images/projects/code2.jpg';
          console.log(`[${username}/${repo.name}] Using default image: ${imageUrl}`);
          defaultImageIndex++;
        } else {
           console.log(`[${username}/${repo.name}] Using extracted image: ${imageUrl}`);
        }

        // Formata a data da última atualização
        const lastUpdated = new Date(repo.pushed_at).toLocaleDateString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });

        const projectData: GithubPagesRepo = {
          id: repo.id,
          name: repo.name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          description: repo.description || `Projeto desenvolvido com ${repo.language || 'tecnologias web'}.`,
          githubUrl: repo.html_url,
          demoUrl: demoUrl,
          hasDemo: !!linkInReadme,
          topics: topics, // Contém 'web' e a linguagem principal em minúsculas se aplicável
          lastUpdated: lastUpdated,
          language: repo.language || 'N/A', // Mantém o nome original da linguagem para exibição
          stars: repo.stargazers_count,
          imageUrl: imageUrl, // Usa a imagem extraída ou a padrão
        };
        // Log the final assigned imageUrl for this project
        console.log(`[${username}/${repo.name}] Final assigned imageUrl: ${projectData.imageUrl}`);
        return projectData;
      })
    );

    // Filtra possíveis resultados nulos (embora improvável no fluxo atual)
    const finalProjects = processedProjects.filter(p => p !== null) as GithubPagesRepo[];

    // --- 4. Atualizar Caches ---
    const dataToCache: CachedProjects = {
      projects: finalProjects,
      timestamp: Date.now(), // Timestamp para localStorage
    };

    // Atualiza localStorage
    try {
      console.log("Attempting to write to localStorage...");
      localStorage.setItem(localStorageKey, JSON.stringify(dataToCache));
      console.log("Successfully wrote to localStorage.");
      // Verify write by reading back (optional)
      // const writtenData = localStorage.getItem(localStorageKey);
      // console.log("Data read back from localStorage:", writtenData ? JSON.parse(writtenData) : 'null');
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }

    // Atualiza Firestore SE for admin
    if (isAdmin()) {
      console.log("Admin user detected. Updating Firestore cache.");
      try {
        await setDoc(firestoreRef, {
          projects: finalProjects,
          timestamp: serverTimestamp(), // Timestamp do servidor para Firestore
        });
      } catch (error) {
        console.error("Error writing to Firestore (admin):", error);
        // Não impede o retorno dos dados, mas registra o erro
      }
    } else {
      console.log("Non-admin user. Skipping Firestore update.");
    }

    return finalProjects;

  } catch (error) {
    console.error('Failed to fetch projects from GitHub API:', error);
    // Em caso de falha total da API, retorna um array vazio ou lança o erro
    // Poderia retornar dados estáticos como fallback aqui, se desejado.
    // Por ora, retorna vazio para indicar falha na busca dinâmica.
    return [];
  }
}
