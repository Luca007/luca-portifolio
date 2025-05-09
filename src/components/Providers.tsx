"use client";

import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { EditProvider } from "@/contexts/EditContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange
    >
      <AuthProvider>
        <LanguageProvider>
          <EditProvider>
            {children}
          </EditProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
