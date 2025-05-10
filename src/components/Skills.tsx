"use client";

import React, { useState, useRef, useEffect } from "react";
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
  CheckCircle,
  Cloud,
  PenTool,
  Brain,
  Rocket
} from "lucide-react";
import { motion } from "framer-motion";
import { EditableItem } from "@/components/ui/EditableItem";
import { useEdit } from "@/contexts/EditContext";
import { useAuth } from "@/contexts/AuthContext";

// --- Types ---
export interface Skill {
  name: string;
  icon: React.ReactNode;
  description: string;
  level: number;
}

interface SkillCardProps {
  skill: Skill;
  isHovered: boolean;
  setHoveredSkill: (name: string | null) => void;
}

interface SkillLevelProps {
  skill: Skill;
  isHovered: boolean;
}

interface SkillCategoryProps {
  skills: Skill[];
  title: string;
  icon: React.ReactNode;
  setHoveredSkill: (name: string | null) => void;
  hoveredSkill: string | null;
  editableItemProps: {
    isAdmin: boolean;
    isEditMode: boolean;
    onEdit: (id: string, value: any) => void;
    pathPrefix: string[];
  };
}

// Função que mapeia identificadores para componentes de ícone
const getSkillIcon = (iconId: string): React.ReactNode => {
  const map: Record<string, React.ReactNode> = {
    FileCode: <FileCode className="h-6 w-6 text-orange-400" />,
    Braces: <Braces className="h-6 w-6 text-yellow-400" />,
    Code: <Code className="h-6 w-6 text-blue-600" />,
    Globe: <Globe className="h-6 w-6 text-cyan-500" />,
    Server: <Server className="h-6 w-6 text-green-500" />,
    Coffee: <Coffee className="h-6 w-6 text-red-500" />,
    Database: <Database className="h-6 w-6 text-purple-500" />,
    Cpu: <Cpu className="h-6 w-6 text-purple-400" />,
    Bot: <Bot className="h-6 w-6 text-green-400" />,
    GitBranch: <GitBranch className="h-6 w-6 text-purple-500" />,
    Cloud: <Cloud className="h-6 w-6 text-sky-500" />,
    PenTool: <PenTool className="h-6 w-6 text-indigo-500" />,
    Brain: <Brain className="h-6 w-6 text-pink-500" />,
    ReactNextJs: <Rocket className="h-6 w-6 text-violet-500" /> // altered icon for React Next.js
  };
  return map[iconId] || <Globe className="h-6 w-6 text-cyan-500" />;
};

// Função para "transformar" um array de skills do content usando getSkillIcon
const parseSkills = (skillsData: any[]): Skill[] => 
  skillsData.map(skill => ({
    ...skill,
    icon: getSkillIcon(skill.icon)
  }));

// --- Sub-Components ---

// New Component para descrição com animação condicional
const SkillDescription: React.FC<{ isHovered: boolean; description: string }> = ({ isHovered, description }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const baseHeight = 40; // 2.5rem aproximadamente 40px

  useEffect(() => {
    if (ref.current) {
      setContentHeight(ref.current.scrollHeight);
    }
  }, [description]);

  // Se o conteúdo não exceder o baseHeight, não animamos a altura
  const animateHeight = contentHeight > baseHeight ? (isHovered ? contentHeight : baseHeight) : "auto";

  return (
    <motion.p
      ref={ref}
      className="text-xs sm:text-sm text-muted-foreground line-clamp-2 group-hover:line-clamp-none transition-all duration-500"
      animate={{ height: animateHeight }}
    >
      {description}
    </motion.p>
  );
};

