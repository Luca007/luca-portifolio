import { getDoc, setDoc, doc, serverTimestamp, Timestamp, collection, writeBatch, getDocs } from "firebase/firestore"; // Added collection, writeBatch, getDocs
import { db } from "./firebase";
import { auth } from "./firebase";
import { isAdmin } from "./firestore";

// --- Interfaces ---

// Raw data from GitHub API
interface GithubApiRepo {
  id: number;
  name: string;
  description: string | null; // Can be null
  html_url: string;
  homepage: string | null;
  topics: string[];
  pushed_at: string; // ISO 8601 string
  created_at: string; // ISO 8601 string
  language: string | null; // Can be null
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  default_branch: string;
}

// Structure for Cache (localStorage & githubCache/projects doc)
// This remains largely the same for quick loading
interface GithubPagesRepoCache {
  id: number;
  name: string;
  description: string;
  githubUrl: string;
  demoUrl: string; // Keep for potential use, even if not primary field in target doc
  hasDemo: boolean; // Keep for potential use
  topics: string[];
  lastUpdated: string; // Formatted date for display
  language: string;
  stars: number;
  imageUrl: string;
  // --- Fields needed for intelligent sync ---
  pushed_at_raw: string; // Keep the original pushed_at string from API
  created_at_raw: string; // Keep the original created_at string from API
}

// Structure for individual documents in the 'githubProjects' collection
interface GithubProjectDoc {
    nome: string; // Matches prompt
    descricao: string; // Matches prompt
    urlRepositorio: string; // Matches prompt
    urlImagem: string | null; // Matches prompt (allow null)
    linguagemPrincipal: string; // Matches prompt
    // Timestamps / Dates
    dataCriacao: Timestamp; // Matches prompt (created_at from GitHub)
    dataUltimaAtualizacaoGithub: Timestamp; // Matches prompt (pushed_at from GitHub)
    dataUltimaAtualizacaoBanco: Timestamp; // Matches prompt (Firestore server timestamp)
    // Optional/Extra fields from previous implementation (can be kept or removed)
    urlDemo: string | null;
    temDemo: boolean;
    tags: string[];
    estrelas: number;
}

// Interface for the simple blob cache document
interface CachedProjectsBlob {
  projects: GithubPagesRepoCache[];
  timestamp: number | Timestamp;
}

// --- Constants ---
const localStorageKey = "githubProjects";
const firestoreCacheDocPath = "githubCache/projects"; // Path for the simple blob cache
const firestoreProjectCollectionPath = "githubProjects"; // Path for the detailed project collection
const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";

// --- Helper Functions ---
const extractReadmeMetadata = (readmeContent: string): { category?: string; demoUrl?: string } => {
  const categoryMatch = readmeContent.match(/<!--\s*categoria:\s*([^->]+)\s*-->/);
  const demoUrlMatch = readmeContent.match(/<!--\s*hospedagem:\s*([^->]+)\s*-->/);

  return {
    category: categoryMatch?.[1]?.trim(),
    demoUrl: demoUrlMatch?.[1]?.trim(),
  };
};
function findProjectDemoLink(readme: string, username: string, repoName: string): string | null {
  const pattern = new RegExp(`https?:\\/\\/${username}\\.github\\.io\\/${repoName}\\/?`, "i");
  const match = readme.match(pattern);
  return match ? match[0] : null;
}
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
 * Fetches projects, prioritizing cache (Firestore blob for admin, localStorage, then API).
 * Triggers detailed Firestore collection update if fetching from API as admin.
 */
