export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  githubLink: string;
  imageUrl: string;
}

export interface Certificate {
  title: string;
  issuer?: string;
  link?: string;
  date?: string; // Optional date if needed
}

export interface Content {
  navigation: {
    home: string;
    about: string;
    skills: string;
    experiences: string;
    education: string;
    projects: string;
    contact: string;
    blog: string;
    language: string;
  };
  languageSwitcher: { selectLanguagePrompt: string; toggleLabel: string }; // Added toggleLabel
  themeSwitcher: { light: string; dark: string; system: string; toggleTheme: string }; // Added to interface
  home: {
    greeting: string;
    title: string;
    subtitle: string;
    roles: string[];
  };
  about: {
    title: string;
    description: string;
    paragraphs: string[];
    jobTitle: string;
    company: string;
    jobDescription: string;
    period: string;
    locationLabel: string; // Already exists, used by pdfGenerator for left col
    location: string;     // Already exists
    emailLabel: string;   // Already exists
    phoneLabel: string;   // Already exists
  };
  skills: {
    title: string;
    description: string;
    skillCategories: {
      programming: string;
      tools: string;
      languages: string;
    };
    proficiencyLabel: string;
    proficiencyLevels: {
      expert: string;
      advanced: string;
      intermediate: string;
      basic: string;
      beginner: string;
    };
    programmingSkills: {
      name: string;
      icon: string;
      description: string;
      level: number;
    }[];
    toolsSkills: {
      name: string;
      icon: string;
      description: string;
      level: number;
    }[];
    languageSkills: {
      name: string;
      icon: string;
      description: string;
      level: number;
    }[];
  };
  experiences: {
    title: string;
    description: string;
    responsibilitiesTitle: string; // Added responsibilities title
    items: {
      company: string;
      position: string;
      period: string;
      location: string;
      description: string;
      responsibilities: string[];
    }[];
  };
  education: {
    title: string;
    description: string;
    coursesTitle: string; // Added courses title
    items: {
      institution: string;
      degree: string;
      period: string;
      description: string;
      courses: {
        name: string;
        grade: string;
      }[];
    }[];
  };
  projects: {
    title: string;
    description: string;
    viewAll: string;
    githubButton: string;
    demoButton: string;
    items: Project[];
  };
  certificates?: { // Added for consistency if you have a dedicated certificates page/section
    title?: string; // Optional title for a dedicated certificates page/section
    items: Certificate[];
  };
  contact: {
    title: string;
    description: string;
    infoTitle: string; // Card title for contact information
    // New fields for contact items:
    emailLabel: string;
    emailValue: string;
    phoneLabel: string;
    phoneValue: string;
    locationLabel: string;
    locationValue: string;
    // GitHub and LinkedIn fields
    githubLabel: string;
    githubValue: string;
    githubLink: string;
    linkedinLabel: string;
    linkedinValue: string;
    linkedinLink: string;
    formSectionTitle: string; // New key for the form section title

    successTitle: string; // Heading after successful form submission
    successButton: string; // Button text to reset form after success
    form: {
      name: string;
      email: string;
      subject: string;
      message: string;
      send: string;
      sending: string;
      success: string;
      error: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      subjectPlaceholder: string;
      messagePlaceholder: string;
    };
  };
  footer: {
    copyright: string;
    poweredBy: string;
    description: string;
    navigationTitle: string;    // Title for footer navigation section
    scrollToTopLabel: string;   // aria-label for scroll-to-top button
  };
  resume: {
    download: string;
    downloading: string;
    description: string;
    pdf: {
      title: string;
      subtitle: string;
      summaryTitle: string;
      skillsTitle: string;
      experienceTitle: string;
      educationTitle: string;
      projectsTitle: string;
      certificatesTitle?: string; // Added: Title for certificates section in PDF
      // Add new contact fields here for PDF if needed, or use existing ones.
      // For now, assuming PDF generation might use a different subset or structure.
      referencesTitle: string;
      referencesAvailable: string;
      dateGenerated: string;
      page: string;
      of: string;
      personalInfo: {
        name: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        github?: string; // Added: GitHub profile URL
      };
      contactInfo: { // Added: Structure for contact section in PDF
        title: string;
        phoneLabel: string;
        emailLabel: string;
        locationLabel: string;
        githubLabel?: string; // Added: Label for GitHub link in PDF
      };
      certificateLinkText?: string; // Added: Text for certificate links (e.g., "Online Certificate")
      projectLinkViewText?: string; // Added
      projectLinkGithubText?: string; // Added
      proficiencyLevels?: { // Added
        expert: string;
        advanced: string;
        intermediate: string;
        basic: string;
        beginner: string;
      };
    };
  };
  services?: {
    title: string;
    description: string;
  };
  testimonials?: {
    title: string;
    description: string;
  };
}

