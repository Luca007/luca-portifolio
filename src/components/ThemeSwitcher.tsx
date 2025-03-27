"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export const ThemeSwitcher = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure the component is mounted before accessing window
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full p-0">
        <div className="h-5 w-5 bg-muted animate-pulse rounded" />
      </Button>
    );
  }

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
              rotate: theme === 'dark' ? -90 : 0,
              scale: theme === 'dark' ? 0 : 1,
              opacity: theme === 'dark' ? 0 : 1
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="h-5 w-5 text-amber-500" />
          </motion.div>

          <motion.div
            initial={false}
            animate={{
              rotate: theme === 'dark' ? 0 : 90,
              scale: theme === 'dark' ? 1 : 0,
              opacity: theme === 'dark' ? 1 : 0
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
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 transition-colors my-1 rounded-md ${
            theme === 'light' ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
          }`}
        >
          <div className="flex items-center">
            <Sun className="mr-2 h-4 w-4 text-amber-500" />
            <span className="font-medium">Light</span>
          </div>

          {theme === 'light' && (
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full absolute -left-1"
              layoutId="activeTheme"
              transition={{ duration: 0.2, type: "spring" }}
            />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 transition-colors my-1 rounded-md ${
            theme === 'dark' ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
          }`}
        >
          <div className="flex items-center">
            <Moon className="mr-2 h-4 w-4 text-blue-400" />
            <span className="font-medium">Dark</span>
          </div>

          {theme === 'dark' && (
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full absolute -left-1"
              layoutId="activeTheme"
              transition={{ duration: 0.2, type: "spring" }}
            />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 transition-colors my-1 rounded-md ${
            theme === 'system' ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
          }`}
        >
          <div className="flex items-center">
            <Monitor className="mr-2 h-4 w-4 text-green-400" />
            <span className="font-medium">System</span>
          </div>

          {theme === 'system' && (
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full absolute -left-1"
              layoutId="activeTheme"
              transition={{ duration: 0.2, type: "spring" }}
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