export async function fetchGithubPagesProjects(username: string): Promise<GithubPagesRepoCache[]> {
  const userIsAdmin = isAdmin();
  const firestoreCacheRef = doc(db, firestoreCacheDocPath);

  // --- 1. Try Firestore Blob Cache (Admin Only) ---
  if (userIsAdmin) {
    try {
      const firestoreSnap = await getDoc(firestoreCacheRef);
      if (firestoreSnap.exists()) {
        const firestoreData = firestoreSnap.data() as CachedProjectsBlob;
        if (firestoreData.timestamp && Date.now() - firestoreData.timestamp.toMillis() < oneWeekInMs) {
          console.log("Loading projects from Firestore cache blob (admin).");
          localStorage.setItem(localStorageKey, JSON.stringify({ projects: firestoreData.projects, timestamp: Date.now() }));
          return firestoreData.projects;
        } else {
          console.log("Firestore cache blob expired (admin).");
        }
      } else {
         console.log("No Firestore cache blob found (admin).");
      }
    } catch (error) {
      console.error("Error reading Firestore cache blob (admin):", error);
    }
  }

  // --- 2. Try LocalStorage Cache ---
  try {
    const localDataString = localStorage.getItem(localStorageKey);
    if (localDataString) {
      const parsedData: CachedProjectsBlob = JSON.parse(localDataString);
      if (parsedData.timestamp && Date.now() - parsedData.timestamp < oneWeekInMs) {
        console.log("Loading projects from localStorage cache.");
        return parsedData.projects;
      } else {
        console.log("localStorage cache expired.");
      }
    }
  } catch (error) {
    console.error("Error reading localStorage:", error);
  }

  // --- 3. Fetch from GitHub API ---
  console.log("Fetching fresh projects from GitHub API.");
  try {
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, {
      headers: { Accept: "application/vnd.github.v3+json", Authorization: `Bearer ${GITHUB_TOKEN}` },
      cache: 'no-store'
    });

    if (!reposResponse.ok) throw new Error(`GitHub API error (repos): ${reposResponse.status}`);

    const repos: GithubApiRepo[] = await reposResponse.json();
    const relevantRepos = repos.filter(repo => !repo.fork && !repo.archived);
    let defaultImageIndex = 0;

    const processedProjects: GithubPagesRepoCache[] = await Promise.all(
      relevantRepos.map(async (repo): Promise<GithubPagesRepoCache> => { // Return non-null
        const readmeContent = await fetchReadmeContent(username, repo.name);
        const metadata = readmeContent ? extractReadmeMetadata(readmeContent) : {};
        const linkInReadme = readmeContent ? findProjectDemoLink(readmeContent, username, repo.name) : null;
        const demoUrl = metadata.demoUrl || repo.homepage || linkInReadme || `https://${username}.github.io/${repo.name}/`; // Keep original logic for demoUrl determination
        const hasDemo = !!linkInReadme || !!repo.homepage || !!metadata.demoUrl; // More robust check for demo presence

        const topics = repo.topics || [];
        if (metadata.category && !topics.map(t => t.toLowerCase()).includes(metadata.category.toLowerCase())) {
          topics.push(metadata.category);
        }
        // Add language and 'web' tag logic if needed (similar to previous version)
        const lowerCaseTopics = topics.map(t => t.toLowerCase());
         if (hasDemo && !lowerCaseTopics.includes("web")) {
           topics.push("web");
         }
         const mainLang = repo.language?.toLowerCase();
         if (mainLang && mainLang !== "n/a" && !lowerCaseTopics.includes(mainLang)) {
           topics.push(mainLang);
         }


        let imageUrl = extractImageUrlFromReadme(readmeContent, username, repo.name, repo.default_branch || 'main');
        if (!imageUrl) {
          imageUrl = defaultImageIndex % 2 === 0 ? '/images/projects/code.png' : '/images/projects/code2.jpg';
          defaultImageIndex++;
        }

        const lastUpdated = new Date(repo.pushed_at).toLocaleDateString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });

        // Map to the Cache structure
        return {
          id: repo.id,
          name: repo.name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
          description: repo.description || `Projeto desenvolvido com ${repo.language || 'tecnologias web'}.`,
          githubUrl: repo.html_url,
          demoUrl: demoUrl, // URL determined above
          hasDemo: hasDemo, // Boolean flag
          topics: topics,
          lastUpdated: lastUpdated, // Formatted for display
          language: repo.language || 'N/A',
          stars: repo.stargazers_count,
          imageUrl: imageUrl,
          // Raw data for sync
          pushed_at_raw: repo.pushed_at, // Keep original ISO string
          created_at_raw: repo.created_at, // Keep original ISO string
        };
      })
    );

    // --- 4. Update Caches ---
    const cacheBlobData: CachedProjectsBlob = {
      projects: processedProjects,
      timestamp: Date.now(),
    };

    // Update localStorage
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(cacheBlobData));
      console.log("Updated localStorage cache.");
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }

    // Update Firestore Blob Cache and Trigger Detailed Update (if admin)
    if (userIsAdmin) {
      console.log("Admin user detected after API fetch.");
      try {
        // Update the simple blob cache
        await setDoc(firestoreCacheRef, {
          projects: processedProjects,
          timestamp: serverTimestamp(),
        });
        console.log("Updated Firestore cache blob (admin).");

        // Trigger the detailed, project-by-project update
        console.log("fetchGithubPagesProjects: Triggering updateFirestoreProjectCollection after API fetch...");
        await updateFirestoreProjectCollection(processedProjects); // Make sure this call happens

      } catch (error) {
        console.error("Error updating Firestore cache blob or triggering detailed update (admin):", error);
      }
    } else {
      console.log("Non-admin user. Skipping Firestore updates after API fetch.");
    }

    return processedProjects;

  } catch (error) {
    console.error('Failed to fetch projects from GitHub API:', error);
    return [];
  }
}