export const EN_CONTENT: Content = {
  navigation: {
    home: "Home",
    about: "About",
    skills: "Skills",
    experiences: "Experience",
    education: "Education",
    projects: "Projects",
    contact: "Contact",
    blog: "Blog",
    language: "Language",
  },
  languageSwitcher: { selectLanguagePrompt: "Select language", toggleLabel: "Change language" },
  themeSwitcher: { light: "Light", dark: "Dark", system: "System", toggleTheme: "Toggle theme" },
  home: {
    greeting: "Hello, I'm",
    title: "Luca",
    subtitle: "Clerot",
    roles: [
      "Full Stack Developer",
      "Software Engineer",
      "UI/UX Designer",
      "Technology Enthusiast",
      "Problem Solver"
    ]
  },
  about: {
    title: "About Me",
    description: "Get to know me better",
    paragraphs: [
      "I'm a passionate software engineer specializing in full-stack development. My journey in technology began when I was young, and I've been building digital solutions ever since.",
      "With experience in both frontend and backend technologies, I enjoy creating seamless user experiences while ensuring robust application architecture.",
      "When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and continuously expanding my knowledge in the ever-evolving tech landscape."
    ],
    jobTitle: "Full Stack Developer",
    company: "ITI",
    jobDescription: "Working on building responsive web applications and digital solutions.",
    period: "2022 - Present",
    locationLabel: "Location",
    location: "Brasília, DF",
    emailLabel: "Email",
    phoneLabel: "Phone"
  },
  skills: {
    title: "Skills",
    description: "Technologies and tools I work with",
    skillCategories: {
      programming: "Programming Languages",
      tools: "Tools & Platforms",
      languages: "Languages"
    },
    proficiencyLabel: "Proficiency",
    proficiencyLevels: {
      expert: "Expert",
      advanced: "Advanced",
      intermediate: "Intermediate",
      basic: "Basic",
      beginner: "Beginner"
    },
    programmingSkills: [
      {
        name: "HTML & CSS",
        icon: "FileCode",
        description: "Responsive UI/UX development for various devices.",
        level: 95
      },
      {
        name: "JavaScript",
        icon: "Braces",
        description: "Advanced development with animations and API integration.",
        level: 90
      },
      {
        name: "TypeScript",
        icon: "Code",
        description: "Static typing development in React and Next.js projects.",
        level: 85
      },
      {
        name: "React & Next.js",
        icon: "ReactNextJs",
        description: "Building modern applications with hybrid rendering.",
        level: 88
      },
      {
        name: "Node.js",
        icon: "Server",
        description: "Creating robust backend services and REST APIs.",
        level: 82
      },
      {
        name: "Java",
        icon: "Coffee",
        description: "Maintaining and developing applications and interfaces.",
        level: 85
      },
      {
        name: "Python",
        icon: "Code",
        description: "Developing personal applications and AI with recognition.",
        level: 80
      },
      {
        name: "SQL & NoSQL",
        icon: "Database",
        description: "Managing and modeling relational and non-relational databases.",
        level: 78
      },
      {
        name: "C++",
        icon: "Cpu",
        description: "Developing personal projects with Arduino and hardware.",
        level: 75
      }
    ],
    toolsSkills: [
      {
        name: "GitHub Copilot & ChatGPT",
        icon: "Bot",
        description: "Using AI to accelerate development.",
        level: 90
      },
      {
        name: "Firebase",
        icon: "Database",
        description: "Executing projects with Google storage and deployment.",
        level: 85
      },
      {
        name: "AWS",
        icon: "Cloud",
        description: "Setting up Docker environments and basic knowledge in Amazon Linux.",
        level: 80
      },
      {
        name: "Git & GitHub",
        icon: "GitBranch",
        description: "Version control and collaborative work on projects.",
        level: 85
      },
      {
        name: "AI Agents",
        icon: "Brain",
        description: "Developing AI agents with platforms like Hugging Face.",
        level: 75
      }
    ],
    languageSkills: [
      {
        name: "Portuguese",
        icon: "Globe",
        description: "Fluent",
        level: 100
      },
      {
        name: "English",
        icon: "Globe",
        description: "Advanced",
        level: 80
      },
      {
        name: "Spanish",
        icon: "Globe",
        description: "Basic",
        level: 60
      }
    ]
  },
  experiences: {
    title: "Experience",
    description: "My professional journey",
    responsibilitiesTitle: "Responsibilities:", // Added responsibilities title
    items: [
      {
        company: "ITI",
        position: "Developer",
        period: "2022 - Present",
        location: "Brasília, Brazil",
        description: "Working on full-stack development for web and mobile applications, implementing new features, fixing bugs, and improving performance.",
        responsibilities: [
          "Developed and maintained web applications using React, Node.js, and TypeScript",
          "Collaborated with design team to implement responsive UI/UX interfaces",
          "Optimized database queries and API endpoints for improved performance"
        ]
      }
    ]
  },
  education: {
    title: "Education",
    description: "My academic background",
    coursesTitle: "Notable Courses", // Added courses title
    items: [
      {
        institution: "IESB",
        degree: "Computer Engineering",
        period: "2020 - Present",
        description: "Studying computer architecture, software engineering, and advanced programming concepts.",
        courses: [
          { name: "Data Structures", grade: "A" },
          { name: "Web Development", grade: "A+" },
          { name: "Software Engineering", grade: "A" }
        ]
      },
      {
        institution: "Escola Salesiana BSB",
        degree: "High School",
        period: "2017 - 2019",
        description: "Focused on science and mathematics, with extracurricular activities in programming.",
        courses: [
          { name: "Advanced Mathematics", grade: "A" },
          { name: "Physics", grade: "A-" },
          { name: "Programming Club", grade: "A+" }
        ]
      }
    ]
  },
  projects: {
    title: "Projects",
    description: "Some of my recent work",
    viewAll: "View all on GitHub",
    githubButton: "GitHub",
    demoButton: "Demo",
    items: [
      {
        title: "Exercise Generator",
        description: "A web application to generate personalized training exercises based on time, skill level, and age",
        tags: ["personal", "UI/UX", "web"],
        link: "https://luca007.github.io/gerador-de-exercicios/",
        githubLink: "https://github.com/Luca007/gerador-de-exercicios",
        imageUrl: "/images/exercise-generator.jpg"
      },
      {
        title: "Resistor Calculator",
        description: "Interactive tool to calculate resistor values based on color bands and vice versa",
        tags: ["personal", "tools", "electronics"],
        link: "https://luca007.github.io/calculadora-de-resistores/",
        githubLink: "https://github.com/Luca007/calculadora-de-resistores",
        imageUrl: "/images/resistor-calculator.jpg"
      }
    ]
  },
  certificates: { // Example data for certificates
    items: [
      {
        title: "Advanced JavaScript",
        issuer: "Online University",
        link: "http://example.com/cert/js",
        date: "2023"
      },
      {
        title: "Cloud Fundamentals",
        issuer: "Tech Platform",
        link: "http://example.com/cert/cloud",
        date: "2024"
      }
    ]
  },
  contact: {
    title: "Get in Touch",
    description: "Have a question or want to work together? Send me a message!",
    infoTitle: "Contact Information",
    emailLabel: "Email",
    emailValue: "luca.clerot@gmail.com",
    phoneLabel: "Phone",    phoneValue: "+55 61 99916-6442",
    locationLabel: "Location",
    locationValue: "Brasília, DF, Brazil",
    githubLabel: "GitHub",
    githubValue: "Luca007",
    githubLink: "https://github.com/Luca007",
    linkedinLabel: "LinkedIn",
    linkedinValue: "Luca Clerot",
    linkedinLink: "https://www.linkedin.com/in/lucaclerot/",
    formSectionTitle: "Send a Message",
    form: {
      name: "Full Name",
      namePlaceholder: "Enter your full name",
      email: "Email Address",
      emailPlaceholder: "Enter your email address",
      subject: "Subject",
      subjectPlaceholder: "Enter the subject of your message",
      message: "Message",
      messagePlaceholder: "Enter your message",
      send: "Send Message",
      sending: "Sending...",
      success: "Your message has been sent successfully! I'll get back to you soon.",
      error: "An error occurred while sending the message. Please try again later.",
    },
    successTitle: "Message Sent!",
    successButton: "Send Another Message",
  },
  footer: {
    copyright: "All rights reserved",
    poweredBy: "Powered by",
    description: "Full-stack developer, computer engineer, and technology enthusiast with experience in web development and application design",
    navigationTitle: "Navigation",
    scrollToTopLabel: "Scroll to top",
  },
  resume: {
    download: "Download Resume",
    downloading: "Downloading...",
    description: "Get my complete resume with detailed experience and qualifications.",
    pdf: {
      title: "Resume",
      subtitle: "Professional Full Stack Developer",
      summaryTitle: "Professional Summary",
      skillsTitle: "Skills",
      experienceTitle: "Work Experience",
      educationTitle: "Education",
      projectsTitle: "Selected Projects",
      certificatesTitle: "Certificates", // Added
      referencesTitle: "References",
      referencesAvailable: "References available upon request.",
      dateGenerated: "Generated on:",
      page: "Page",
      of: "of",
      personalInfo: {
        name: "Luca Clerot Aviani",
        title: "Full Stack Developer",
        email: "luca.clerot@gmail.com",
        phone: "+55 61 98XXX-XXXX",
        location: "Brasília, DF, Brazil",
        github: "https://github.com/Luca007" // Added
      },
      contactInfo: { // Added
        title: "Contact",
        phoneLabel: "Phone:",
        emailLabel: "Email:",
        locationLabel: "Location:",
        githubLabel: "GitHub Profile"
      },
      certificateLinkText: "View Certificate", // Added
      projectLinkViewText: "View Project", // Added
      projectLinkGithubText: "View on GitHub", // Added
      proficiencyLevels: { // Added
        expert: "Expert",
        advanced: "Advanced",
        intermediate: "Intermediate",
        basic: "Basic",
        beginner: "Beginner"
      }
    }
  }
};

