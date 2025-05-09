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

  // Scroll handler with debounce
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;
        setIsScrolled(currentScrollY > 10);

        const sections = document.querySelectorAll("section[id]");
        const scrollPosition = currentScrollY + 100; // Adjusted offset for better accuracy

        let currentSection = "home"; // Default to home
        sections.forEach((section) => {
          const sectionTop = (section as HTMLElement).offsetTop;
          const sectionHeight = (section as HTMLElement).offsetHeight;
          const sectionId = section.getAttribute("id") || "";

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = sectionId;
          }
        });
        // Handle case where user scrolls past the last section
        const lastSection = sections[sections.length - 1];
        if (lastSection && scrollPosition >= (lastSection as HTMLElement).offsetTop + (lastSection as HTMLElement).offsetHeight) {
          currentSection = lastSection.getAttribute("id") || "home";
        }

        setActiveSection(currentSection);
      }, 50); // Reduced debounce delay for faster feedback
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check in case the page loads scrolled
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Scroll to section function
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const headerElement = document.getElementById("site-header"); // Atualizado para o ID correto
    const headerHeight = headerElement ? headerElement.offsetHeight : 60; // Dinamicamente obtém a altura do header ou usa fallback
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
    // Manually set active section immediately for better UX
    setActiveSection(id);
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  // Navigation items - Atualizado para usar traduções dinâmicas
  const navigationKeys = Object.keys(content.navigation) as Array<keyof typeof content.navigation>;
  
  const navigationItems = navigationKeys
    .filter(key => key !== 'blog' && key !== 'language') // Remove 'blog' e 'language' da navegação principal
    .map(key => ({
      id: key,
      name: content.navigation[key]
    }));

  // Handle logo click
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    if (isAdmin) {
      setEditMode(!isEditMode);
    } else if (user) {
      // If a non-admin user clicks the logo, maybe scroll to top? Or do nothing?
      // Currently set to sign out, which might be confusing. Let's scroll to top.
      // signOut(); // Removed sign out on logo click for non-admin
      scrollToSection("home"); // Scroll to top instead
    } else {
      setLoginModalOpen(true);
    }
  };

  // Handle admin icon click (separate from logo)
  const handleAdminIconClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (isAdmin) {
          setEditMode(!isEditMode);
      } else if (!user) {
          setLoginModalOpen(true);
      }
      // If user is logged in but not admin, this button isn't shown or does nothing
  };


  return (
    <header className={cn(
      "w-full py-[17px] -mt-1",
      "transition-all duration-300 ease-in-out",
      isScrolled
        ? "bg-background/85 shadow-lg"
        : "bg-background/50 shadow-none"
    )}>
      <div className="container flex items-center justify-between">
        {/* Left side: Logo and Badges */}
        <div className="flex items-center gap-2">
          {/* Logo - always scrolls to top */}
           <Link href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }} className="flex items-center space-x-2 group cursor-pointer">
             <Logo className={cn(
               "h-8 w-8 transition-colors duration-300 text-foreground/80 group-hover:text-primary",
               // Keep admin/edit mode colors if needed, but applied differently now
             )} />
             <span className={cn(
               "font-bold text-xl transition-colors duration-300 text-foreground/90 group-hover:text-primary",
             )}>
               Luca Clerot
             </span>
           </Link>

          {/* Admin/Edit Controls - Moved next to logo */}
          {isAdmin && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAdminIconClick}
                    className={cn(
                      "ml-1 rounded-full h-8 w-8",
                      isEditMode ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300"
                                 : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300"
                    )}
                  >
                    <Edit size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {!user && !isAdmin && (
             <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                   <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAdminIconClick} // Opens login modal
                    className="ml-1 rounded-full h-8 w-8 text-foreground/60 hover:bg-muted/50 hover:text-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-ellipsis"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M17 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M7 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Admin Login</p>
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
                "relative px-3 py-2 text-sm transition-colors rounded-md group", // Adjusted padding/text size
                activeSection === item.id
                  ? "text-primary font-medium"
                  : "text-foreground/70 hover:text-primary hover:bg-muted/50"
              )}
              aria-current={activeSection === item.id ? "page" : undefined}
            >
              {item.name} {/* Nome traduzido */}
              {/* Underline effect for active item */}
              <span className={cn(
                  "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-4/5",
                  activeSection === item.id ? "w-4/5" : "w-0"
              )}></span>
            </button>
          ))}
          <div className="flex items-center pl-2 space-x-1 border-l border-border/20 ml-2"> {/* Separator */}
            <ThemeSwitcher /> {/* Se o dropdown estiver com problemas, verifique seu z-index */}
            <LanguageSwitcher /> {/* Se o dropdown estiver com problemas, verifique seu z-index */}
            {user && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => signOut()}
                      className="text-foreground/70 hover:text-destructive hover:bg-destructive/10" // Destructive indication
                    >
                      <LogOut size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign Out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </nav>

        {/* Mobile navigation Trigger & Controls */}
        <div className="md:hidden flex items-center space-x-1">
          <ThemeSwitcher /> {/* Se o dropdown estiver com problemas, verifique seu z-index */}
          <LanguageSwitcher /> {/* Se o dropdown estiver com problemas, verifique seu z-index */}
          {user && (
             <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => signOut()}
                      className="text-foreground/70 hover:text-destructive hover:bg-destructive/10 h-9 w-9"
                    >
                      <LogOut size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sign Out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
          )}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 text-foreground/80 hover:bg-muted/50 h-9 w-9"
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] max-w-[300px] p-0 flex flex-col">
              {/* Mobile Menu Header */}
              <div className="p-4 border-b border-border/10 flex justify-between items-center">
                 <Link href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); setIsMobileMenuOpen(false); }} className="flex items-center space-x-2 group cursor-pointer">
                    <Logo className="h-7 w-7 text-primary" />
                     <span className="font-bold text-lg text-primary">Luca Clerot</span>
                 </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="h-8 w-8 rounded-full">
                   <X size={20} className="text-muted-foreground" />
                </Button>
              </div>

              {/* Mobile Menu Navigation */}
              <nav className="flex-1 overflow-auto py-4 px-4 space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "w-full p-3 text-left rounded-md flex items-center justify-between transition-all text-base", // Ensure full width
                      activeSection === item.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/80 hover:bg-muted/50 hover:text-primary"
                    )}
                    aria-current={activeSection === item.id ? "page" : undefined}
                  >
                    <span>{item.name}</span> {/* Nome traduzido */}
                    {activeSection === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Mobile Menu Footer (Optional: could add theme/lang switchers here too) */}
              <div className="p-4 border-t border-border/10">
                {/* Add footer content if needed */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </header>
  );
}
