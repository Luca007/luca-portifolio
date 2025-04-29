"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Importe os ícones necessários
import {
  ExternalLink, Github, Code, Globe, Search, Briefcase, Star, Tag, Calendar, RefreshCcw, Loader2,
  FileCode, Container, Coffee, Terminal, FileQuestion, Component // Adicione outros ícones conforme necessário
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { fetchGithubPagesProjects } from "@/lib/github";
import { Input } from "@/components/ui/input";
import { imageConfig, throttle } from "@/lib/utils";
import { LucideProps } from "lucide-react"; // Importe LucideProps

interface Project {
  id: number;
  name: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  topics: string[];
  lastUpdated: string;
  language: string;
  stars: number;
  imageUrl: string;
  hasDemo?: boolean;
}

// Mapeamento de linguagens para ícones
const languageIcons: Record<string, React.ComponentType<LucideProps>> = {
  typescript: Code, // Ou um ícone específico de TS se disponível
  javascript: Code, // Ou um ícone específico de JS
  html: FileCode,
  css: FileCode, // Ou um ícone específico de CSS
  docker: Container,
  dockerfile: Container,
  java: Coffee,
  python: Code, // Ou um ícone específico de Python
  shell: Terminal,
  vue: Component, // Exemplo para Vue
  // Adicione mais linguagens e seus ícones aqui
  'n/a': FileQuestion, // Ícone padrão para N/A ou desconhecido
};

export default function Projects() {
  const { content } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para searchTerm
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]); // Estado para allTags
  const [error, setError] = useState<string | null>(null); // Estado para error

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null); // Limpa o erro antes de carregar
        const githubProjects = await fetchGithubPagesProjects("Luca007");

        // Extraindo todas as tags únicas
        const tags = Array.from(new Set(githubProjects.flatMap(project => project.topics))).sort();

        setProjects(githubProjects);
        setFilteredProjects(githubProjects);
        setAllTags(tags); // Atualizando o estado de allTags
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [content.projects.items]);

  // Filter projects based on search and tags
  useEffect(() => {
    let result = projects;

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        project =>
          project.name.toLowerCase().includes(search) ||
          project.description.toLowerCase().includes(search) ||
          project.topics.some(tag => tag.toLowerCase().includes(search)) ||
          project.language.toLowerCase().includes(search)
      );
    }

    // Filter by tag
    if (selectedTag) {
      result = result.filter(
        project => project.topics.includes(selectedTag)
      );
    }

    setFilteredProjects(result);
  }, [searchTerm, selectedTag, projects]);

  const refreshProjects = async () => {
    try {
      setIsLoading(true);
      setError(null); // Limpa o erro antes de recarregar
      const githubProjects = await fetchGithubPagesProjects("Luca007");

      const tags = Array.from(new Set(githubProjects.flatMap(project => project.topics))).sort();

      setProjects(githubProjects);
      setFilteredProjects(githubProjects);
      setAllTags(tags); // Atualizando o estado de allTags
      setSelectedTag(null);
      setSearchTerm("");
    } catch (err) {
      console.error("Error refreshing projects:", err);
      setError("Failed to refresh projects. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects" className="py-24 bg-muted/20 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-primary/5 rounded-full filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 rounded-full filter blur-3xl opacity-70"></div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="section-heading">
            <span>{content.projects.title}</span>
            <span></span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center">
            {content.projects.description}
          </p>
        </motion.div>

        {/* Filter controls */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/30 focus:border-primary/30 pr-4"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto py-2 md:py-0 scrollbar-thin">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
              className="rounded-full text-xs whitespace-nowrap"
            >
              All Projects
            </Button>

            {allTags.slice(0, 8).map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className="rounded-full text-xs whitespace-nowrap"
              >
                {tag}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={refreshProjects}
              disabled={isLoading}
              className="rounded-full"
              title="Refresh projects"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-100/20 dark:bg-red-900/20 p-4 rounded-lg mb-6 text-center text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground max-w-md">
              {selectedTag ?
                `No projects found with the tag "${selectedTag}". Try another filter.` :
                "No projects match your search criteria. Try different keywords."}
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                setSearchTerm("");
                setSelectedTag(null);
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => {
                const displayedTopics = project.topics.filter(
                  (topic) => topic.toLowerCase() !== project.language.toLowerCase() && topic.toLowerCase() !== "web"
                );

                // Seleciona o ícone da linguagem dinamicamente
                const langKey = project.language.toLowerCase();
                const LanguageIcon = languageIcons[langKey] || languageIcons['n/a'];

                // *** Add logging here ***
                console.log(`Rendering project: ${project.name}, Image URL: ${project.imageUrl}`);

                return (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.3,
                      layout: { duration: 0.6, type: "spring", damping: 30, stiffness: 200 }
                    }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                    <Card className="overflow-hidden bg-gradient-to-br from-background to-background/90 border border-border/30 hover:border-primary/20 transition-all hover:shadow-xl shadow-lg shadow-black/5 hover:shadow-primary/5 h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={project.imageUrl} // Ensure this is correct
                          alt={project.name}
                          fill
                          sizes={imageConfig.getOptimalSizes()}
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          {...imageConfig.defaultImageProps}
                          // Add onError for debugging image loading issues
                          onError={(e) => console.error(`Image failed to load: ${project.imageUrl}`, e)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-70"></div>

                        {/* Language and Web badge */}
                        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm border border-border/40 px-2 py-1 rounded-md flex flex-col items-start space-y-1">
                          <div className="flex items-center">
                            <LanguageIcon className="h-3 w-3 mr-1 text-primary" /> {/* Ícone dinâmico */}
                            <span className="text-xs font-medium">{project.language}</span>
                          </div>
                          {project.hasDemo && (
                            <div className="flex items-center">
                              <Globe className="h-3 w-3 mr-1 text-primary" />
                              <span className="text-xs font-medium">Web</span>
                            </div>
                          )}
                        </div>

                        {/* Star count if available */}
                        {project.stars > 0 && (
                          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm border border-border/40 px-2 py-1 rounded-md flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-400" />
                            <span className="text-xs font-medium">{project.stars}</span>
                          </div>
                        )}

                        {/* Floating tags */}
                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 max-w-[90%]">
                          {displayedTopics.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-block bg-primary/20 backdrop-blur-sm text-primary px-2 py-0.5 rounded-full text-xs font-medium truncate max-w-[100px]"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedTag(tag);
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                          {displayedTopics.length > 3 && (
                            <span className="inline-block bg-muted/40 backdrop-blur-sm text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                              +{displayedTopics.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-6 flex-grow">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                              {project.name}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{project.lastUpdated}</span>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm line-clamp-3">
                            {project.description}
                          </p>
                        </div>
                      </CardContent>

                      <CardFooter className="p-6 pt-0 flex justify-between gap-4 mt-auto">
                        <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-1 group">
                            <Github className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                            <span>GitHub</span>
                          </Button>
                        </Link>

                        {project.hasDemo && project.demoUrl && (
                          <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full gap-1 bg-gradient-to-r from-primary to-blue-500 hover:shadow-md hover:shadow-primary/20 group"
                            >
                              <Globe className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                              <span>Demo</span>
                            </Button>
                          </Link>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="flex justify-center mt-12">
          <Link href="https://github.com/Luca007" target="_blank" rel="noopener noreferrer">
            <Button className="px-8 rounded-full bg-gradient-to-r from-primary to-blue-500 hover:shadow-lg hover:shadow-primary/20 group">
              <Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              {content.projects.viewAll}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
