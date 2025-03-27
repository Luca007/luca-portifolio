"use client";

import { useEffect } from "react";
import { useScroll, useSpring, motion } from "framer-motion";

export default function FixedProgressBar() {
  const { scrollYProgress } = useScroll();

  // Add spring physics for smooth animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Always force the progress bar to stay fixed at the top
  useEffect(() => {
    const forceFixedPosition = () => {
      // Find or create the progress bar element
      let progressBar = document.querySelector('.fixed-progress-bar');
      if (!progressBar) {
        // If not found in DOM yet, return and try again on next frame
        requestAnimationFrame(forceFixedPosition);
        return;
      }

      // Force fixed position through direct style manipulation
      Object.assign(progressBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        width: '100%',
        zIndex: '99999',
        pointerEvents: 'none'
      });
    };

    // Run immediately and on scroll/resize
    forceFixedPosition();
    window.addEventListener('scroll', forceFixedPosition, { passive: true });
    window.addEventListener('resize', forceFixedPosition, { passive: true });

    // Add redundant calls for reliability
    setTimeout(forceFixedPosition, 100);
    setTimeout(forceFixedPosition, 500);

    return () => {
      window.removeEventListener('scroll', forceFixedPosition);
      window.removeEventListener('resize', forceFixedPosition);
    };
  }, []);

  return (
    <div className="fixed-progress-bar fixed top-0 left-0 right-0 h-1 z-[99999] overflow-hidden pointer-events-none">
      {/* Background track */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-sm" />

      {/* Animated progress */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-blue-600 via-primary to-indigo-500"
        style={{
          scaleX,
          transformOrigin: "0%"
        }}
      >
        {/* Shine effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70"
          style={{
            transform: 'translateX(-100%)',
            animation: 'shine 3s ease-in-out infinite'
          }}
        />
      </motion.div>

      {/* Add animation keyframes in a style tag */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
