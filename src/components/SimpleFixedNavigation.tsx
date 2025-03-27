"use client";

import React from 'react';
import SimpleFixedHeader from './SimpleFixedHeader';
import { useScroll, useSpring, motion } from "framer-motion";

export default function SimpleFixedNavigation() {
  const { scrollYProgress } = useScroll();

  // Add spring physics for smooth animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Simple progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[99999] overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-blue-600 via-primary to-indigo-500"
          style={{
            scaleX,
            transformOrigin: "0%"
          }}
        />
      </div>

      {/* Fixed header */}
      <SimpleFixedHeader />
    </>
  );
}
