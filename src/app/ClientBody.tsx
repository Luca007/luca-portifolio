"use client";

import { useEffect, useState } from "react";

interface ClientBodyProps {
  children: React.ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Remove any extension-added classes during hydration
    const root = document.documentElement;

    // Remove all classes except theme classes (for dark/light mode)
    const classList = Array.from(root.classList);
    classList.forEach(cls => {
      if (!cls.startsWith('dark') && !cls.startsWith('light')) {
        root.classList.remove(cls);
      }
    });

    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return children;
}
