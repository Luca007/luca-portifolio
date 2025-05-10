# Luca Clerot – Modern Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)  
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwind-css)](https://tailwindcss.com/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

Uma moderna página de portfólio, interativa e multilíngue, desenvolvida com Next.js, Tailwind CSS, shadcn/ui e Framer Motion. Exibe experiência profissional, habilidades, educação e projetos com tema escuro e animações envolventes.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage and Customization](#usage-and-customization)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Security](#security)

## Demo

> _Demo ao vivo: Em breve_  
> Substitua pelo link de implantação.

## Features

- **Design Responsivo:** Compatível com dispositivos móveis, tablets e desktops.
- **Partículas Interativas:** Animação de fundo com `react-tsparticles`.
- **Animações Suaves:** Com Framer Motion.
- **Modo Escuro:** Tema principal escuro com cores de destaque.
- **Suporte Multilíngue:** Inglês, Português e Espanhol via React Context.
- **UI Acessível:** Baseada em Radix UI e shadcn/ui.
- **Carregamento Dinâmico de Projetos:** Busca repositórios no GitHub com metadados do README.
- **Cache Firestore (Opcional):** Armazena dados para melhor performance.
- **Componentes Modulares:** Reutilizáveis, usando App Router do Next.js.
- **SEO & Performance:** Markup otimizado e carregamento rápido.

## Screenshots

![Seção Hero](./public/images/screenshots/portfolio-hero.png)

![Seção Skills](./public/images/screenshots/portfolio-skills.png)

![Seção Projects](./public/images/screenshots/portfolio-projects.png)

## Tech Stack

| Camada            | Tecnologia                                 |
| ----------------- | ------------------------------------------ |
| Framework         | Next.js 14+ (App Router)                   |
| Linguagem         | TypeScript                                 |
| Estilização       | Tailwind CSS                               |
| Componentes UI    | shadcn/ui (Radix UI + Tailwind)            |
| Animações         | Framer Motion                              |
| Partículas        | react-tsparticles & tsparticles            |
| Ícones            | Lucide React                               |
| Dados             | GitHub API, Firebase Firestore (opcional)  |
| Estado            | React Context API                          |
| Linting/Format    | ESLint, Prettier                           |

## Prerequisites

- Node.js v18.17+  
- Bun (recomendado) ou npm/yarn  
- Git  
- GitHub Personal Access Token com escopo `public_repo`  
- (Opcional) Projeto Firebase com Firestore habilitado

## Installation

```powershell
# Clonar o repositório
git clone https://github.com/Luca007/luca-portifolio.git
cd luca-portifolio

# Instalar dependências
bun install    # ou npm install | yarn install
```

## Environment Variables

```bash
# Crie um arquivo .env.local com:
NEXT_PUBLIC_GITHUB_TOKEN=SEU_TOKEN_GITHUB
# (Opcional) Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Running the Application

```powershell
# Iniciar servidor de desenvolvimento
bun dev     # ou npm run dev | yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Project Structure

```text
├─ app/               Páginas e layouts do Next.js App Router
├─ components/        Componentes React compartilhados
├─ public/            Imagens, ícones e assets estáticos
├─ styles/            CSS global e configuração Tailwind
├─ config/            Configurações de idioma e autenticação
├─ lib/               Utilities: GitHub, Firebase, PDF
├─ README.md          Documentação do projeto
├─ package.json       Dependências e scripts
└─ tsconfig.json      Configurações do TypeScript
```

## Usage and Customization

- **Conteúdo:** Atualize textos e imagens em `app/`.
- **Tema:** Ajuste `tailwind.config.ts` e `styles/globals.css`.
- **Componentes:** Modifique ou adicione em `components/`.
- **Projetos:** Configure a busca no GitHub em `lib/github.ts` e o cache em `lib/firestore.ts`.

## Contributing

Para contribuir com este projeto, utilize os seguintes recursos:

- **Guia de Contribuição:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Código de Conduta:** [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- **Templates de Issue:**
  - [🐞 Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)
  - [✨ Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)
- **Template de Pull Request:** [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)

Contribuições são bem-vindas!  
Siga estes passos:

1. Faça um fork deste repositório.  
2. Crie uma branch: `git checkout -b feature/NovaFuncionalidade`.  
3. Commit suas alterações: `git commit -m "feat: Descrição da mudança"`.  
4. Push para sua branch: `git push origin feature/NovaFuncionalidade`.  
5. Abra um Pull Request.

Certifique-se de que todos os checadores de lint e formatação passem.

## License

Este projeto está licenciado sob a [MIT License](LICENSE).

## Contact

- Email: [luca@example.com](mailto:luca@example.com)  
- GitHub: [https://github.com/Luca007](https://github.com/Luca007)

## Security

Para questões de segurança e vulnerabilidades, consulte a [Security Policy](SECURITY.md).