export const PT_CONTENT: Content = {
  navigation: {
    home: "Início",
    about: "Sobre",
    skills: "Habilidades",
    experiences: "Experiência",
    education: "Educação",
    projects: "Projetos",
    contact: "Contato",
    blog: "Blog",
    language: "Idioma",
  },
  languageSwitcher: { selectLanguagePrompt: "Selecionar idioma", toggleLabel: "Mudar idioma" },
  themeSwitcher: { light: "Claro", dark: "Escuro", system: "Sistema", toggleTheme: "Alternar tema" },
  home: {
    greeting: "Olá, eu sou",
    title: "Luca",
    subtitle: "Clerot",
    roles: [
      "Desenvolvedor Full Stack",
      "Engenheiro de Software",
      "Designer UI/UX",
      "Entusiasta de Tecnologia",
      "Solucionador de Problemas"
    ]
  },
  about: {
    title: "Sobre Mim",
    description: "Conheça-me melhor",
    paragraphs: [
      "Sou um engenheiro de software apaixonado, especializado em desenvolvimento full-stack. Minha jornada na tecnologia começou quando eu era jovem, e desde então venho construindo soluções digitais.",
      "Com experiência em tecnologias frontend e backend, gosto de criar experiências de usuário perfeitas, garantindo uma arquitetura de aplicativo robusta.",
      "Quando não estou codificando, gosto de explorar novas tecnologias, contribuir para projetos de código aberto e expandir continuamente meu conhecimento no cenário tecnológico em constante evolução."
    ],
    jobTitle: "Desenvolvedor Full Stack",
    company: "ITI",
    jobDescription: "Trabalhando na construção de aplicações web responsivas e soluções digitais.",
    period: "2022 - Presente",
    locationLabel: "Localização",
    location: "Brasília, DF",
    emailLabel: "Email",
    phoneLabel: "Telefone"
  },
  skills: {
    title: "Habilidades",
    description: "Tecnologias e ferramentas com as quais trabalho",
    skillCategories: {
      programming: "Programação",
      tools: "Ferramentas",
      languages: "Idiomas"
    },
    proficiencyLabel: "Proficiência",
    proficiencyLevels: {
      expert: "Especialista",
      advanced: "Avançado",
      intermediate: "Intermediário",
      basic: "Básico",
      beginner: "Iniciante"
    },
    programmingSkills: [
      {
        name: "HTML & CSS",
        icon: "FileCode",
        description: "Desenvolvimento de UI/UX responsivo para diversos dispositivos.",
        level: 95
      },
      {
        name: "JavaScript",
        icon: "Braces",
        description: "Desenvolvimento avançado com animações e conexão com APIs.",
        level: 90
      },
      {
        name: "TypeScript",
        icon: "Code",
        description: "Desenvolvimento com tipagem estática em projetos React e Next.js.",
        level: 85
      },
      {
        name: "React & Next.js",
        icon: "ReactNextJs",
        description: "Construção de aplicações modernas com renderização híbrida.",
        level: 88
      },
      {
        name: "Node.js",
        icon: "Server",
        description: "Criação de serviços backend e APIs REST robustas.",
        level: 82
      },
      {
        name: "Java",
        icon: "Coffee",
        description: "Manutenção e desenvolvimento de aplicações e interfaces.",
        level: 85
      },
      {
        name: "Python",
        icon: "Code",
        description: "Desenvolvimento de aplicações pessoais e IA com reconhecimento.",
        level: 80
      },
      {
        name: "SQL & NoSQL",
        icon: "Database",
        description: "Gestão e modelagem de bases de dados relacionais e não relacionais.",
        level: 78
      },
      {
        name: "C++",
        icon: "Cpu",
        description: "Desenvolvimento de projetos pessoais com Arduino e hardware.",
        level: 75
      }
    ],
    toolsSkills: [
      {
        name: "GitHub Copilot & ChatGPT",
        icon: "Bot",
        description: "Uso de IA para acelerar o desenvolvimento.",
        level: 90
      },
      {
        name: "Firebase",
        icon: "Database",
        description: "Realização de projetos com armazenamento e deploy do Google.",
        level: 85
      },
      {
        name: "AWS",
        icon: "Cloud",
        description: "Configuração de ambientes Docker e conhecimentos básicos em Amazon Linux.",
        level: 80
      },
      {
        name: "Git & GitHub",
        icon: "GitBranch",
        description: "Controle de versão e trabalho colaborativo em projetos.",
        level: 85
      },
      {
        name: "AI Agents",
        icon: "Brain",
        description: "Desenvolvimento de agentes de IA com plataformas como Hugging Face.",
        level: 75
      }
    ],
    languageSkills: [
      {
        name: "Português",
        icon: "Globe",
        description: "Fluente",
        level: 100
      },
      {
        name: "Inglês",
        icon: "Globe",
        description: "Avançado",
        level: 80
      },
      {
        name: "Espanhol",
        icon: "Globe",
        description: "Básico",
        level: 60
      }
    ]
  },
  experiences: {
    title: "Experiência",
    description: "Minha jornada profissional",
    responsibilitiesTitle: "Responsabilidades:", // Added responsibilities title
    items: [
      {
        company: "ITI",
        position: "Desenvolvedor",
        period: "2022 - Presente",
        location: "Brasília, Brasil",
        description: "Trabalhando no desenvolvimento full-stack para aplicações web e mobile, implementando novos recursos, corrigindo bugs e melhorando o desempenho.",
        responsibilities: [
          "Desenvolvimento e manutenção de aplicações web usando React, Node.js e TypeScript",
          "Colaboração com equipe de design para implementar interfaces UI/UX responsivas",
          "Otimização de consultas de banco de dados e endpoints de API para melhor desempenho"
        ]
      }
    ]
  },
  education: {
    title: "Educação",
    description: "Minha formação acadêmica",
    coursesTitle: "Cursos Notáveis", // Added courses title
    items: [
      {
        institution: "IESB",
        degree: "Engenharia da Computação",
        period: "2020 - Presente",
        description: "Estudando arquitetura de computadores, engenharia de software e conceitos avançados de programação.",
        courses: [
          { name: "Estruturas de Dados", grade: "A" },
          { name: "Desenvolvimento Web", grade: "A+" },
          { name: "Engenharia de Software", grade: "A" }
        ]
      },
      {
        institution: "Escola Salesiana BSB",
        degree: "Ensino Médio",
        period: "2017 - 2019",
        description: "Foco em ciências e matemática, com atividades extracurriculares em programação.",
        courses: [
          { name: "Matemática Avançada", grade: "A" },
          { name: "Física", grade: "A-" },
          { name: "Clube de Programação", grade: "A+" }
        ]
      }
    ]
  },
  projects: {
    title: "Projetos",
    description: "Alguns dos meus trabalhos recentes",
    viewAll: "Ver todos no GitHub",
    githubButton: "GitHub",
    demoButton: "Demo",
    items: [
      {
        title: "Gerador de Exercícios",
        description: "Uma aplicação web para gerar exercícios de treinamento personalizados com base em tempo, nível de habilidade e idade",
        tags: ["pessoal", "UI/UX", "web"],
        link: "https://luca007.github.io/gerador-de-exercicios/",
        githubLink: "https://github.com/Luca007/gerador-de-exercicios",
        imageUrl: "/images/exercise-generator.jpg"
      },
      {
        title: "Calculadora de Resistores",
        description: "Ferramenta interativa para calcular valores de resistores com base em faixas de cores e vice-versa",
        tags: ["pessoal", "ferramentas", "eletrônica"],
        link: "https://luca007.github.io/calculadora-de-resistores/",
        githubLink: "https://github.com/Luca007/calculadora-de-resistores",
        imageUrl: "/images/resistor-calculator.jpg"
      }
    ]
  },
  certificates: { // Example data for certificates
    items: [
      {
        title: "JavaScript Avançado",
        issuer: "Universidade Online",
        link: "http://example.com/cert/js-pt",
        date: "2023"
      },
      {
        title: "Fundamentos da Nuvem",
        issuer: "Plataforma de Tecnologia",
        link: "http://example.com/cert/cloud-pt",
        date: "2024"
      }
    ]
  },
  contact: {
    title: "Entre em Contato",
    description: "Tem alguma pergunta ou quer trabalhar junto? Me mande uma mensagem!",
    infoTitle: "Informações de Contato",
    emailLabel: "Email",
    emailValue: "luca.clerot@gmail.com",
    phoneLabel: "Telefone",
    phoneValue: "+55 61 99916-6442",
    locationLabel: "Localização",
    locationValue: "Brasília, DF - Brasil",
    githubLabel: "GitHub",
    githubValue: "Luca007",
    githubLink: "https://github.com/Luca007",
    linkedinLabel: "LinkedIn",
    linkedinValue: "Luca Clerot",
    linkedinLink: "https://www.linkedin.com/in/lucaclerot/",
    formSectionTitle: "Envie uma Mensagem",
    form: {
      name: "Nome Completo",
      namePlaceholder: "Digite seu nome completo",
      email: "Endereço de Email",
      emailPlaceholder: "Digite seu endereço de email",
      subject: "Assunto",
      subjectPlaceholder: "Digite o assunto da sua mensagem",
      message: "Mensagem",
      messagePlaceholder: "Digite sua mensagem",
      send: "Enviar Mensagem",
      sending: "Enviando...",
      success: "Sua mensagem foi enviada com sucesso! Retornarei em breve.",
      error: "Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente mais tarde.",
    },
    successTitle: "Mensagem Enviada!",
    successButton: "Enviar Outra Mensagem",
  },
  footer: {
    copyright: "Todos os direitos reservados",
    poweredBy: "Desenvolvido com",
    description: "Desenvolvedor full-stack, engenheiro de computação e entusiasta de tecnologia com experiência em desenvolvimento web e design de aplicações",
    navigationTitle: "Navegação",
    scrollToTopLabel: "Voltar ao topo",
  },
  resume: {
    download: "Baixar Currículo",
    downloading: "Baixando...",
    description: "Obtenha meu currículo completo com experiência e qualificações detalhadas.",
    pdf: {
      title: "Currículo",
      subtitle: "Desenvolvedor Full Stack Profissional",
      summaryTitle: "Resumo Profissional",
      skillsTitle: "Habilidades",
      experienceTitle: "Experiência Profissional",
      educationTitle: "Formação Acadêmica",
      projectsTitle: "Projetos Selecionados",
      certificatesTitle: "Certificados", // Added
      referencesTitle: "Referências",
      referencesAvailable: "Referências disponíveis mediante solicitação.",
      dateGenerated: "Gerado em:",
      page: "Página",
      of: "de",
      personalInfo: {
        name: "Luca Clerot Aviani",
        title: "Desenvolvedor Full Stack",
        email: "luca.clerot@gmail.com",
        phone: "+55 61 98XXX-XXXX",
        location: "Brasília, DF, Brasil",
        github: "https://github.com/Luca007" // Added
      },
      contactInfo: { // Added
        title: "Contato",
        phoneLabel: "Celular:",
        emailLabel: "E-mail:",
        locationLabel: "Localização:",
        githubLabel: "Perfil GitHub"
      },
      certificateLinkText: "Ver Certificado", // Added
      projectLinkViewText: "Ver Projeto", // Added
      projectLinkGithubText: "Ver no GitHub", // Added
      proficiencyLevels: { // Added
        expert: "Fluente/Especialista",
        advanced: "Avançado",
        intermediate: "Intermediário",
        basic: "Básico",
        beginner: "Iniciante"
      }
    }
  }
};

