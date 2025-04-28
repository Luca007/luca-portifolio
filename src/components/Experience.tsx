"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useEdit } from "@/contexts/EditContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { EditableItem } from "@/components/ui/EditableItem";

const TimelineDot = () => (
  <div className="absolute left-0 md:left-1/2 top-0 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary transform -translate-x-1/2 flex items-center justify-center">
    <div className="w-2 h-2 rounded-full bg-primary"></div>
  </div>
);

const ExperienceCard = ({ experience, index, isAdmin, isEditMode, handleEdit }) => (
  <EditableItem
    id={`experience-${index}`}
    path={["experiences", "items"]}
    type="experience"
    content={experience}
    isAdmin={isAdmin}
    isEditMode={isEditMode}
    onEdit={handleEdit}
  >
    <Card className="w-full md:w-auto bg-gradient-to-br from-background to-muted/30 border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gradient mb-1">{experience.position}</h3>
            <div className="flex items-center space-x-3 mb-4">
              <span className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-1" />
                {experience.company}
              </span>
              <span className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {experience.location}
              </span>
              <span className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {experience.period}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm">{experience.description}</p>

          {experience.responsibilities.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Responsibilities:</h4>
              <ul className="space-y-1 list-disc pl-5 text-sm text-muted-foreground">
                {experience.responsibilities.map((responsibility, i) => (
                  <li key={i}>{responsibility}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </EditableItem>
);

export default function Experience() {
  const { content } = useLanguage();
  const { isAdmin, user } = useAuth();
  const { isEditMode, handleEdit } = useEdit();

  return (
    <section id="experiences" className="py-20 bg-muted/30">
      <div className="container">
        <EditableItem
          id="experiences-title"
          path={["experiences"]}
          type="heading"
          content={{ text: content.experiences.title, type: "heading" }}
          isAdmin={isAdmin}
          isEditMode={isEditMode}
          onEdit={handleEdit}
        >
          <h2 className="section-heading">
            <span>{content.experiences.title}</span>
            <span></span>
          </h2>
        </EditableItem>

        <EditableItem
          id="experiences-description"
          path={["experiences"]}
          type="text"
          content={{ text: content.experiences.description, type: "text" }}
          isAdmin={isAdmin}
          isEditMode={isEditMode}
          onEdit={handleEdit}
        >
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto text-center">
            {content.experiences.description}
          </p>
        </EditableItem>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 h-full w-px bg-gradient-to-b from-primary/70 via-muted-foreground/50 to-transparent"></div>

          {/* Experience items */}
          <div className="space-y-12">
            {content.experiences.items.map((experience, index) => (
              <div key={index} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:pr-[50%]" : "md:pl-[50%] md:flex-row-reverse"}`}>
                <TimelineDot />
                <ExperienceCard experience={experience} index={index} isAdmin={isAdmin} isEditMode={isEditMode} handleEdit={handleEdit} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
