"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Calendar, Award } from "lucide-react";

export default function Education() {
  const { content } = useLanguage();

  return (
    <section id="education" className="py-20">
      <div className="container">
        <h2 className="section-heading">
          <span>{content.education.title}</span>
          <span></span>
        </h2>

        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto text-center">
          {content.education.description}
        </p>

        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.education.items.map((education, index) => (
              <Card
                key={index}
                className="overflow-hidden bg-gradient-to-br from-background to-muted/20 border border-border/30 transition-all duration-300 hover:shadow-xl hover:border-primary/20"
              >
                <div className="h-2 w-full bg-gradient-to-r from-primary/70 to-primary/40"></div>
                <CardContent className="p-6">
                  <div className="flex items-start mb-4">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold">{education.degree}</h3>
                      <p className="text-muted-foreground">{education.institution}</p>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{education.period}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg mb-4">
                    <p className="text-sm font-medium text-foreground">{education.description}</p>
                  </div>

                  {education.courses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center">
                        <Award className="h-4 w-4 mr-2 text-primary" />
                        {content.education.coursesTitle}
                      </h4>
                      <div className="space-y-3">
                        {education.courses.map((course, courseIndex) => (
                          <div key={courseIndex} className="flex justify-between items-center border-b border-border/30 pb-2">
                            <span className="text-sm">{course.name}</span>
                            <span className="text-sm font-medium text-primary/90">{course.grade}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