export const ES_CONTENT: Content = {
  navigation: {
    home: "Inicio",
    about: "Sobre mí",
    skills: "Habilidades",
    experiences: "Experiencia",
    education: "Educación",
    projects: "Proyectos",
    contact: "Contacto",
    blog: "Blog",
    language: "Idioma",
  },
  languageSwitcher: { selectLanguagePrompt: "Seleccionar idioma", toggleLabel: "Cambiar idioma" },
  themeSwitcher: { light: "Claro", dark: "Oscuro", system: "Sistema", toggleTheme: "Cambiar tema" },
  home: {
    greeting: "Hola, soy",
    title: "Luca",
    subtitle: "Clerot",
    roles: [
      "Desarrollador Full Stack",
      "Ingeniero de Software",
      "Diseñador UI/UX",
      "Entusiasta de la Tecnología",
      "Solucionador de Problemas"
    ]
  },
  about: {
    title: "Sobre Mí",
    description: "Conóceme mejor",
    paragraphs: [
      "Soy un ingeniero de software apasionado, especializado en desarrollo full-stack. Mi viaje en la tecnología comenzó cuando era joven, y desde entonces he estado construyendo soluciones digitales.",
      "Con experiencia en tecnologías frontend y backend, disfruto creando experiencias de usuario perfectas mientras garantizo una arquitectura de aplicación robusta.",
      "Cuando no estoy programando, disfruto explorando nuevas tecnologías, contribuyendo a proyectos de código abierto y expandiendo continuamente mi conocimiento en el panorama tecnológico en constante evolución."
    ],
    jobTitle: "Desarrollador Full Stack",
    company: "ITI",
    jobDescription: "Trabajando en desarrollo full-stack para aplicaciones web y móviles.",
    period: "2022 - Presente",
    locationLabel: "Ubicación",
    location: "Brasilia, Brasil",
    emailLabel: "Correo",
    phoneLabel: "Teléfono"
  },
  skills: {
    title: "Habilidades",
    description: "Tecnologías y herramientas con las que trabajo",
    skillCategories: {
      programming: "Programación",
      tools: "Herramientas",
      languages: "Idiomas"
    },
    proficiencyLabel: "Proficiência",
    proficiencyLevels: {
      expert: "Experto",
      advanced: "Avanzado",
      intermediate: "Intermedio",
      basic: "Básico",
      beginner: "Principiante"
    },
    programmingSkills: [
      {
        name: "HTML & CSS",
        icon: "FileCode",
        description: "Desarrollo de UI/UX responsivo para varios dispositivos.",
        level: 95
      },
      {
        name: "JavaScript",
        icon: "Braces",
        description: "Desarrollo avanzado com animações e integração de API.",
        level: 90
      },
      {
        name: "TypeScript",
        icon: "Code",
        description: "Desarrollo con tipado estático en proyectos React y Next.js.",
        level: 85
      },
      {
        name: "React & Next.js",
        icon: "ReactNextJs",
        description: "Construcción de aplicaciones modernas com renderizado híbrido.",
        level: 88
      },
      {
        name: "Node.js",
        icon: "Server",
        description: "Creación de servicios backend y APIs REST robustas.",
        level: 82
      },
      {
        name: "Java",
        icon: "Coffee",
        description: "Mantenimiento y desarrollo de aplicaciones e interfaces.",
        level: 85
      },
      {
        name: "Python",
        icon: "Code",
        description: "Desarrollo de aplicaciones personales e IA com reconhecimento.",
        level: 80
      },
      {
        name: "SQL & NoSQL",
        icon: "Database",
        description: "Gestión y modelado de bases de datos relacionales y no relacionales.",
        level: 78
      },
      {
        name: "C++",
        icon: "Cpu",
        description: "Desarrollo de proyectos personales con Arduino y hardware.",
        level: 75
      }
    ],
    toolsSkills: [
      {
        name: "GitHub Copilot & ChatGPT",
        icon: "Bot",
        description: "Uso de IA para acelerar el desarrollo.",
        level: 90
      },
      {
        name: "Firebase",
        icon: "Database",
        description: "Realización de proyectos con almacenamiento y despliegue de Google.",
        level: 85
      },
      {
        name: "AWS",
        icon: "Cloud",
        description: "Configuración de entornos Docker y conocimientos básicos en Amazon Linux.",
        level: 80
      },
      {
        name: "Git & GitHub",
        icon: "GitBranch",
        description: "Control de versiones y trabajo colaborativo en proyectos.",
        level: 85
      },
      {
        name: "AI Agents",
        icon: "Brain",
        description: "Desarrollo de agentes de IA con plataformas como Hugging Face.",
        level: 75
      }
    ],
    languageSkills: [
      {
        name: "Portugués",
        icon: "Globe",
        description: "Fluido",
        level: 100
      },
      {
        name: "Inglés",
        icon: "Globe",
        description: "Avanzado",
        level: 80
      },
      {
        name: "Español",
        icon: "Globe",
        description: "Básico",
        level: 60
      }
    ]
  },
  experiences: {
    title: "Experiencia",
    description: "Mi trayectoria profesional",
    responsibilitiesTitle: "Responsabilidades:", // Added responsibilities title
    items: [
      {
        company: "ITI",
        position: "Desarrollador",
        period: "2022 - Presente",
        location: "Brasília, Brasil",
        description: "Trabajando en desarrollo full-stack para aplicaciones web y móviles, implementando nuevas funcionalidades, solucionando errores y mejorando el rendimiento.",
        responsibilities: [
          "Desarrollo y mantenimiento de aplicaciones web usando React, Node.js y TypeScript",
          "Colaboración con el equipo de diseño para implementar interfaces UI/UX responsivas",
          "Optimización de consultas de base de datos y endpoints de API para mejor rendimiento"
        ]
      }
    ]
  },
  education: {
    title: "Educación",
    description: "Mi formación académica",
    coursesTitle: "Cursos Destacados", // Added courses title
    items: [
      {
        institution: "IESB",
        degree: "Ingeniería Informática",
        period: "2020 - Presente",
        description: "Estudiando arquitectura de computadores, ingeniería de software y conceptos avanzados de programación.",
        courses: [
          { name: "Estructuras de Datos", grade: "A" },
          { name: "Desarrollo Web", grade: "A+" },
          { name: "Ingeniería de Software", grade: "A" }
        ]
      },
      {
        institution: "Escola Salesiana BSB",
        degree: "Educación Secundaria",
        period: "2017 - 2019",
        description: "Enfocado en ciencias y matemáticas, con actividades extracurriculares en programación.",
        courses: [
          { name: "Matemáticas Avanzadas", grade: "A" },
          { name: "Física", grade: "A-" },
          { name: "Club de Programación", grade: "A+" }
        ]
      }
    ]
  },
  projects: {
    title: "Proyectos",
    description: "Algunos de mis trabajos recientes",
    viewAll: "Ver todos en GitHub",
    githubButton: "GitHub",
    demoButton: "Demo",
    items: [
      {
        title: "Generador de Ejercicios",
        description: "Una aplicación web para gerar exercícios de treinamento personalizados com base em tempo, nível de habilidade e idade",
        tags: ["personal", "UI/UX", "web"],
        link: "https://luca007.github.io/gerador-de-exercicios/",
        githubLink: "https://github.com/Luca007/gerador-de-exercicios",
        imageUrl: "/images/exercise-generator.jpg"
      },
      {
        title: "Calculadora de Resistencias",
        description: "Herramienta interativa para calcular valores de resistencias basadas en bandas de colores e viceversa",
        tags: ["personal", "herramientas", "electrónica"],
        link: "https://luca007.github.io/calculadora-de-resistores/",
        githubLink: "https://github.com/Luca007/calculadora-de-resistores",
        imageUrl: "/images/resistor-calculator.jpg"
      }
    ]
  },
  certificates: { // Example data for certificates
    items: [
      {
        title: "JavaScript Avanzado",
        issuer: "Universidad en Línea",
        link: "http://example.com/cert/js-es",
        date: "2023"
      },
      {
        title: "Fundamentos de la Nube",
        issuer: "Plataforma Tecnológica",
        link: "http://example.com/cert/cloud-es",
        date: "2024"
      }
    ]
  },
  contact: {
    title: "Contacto",
    description: "Ponte en contacto conmigo.",
    infoTitle: "Información de Contacto",
    emailLabel: "Correo Electrónico",
    emailValue: "luca.clerot@gmail.com",
    phoneLabel: "Teléfono",
    phoneValue: "+55 61 99916-6442",
    locationLabel: "Ubicación",
    locationValue: "Brasilia, DF - Brasil",
    githubLabel: "GitHub",
    githubValue: "Luca007",
    githubLink: "https://github.com/Luca007",
    linkedinLabel: "LinkedIn",
    linkedinValue: "Luca Clerot",
    linkedinLink: "https://www.linkedin.com/in/lucaclerot/",
    formSectionTitle: "Enviar un Mensaje",
    form: {
      name: "Nombre Completo",
      namePlaceholder: "Introduce tu nombre completo",
      email: "Dirección de Correo Electrónico",
      emailPlaceholder: "Introduce tu dirección de correo electrónico",
      subject: "Asunto",
      subjectPlaceholder: "Introduce el asunto de tu mensaje",
      message: "Mensaje",
      messagePlaceholder: "Introduce tu mensaje",
      send: "Enviar Mensaje",
      sending: "Enviando...",
      success: "¡Tu mensaje ha sido enviado con éxito! Me pondré en contacto contigo pronto.",
      error: "Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.",
    },
    successTitle: "¡Mensaje Enviado!",
    successButton: "Enviar Otro Mensaje",
  },
  footer: {
    copyright: "Todos los derechos reservados",
    poweredBy: "Desarrollado con",
    description: "Desarrollador full-stack, ingeniero en computación e entusiasta da tecnologia com experiência em desenvolvimento web e design de aplicações",
    navigationTitle: "Navegación",
    scrollToTopLabel: "Ir al principio",
  },
  resume: {
    download: "Descargar Currículum",
    downloading: "Descargando...",
    description: "Obtén mi currículum completo con experiencia y calificaciones detalladas.",
    pdf: {
      title: "Currículum",
      subtitle: "Desarrollador Full Stack Profesional",
      summaryTitle: "Resumen Profissional",
      skillsTitle: "Habilidades",
      experienceTitle: "Experiencia Profesional",
      educationTitle: "Formación Académica",
      projectsTitle: "Proyectos Seleccionados",
      certificatesTitle: "Certificados", // Added
      referencesTitle: "Referencias",
      referencesAvailable: "Referencias disponibles a petición.",
      dateGenerated: "Generado el:",
      page: "Página",
      of: "de",
      personalInfo: {
        name: "Luca Clerot Aviani",
        title: "Desarrollador Full Stack",
        email: "luca.clerot@gmail.com",
        phone: "+55 61 98XXX-XXXX",
        location: "Brasília, DF, Brasil",
        github: "https://github.com/Luca007" // Added
      },
      contactInfo: { // Added
        title: "Contacto",
        phoneLabel: "Teléfono:",
        emailLabel: "Correo:",
        locationLabel: "Ubicación:",
        githubLabel: "Perfil GitHub"
      },
      certificateLinkText: "Ver Certificado", // Added
      projectLinkViewText: "Ver Proyecto", // Added
      projectLinkGithubText: "Ver en GitHub", // Added
      proficiencyLevels: { // Added
        expert: "Experto/Fluido",
        advanced: "Avanzado",
        intermediate: "Intermedio",
        basic: "Básico",
        beginner: "Principiante"
      }
    }
  }
};

export const contentMap: Record<string, Content> = {
  en: EN_CONTENT,
  es: ES_CONTENT,
  pt: PT_CONTENT
};
