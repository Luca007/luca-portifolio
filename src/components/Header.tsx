"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { content } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      // Detect active section based on scroll position
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 100; // Add offset for better UX

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute("id") || "";

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string, isExternal: boolean = false) => {
    if (!isExternal) {
      setActiveSection(id);
    }
  };

  // Navigation items array without the "Blog" page
  const navigationItems = [
    { name: content.navigation.home, href: "#home", id: "home" },
    { name: content.navigation.about, href: "#about", id: "about" },
    { name: content.navigation.skills, href: "#skills", id: "skills" },
    { name: content.navigation.experiences, href: "#experiences", id: "experiences" },
    { name: content.navigation.education, href: "#education", id: "education" },
    { name: content.navigation.projects, href: "#projects", id: "projects" },
    { name: content.navigation.contact, href: "#contact", id: "contact" }
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-500",
        isScrolled
          ? "bg-background/90 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <Logo className="h-8 w-8 group-hover:text-primary transition-colors duration-300" />
          <span className="font-bold text-xl group-hover:text-primary transition-colors duration-300">Luca Clerot</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-foreground/80 transition-colors rounded-md group",
                  isActive
                    ? "text-primary font-medium"
                    : "hover:text-primary hover:bg-muted/50"
                )}
                onClick={() => handleNavClick(item.id)}
              >
                {item.name}
                {isActive && (
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <div className="flex items-center ml-2 space-x-1">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile navigation */}
        <div className="md:hidden flex items-center space-x-1">
          <div className="flex items-center">
            <ThemeSwitcher />
            <LanguageSwitcher />

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 ml-1 text-foreground hover:bg-muted/50 rounded-md transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu size={22} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px] p-0">
                <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
                  <div className="p-6 border-b border-border/10">
                    <div className="flex items-center justify-between mb-6">
                      <Logo className="h-8 w-8 text-primary" />
                      <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <X size={20} className="text-muted-foreground hover:text-primary transition-colors" />
                      </button>
                    </div>

                    {/* Active section indicator in mobile - simplified */}
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium text-primary">
                        {navigationItems.find(item => item.id === activeSection)?.name || ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto py-4 px-4">
                    <nav className="flex flex-col space-y-1">
                      {navigationItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              handleNavClick(item.id);
                            }}
                            className={cn(
                              "p-3 rounded-md flex items-center transition-all",
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-foreground/80 hover:bg-muted/50 hover:text-primary"
                            )}
                          >
                            <span className="text-base">{item.name}</span>
                            {isActive && (
                              <motion.span
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                                layoutId="activeMobileIndicator"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              />
                            )}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="p-6 border-t border-border/10 mt-auto">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        <p>Luca Clerot</p>
                        <p>Full Stack Developer</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
