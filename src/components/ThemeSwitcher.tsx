"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor, LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface ThemeOption {
  value: "light" | "dark" | "system";
  label: string;
  icon: LucideIcon;
  iconClass: string;
}

const themeOptions: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun, iconClass: "text-amber-500" },
  { value: "dark", label: "Dark", icon: Moon, iconClass: "text-blue-400" },
  { value: "system", label: "System", icon: Monitor, iconClass: "text-green-400" },
];

export const ThemeSwitcher = () => {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  // Aguarde a montagem para evitar problemas de hidratação
  if (!mounted) return null;

  // Se o usuário escolheu "system", use resolvedTheme para determinar o estado real
  const effectiveTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-full p-0 overflow-hidden hover:bg-primary/10 focus-visible:bg-primary/10"
          aria-label="Toggle theme"
        >
          <motion.div
            className="absolute inset-0 opacity-0 bg-primary/10 rounded-full"
            whileHover={{ opacity: 0.5 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            initial={false}
            animate={{
              rotate: effectiveTheme === 'dark' ? -90 : 0,
              scale: effectiveTheme === 'dark' ? 0 : 1,
              opacity: effectiveTheme === 'dark' ? 0 : 1
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-5 w-5 text-amber-500" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{
              rotate: effectiveTheme === 'dark' ? 0 : 90,
              scale: effectiveTheme === 'dark' ? 1 : 0,
              opacity: effectiveTheme === 'dark' ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="h-5 w-5 text-blue-400" />
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background/95 backdrop-blur-sm border border-border/50"
      >
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`flex items-center gap-2 transition-colors my-1 rounded-md relative ${
                isActive ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center">
                <Icon className={`mr-2 h-4 w-4 ${option.iconClass}`} />
                <span className="font-medium">{option.label}</span>
              </div>
              {isActive && (
                <motion.div
                  className="w-1.5 h-1.5 bg-primary rounded-full absolute -left-1"
                  layoutId="activeTheme"
                  transition={{ duration: 0.2, type: "spring" }}
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
