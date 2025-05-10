"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LANGUAGES, DEFAULT_LANGUAGE, Language } from "@/config/languages";
import { contentMap, Content } from "@/i18n/content";
import { getContent } from "@/lib/firestore";

type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  content: Content;
};

const defaultContext: LanguageContextType = {
  currentLanguage: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  content: contentMap[DEFAULT_LANGUAGE.code],
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [content, setContent] = useState<Content>(contentMap[DEFAULT_LANGUAGE.code]);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      const lang = LANGUAGES.find((l) => l.code === savedLanguage);
      if (lang) {
        setCurrentLanguage(lang);
        console.log(`Language set to ${lang.code} from localStorage`);
      }
    }
  }, []);

  // Load content based on priority: localStorage, Firestore, then contentMap
  useEffect(() => {
    const load = async () => {
      const code = currentLanguage.code;
      const localDataKey = `content_${code}`;
      const localTsKey = `content_updatedAt_${code}`;
      const localData = localStorage.getItem(localDataKey);
      const localTs = localStorage.getItem(localTsKey);
      const localTimestamp = localTs ? parseInt(localTs) : 0;
      try {
        const fb = await getContent(code);
        if (localData && localTimestamp && fb && localTimestamp >= fb.updatedAt) {
          setContent(JSON.parse(localData));
          console.log(`Content loaded from localStorage for ${code}`);
        } else if (fb) {
          setContent(fb.data);
          localStorage.setItem(localDataKey, JSON.stringify(fb.data));
          localStorage.setItem(localTsKey, fb.updatedAt.toString());
          console.log(`Content loaded from Firestore for ${code}`);
        } else {
          setContent(contentMap[code]);
          console.log(`Content loaded from default map for ${code}`);
        }
      } catch (error) {
        console.error("Error loading content, falling back to default", error);
        setContent(contentMap[code]);
        console.log(`Content loaded from default map for ${code}`);
      }
    };
    load();
  }, [currentLanguage]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem("language", lang.code);
    console.log(`Language changed to ${lang.code}`);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
};
