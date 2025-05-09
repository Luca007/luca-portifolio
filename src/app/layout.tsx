import "./globals.css";
import SimpleFixedNavigation from "@/components/Navigation";

import type { Metadata } from "next";
import Providers from "@/components/Providers";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luca Clerot | Full Stack Developer",
  description: "Personal portfolio of Luca Clerot, a Full Stack Developer with expertise in web development and UI/UX design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add suppressHydrationWarning here
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* SimpleFixedNavigation foi movido para dentro de Providers */}
        <Suspense fallback={<div>Loading...</div>}>
          <Providers> {/* Providers deve conter ThemeProvider e LanguageProvider */}
            <SimpleFixedNavigation /> {/* Header agora está dentro do contexto dos Providers */}
            <ToastProvider> {/* Considere se ToastProvider também deve estar dentro de Providers ou se precisa de temas */}
              {children}
            </ToastProvider>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
