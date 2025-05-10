"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, User, Briefcase, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState, Dispatch, SetStateAction } from "react";
import ResumeDownload from "./ResumeDownload";
import { imageConfig } from "@/lib/utils";
import { EditableItem } from "@/components/ui/EditableItem";
import { useEdit } from "@/contexts/EditContext";
import { useAuth } from "@/contexts/AuthContext";

// --- ProfilePhoto Component ---
interface ProfilePhotoProps {
  isPhotoHovered: boolean;
  setIsPhotoHovered: Dispatch<SetStateAction<boolean>>;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ isPhotoHovered, setIsPhotoHovered }) => (
  <div
    className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl"
    onMouseEnter={() => setIsPhotoHovered(true)}
    onMouseLeave={() => setIsPhotoHovered(false)}
  >
    <motion.div
      animate={{
        scale: isPhotoHovered ? 1.08 : 1,
        rotate: isPhotoHovered ? 2 : 0
      }}
      transition={{ duration: 0.4 }}
      className="w-full h-full relative"
    >
      <Image
        src="/images/profile-photo.jpg"
        alt="Luca Clerot"
        fill
        sizes="(max-width: 768px) 300px, 400px"
        className="object-cover"
        {...imageConfig.defaultPriorityImageProps}
      />
    </motion.div>

    {/* Photo overlay with gradient */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
      animate={{
        opacity: isPhotoHovered ? 0.4 : 0.6
      }}
      transition={{ duration: 0.3 }}
    ></motion.div>

    {/* Photo border glow effect */}
    <motion.div
      className="absolute -inset-1 rounded-full"
      animate={{
        boxShadow: isPhotoHovered
          ? '0 0 25px 5px rgba(59, 130, 246, 0.4)'
          : '0 0 15px 2px rgba(59, 130, 246, 0.2)'
      }}
      transition={{ duration: 0.4 }}
    ></motion.div>
  </div>
);

// --- JobCard Component ---
interface JobCardProps {
  jobTitle: string;
  company: string;
  jobDescription: string;
  period: string;
}

const JobCard: React.FC<JobCardProps> = ({ jobTitle, company, jobDescription, period }) => (
  <Card className="bg-gradient-to-br from-background to-muted/10 border border-border/30 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 h-full">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center mb-3 sm:mb-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
          <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-base sm:text-xl font-semibold">{jobTitle}</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">{company}</p>
        </div>
      </div>
      <p className="text-muted-foreground text-xs sm:text-sm pb-3">
        {jobDescription}
      </p>
      <div className="flex items-center mt-2 text-xs text-muted-foreground">
        <Calendar className="h-3 w-3 mr-1" />
        <span>{period}</span>
      </div>
    </CardContent>
  </Card>
);

// --- ContactInfoCard Component ---
interface ContactInfoCardProps {
  locationLabel: string;
  location: string;
  emailLabel: string;
  email: string;
  phoneLabel: string;
  phone: string;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ locationLabel, location, emailLabel, email, phoneLabel, phone }) => (
  <Card className="bg-gradient-to-br from-background to-muted/10 border border-border/30 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 h-full">
    <CardContent className="p-4 sm:p-6">
      <div className="flex flex-col space-y-3 sm:space-y-4">
        {/* Location */}
        <motion.div
          className="flex items-center"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-primary/10 rounded-full mr-3">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </span>
          <div>
            <span className="text-xs sm:text-sm text-muted-foreground">{locationLabel}</span>
            <p className="text-sm sm:text-base font-medium">{location}</p>
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          className="flex items-center"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-primary/10 rounded-full mr-3">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </span>
          <div>
            <span className="text-xs sm:text-sm text-muted-foreground">{emailLabel}</span>
            <a
              href={`mailto:${email}`}
              className="text-sm sm:text-base font-medium hover:text-primary transition-colors block"
            >
              {email}
            </a>
          </div>
        </motion.div>

        {/* Phone */}
        <motion.div
          className="flex items-center"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-primary/10 rounded-full mr-3">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </span>
          <div>
            <span className="text-xs sm:text-sm text-muted-foreground">{phoneLabel}</span>
            <a
              href={`tel:${phone}`}
              className="text-sm sm:text-base font-medium hover:text-primary transition-colors block"
            >
              {phone}
            </a>
          </div>
        </motion.div>
      </div>
    </CardContent>
  </Card>
);

