"use client";

import { ReactNode, useEffect, lazy, Suspense } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/components/ThemeProvider";

// Lazy load non-critical components
const ReadingProgressBar = lazy(() => import("@/components/ReadingProgressBar"));

// Simple loading fallback that doesn't cause a layout shift
const ProgressBarFallback = () => <div className="h-1 sticky top-0 z-50"></div>;

export default function ClientBody({ children }: { children: ReactNode }) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // Clear extension classes for better performance
    document.body.classList.remove(
      ...[...document.body.classList].filter(cls =>
        cls.startsWith('extension-') || cls.startsWith('extendify-')
      )
    );

    // Apply performance optimizations
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        // Apply performance optimizations when browser is idle
        document.body.classList.add('js-focus-visible');
      });
    }
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <div className="min-h-screen">
          <Suspense fallback={<ProgressBarFallback />}>
            <ReadingProgressBar />
          </Suspense>
          {children}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
