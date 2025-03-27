"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ReadingProgressBar() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  // Add spring physics for smooth animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      // Show the progress bar only after scrolling a bit (e.g., 100px)
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] overflow-hidden">
      {/* Background track */}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-sm" />

      {/* Animated progress */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-blue-600 via-primary to-indigo-500"
        style={{
          scaleX,
          transformOrigin: "0%"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70"
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