// --- Main About Component ---
export default function About() {
  const { content } = useLanguage();
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const { isAdmin } = useAuth();
  const { isEditMode, handleEdit } = useEdit();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const paragraphs = content.about.paragraphs || []; // Ensure paragraphs is an array

  const highlightWords = (text: string): JSX.Element => {
    // Highlight keywords by wrapping them in spans with gradient text
    const keywords = ['full-stack', 'frontend', 'backend', 'software engineer', 'developer', 'technology'];
    let highlightedText = text;

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span class="text-primary font-medium">$&</span>`);
    });

    return <p dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      <div className="container relative z-10 px-4 sm:px-6">
        <motion.div
          className="flex flex-col md:flex-row gap-8 md:gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Profile Photo */}
          <motion.div
            className="w-full md:w-1/3 flex justify-center"
            variants={fadeIn}
          >
            <ProfilePhoto isPhotoHovered={isPhotoHovered} setIsPhotoHovered={setIsPhotoHovered} />
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="w-full md:w-2/3"
            variants={fadeIn}
          >
            {/* Title */}
            <EditableItem
              id="about-title"
              path={["about"]}
              type="heading"
              content={{ text: content.about.title, type: "heading" }}
              isAdmin={isAdmin}
              isEditMode={isEditMode}
              onEdit={handleEdit}
            >
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <span className="bg-primary/20 px-3 sm:px-4 py-1 rounded mr-0 sm:mr-3 flex items-center mb-2 sm:mb-0">
                  <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  {content.about.title}
                </span>
                <span className="h-[1px] w-full sm:w-auto sm:flex-grow bg-gradient-to-r from-primary/50 to-transparent"></span>
              </motion.h2>
            </EditableItem>

            {/* Paragraphs */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {paragraphs.map((paragraph: string, index: number) => (
                <EditableItem
                  key={index}
                  id={`about-paragraph-${index}`}
                  path={["about", "paragraphs"]}
                  type="text"
                  content={{ text: paragraph, type: "text" }}
                  isAdmin={isAdmin}
                  isEditMode={isEditMode}
                  onEdit={handleEdit}
                >
                  <motion.div
                    className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    viewport={{ once: true }}
                  >
                    {highlightWords(paragraph)}
                  </motion.div>
                </EditableItem>
              ))}
            </div>

            {/* Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeIn}>
                <EditableItem
                  id="about-jobcard"
                  path={["about", "job"]}
                  type="job"
                  content={{
                    jobTitle: content.about.jobTitle,
                    company: content.about.company,
                    jobDescription: content.about.jobDescription,
                    period: content.about.period
                  }}
                  isAdmin={isAdmin}
                  isEditMode={isEditMode}
                  onEdit={handleEdit}
                >
                  <JobCard
                    jobTitle={content.about.jobTitle || ""}
                    company={content.about.company || ""}
                    jobDescription={content.about.jobDescription || ""}
                    period={content.about.period || ""}
                  />
                </EditableItem>
              </motion.div>

              <motion.div variants={fadeIn}>
                <EditableItem
                  id="about-contactcard"
                  path={["about", "contact"]}
                  type="contact"
                  content={{
                    locationLabel: content.about.locationLabel,
                    location: content.about.location,
                    emailLabel: content.about.emailLabel,
                    email: "luca.clerot@gmail.com",
                    phoneLabel: content.about.phoneLabel,
                    phone: "(61) 99916-6442"
                  }}
                  isAdmin={isAdmin}
                  isEditMode={isEditMode}
                  onEdit={handleEdit}
                >
                  <ContactInfoCard
                    locationLabel={content.about.locationLabel || ""}
                    location={content.about.location || ""}
                    emailLabel={content.about.emailLabel || ""}
                    email="luca.clerot@gmail.com"
                    phoneLabel={content.about.phoneLabel || ""}
                    phone="(61) 99916-6442"
                  />
                </EditableItem>
              </motion.div>
            </motion.div>

            {/* Resume Download */}
            <motion.div
              className="flex justify-center sm:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <ResumeDownload isAdmin={isAdmin} isEditMode={isEditMode} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
