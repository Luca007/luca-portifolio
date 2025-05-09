"use client";
import * as React from "react";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

// Extend NextThemesProvider props to ensure children are required.
interface CustomThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}