const SkillCard: React.FC<SkillCardProps> = ({ skill, isHovered, setHoveredSkill }) => (
  <motion.div
    key={skill.name}
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
            <SkillDescription isHovered={isHovered} description={skill.description} />
            <SkillLevel skill={skill} isHovered={isHovered} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const SkillLevel: React.FC<SkillLevelProps> = ({ skill, isHovered }) => {
  const { content } = useLanguage();
  const levels = content.skills.proficiencyLevels;
  const levelText =
    skill.level >= 90
      ? levels.expert
      : skill.level >= 80
      ? levels.advanced
      : skill.level >= 60
      ? levels.intermediate
      : levels.basic;

  return (
    <div className="w-full mt-3">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-muted-foreground">{content.skills.proficiencyLabel}</span>
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

const SkillCategory: React.FC<Omit<SkillCategoryProps, 'editableItemProps'> & {
  isAdmin: boolean;
  isEditMode: boolean;
  onEdit: (id: string, path: string[], type: string, content: any) => void;
  pathPrefix: string[];
}> = ({
  skills,
  title,
  icon,
  setHoveredSkill,
  hoveredSkill,
  isAdmin,
  isEditMode,
  onEdit,
  pathPrefix
}) => (
  <div className="space-y-4">
    <EditableItem
      id={`skill-category-title-${title}`}
      path={[...pathPrefix.slice(0, 2), 'skillCategories', pathPrefix[1]]}
      type="heading"
      content={{ text: title, type: "heading" }}
      isAdmin={isAdmin}
      isEditMode={isEditMode}
      onEdit={onEdit}
    >
      <motion.h3
        className="text-lg sm:text-xl font-semibold flex items-center"
        variants={{
          hidden: { y: 20, opacity: 0 },
          show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
        }}
      >
        {icon}
        <span className="ml-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {title}
        </span>
      </motion.h3>
    </EditableItem>
    <div className="space-y-3 sm:space-y-4">
      {skills.map((skill) => (
        <EditableItem
          key={skill.name}
          id={`skill-${skill.name}`}
          path={[...pathPrefix, skill.name]}
          type="skill"
          content={{ ...skill, type: "skill" }}
          isAdmin={isAdmin}
          isEditMode={isEditMode}
          onEdit={onEdit}
        >
          <SkillCard
            skill={skill}
            isHovered={hoveredSkill === skill.name}
            setHoveredSkill={setHoveredSkill}
          />
        </EditableItem>
      ))}
    </div>
  </div>
);

// --- Main Skills Component ---
export default function Skills() {
  const { content } = useLanguage();
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const { isEditMode, handleEdit } = useEdit();

  // Extrai e transforma os dados de skills do content
  const programmingSkills: Skill[] = content.skills.programmingSkills
    ? parseSkills(content.skills.programmingSkills)
    : [];
  const toolsSkills: Skill[] = content.skills.toolsSkills
    ? parseSkills(content.skills.toolsSkills)
    : [];
  const languageSkills: Skill[] = content.skills.languageSkills
    ? parseSkills(content.skills.languageSkills)
    : [];

  return (
    <section id="skills" className="py-16 sm:py-24 bg-background relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full filter blur-xl opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 rounded-full filter blur-xl opacity-40"></div>
      <div className="container relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <EditableItem
            id="skills-title"
            path={["skills"]}
            type="heading"
            content={{ text: content.skills.title, type: "heading" }}
            isAdmin={isAdmin}
            isEditMode={isEditMode}
            onEdit={handleEdit}
          >
            <h2 className="section-heading">
              <span>{content.skills.title}</span>
              <span></span>
            </h2>
          </EditableItem>
          <EditableItem
            id="skills-description"
            path={["skills"]}
            type="text"
            content={{ text: content.skills.description, type: "text" }}
            isAdmin={isAdmin}
            isEditMode={isEditMode}
            onEdit={handleEdit}
          >
            <p className="text-base sm:text-lg text-muted-foreground mb-10 sm:mb-16 max-w-3xl mx-auto text-center">
              {content.skills.description}
            </p>
          </EditableItem>
        </motion.div>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          <SkillCategory
            skills={programmingSkills}
            title={content.skills.skillCategories.programming}
            icon={<Code className="mr-2 h-5 w-5 text-primary" />}
            setHoveredSkill={setHoveredSkill}
            hoveredSkill={hoveredSkill}
            isAdmin={isAdmin}
            isEditMode={isEditMode}
            onEdit={handleEdit}
            pathPrefix={["skills", "programmingSkills"]}
          />
          <SkillCategory
            skills={toolsSkills}
            title={content.skills.skillCategories.tools}
            icon={<Server className="mr-2 h-5 w-5 text-primary" />}
            setHoveredSkill={setHoveredSkill}
            hoveredSkill={hoveredSkill}
            isAdmin={isAdmin}
            isEditMode={isEditMode}
            onEdit={handleEdit}
            pathPrefix={["skills", "toolsSkills"]}
          />
          <SkillCategory
            skills={languageSkills}
            title={content.skills.skillCategories.languages}
            icon={<Languages className="mr-2 h-5 w-5 text-primary" />}
            setHoveredSkill={setHoveredSkill}
            hoveredSkill={hoveredSkill}
            isAdmin={isAdmin}
            isEditMode={isEditMode}
            onEdit={handleEdit}
            pathPrefix={["skills", "languageSkills"]}
          />
        </motion.div>
      </div>
    </section>
  );
}