/**
 * Performs intelligent update of the 'githubProjects' collection in Firestore.
 * Compares pushed_at dates and enforces a 7-day refresh.
 * Uses batch writes for efficiency.
 * @param projectsData Array of project data (GithubPagesRepoCache) from API or localStorage.
 */
export const updateFirestoreProjectCollection = async (projectsData: GithubPagesRepoCache[]) => {
    // Add extra check for isAdmin just in case it's called directly elsewhere
    if (!isAdmin()) {
        console.log("updateFirestoreProjectCollection: Skipping update - User is not admin.");
        return;
    }
    if (!projectsData || projectsData.length === 0) {
        console.log("updateFirestoreProjectCollection: Skipping update - No project data provided.");
        return;
    }

    console.log(`updateFirestoreProjectCollection: Starting update for ${projectsData.length} projects...`);
    const batch = writeBatch(db);
    const projectsCollectionRef = collection(db, firestoreProjectCollectionPath);
    let updatesPerformed = 0;
    let creationsPerformed = 0;
    let errorsEncountered = 0;

    try {
        for (const project of projectsData) {
            // Add log for each project being processed
            console.log(`updateFirestoreProjectCollection: Processing project ID ${project.id} (${project.name})...`);
            const docRef = doc(projectsCollectionRef, String(project.id)); // Use GitHub ID as Firestore Doc ID

            let incomingPushedAt: Timestamp | null = null;
            let incomingCreatedAt: Timestamp | null = null;
            try {
                incomingPushedAt = Timestamp.fromDate(new Date(project.pushed_at_raw));
                incomingCreatedAt = Timestamp.fromDate(new Date(project.created_at_raw));
            } catch (dateError) {
                console.error(`updateFirestoreProjectCollection: Invalid date format for project ID ${project.id} (${project.name}). Skipping project. Raw dates: pushed='${project.pushed_at_raw}', created='${project.created_at_raw}'`, dateError);
                errorsEncountered++;
                continue; // Skip this project if dates are invalid
            }

            let shouldWrite = false;
            let isNewDoc = false;

            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const existingData = docSnap.data() as GithubProjectDoc;
                    const existingPushedAt = existingData.dataUltimaAtualizacaoGithub;
                    const lastDbUpdate = existingData.dataUltimaAtualizacaoBanco;
                    console.log(`updateFirestoreProjectCollection: [${project.name}] Exists. Existing pushed_at: ${existingPushedAt?.toDate()}, Last DB update: ${lastDbUpdate?.toDate()}`);


                    // Condition 1: GitHub repo was updated
                    if (!existingPushedAt || existingPushedAt.toMillis() !== incomingPushedAt.toMillis()) {
                        shouldWrite = true;
                        console.log(`updateFirestoreProjectCollection: [${project.name}] Decision: Update needed (GitHub repo updated).`);
                    }
                    // Condition 2: 7 days passed since last DB update
                    else if (lastDbUpdate && (Date.now() - lastDbUpdate.toMillis() > oneWeekInMs)) {
                        shouldWrite = true;
                        console.log(`updateFirestoreProjectCollection: [${project.name}] Decision: Update needed (7-day refresh).`);
                    } else {
                         console.log(`updateFirestoreProjectCollection: [${project.name}] Decision: No update needed.`);
                    }

                } else {
                    shouldWrite = true;
                    isNewDoc = true;
                    console.log(`updateFirestoreProjectCollection: [${project.name}] Decision: Create new document.`);
                }

                // Prepare data and add to batch if needed
                if (shouldWrite) {
                    const projectDocData: GithubProjectDoc = {
                        nome: project.name,
                        descricao: project.description,
                        urlRepositorio: project.githubUrl,
                        urlImagem: project.imageUrl,
                        linguagemPrincipal: project.language,
                        dataCriacao: incomingCreatedAt,
                        dataUltimaAtualizacaoGithub: incomingPushedAt,
                        dataUltimaAtualizacaoBanco: serverTimestamp(),
                        urlDemo: project.demoUrl,
                        temDemo: project.hasDemo,
                        tags: project.topics,
                        estrelas: project.stars,
                    };
                    console.log(`updateFirestoreProjectCollection: [${project.name}] Adding ${isNewDoc ? 'create' : 'update'} to batch.`);
                    batch.set(docRef, projectDocData, { merge: !isNewDoc });
                    if (isNewDoc) creationsPerformed++; else updatesPerformed++;
                }
            } catch (firestoreError) {
                 console.error(`updateFirestoreProjectCollection: Error processing document for project ID ${project.id} (${project.name}):`, firestoreError);
                 errorsEncountered++;
            }
        } // End for loop

        // Commit the batch
        if (updatesPerformed > 0 || creationsPerformed > 0) {
            console.log(`updateFirestoreProjectCollection: Committing batch (${creationsPerformed} creations, ${updatesPerformed} updates)...`);
            await batch.commit();
            console.log(`updateFirestoreProjectCollection: Batch commit successful.`);
        } else {
            console.log("updateFirestoreProjectCollection: No changes to commit.");
        }

        if (errorsEncountered > 0) {
             console.warn(`updateFirestoreProjectCollection: Finished with ${errorsEncountered} errors.`);
        } else {
             console.log(`updateFirestoreProjectCollection: Finished successfully.`);
        }


    } catch (error) {
        // Catch errors related to the overall process (e.g., initial collection ref)
        console.error("updateFirestoreProjectCollection: Uncaught error during update process:", error);
    }
};


