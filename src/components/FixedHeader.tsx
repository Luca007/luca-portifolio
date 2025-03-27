"use client";

import React, { useEffect } from "react";
import Header from "./Header";
import FixedProgressBar from "./FixedProgressBar";

export default function FixedHeader() {
  useEffect(() => {
    // Function to ensure the header stays absolutely positioned at the top
    const fixHeader = () => {
      const headerElement = document.querySelector('header');
      if (headerElement) {
        // Force header to be absolute with inline styles (highest specificity)
        Object.assign(headerElement.style, {
          position: 'fixed', // This works better than absolute for keeping at top
          top: '0',
          left: '0',
          right: '0',
          width: '100%',
          zIndex: '9999',
          transition: 'all 0.2s ease-in-out'
        });

        // Add padding to the body to prevent content from being hidden under header
        const headerHeight = headerElement.offsetHeight;
        document.body.style.paddingTop = `${headerHeight}px`;
      }
    };

    // Apply immediately and then wait for DOM to be fully loaded
    fixHeader();

    // Apply after DOM is loaded
    if (document.readyState === 'complete') {
      fixHeader();
    } else {
      window.addEventListener('load', fixHeader);
    }

    // Also reapply on scroll and resize
    window.addEventListener('scroll', fixHeader, { passive: true });
    window.addEventListener('resize', fixHeader, { passive: true });

    // Create a MutationObserver to detect DOM changes
    const observer = new MutationObserver(fixHeader);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Force the browser to reconsider the layout
    document.body.offsetHeight;

    // Apply one more time after a short delay to ensure it works after any initial animations
    setTimeout(fixHeader, 500);

    return () => {
      window.removeEventListener('load', fixHeader);
      window.removeEventListener('resize', fixHeader);
      window.removeEventListener('scroll', fixHeader);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <FixedProgressBar />
      <Header />
    </>
  );
}
