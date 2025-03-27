"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  Server,
  FileCode,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Languages,
  Bot,
  Braces,
  Coffee,
  Cloud,
  PenTool,
  Brain,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type Skill = {
  name: string;
  icon: React.ReactNode;
  description: string;
  level: number;
};

export default function Skills() {
  const { content } = useLanguage();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const programmingSkills: Skill[] = [
    {
      name: "HTML & CSS",
      icon: <FileCode className="h-6 w-6 text-orange-400" />,
      description: "Experience in UI/UX development for various websites, including personal projects with responsive design for mobile and various monitors.",
      level: 95,
    },
    {
      name: "JavaScript",
      icon: <Braces className="h-6 w-6 text-yellow-400" />,
      description: "Advanced experience in JS for animations, functions, and application features, as well as backend development with JSON file manipulation and API connections.",
      level: 90,
    },
    {
      name: "TypeScript",
      icon: <Code className="h-6 w-6 text-blue-600" />,
      description: "Strong experience with TypeScript for type-safe application development, including React projects and Next.js applications.",
      level: 85,
    },
    {
      name: "React & Next.js",
      icon: <Globe className="h-6 w-6 text-cyan-500" />,
      description: "Proficient in building modern web applications using React and Next.js with server-side rendering, static generation, and dynamic routes.",
      level: 88,
    },
    {
      name: "Node.js",
      icon: <Server className="h-6 w-6 text-green-500" />,
      description: "Experience building backend services, REST APIs, and server-side applications using Node.js and Express.",
      level: 82,
    },
    {
      name: "Java",
      icon: <Coffee className="h-6 w-6 text-red-500" />,
      description: "Experience maintaining tools, fixing bugs, creating interfaces, developing applications, and debugging them.",
      level: 85,
    },
    {
      name: "Python",
      icon: <Code className="h-6 w-6 text-blue-400" />,
      description: "Experience developing applications for personal use, such as a ChatBot, a hand recognition AI using WebCam, etc.",
      level: 80,
    },
    {
      name: "SQL & NoSQL",
      icon: <Database className="h-6 w-6 text-purple-500" />,
      description: "Experience with database design and management, including MySQL, PostgreSQL, and MongoDB for various application needs.",
      level: 78,
    },
    {
      name: "C++",
      icon: <Cpu className="h-6 w-6 text-purple-400" />,
      description: "Experience in C++ application development for personal Arduino projects, as well as experience with the hardware.",
      level: 75,
    },
  ];

  const toolsSkills: Skill[] = [
    {
      name: "GitHub Copilot & ChatGPT",
      icon: <Bot className="h-6 w-6 text-green-400" />,
      description: "Use of artificial intelligence in daily development to accelerate the process.",
      level: 90,
    },
    {
      name: "Firebase (Google)",
      icon: <Database className="h-6 w-6 text-orange-500" />,
      description: "Experience with personal and free projects using Google's storage and deployment tool.",
      level: 85,
    },
    {
      name: "AWS (Amazon)",
      icon: <Cloud className="h-6 w-6 text-blue-500" />,
      description: "Experience configuring environments for deploying applications in Docker, plus basic knowledge of Amazon Linux 2.",
      level: 80,
    },
    {
      name: "Git & GitHub",
      icon: <GitBranch className="h-6 w-6 text-purple-500" />,
      description: "Experience with version control and collaborative development.",
      level: 85,
    },
    {
      name: "AI Agents",
      icon: <Brain className="h-6 w-6 text-indigo-400" />,
      description: "Experience developing AI agents through open applications like Hugging Face and other platforms.",
      level: 75,
    },
  ];

  const languageSkills: Skill[] = [
    {
      name: "English",
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      description: "Fluent in English, completed advanced course at Casa Thomas Jefferson.",
      level: 100,
    },
    {
      name: "Spanish",
      icon: <Globe className="h-6 w-6 text-yellow-500" />,
      description: "Basic knowledge of Spanish.",
      level: 20,
    },
    {
      name: "Japanese",
      icon: <Globe className="h-6 w-6 text-red-400" />,
      description: "Basic knowledge of Japanese.",
      level: 50,
    },
  ];

  // Helper function to render skill progress bar
  const renderSkillLevel = (skill: Skill) => {
    const isHovered = hoveredSkill === skill.name;

    // Define different levels
    const levelText = skill.level >= 90 ? "Expert" :
                     skill.level >= 80 ? "Advanced" :
                     skill.level >= 60 ? "Intermediate" :
                     "Basic";

    return (
      <div className="w-full mt-3">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-muted-foreground">Proficiency</span>
          <motion.span
            className="text-xs font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {levelText} - {skill.level}%
          </motion.span>
        </div>
        <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </motion.div>
        </div>
      </div>
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const renderSkillCards = (skills: Skill[], title: string, icon: React.ReactNode) => (
    <div className="space-y-4">
      <motion.h3
        className="text-lg sm:text-xl font-semibold flex items-center"
        variants={item}
      >
        {icon}
        <span className="ml-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {title}
        </span>
      </motion.h3>
      <div className="space-y-3 sm:space-y-4">
        {skills.map((skill) => (
          <motion.div
            key={skill.name}
            variants={item}
            whileHover={{ y: -5 }}
            onHoverStart={() => setHoveredSkill(skill.name)}
            onHoverEnd={() => setHoveredSkill(null)}
          >
            <Card className="overflow-hidden border-border/30 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:bg-gradient-to-br hover:from-background hover:to-background/80">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="mt-0.5 bg-primary/5 rounded-md p-2 sm:p-2.5 transition-colors duration-300">
                    {skill.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base sm:text-lg mb-1 flex items-center">
                      {skill.name}
                      {skill.level >= 90 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="ml-2"
                        >
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        </motion.span>
                      )}
                    </h4>
                    <motion.p
                      className="text-xs sm:text-sm text-muted-foreground line-clamp-2 group-hover:line-clamp-none transition-all duration-500"
                      initial={{ height: "2.5rem" }}
                      animate={{ height: hoveredSkill === skill.name ? "auto" : "2.5rem" }}
                      transition={{ duration: 0.3 }}
                    >
                      {skill.description}
                    </motion.p>
                    {renderSkillLevel(skill)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="skills" className="py-16 sm:py-24 bg-[#050e1b] relative">
      {/* Top transition wave - fixed */}
      <div className="absolute -top-12 inset-x-0 h-24 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          className="absolute bottom-0 fill-[#050e1b] w-full"
          preserveAspectRatio="none"
          style={{ height: '50px' }}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 rounded-full filter blur-3xl"></div>

      <div className="container relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading">
            <span>{content.skills.title}</span>
            <span></span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground mb-10 sm:mb-16 max-w-3xl mx-auto text-center">
            {content.skills.description}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {renderSkillCards(programmingSkills, content.skills.skillCategories.programming,
            <Code className="mr-2 h-5 w-5 text-primary" />)}

          {renderSkillCards(toolsSkills, content.skills.skillCategories.tools,
            <Server className="mr-2 h-5 w-5 text-primary" />)}

          {renderSkillCards(languageSkills, content.skills.skillCategories.languages,
            <Languages className="mr-2 h-5 w-5 text-primary" />)}
        </motion.div>
      </div>

      {/* Bottom transition wave - fixed */}
      <div className="absolute -bottom-12 inset-x-0 h-24 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          className="absolute top-0 fill-[#050e1b] w-full"
          preserveAspectRatio="none"
          style={{ height: '50px', transform: 'rotate(180deg)' }}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
}
