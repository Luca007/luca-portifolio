"use client";

import { ReactNode, useEffect, lazy, Suspense } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

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

    // Force reflow to ensure header stickiness
    document.body.offsetHeight;

    // Add script to fix sticky header issues
    const fixStickyHeader = () => {
      const header = document.querySelector('header');
      if (header) {
        header.style.position = 'sticky';
        header.style.top = '0';
        header.style.zIndex = '9999';

        // Force repainting
        void header.offsetHeight;
      }
    };

    // Run on load and scroll
    fixStickyHeader();
    window.addEventListener('scroll', fixStickyHeader, { passive: true });
    window.addEventListener('resize', fixStickyHeader, { passive: true });

    return () => {
      window.removeEventListener('scroll', fixStickyHeader);
      window.removeEventListener('resize', fixStickyHeader);
    };
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen relative">
            <Suspense fallback={<ProgressBarFallback />}>
              <ReadingProgressBar />
            </Suspense>
            {children}
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
