import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            <ToastProvider>
              {children}
            </ToastProvider>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
