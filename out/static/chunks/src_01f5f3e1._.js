(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_01f5f3e1._.js", {

"[project]/src/components/ThemeProvider.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ThemeProvider": (()=>ThemeProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ThemeProvider.tsx",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/config/languages.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "DEFAULT_LANGUAGE": (()=>DEFAULT_LANGUAGE),
    "LANGUAGES": (()=>LANGUAGES)
});
const LANGUAGES = [
    {
        code: "pt",
        name: "Português",
        flag: "🇧🇷",
        countryCode: "PTbr"
    },
    {
        code: "en",
        name: "English",
        flag: "🇺🇸",
        countryCode: "USA"
    },
    {
        code: "es",
        name: "Español",
        flag: "🇪🇸",
        countryCode: "ESP"
    }
];
const DEFAULT_LANGUAGE = LANGUAGES[0]; // Português como padrão
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/i18n/content.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "EN_CONTENT": (()=>EN_CONTENT),
    "ES_CONTENT": (()=>ES_CONTENT),
    "PT_CONTENT": (()=>PT_CONTENT),
    "contentMap": (()=>contentMap)
});
const EN_CONTENT = {
    navigation: {
        home: "Home",
        about: "About",
        skills: "Skills",
        experiences: "Experience",
        education: "Education",
        projects: "Projects",
        contact: "Contact",
        blog: "Blog",
        language: "Language"
    },
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
        }
    },
    experiences: {
        title: "Experience",
        description: "My professional journey",
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
        items: [
            {
                institution: "IESB",
                degree: "Computer Engineering",
                period: "2020 - Present",
                description: "Studying computer architecture, software engineering, and advanced programming concepts.",
                courses: [
                    {
                        name: "Data Structures",
                        grade: "A"
                    },
                    {
                        name: "Web Development",
                        grade: "A+"
                    },
                    {
                        name: "Software Engineering",
                        grade: "A"
                    }
                ]
            },
            {
                institution: "Escola Salesiana BSB",
                degree: "High School",
                period: "2017 - 2019",
                description: "Focused on science and mathematics, with extracurricular activities in programming.",
                courses: [
                    {
                        name: "Advanced Mathematics",
                        grade: "A"
                    },
                    {
                        name: "Physics",
                        grade: "A-"
                    },
                    {
                        name: "Programming Club",
                        grade: "A+"
                    }
                ]
            }
        ]
    },
    projects: {
        title: "Projects",
        description: "Some of my recent work",
        viewAll: "View all on GitHub",
        items: [
            {
                title: "Exercise Generator",
                description: "A web application to generate personalized training exercises based on time, skill level, and age",
                tags: [
                    "personal",
                    "UI/UX",
                    "web"
                ],
                link: "https://luca007.github.io/gerador-de-exercicios/",
                githubLink: "https://github.com/Luca007/gerador-de-exercicios",
                imageUrl: "/images/exercise-generator.jpg"
            },
            {
                title: "Resistor Calculator",
                description: "Interactive tool to calculate resistor values based on color bands and vice versa",
                tags: [
                    "personal",
                    "tools",
                    "electronics"
                ],
                link: "https://luca007.github.io/calculadora-de-resistores/",
                githubLink: "https://github.com/Luca007/calculadora-de-resistores",
                imageUrl: "/images/resistor-calculator.jpg"
            }
        ]
    },
    contact: {
        title: "Contact",
        description: "Let's work together",
        form: {
            name: "Name",
            email: "Email",
            message: "Message",
            send: "Send Message",
            sending: "Sending...",
            success: "Thank you for reaching out. I'll get back to you as soon as possible.",
            error: "Error sending message. Please try again."
        }
    },
    footer: {
        copyright: "All rights reserved",
        poweredBy: "Powered by",
        description: "Full-stack developer, computer engineer, and technology enthusiast with experience in web development and application design"
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
                location: "Brasília, DF, Brazil"
            }
        }
    }
};
const PT_CONTENT = {
    navigation: {
        home: "Início",
        about: "Sobre",
        skills: "Habilidades",
        experiences: "Experiência",
        education: "Educação",
        projects: "Projetos",
        contact: "Contato",
        blog: "Blog",
        language: "Idioma"
    },
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
            programming: "Linguagens de Programação",
            tools: "Ferramentas & Plataformas",
            languages: "Idiomas"
        }
    },
    experiences: {
        title: "Experiência",
        description: "Minha jornada profissional",
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
        items: [
            {
                institution: "IESB",
                degree: "Engenharia da Computação",
                period: "2020 - Presente",
                description: "Estudando arquitetura de computadores, engenharia de software e conceitos avançados de programação.",
                courses: [
                    {
                        name: "Estruturas de Dados",
                        grade: "A"
                    },
                    {
                        name: "Desenvolvimento Web",
                        grade: "A+"
                    },
                    {
                        name: "Engenharia de Software",
                        grade: "A"
                    }
                ]
            },
            {
                institution: "Escola Salesiana BSB",
                degree: "Ensino Médio",
                period: "2017 - 2019",
                description: "Foco em ciências e matemática, com atividades extracurriculares em programação.",
                courses: [
                    {
                        name: "Matemática Avançada",
                        grade: "A"
                    },
                    {
                        name: "Física",
                        grade: "A-"
                    },
                    {
                        name: "Clube de Programação",
                        grade: "A+"
                    }
                ]
            }
        ]
    },
    projects: {
        title: "Projetos",
        description: "Alguns dos meus trabalhos recentes",
        viewAll: "Ver todos no GitHub",
        items: [
            {
                title: "Gerador de Exercícios",
                description: "Uma aplicação web para gerar exercícios de treinamento personalizados com base em tempo, nível de habilidade e idade",
                tags: [
                    "pessoal",
                    "UI/UX",
                    "web"
                ],
                link: "https://luca007.github.io/gerador-de-exercicios/",
                githubLink: "https://github.com/Luca007/gerador-de-exercicios",
                imageUrl: "/images/exercise-generator.jpg"
            },
            {
                title: "Calculadora de Resistores",
                description: "Ferramenta interativa para calcular valores de resistores com base em faixas de cores e vice-versa",
                tags: [
                    "pessoal",
                    "ferramentas",
                    "eletrônica"
                ],
                link: "https://luca007.github.io/calculadora-de-resistores/",
                githubLink: "https://github.com/Luca007/calculadora-de-resistores",
                imageUrl: "/images/resistor-calculator.jpg"
            }
        ]
    },
    contact: {
        title: "Contato",
        description: "Vamos trabalhar juntos",
        form: {
            name: "Nome",
            email: "Email",
            message: "Mensagem",
            send: "Enviar Mensagem",
            sending: "Enviando...",
            success: "Obrigado pelo contato. Responderei o mais breve possível.",
            error: "Erro ao enviar mensagem. Por favor, tente novamente."
        }
    },
    footer: {
        copyright: "Todos os direitos reservados",
        poweredBy: "Desenvolvido com",
        description: "Desenvolvedor full-stack, engenheiro de computação e entusiasta de tecnologia com experiência em desenvolvimento web e design de aplicações"
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
                location: "Brasília, DF, Brasil"
            }
        }
    }
};
const ES_CONTENT = {
    navigation: {
        home: "Inicio",
        about: "Sobre mí",
        skills: "Habilidades",
        experiences: "Experiencia",
        education: "Educación",
        projects: "Proyectos",
        contact: "Contacto",
        blog: "Blog",
        language: "Idioma"
    },
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
            programming: "Lenguajes de Programación",
            tools: "Herramientas y Plataformas",
            languages: "Idiomas"
        }
    },
    experiences: {
        title: "Experiencia",
        description: "Mi trayectoria profesional",
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
        items: [
            {
                institution: "IESB",
                degree: "Ingeniería Informática",
                period: "2020 - Presente",
                description: "Estudiando arquitectura de computadores, ingeniería de software y conceptos avanzados de programación.",
                courses: [
                    {
                        name: "Estructuras de Datos",
                        grade: "A"
                    },
                    {
                        name: "Desarrollo Web",
                        grade: "A+"
                    },
                    {
                        name: "Ingeniería de Software",
                        grade: "A"
                    }
                ]
            },
            {
                institution: "Escola Salesiana BSB",
                degree: "Educación Secundaria",
                period: "2017 - 2019",
                description: "Enfocado en ciencias y matemáticas, con actividades extracurriculares en programación.",
                courses: [
                    {
                        name: "Matemáticas Avanzadas",
                        grade: "A"
                    },
                    {
                        name: "Física",
                        grade: "A-"
                    },
                    {
                        name: "Club de Programación",
                        grade: "A+"
                    }
                ]
            }
        ]
    },
    projects: {
        title: "Proyectos",
        description: "Algunos de mis trabajos recientes",
        viewAll: "Ver todos en GitHub",
        items: [
            {
                title: "Generador de Ejercicios",
                description: "Una aplicación web para generar ejercicios de entrenamiento personalizados según tiempo, nivel de habilidad y edad",
                tags: [
                    "personal",
                    "UI/UX",
                    "web"
                ],
                link: "https://luca007.github.io/gerador-de-exercicios/",
                githubLink: "https://github.com/Luca007/gerador-de-exercicios",
                imageUrl: "/images/exercise-generator.jpg"
            },
            {
                title: "Calculadora de Resistencias",
                description: "Herramienta interactiva para calcular valores de resistencias basadas en bandas de colores y viceversa",
                tags: [
                    "personal",
                    "herramientas",
                    "electrónica"
                ],
                link: "https://luca007.github.io/calculadora-de-resistores/",
                githubLink: "https://github.com/Luca007/calculadora-de-resistores",
                imageUrl: "/images/resistor-calculator.jpg"
            }
        ]
    },
    contact: {
        title: "Contacto",
        description: "Trabajemos juntos",
        form: {
            name: "Nombre",
            email: "Correo",
            message: "Mensaje",
            send: "Enviar Mensaje",
            sending: "Enviando...",
            success: "¡Mensaje enviado con éxito!",
            error: "Error al enviar el mensaje. Por favor, inténtalo de nuevo."
        }
    },
    footer: {
        copyright: "Todos los derechos reservados",
        poweredBy: "Desarrollado con",
        description: "Desarrollador full-stack, ingeniero en computación y entusiasta de la tecnología con experiencia en desarrollo web y diseño de aplicaciones"
    },
    resume: {
        download: "Descargar Currículum",
        downloading: "Descargando...",
        description: "Obtén mi currículum completo con experiencia y calificaciones detalladas.",
        pdf: {
            title: "Currículum",
            subtitle: "Desarrollador Full Stack Profesional",
            summaryTitle: "Resumen Profesional",
            skillsTitle: "Habilidades",
            experienceTitle: "Experiencia Profesional",
            educationTitle: "Formación Académica",
            projectsTitle: "Proyectos Seleccionados",
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
                location: "Brasília, DF, Brasil"
            }
        }
    }
};
const contentMap = {
    en: EN_CONTENT,
    es: ES_CONTENT,
    pt: PT_CONTENT
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/LanguageContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "LanguageProvider": (()=>LanguageProvider),
    "useLanguage": (()=>useLanguage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$languages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/languages.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/content.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const defaultContext = {
    currentLanguage: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$languages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_LANGUAGE"],
    setLanguage: ()=>{},
    content: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EN_CONTENT"]
};
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(defaultContext);
const useLanguage = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
};
_s(useLanguage, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
const LanguageProvider = ({ children })=>{
    _s1();
    const [currentLanguage, setCurrentLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$languages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_LANGUAGE"]);
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contentMap"][__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$languages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_LANGUAGE"].code]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LanguageProvider.useEffect": ()=>{
            const savedLanguage = localStorage.getItem("language");
            if (savedLanguage) {
                const lang = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$languages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LANGUAGES"].find({
                    "LanguageProvider.useEffect.lang": (l)=>l.code === savedLanguage
                }["LanguageProvider.useEffect.lang"]);
                if (lang) {
                    setCurrentLanguage(lang);
                    setContent(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contentMap"][lang.code] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EN_CONTENT"]);
                }
            }
        }
    }["LanguageProvider.useEffect"], []);
    const setLanguage = (lang)=>{
        setCurrentLanguage(lang);
        setContent(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contentMap"][lang.code] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EN_CONTENT"]);
        localStorage.setItem("language", lang.code);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: {
            currentLanguage,
            setLanguage,
            content
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/LanguageContext.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
};
_s1(LanguageProvider, "trLTF6nJLOZQ0kM92VC0DvEf1H4=");
_c = LanguageProvider;
var _c;
__turbopack_context__.k.register(_c, "LanguageProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/firebase.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Import the functions you need from the SDKs you need
__turbopack_context__.s({
    "auth": (()=>auth),
    "db": (()=>db),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm2017.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>"); // Added import for authentication
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$e84cf44d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__o__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index-e84cf44d.js [app-client] (ecmascript) <export o as getAuth>");
;
;
;
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDrxT8NXrvg59C_KoX-sH3Fa26EaZWuyK4",
    authDomain: "curriculo-d20af.firebaseapp.com",
    projectId: "curriculo-d20af",
    storageBucket: "curriculo-d20af.firebasestorage.app",
    messagingSenderId: "259221061959",
    appId: "1:259221061959:web:8c552eee0ce6a74a074c62"
};
// Initialize Firebase
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(firebaseConfig);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$e84cf44d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__o__as__getAuth$3e$__["getAuth"])(app); // Added authentication initialization
const __TURBOPACK__default__export__ = app;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthProvider": (()=>AuthProvider),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$e84cf44d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ab__as__signInWithEmailAndPassword$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index-e84cf44d.js [app-client] (ecmascript) <export ab as signInWithEmailAndPassword>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$e84cf44d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__signOut$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index-e84cf44d.js [app-client] (ecmascript) <export C as signOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$e84cf44d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__y__as__onAuthStateChanged$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index-e84cf44d.js [app-client] (ecmascript) <export y as onAuthStateChanged>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const defaultContext = {
    user: null,
    loading: true,
    error: null,
    signIn: async ()=>{},
    signOut: async ()=>{},
    isAdmin: false
};
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(defaultContext);
const useAuth = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
};
_s(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
const AuthProvider = ({ children })=>{
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAdmin, setIsAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$e84cf44d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__y__as__onAuthStateChanged$3e$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], {
                "AuthProvider.useEffect.unsubscribe": (authUser)=>{
                    setUser(authUser);
                    setLoading(false);
                    // Check if user is admin
                    if (authUser) {
                        // This is a simple check. In production, you might want to check against a list
                        // of admin emails or a custom claim in Firebase Authentication
                        const adminEmails = [
                            'admin@example.com',
                            'luca.clerot@gmail.com'
                        ];
                        setIsAdmin(adminEmails.includes(authUser.email || ''));
                    } else {
                        setIsAdmin(false);
                    }
                }
            }["AuthProvider.useEffect.unsubscribe"]);
            return ({
                "AuthProvider.useEffect": ()=>unsubscribe()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], []);
    const signIn = async (email, password)=>{
        try {
            setError(null);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$e84cf44d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ab__as__signInWithEmailAndPassword$3e$__["signInWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, password);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const signOut = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$e84cf44d$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__signOut$3e$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const value = {
        user,
        loading,
        error,
        signIn,
        signOut,
        isAdmin
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 87,
        columnNumber: 10
    }, this);
};
_s1(AuthProvider, "VjRKH8XQuFVCswRxyn9KVxCEpAg=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/EditContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "EditProvider": (()=>EditProvider),
    "useEdit": (()=>useEdit)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
// Create the context with default values
const EditContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    isEditMode: false,
    setEditMode: ()=>{},
    editedItems: {},
    registerEditedItem: ()=>{},
    handleEdit: ()=>{}
});
const useEdit = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(EditContext);
};
_s(useEdit, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
const EditProvider = ({ children })=>{
    _s1();
    const { isAdmin } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isEditMode, setIsEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editedItems, setEditedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Listen for edit mode toggle events
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditProvider.useEffect": ()=>{
            const handleEditModeEnabled = {
                "EditProvider.useEffect.handleEditModeEnabled": ()=>{
                    setIsEditMode(true);
                    // Clear edited items when entering edit mode
                    setEditedItems({});
                }
            }["EditProvider.useEffect.handleEditModeEnabled"];
            const handleEditModeDisabled = {
                "EditProvider.useEffect.handleEditModeDisabled": ()=>{
                    setIsEditMode(false);
                    // Clear edited items when exiting edit mode
                    setEditedItems({});
                }
            }["EditProvider.useEffect.handleEditModeDisabled"];
            window.addEventListener('edit-mode-enabled', handleEditModeEnabled);
            window.addEventListener('edit-mode-disabled', handleEditModeDisabled);
            return ({
                "EditProvider.useEffect": ()=>{
                    window.removeEventListener('edit-mode-enabled', handleEditModeEnabled);
                    window.removeEventListener('edit-mode-disabled', handleEditModeDisabled);
                }
            })["EditProvider.useEffect"];
        }
    }["EditProvider.useEffect"], []);
    // Function to set edit mode
    const setEditMode = (mode)=>{
        setIsEditMode(mode);
        if (mode) {
            window.dispatchEvent(new CustomEvent('edit-mode-enabled'));
        } else {
            window.dispatchEvent(new CustomEvent('edit-mode-disabled'));
        }
    };
    // Function to register an edited item
    const registerEditedItem = (id)=>{
        setEditedItems((prev)=>({
                ...prev,
                [id]: true
            }));
    };
    // Function to handle editing an item
    const handleEdit = (id, path, type, content)=>{
        // Register item as edited
        registerEditedItem(id);
        // Dispatch an event to notify the AdminPanel
        window.dispatchEvent(new CustomEvent('edit-item', {
            detail: {
                id,
                path,
                type,
                content
            }
        }));
    };
    // Only provide edit capabilities if user is admin
    const value = {
        isEditMode: isAdmin ? isEditMode : false,
        setEditMode: isAdmin ? setEditMode : ()=>{},
        editedItems,
        registerEditedItem,
        handleEdit
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/EditContext.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
};
_s1(EditProvider, "Ha8QJbCNDcMzDluEzgRSP+YLfkE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = EditProvider;
var _c;
__turbopack_context__.k.register(_c, "EditProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/Providers.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Providers)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ThemeProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/LanguageContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$EditContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/EditContext.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        attribute: "class",
        defaultTheme: "dark",
        enableSystem: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LanguageProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$EditContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditProvider"], {
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/Providers.tsx",
                    lineNumber: 14,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Providers.tsx",
                lineNumber: 13,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Providers.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Providers.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_01f5f3e1._.js.map