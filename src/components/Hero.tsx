"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Code, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { EditableItem } from "@/components/ui/EditableItem";
import { useEdit } from "@/contexts/EditContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Hero() {
  const { content, currentLanguage } = useLanguage(); // Destructure currentLanguage
  const { isAdmin } = useAuth();
  const { isEditMode, handleEdit } = useEdit();
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for background interaction
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mouseXMovement = useRef(0);
  const mouseYMovement = useRef(0);

  // Scroll-based animations
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const nameScale = useTransform(scrollY, [0, 300], [1, 0.9]);
  const nameY = useTransform(scrollY, [0, 300], [0, -40]);
  const titleControls = useAnimation();

  // Handle mouse movement for background effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate the position relative to the center of the screen
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      // Update mouse position with easing for smoother effect
      mouseXMovement.current = x * 15; // Control the amount of movement
      mouseYMovement.current = y * 15;

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Hide scroll indicator when user has scrolled
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Animate the title when the component mounts
    titleControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    });

    // Typewriter effect for roles
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < content.home.roles[currentRoleIndex].length) {
          setDisplayText(content.home.roles[currentRoleIndex].substring(0, displayText.length + 1));
          setTypingSpeed(Math.random() * 50 + 100); // Varied typing speed for more natural effect
        } else {
          // Pause at the end of the word
          setTimeout(() => {
            setIsDeleting(true);
            setTypingSpeed(50);
          }, 1500);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.substring(0, displayText.length - 1));
          setTypingSpeed(30); // Faster deletion
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((currentRoleIndex + 1) % content.home.roles.length);
          setTypingSpeed(100);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [content.home.roles, currentRoleIndex, displayText, isDeleting, typingSpeed, titleControls]);

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/Luca007",
      icon: <Github size={20} />,
      color: "hover:bg-gray-800 hover:text-white",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/luca-clerot-aviani-10042128a",
      icon: <Linkedin size={20} />,
      color: "hover:bg-blue-700 hover:text-white",
    },
    {
      name: "Email",
      url: "mailto:luca.clerot@gmail.com",
      icon: <Mail size={20} />,
      color: "hover:bg-red-500 hover:text-white",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // SVG path for wave animation
  const curvePath = "M0,96 C200,150 400,20 500,96 C600,150 800,50 1000,96 V192 H0 Z";

  // Floating animation for decorative elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16" ref={containerRef}>
      {/* Animated background elements with mouse interaction */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full filter blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: mouseXMovement.current,
            y: mouseYMovement.current,
          }}
          transition={{
            scale: {
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            },
            opacity: {
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            },
            x: {
              duration: 0.8,
              ease: "easeOut",
            },
            y: {
              duration: 0.8,
              ease: "easeOut",
            },
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full filter blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
            x: -mouseXMovement.current * 0.8, // Opposite direction for parallax effect
            y: -mouseYMovement.current * 0.8,
          }}
          transition={{
            scale: {
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            },
            opacity: {
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            },
            x: {
              duration: 1,
              ease: "easeOut",
            },
            y: {
              duration: 1,
              ease: "easeOut",
            },
          }}
        />

        {/* Additional smaller orbs that follow mouse more directly */}
        <motion.div
          className="absolute top-2/3 left-1/3 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-xl hidden md:block"
          animate={{
            x: mouseXMovement.current * 2,
            y: mouseYMovement.current * 2,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-20 h-20 bg-purple-500/5 rounded-full filter blur-lg hidden md:block"
          animate={{
            x: mouseXMovement.current * 3,
            y: mouseYMovement.current * 3,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        />
      </div>

      {/* Decorative code elements */}
      <motion.div
        className="absolute left-10 top-1/3 hidden lg:block"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        style={{ opacity }}
      >
        <EditableItem
          id="hero-snippet-1"
          path={["home", "decorativeCodeSnippet1"]}
          type="textarea"
          content={{ text: content.home.decorativeCodeSnippet1 || "" }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <pre className="text-primary font-mono text-sm whitespace-pre-wrap">
            {content.home.decorativeCodeSnippet1}
          </pre>
        </EditableItem>
      </motion.div>

      <motion.div
        className="absolute right-10 bottom-1/3 hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.15, x: 0 }}
        transition={{ duration: 1, delay: 1.8 }}
        style={{ opacity }}
      >
        <EditableItem
          id="hero-snippet-2"
          path={["home", "decorativeCodeSnippet2"]}
          type="textarea"
          content={{ text: content.home.decorativeCodeSnippet2 || "" }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <pre className="text-primary font-mono text-sm whitespace-pre-wrap">
            {content.home.decorativeCodeSnippet2}
          </pre>
        </EditableItem>
      </motion.div>

      {/* Main content */}
      <div className="container relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center">

          <EditableItem
            id="home-greeting"
            path={["home", "greeting"]}
            type="text"
            content={{ text: content.home.greeting }}
            isAdmin={isAdmin}
            isEditMode={isEditMode && isAdmin} // Ensured correct prop
            onEdit={handleEdit}
          >
            <motion.div
              className="mb-6"
              variants={item}
            >
              <motion.p className="text-xl md:text-2xl mb-4 text-foreground/80 inline-flex items-center justify-center">
                {content.home.greeting}
                <motion.span
                  animate={floatingAnimation}
                  className="ml-2"
                >
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                </motion.span>
              </motion.p>
            </motion.div>
          </EditableItem>

          {/* Refactored Title and Subtitle Section */}
          <motion.div
            style={{ scale: nameScale, y: nameY }}
            className="mb-6"
          >
            <motion.h1
              variants={item}
              className="text-4xl md:text-7xl font-bold relative z-10 mb-2"
            >
              <EditableItem
                id="home-main-title"
                path={["home", "title"]}
                type="text"
                content={{ text: content.home.title }}
                isAdmin={isAdmin}
                isEditMode={isEditMode && isAdmin}
                onEdit={handleEdit}
              >
                <span className="relative inline-block">
                  {content.home.title}
                </span>
              </EditableItem>
              {" "} {/* Space between title and subtitle */}
              <EditableItem
                id="home-subtitle"
                path={["home", "subtitle"]}
                type="text"
                content={{ text: content.home.subtitle }}
                isAdmin={isAdmin}
                isEditMode={isEditMode && isAdmin}
                onEdit={handleEdit}
              >
                <span className="text-primary relative">
                  {content.home.subtitle}
                  <motion.span
                    className="absolute bottom-1 left-0 w-full h-1 bg-primary/30 rounded"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 1 }}
                  />
                </span>
              </EditableItem>
            </motion.h1>
            <motion.div
              className="bg-gradient-to-r from-primary/10 to-transparent h-[30px] w-[120%] -ml-[10%] -mt-6 rounded-full hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            />
          </motion.div>
          {/* End of Refactored Title and Subtitle Section */}

          <EditableItem
            id="home-roles-typewriter"
            path={["home", "roles"]}
            type="text"
            content={{ text: content.home.roles.join(', ') }}
            isAdmin={isAdmin}
            isEditMode={isEditMode && isAdmin}
            onEdit={(
              editedPath,
              newValueFromEditableItem, // This is { text: "string" } for type="text"
              lang, // language code from EditableItem
              originalContentPassedToEditableItem // This is { text: "original_string" }
            ) => {
              if (
                typeof newValueFromEditableItem === 'object' &&
                newValueFromEditableItem !== null &&
                'text' in newValueFromEditableItem &&
                typeof (newValueFromEditableItem as { text: string }).text === 'string'
              ) {
                const newRolesString = (newValueFromEditableItem as { text: string }).text;
                const newRolesArray = newRolesString.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
                const originalRolesArray = content.home.roles; // Use current roles array from content
                handleEdit(editedPath, newRolesArray, currentLanguage.code, originalRolesArray);
              } else {
                console.error("Unexpected newValue format from EditableItem for roles:", newValueFromEditableItem);
                // Fallback: use original roles if parsing fails
                handleEdit(editedPath, content.home.roles, currentLanguage.code, content.home.roles);
              }
            }}
          >
            <motion.div
              variants={item}
              className="h-16 flex items-center justify-center mx-auto px-3 border border-border/30 rounded-full bg-background/50 backdrop-blur-sm shadow-sm max-w-md mb-12"
            >
              <h2 className="text-xl md:text-2xl font-medium flex items-center">
                <Code className="mr-3 text-primary" size={18} />
                <span className="text-gradient">{displayText}</span>
                <span className="animate-blink ml-1">|</span>
              </h2>
            </motion.div>
          </EditableItem>

          <motion.div
            variants={item}
            className="flex justify-center mt-6 sm:mt-10 mb-8 space-x-3 sm:space-x-4"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 sm:p-3 bg-background/80 border-[1.5px] border-border hover:border-primary rounded-full transition-all duration-300 ${link.color}`}
                aria-label={link.name}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {link.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* About button - Moved below social links */}
          <motion.div
            variants={item}
            className="flex justify-center mb-12"
          >
            <Link href="#about">
              <motion.div
                className="relative"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
              >
                {/* Glow effect behind the button */}
                <div className="absolute -inset-1 bg-primary/40 rounded-full blur-md opacity-80"></div>

                {/* Main button with gradient background */}
                <Button
                  size="lg"
                  className="relative rounded-full py-4 sm:py-6 px-6 sm:px-8 bg-gradient-to-r from-primary/90 via-blue-600 to-primary/90 bg-size-200 hover:bg-right-bottom transition-all duration-500 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 border border-primary/30"
                >
                  <span className="absolute inset-0 rounded-full overflow-hidden">
                    <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.3),transparent_70%)]"></span>
                  </span>

                  <span className="relative flex items-center">
                    <span className="mr-2 bg-white/30 rounded-full p-1">
                      <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </span>
                    <span className="font-semibold text-white text-sm sm:text-base drop-shadow-md">
                      {content.navigation.about}
                    </span>
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <AnimatePresence>
            {/* Only show the dots indicating scroll */}
            {showScrollIndicator && (
              <motion.div
                className="flex space-x-1 mt-4 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 2, duration: 1 }}
              >
                <motion.span
                  className="w-1.5 h-1.5 bg-primary/80 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 bg-primary/80 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 bg-primary/80 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </section>
  );
}