/**
 * Syncs data from localStorage to the Firestore project collection upon admin login.
 * Reads localStorage and triggers the intelligent update function.
 */
export const syncLocalStorageToFirestore = async () => {
  // Check admin status *before* proceeding
  if (!isAdmin()) {
    console.log("syncLocalStorageToFirestore: Sync skipped - User is not admin.");
    return;
  }

  console.log("syncLocalStorageToFirestore: Admin confirmed. Reading localStorage...");
  const localDataString = localStorage.getItem(localStorageKey);

  if (localDataString) {
    try {
      console.log("syncLocalStorageToFirestore: Found data in localStorage. Parsing...");
      const localCacheBlob: CachedProjectsBlob = JSON.parse(localDataString);
      console.log(`syncLocalStorageToFirestore: Parsed data. Timestamp: ${localCacheBlob.timestamp}, Project count: ${localCacheBlob.projects?.length}`);


      if (localCacheBlob.projects && localCacheBlob.projects.length > 0) {
        console.log("syncLocalStorageToFirestore: Triggering updateFirestoreProjectCollection...");
        // Call the intelligent update function with data from localStorage
        await updateFirestoreProjectCollection(localCacheBlob.projects);
        console.log("syncLocalStorageToFirestore: updateFirestoreProjectCollection finished.");
      } else {
        console.log("syncLocalStorageToFirestore: No project data found in parsed localStorage data.");
      }
    } catch (error) {
      console.error("syncLocalStorageToFirestore: Error parsing localStorage or during update trigger:", error);
    }
  } else {
    console.log("syncLocalStorageToFirestore: No data found in localStorage for key:", localStorageKey);
  }
};


// Optional: Function to clear the project collection (Use with caution!)
export const clearFirestoreProjectCollection = async () => {
    if (!isAdmin()) {
        console.error("Clear Firestore Collection failed: User is not admin.");
        return;
    }
    console.warn(`WARNING: Attempting to clear ALL documents from '${firestoreProjectCollectionPath}' collection!`);
    try {
        const projectsCollectionRef = collection(db, firestoreProjectCollectionPath);
        const querySnapshot = await getDocs(projectsCollectionRef);
        const batch = writeBatch(db);
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`Successfully cleared ${querySnapshot.size} documents from '${firestoreProjectCollectionPath}'.`);
        // Also clear local/blob caches
        localStorage.removeItem(localStorageKey);
        await setDoc(doc(db, firestoreCacheDocPath), { projects: [], timestamp: serverTimestamp() });
        console.log("Cleared localStorage and Firestore cache blob.");

    } catch (error) {
        console.error("Error clearing Firestore project collection:", error);
    }
};
