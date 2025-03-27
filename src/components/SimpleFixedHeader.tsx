"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEdit } from "@/contexts/EditContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, Edit } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { AdminLoginModal } from "@/components/ui/AdminLoginModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function SimpleFixedHeader() {
  const { content } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const { isEditMode, setEditMode } = useEdit();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Scroll handler with debounce to prevent excessive renders
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        // Update scroll state
        setIsScrolled(window.scrollY > 10);

        // Find active section
        const sections = document.querySelectorAll("section[id]");
        const scrollPosition = window.scrollY + 100;

        sections.forEach((section) => {
          const sectionTop = (section as HTMLElement).offsetTop;
          const sectionHeight = (section as HTMLElement).offsetHeight;
          const sectionId = section.getAttribute("id") || "";

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(sectionId);
          }
        });
      }, 100); // Debounce delay
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Simple scroll to section function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const headerHeight = 60;
    window.scrollTo({
      top: element.offsetTop - headerHeight,
      behavior: "smooth"
    });
  };

  // Navigation items
  const navigationItems = [
    { name: content.navigation.home, id: "home" },
    { name: content.navigation.about, id: "about" },
    { name: content.navigation.skills, id: "skills" },
    { name: content.navigation.experiences, id: "experiences" },
    { name: content.navigation.education, id: "education" },
    { name: content.navigation.projects, id: "projects" },
    { name: content.navigation.contact, id: "contact" }
  ];

  // Handle logo click - regular users go to home, admins toggle login modal
  const handleLogoClick = (e: React.MouseEvent) => {
    if (isAdmin) {
      // Admin already logged in, toggle edit mode
      e.preventDefault();
      setEditMode(!isEditMode);
    } else if (user) {
      // Regular user logged in, sign out
      e.preventDefault();
      signOut();
    } else {
      // Not logged in, show login modal
      e.preventDefault();
      setLoginModalOpen(true);
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 9999,
        padding: "0.75rem 0",
        backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
        boxShadow: isScrolled ? "0 2px 10px rgba(0, 0, 0, 0.3)" : "none",
        transition: "all 0.3s ease"
      }}
      id="fixed-header"
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          {/* Logo area */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 group cursor-pointer"
          >
            <Logo className={cn(
              "h-8 w-8 transition-colors duration-300",
              isAdmin && "text-blue-400",
              isEditMode && "text-green-400",
              !isAdmin && !isEditMode && "group-hover:text-primary"
            )} />
            <span className={cn(
              "font-bold text-xl transition-colors duration-300",
              isAdmin && "text-blue-400",
              isEditMode && "text-green-400",
              !isAdmin && !isEditMode && "group-hover:text-primary"
            )}>
              Luca Clerot
            </span>
          </button>

          {/* Admin badge */}
          {isAdmin && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-3 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    Admin
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You are logged in as an administrator</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Edit mode badge */}
          {isEditMode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-3 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Edit size={10} />
                    Edit Mode
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You can now edit content on the page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "relative px-3 py-2 text-foreground/80 transition-colors rounded-md group",
                activeSection === item.id
                  ? "text-primary font-medium"
                  : "hover:text-primary hover:bg-muted/50"
              )}
            >
              {item.name}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded"></span>
              )}
            </button>
          ))}
          <div className="flex items-center ml-2 space-x-1">
            <ThemeSwitcher />
            <LanguageSwitcher />

            {/* Logout button if user is signed in */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="text-foreground/70 hover:text-primary hover:bg-muted/50"
              >
                <LogOut size={20} />
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile navigation */}
        <div className="md:hidden flex items-center space-x-1">
          <div className="flex items-center">
            <ThemeSwitcher />
            <LanguageSwitcher />

            {/* Logout button if user is signed in */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="text-foreground/70 hover:text-primary hover:bg-muted/50"
              >
                <LogOut size={20} />
              </Button>
            )}

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
                  </div>

                  <div className="flex-1 overflow-auto py-4 px-4">
                    <nav className="flex flex-col space-y-1">
                      {navigationItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            scrollToSection(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={cn(
                            "p-3 text-left rounded-md flex items-center transition-all",
                            activeSection === item.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground/80 hover:bg-muted/50 hover:text-primary"
                          )}
                        >
                          <span className="text-base">{item.name}</span>
                          {activeSection === item.id && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </header>
  );
}
