"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES, Language } from "@/config/languages";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage, content } = useLanguage();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-full p-0 overflow-hidden hover:bg-primary/10 focus-visible:bg-primary/10"
          aria-label={content.languageSwitcher.toggleLabel}
        >
          <motion.div
            className="flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 rounded-full opacity-0 bg-primary/10 transition-opacity group-hover:opacity-100" />
            <span className="text-lg font-semibold">{currentLanguage.flag}</span>
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-background/95 backdrop-blur-sm border border-border/50"
      >
        <div className="p-2 text-xs font-medium text-muted-foreground">
          {content.languageSwitcher.selectLanguagePrompt}
        </div>
        {LANGUAGES.map((lang: Language) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang)}
            className={`flex items-center gap-2 transition-colors my-1 rounded-md ${
              currentLanguage.code === lang.code
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center">
              <span className="text-xl mr-2">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </div>
            <span className="ml-auto text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full">
              {lang.countryCode}
            </span>

            {currentLanguage.code === lang.code && (
              <motion.div
                className="w-1.5 h-1.5 bg-primary rounded-full absolute -left-1"
                layoutId="activeLang"
                transition={{ duration: 0.2, type: "spring" }}
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
