luca-portfolio/
├── .github/                      # GitHub configuration
│   ├── ISSUE_TEMPLATE/           # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md  # Pull request template
├── docs/                        # Project documentation
│   └── project-structure.md     # This file
├── scripts/                     # Automation and maintenance scripts
│   ├── deploy-gh-pages.sh       # GitHub Pages deployment script
│   └── seedContent.js           # Content seeding script for Firestore
├── public/                      # Static assets
│   ├── fonts/                   # Custom font files
│   ├── images/                  # Image assets & screenshots
│   │   ├── exercise-generator.jpg
│   │   ├── grid.svg
│   │   ├── profile-photo.jpg
│   │   ├── resistor-calculator.jpg
│   │   ├── projects/
│   │   │   ├── code.png
│   │   │   └── code2.jpg
│   │   └── screenshots/
│   │       ├── portfolio-hero.png
│   │       └── portfolio-projects.png
│   └── resume_prebuild/         # Prebuilt resume PDFs
├── src/                         # Source code
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Main page
│   │   ├── globals.css          # Global styles
│   │   └── ClientBody.tsx       # Client wrapper
│   ├── components/              # Shared React components
│   │   ├── About.tsx             # About section
│   │   ├── Contact.tsx           # Contact section
│   │   ├── Education.tsx         # Education section
│   │   ├── Experience.tsx        # Experience section
│   │   ├── Footer.tsx            # Footer component
│   │   ├── Header.tsx            # Header with navigation
│   │   ├── Hero.tsx              # Hero section
│   │   ├── InteractiveBackground.tsx # Animated background
│   │   ├── LanguageSwitcher.tsx  # Language selection
│   │   ├── Logo.tsx              # Logo component
│   │   ├── Projects.tsx          # Projects section
│   │   ├── Providers.tsx         # Context providers
│   │   ├── Skills.tsx            # Skills section
│   │   ├── ThemeProvider.tsx     # Dark/light theme provider
│   │   ├── ThemeSwitcher.tsx     # Theme toggle
│   │   └── ui/                   # shadcn/ui components
│   ├── config/                  # Configuration files
│   │   └── languages.ts          # Language settings
│   ├── contexts/                # React context providers
│   │   └── LanguageContext.tsx   # Language context provider
│   ├── i18n/                    # Internationalization content
│   │   ├── content.js            # Multilingual content (JavaScript version)
│   │   └── content.ts            # Multilingual content (TypeScript source)
│   ├── lib/                     # Utility modules
│   │   ├── firebase.ts
│   │   ├── firestore.ts
│   │   ├── github.ts
│   │   ├── pdfGenerator.ts      # PDF creation logic
│   │   └── utils.ts             # Helper utilities
│   ├── templates/               # JSON/data templates
│   └── types/                   # TypeScript custom types (ensure no other critical types are here if removing readline-sync.d.ts)
├── .devcontainer/               # VS Code devcontainer config
├── .eslintrc.json               # ESLint configuration
├── eslint.config.mjs            # Additional ESLint settings
├── next.config.mjs              # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Project metadata & scripts
├── bun.lock                     # Bun lockfile
├── README.md                    # Project overview
├── CONTRIBUTING.md              # Contribution guidelines
├── SECURITY.md                  # Security policy
├── CODE_OF_CONDUCT.md           # Code of conduct
├── LICENSE                      # MIT license
└── node_modules/                # Dependencies
