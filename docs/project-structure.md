luca-portfolio/
├── .github/                      # GitHub configuration
│   ├── ISSUE_TEMPLATE/           # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md  # Pull request template
├── docs/                        # Project documentation
│   └── project-structure.md     # This file
├── scripts/                     # Automation and maintenance scripts
│   ├── deploy-gh-pages.sh       # GitHub Pages deployment script
│   └── verify-build.sh          # Build verification script
├── public/                      # Static assets
│   ├── fonts/                   # Font files
│   └── images/                  # Image assets & screenshots
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with metadata
│   │   ├── page.tsx              # Main page component
│   │   ├── globals.css           # Global styles
│   │   └── ClientBody.tsx        # Client-side wrapper
│   ├── components/               # React components
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
│   ├── contexts/                 # React contexts
│   │   └── LanguageContext.tsx   # Language context provider
│   ├── i18n/                     # Internationalization
│   │   └── content.ts            # Multilingual content
│   ├── lib/                      # Utility functions
│   │   └── utils.ts              # Helper utilities
│   └── config/                   # Configuration
│       └── languages.ts          # Language settings
├── CONTRIBUTING.md              # Contribution guidelines
├── SECURITY.md                  # Security policy
├── CODE_OF_CONDUCT.md           # Code of conduct
├── LICENSE                      # MIT license
└── README.md                    # Project overview
