"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES, Language } from "@/config/languages";
import Logo from "@/components/Logo";
import { Github, Linkedin, Mail, ArrowUp, Code, Heart, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Footer() {
  const { content, currentLanguage, setLanguage } = useLanguage();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/Luca007",
      icon: <Github className="h-5 w-5" />,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/luca-clerot-aviani-10042128a",
      icon: <Linkedin className="h-5 w-5" />,
    },
    {
      name: "Email",
      url: "mailto:luca.clerot@gmail.com",
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  const navLinks = [
    { name: content.navigation.home, href: "#home" },
    { name: content.navigation.about, href: "#about" },
    { name: content.navigation.skills, href: "#skills" },
    { name: content.navigation.experiences, href: "#experiences" },
    { name: content.navigation.education, href: "#education" },
    { name: content.navigation.projects, href: "#projects" },
    { name: content.navigation.contact, href: "#contact" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hoverAnimation = {
    scale: 1.05,
    transition: { duration: 0.2 }
  };

  const tapAnimation = {
    scale: 0.95,
    transition: { duration: 0.1 }
  };

  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t border-border/20 relative pt-12 pb-6">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background rounded-full p-3 border border-border/20 shadow-lg">
        <motion.button
          onClick={scrollToTop}
          className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-2 rounded-full hover:shadow-lg hover:shadow-primary/20"
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          aria-label="Scroll to top"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Link href="/" className="flex items-center space-x-2 mb-4 group">
                <Logo className="h-8 w-8 group-hover:text-primary transition-colors duration-300" />
                <span className="font-bold text-xl group-hover:text-primary transition-colors duration-300">Luca Clerot</span>
              </Link>
              <p className="text-muted-foreground max-w-md mb-4">
                {content.footer.description}
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-background/80 border border-border/50 hover:border-primary rounded-full transition-colors"
                    aria-label={link.name}
                    whileHover={hoverAnimation}
                    whileTap={tapAnimation}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-3">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Code className="h-4 w-4 mr-2 text-primary" />
                Navigation
              </h3>
              <ul className="space-y-2 columns-2">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center"
                      whileHover={{ x: 3 }}
                    >
                      <span className="absolute left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 -bottom-0.5 opacity-0 group-hover:opacity-100"></span>
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="md:col-span-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 className="font-semibold text-lg mb-4">Contact</h3>
              <div className="flex flex-col space-y-4">
                <motion.a
                  href="mailto:luca.clerot@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block relative"
                  whileHover={{ x: 3 }}
                >
                  luca.clerot@gmail.com
                </motion.a>
                <motion.a
                  href="https://github.com/Luca007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-block relative"
                  whileHover={{ x: 3 }}
                >
                  github.com/Luca007
                </motion.a>

                {/* Language Selection */}
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-primary" />
                    {content.navigation.language}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {LANGUAGES.map((lang: Language) => (
                      <motion.button
                        key={lang.code}
                        onClick={() => setLanguage(lang)}
                        className={`flex items-center gap-1 py-1 px-2 rounded-md transition-colors ${
                          currentLanguage.code === lang.code
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
                        }`}
                        whileHover={hoverAnimation}
                        whileTap={tapAnimation}
                      >
                        <span className="text-lg mr-1">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/20 flex flex-col md:flex-row justify-between items-center">
          <motion.p
            className="text-sm text-muted-foreground mb-4 md:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {content.footer.copyright} © {currentYear} Luca Clerot
          </motion.p>
          <motion.p
            className="text-sm text-muted-foreground flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {content.footer.poweredBy}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="relative hover:text-primary mx-1 transition-colors">Next.js</a>
            <span className="mx-1">+</span>
            <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="relative hover:text-primary mx-1 transition-colors">Tailwind</a>
            <span className="mx-1">+</span>
            <Heart className="h-3 w-3 text-red-500 mx-1" />
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
