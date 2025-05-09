"use client";

import React from "react";
import SimpleFixedHeader from "./Header";
import { motion, useScroll, useSpring } from "framer-motion";

export default function SimpleFixedNavigation() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <header id="site-header" className="sticky top-0 left-0 right-0 z-50 will-change-transform">
      {/* progress bar */}
      <div className="relative h-1 w-full overflow-hidden pointer-events-none z-[1]">
        <motion.div
          className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-blue-600 via-primary to-indigo-500"
          style={{ scaleX, transformOrigin: "0%" }}
        />
      </div>

      {/* Header component */}
      <SimpleFixedHeader />
    </header>
  );
}
