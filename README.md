# Luca Clerot - Modern Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

![Portfolio Hero Screenshot](./public/images/screenshots/portfolio-hero.png)

A modern, interactive, and multilingual portfolio website built with Next.js, Tailwind CSS, shadcn/ui, and Framer Motion. Designed to showcase professional experience, skills, education, and projects with a sleek dark theme and engaging animations.

<!-- Optional: Add a link to the live demo -->
<!-- ## 🌐 Live Demo

[View the live portfolio here](https://your-deployment-link.com) -->

## ✨ Features

-   **Responsive Design**: Optimized for all screen sizes, from mobile to desktop.
-   **Interactive Particle Background**: Engaging background animation using `react-tsparticles`.
-   **Smooth Animations**: Elegant page transitions and component animations powered by Framer Motion.
-   **Dark Mode First**: A visually appealing dark theme with vibrant accent colors.
-   **Multilingual Support**: Easily switch between English, Portuguese (Português), and Spanish (Español).
-   **Accessible UI**: Built with accessibility best practices using Radix UI primitives via shadcn/ui.
-   **Dynamic Project Loading**: Fetches and displays GitHub projects automatically, including README images and metadata.
-   **Optional Firestore Caching**: Can cache GitHub project data in Firestore for improved performance and reduced API calls (requires Firebase setup).
-   **Modern Tech Stack**: Leverages the latest features of Next.js (App Router), TypeScript, and Tailwind CSS.
-   **Component-Based**: Modular and reusable components for easy maintenance and extension.

## 📸 Screenshots

<div align="center">
  <img src="./public/images/screenshots/portfolio-skills.png" alt="Skills Section" width="45%"/>
  <img src="./public/images/screenshots/portfolio-projects.png" alt="Projects Section" width="45%"/>
  <!-- Add more screenshots if desired -->
</div>

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Particles**: [react-tsparticles](https://github.com/tsparticles/react) & [tsparticles](https://github.com/tsparticles/tsparticles)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State Management**: React Context API (for Language)
-   **Data Fetching**: GitHub API (for projects)
-   **Linting/Formatting**: ESLint, Prettier

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/): Version 18.17 or later recommended.
-   [Bun](https://bun.sh/) (Recommended) or [npm](https://www.npmjs.com/)/[yarn](https://yarnpkg.com/) package manager.
-   [Git](https://git-scm.com/) for cloning the repository.
-   A [GitHub Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) (Classic) with `public_repo` scope. This is needed to fetch project data from the GitHub API and avoid rate limits.
-   **(Optional) Firebase Project:** If you intend to use the Firestore caching feature for GitHub projects (recommended for reducing API calls, especially for admin users), you need a Firebase project.
    -   Set up a new project at the [Firebase Console](https://console.firebase.google.com/).
    -   Enable Firestore Database in your project.
    -   Obtain your Firebase project configuration credentials.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Luca007/luca-portifolio.git
    cd luca-portifolio
    ```

2.  **Install dependencies:**
    ```bash
    # Using Bun (recommended)
    bun install

    # Or using npm
    npm install

    # Or using yarn
    yarn install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project directory. Add your GitHub Personal Access Token and, if using Firebase, your Firebase project credentials:

    ```env
    # .env.local

    # GitHub API Token (Required)
    NEXT_PUBLIC_GITHUB_TOKEN=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN

    # Firebase Configuration (Optional - Needed for Firestore Caching)
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
    # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID # Optional, if using Analytics
    ```
    -   Replace `YOUR_GITHUB_PERSONAL_ACCESS_TOKEN` with the token you generated.
    -   Replace the `YOUR_FIREBASE_...` placeholders with your actual Firebase project configuration values (found in your Firebase project settings under "General" -> "Your apps" -> "Web app" -> "SDK setup and configuration" -> "Config").

    *Note on GitHub Token Security: The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser. While necessary for fetching data client-side in this setup, be mindful of security implications. For production, consider fetching data server-side or via API routes if the token needs to be kept secret.*

    *Note on Firebase Credentials: These are typically safe to expose publicly for client-side SDK initialization.*

4.  **Run the development server:**
    ```bash
    # Using Bun
    bun dev

    # Or using npm
    npm run dev

    # Or using yarn
    yarn dev
    ```

5.  **Open the application:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

## 🏗️ Project Structure

    ├── app                          # App Router (pages) directory
    │   ├── api                      # API routes
    │   ├── about                     # About page
    │   ├── contact                   # Contact page
    │   ├── experience                # Experience (Resume) page
    │   ├── projects                  # Projects page
    │   ├── skills                    # Skills page
    │   └── page.tsx                  # Home page
    ├── components                   # Shared components (e.g., Navbar, Footer)
    ├── public                       # Public assets
    │   ├── images                   # Image assets
    │   └── favicon.ico              # Favicon
    ├── styles                       # Global styles
    │   └── globals.css              # Global CSS
    ├── .env.local                   # Local environment variables (e.g., API keys)
    ├── .gitignore                   # Ignored files and directories in Git
    ├── package.json                 # Project metadata and dependencies
    ├── README.md                    # Project documentation
    └── tsconfig.json                # TypeScript configuration

## 🛠️ Customization

To customize this portfolio for your own use:

1.  **Update the content** in the `app` directory to reflect your own information, experiences, and projects.
2.  **Replace the images** in the `public/images` directory with your own, and update the image references in the project accordingly.
3.  **Modify the styles** in the `styles/globals.css` file to change the appearance of the portfolio to your liking.
4.  **Change the configuration** in the `.env.local` file to include your own GitHub API token and, if applicable, your Firebase project credentials.

## 🚀 Deployment

To deploy the portfolio website:

1.  Build the project:
    ```bash
    # Using Bun
    bun build

    # Or using npm
    npm run build

    # Or using yarn
    yarn build
    ```

2.  Deploy the `app` directory to a hosting provider that supports Next.js, such as Vercel or Netlify.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature-branch`).
3.  Make your changes and commit them (`git commit -m 'Add new feature'`).
4.  Push the branch to your forked repository (`git push origin feature-branch`).
5.  Create a pull request describing your changes.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
