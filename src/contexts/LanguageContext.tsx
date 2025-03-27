"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LANGUAGES, DEFAULT_LANGUAGE, Language } from "@/config/languages";
import { contentMap, Content, EN_CONTENT } from "@/i18n/content";

type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  content: Content;
};

const defaultContext: LanguageContextType = {
  currentLanguage: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  content: EN_CONTENT,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [content, setContent] = useState<Content>(contentMap[DEFAULT_LANGUAGE.code]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      const lang = LANGUAGES.find((l) => l.code === savedLanguage);
      if (lang) {
        setCurrentLanguage(lang);
        setContent(contentMap[lang.code] || EN_CONTENT);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    setContent(contentMap[lang.code] || EN_CONTENT);
    localStorage.setItem("language", lang.code);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
};
