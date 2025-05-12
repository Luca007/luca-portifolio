// Enable dynamic rendering to skip static prerender errors
export const dynamic = 'force-dynamic';

"use client";

import { Suspense, lazy } from 'react';
import dynamicNext from 'next/dynamic';
import ClientBody from './ClientBody';
import Hero from "@/components/Hero";
import InteractiveBackground from "@/components/InteractiveBackground";

// Lazy load non-critical sections for better initial load performance
const About = lazy(() => import("@/components/About"));
const Skills = lazy(() => import("@/components/Skills"));
const Experience = lazy(() => import("@/components/Experience"));
const Education = lazy(() => import("@/components/Education"));
// Correct the Projects import by removing the then() clause:
const Projects = lazy(() => import("@/components/Projects"));
const Contact = lazy(() => import("@/components/Contact"));
const Footer = lazy(() => import("@/components/Footer"));
const ThemeSwitcher = lazy(() => import("@/components/ThemeSwitcher").then(mod => ({ default: mod.ThemeSwitcher })));
const AdminPanel = dynamicNext(() => import("@/components/AdminPanel"), { ssr: false });

// Simple placeholders that don't cause layout shifts
const SectionPlaceholder = ({ height = "min-h-screen", id = "" }) => (
  // Use theme background color
  <section className={`${height} bg-background`} id={id}></section>
);

export default function Home() {
  return (
    <ClientBody>
      <InteractiveBackground />
      <main className="min-h-screen relative overflow-x-hidden">
        <Hero />

        <Suspense fallback={<SectionPlaceholder id="about" />}>
          <About />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder id="skills" />}>
          <Skills />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder id="experiences" />}>
          <Experience />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder id="education" />}>
          <Education />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder id="projects" />}>
          <Projects />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder id="contact" />}>
          <Contact />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder height="min-h-[200px]" />}>
          <Footer />
        </Suspense>
      </main>

      <Suspense fallback={<div className="fixed bottom-4 right-4 z-50 w-10 h-10"></div>}>
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeSwitcher />
        </div>
      </Suspense>

      {/* Admin Panel - client-only dynamic import */}
      <AdminPanel />
    </ClientBody>
  );
}
