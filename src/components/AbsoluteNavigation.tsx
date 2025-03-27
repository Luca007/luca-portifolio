"use client";

import React, { useEffect } from 'react';
import AbsoluteHeader from './AbsoluteHeader';
import FixedProgressBar from './FixedProgressBar';

export default function AbsoluteNavigation() {
  useEffect(() => {
    // Function to ensure proper document structure for fixed header
    const setupDocumentForFixedHeader = () => {
      // Add padding to body to account for fixed header
      const headerElement = document.getElementById('absolute-header');
      if (headerElement) {
        const headerHeight = headerElement.offsetHeight;
        document.body.style.paddingTop = `${headerHeight}px`;

        // Force the header to be fixed position
        headerElement.style.position = 'fixed';
        headerElement.style.top = '0';
        headerElement.style.left = '0';
        headerElement.style.right = '0';
        headerElement.style.width = '100%';
        headerElement.style.zIndex = '9999';
      }
    };

    // Add a class to the body to support our absolute header
    document.body.classList.add('has-absolute-header');

    // Run setup on mount, after DOM is ready, and after window load
    setupDocumentForFixedHeader();

    if (document.readyState === 'complete') {
      setupDocumentForFixedHeader();
    } else {
      window.addEventListener('load', setupDocumentForFixedHeader);
    }

    // Run again after a delay to account for dynamic content
    setTimeout(setupDocumentForFixedHeader, 100);
    setTimeout(setupDocumentForFixedHeader, 500);

    // Also run on resize as dimensions may change
    window.addEventListener('resize', setupDocumentForFixedHeader);

    return () => {
      document.body.classList.remove('has-absolute-header');
      window.removeEventListener('load', setupDocumentForFixedHeader);
      window.removeEventListener('resize', setupDocumentForFixedHeader);
    };
  }, []);

  return (
    <>
      <FixedProgressBar />
      <AbsoluteHeader />
    </>
  );
}
