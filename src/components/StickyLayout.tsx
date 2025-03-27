"use client";

import React, { ReactNode, useEffect } from "react";

export default function StickyLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Force browser to recalculate layout and respect sticky positioning
    const reflow = () => {
      document.body.offsetHeight;
      document.documentElement.offsetHeight;
    };

    // Initial reflow
    reflow();

    // Add reflow on resize
    window.addEventListener('resize', reflow);

    // Add reflow on scroll
    window.addEventListener('scroll', () => {
      requestAnimationFrame(reflow);
    }, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('resize', reflow);
      window.removeEventListener('scroll', reflow);
    };
  }, []);

  return (
    <div className="sticky-context">
      {children}
      <style jsx global>{`
        .sticky-context {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
        }
        body {
          overflow-x: hidden;
        }
        html, body {
          overscroll-behavior-y: none;
        }
      `}</style>
    </div>
  );
}
