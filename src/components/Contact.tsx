"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/components/ui/toast";
import { EditableItem } from "@/components/ui/EditableItem";
import { useEdit } from "@/contexts/EditContext";
import { useAuth } from "@/contexts/AuthContext";

interface ContactInfoItem {
  iconComponent: JSX.Element; // Icon component with EditableItem wrapper
  titleComponent: JSX.Element; // Title component with EditableItem
  valueComponent: JSX.Element; // Value component with EditableItem
  linkComponent?: JSX.Element; // Optional link component for URLs
  link: string; // URL for the link
}

interface ContactInfoCardProps {
  contactInfo: ContactInfoItem[];
  isEditMode: boolean;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ contactInfo, isEditMode }) => (
  <Card className="bg-gradient-to-br from-background to-muted/20 border border-border/30 shadow-sm h-full hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
    <CardContent className="p-6">
      <div className="space-y-4">
        {contactInfo.map((info: ContactInfoItem, index: number) => (
          <motion.div
            key={index}
            className="flex items-start hover:bg-muted/20 p-3 rounded-lg transition-colors group cursor-pointer"
            whileHover={isEditMode ? {} : { x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => {
              if (!isEditMode && info.link) {
                window.open(info.link, "_blank", "noopener,noreferrer");
              }
            }}
          >
            {info.iconComponent}
            <div>
              {info.titleComponent}
              {info.valueComponent}
              {info.linkComponent && (
                <div className="mt-1">
                  {info.linkComponent}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
);

interface ContactFormProps {
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  formRef: React.RefObject<HTMLFormElement>;
  isSubmitting: boolean;
  submitted: boolean;
  error: string | null;
  resetForm: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ handleSubmit, formRef, isSubmitting, submitted, error, resetForm }) => {
  const { content } = useLanguage();
  return (
    <Card className="bg-gradient-to-br from-background to-muted/20 border border-border/30 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
      <CardContent className="p-6">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {content.contact.successTitle}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {content.contact.form.success}
            </p>
            <Button onClick={resetForm} className="mt-4">
              {content.contact.successButton}
            </Button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {content.contact.form.name}
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="bg-background/50"
                  placeholder={content.contact.form.namePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {content.contact.form.email}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-background/50"
                  placeholder={content.contact.form.emailPlaceholder}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                {content.contact.form.subject}
              </label>
              <Input
                id="subject"
                name="subject"
                required
                className="bg-background/50"
                placeholder={content.contact.form.subjectPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                {content.contact.form.message}
              </label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
                className="bg-background/50 resize-none"
                placeholder={content.contact.form.messagePlaceholder}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {content.contact.form.sending}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    {content.contact.form.send}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default function Contact() {
  const { content, currentLanguage } = useLanguage();
  const { isAdmin } = useAuth();
  const { isEditMode, handleEdit } = useEdit();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const contactInfo: ContactInfoItem[] = [
    {
      iconComponent: (
        <EditableItem
          id="contact-email-icon"
          path={['contact', 'icons', 'email']}
          type="icon"
          content={{ icon: "Mail" }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <div className="bg-primary/10 p-2 rounded-full mr-4 group-hover:bg-primary/20 transition-colors duration-300">
            <Mail className="h-5 w-5 text-primary" />
          </div>
        </EditableItem>
      ),
      titleComponent: (
        <EditableItem
          id="contact-email-label"
          path={['contact', 'emailLabel']}
          type="text"
          content={{ text: content.contact.emailLabel }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <p className="text-sm font-medium text-muted-foreground">
            {content.contact.emailLabel}
          </p>
        </EditableItem>
      ),
      valueComponent: (
        <EditableItem
          id="contact-email-value"
          path={['contact', 'emailValue']}
          type="text"
          content={{ text: content.contact.emailValue }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <p className="group-hover:text-primary transition-colors font-medium">
            {content.contact.emailValue}
          </p>
        </EditableItem>
      ),
      link: `mailto:${content.contact.emailValue}`,
    },
    {
      iconComponent: (
        <EditableItem
          id="contact-phone-icon"
          path={['contact', 'icons', 'phone']}
          type="icon"
          content={{ icon: "Phone" }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <div className="bg-primary/10 p-2 rounded-full mr-4 group-hover:bg-primary/20 transition-colors duration-300">
            <Phone className="h-5 w-5 text-primary" />
          </div>
        </EditableItem>
      ),
      titleComponent: (
        <EditableItem
          id="contact-phone-label"
          path={['contact', 'phoneLabel']}
          type="text"
          content={{ text: content.contact.phoneLabel }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <p className="text-sm font-medium text-muted-foreground">
            {content.contact.phoneLabel}
          </p>
        </EditableItem>
      ),
      valueComponent: (
        <EditableItem
          id="contact-phone-value"
          path={['contact', 'phoneValue']}
          type="text"
          content={{ text: content.contact.phoneValue }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <p className="group-hover:text-primary transition-colors font-medium">
            {content.contact.phoneValue}
          </p>
        </EditableItem>
      ),
      link: `tel:${content.contact.phoneValue}`,
    },
    {
      iconComponent: (
        <EditableItem
          id="contact-location-icon"
          path={['contact', 'icons', 'location']}
          type="icon"
          content={{ icon: "MapPin" }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <div className="bg-primary/10 p-2 rounded-full mr-4 group-hover:bg-primary/20 transition-colors duration-300">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
        </EditableItem>
      ),
      titleComponent: (
        <EditableItem
          id="contact-location-label"
          path={['contact', 'locationLabel']}
          type="text"
          content={{ text: content.contact.locationLabel }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <p className="text-sm font-medium text-muted-foreground">
            {content.contact.locationLabel}
          </p>
        </EditableItem>
      ),
      valueComponent: (
        <EditableItem
          id="contact-location-value"
          path={['contact', 'locationValue']}
          type="text"
          content={{ text: content.contact.locationValue }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <p className="group-hover:text-primary transition-colors font-medium">
            {content.contact.locationValue}
          </p>
        </EditableItem>
      ),
      link: "https://maps.google.com/?q=SHIGS+703+Bl+O+Casa+41+Brasília+DF+70331-715",
    },
    {
      iconComponent: (
        <EditableItem
          id="contact-github-icon"
          path={['contact', 'icons', 'github']}
          type="icon"
          content={{ icon: "Github" }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <div className="bg-primary/10 p-2 rounded-full mr-4 group-hover:bg-primary/20 transition-colors duration-300">
            <Github className="h-5 w-5 text-primary" />
          </div>
        </EditableItem>
      ),
      titleComponent: (
        <EditableItem
          id="contact-github-label"
          path={['contact', 'githubLabel']}
          type="text"
          content={{ text: content.contact.githubLabel }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <p className="text-sm font-medium text-muted-foreground">
            {content.contact.githubLabel}
          </p>
        </EditableItem>
      ),
      valueComponent: (
        <EditableItem
          id="contact-github-value"
          path={['contact', 'githubValue']}
          type="text"
          content={{ text: content.contact.githubValue }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <p className="group-hover:text-primary transition-colors font-medium">
            {content.contact.githubValue}
          </p>
        </EditableItem>
      ),
      link: content.contact.githubLink,
    },
    {
      iconComponent: (
        <EditableItem
          id="contact-linkedin-icon"
          path={['contact', 'icons', 'linkedin']}
          type="icon"
          content={{ icon: "Linkedin" }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <div className="bg-primary/10 p-2 rounded-full mr-4 group-hover:bg-primary/20 transition-colors duration-300">
            <Linkedin className="h-5 w-5 text-primary" />
          </div>
        </EditableItem>
      ),
      titleComponent: (
        <EditableItem
          id="contact-linkedin-label"
          path={['contact', 'linkedinLabel']}
          type="text"
          content={{ text: content.contact.linkedinLabel }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <p className="text-sm font-medium text-muted-foreground">
            {content.contact.linkedinLabel}
          </p>
        </EditableItem>
      ),
      valueComponent: (
        <EditableItem
          id="contact-linkedin-value"
          path={['contact', 'linkedinValue']}
          type="text"
          content={{ text: content.contact.linkedinValue }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <p className="group-hover:text-primary transition-colors font-medium">
            {content.contact.linkedinValue}
          </p>
        </EditableItem>
      ),
      link: content.contact.linkedinLink,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formRef.current) return;

    try {
      const formData = new FormData(formRef.current);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const subject = formData.get('subject') as string;
      const message = formData.get('message') as string;

      console.log("Sending message to Firebase:", { name, email, subject, message });

      const docRef = await addDoc(collection(db, "messages"), {
        name,
        email,
        subject,
        message,
        createdAt: serverTimestamp(),
        read: false,
        language: currentLanguage.code,
      });

      console.log("Document written with ID: ", docRef.id);

      setSubmitted(true);
      formRef.current.reset();
      toast({
        title: "Success",
        description: "Your message has been sent successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error instanceof Error ? error.message : content.contact.form.error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError(null);
  };

  if (!isMounted) return null;

  return (
    <section id="contact" className="py-20">
      <div className="container">
        <EditableItem
          id="contact-section-title"
          path={["contact", "title"]}
          type="heading"
          content={{ text: content.contact.title }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <motion.h2
            className="section-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span>{content.contact.title}</span>
            <span></span>
          </motion.h2>
        </EditableItem>

        <EditableItem
          id="contact-section-description"
          path={["contact", "description"]}
          type="paragraph"
          content={{ text: content.contact.description }}
          isAdmin={isAdmin}
          isEditMode={isEditMode && isAdmin}
          onEdit={handleEdit}
        >
          <motion.p
            className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {content.contact.description}
          </motion.p>
        </EditableItem>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EditableItem
              id="contact-form-section-title"
              path={["contact", "formSectionTitle"]}
              type="heading"
              content={{ text: content.contact.formSectionTitle }}
              isAdmin={isAdmin}
              isEditMode={isEditMode && isAdmin}
              onEdit={handleEdit}
            >
              <h3 className="text-xl font-semibold mb-6 text-primary">
                {content.contact.formSectionTitle}
              </h3>
            </EditableItem>
            <ContactForm
              handleSubmit={handleSubmit}
              formRef={formRef}
              isSubmitting={isSubmitting}
              submitted={submitted}
              error={error}
              resetForm={resetForm}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <EditableItem
              id="contact-info-card-title"
              path={["contact", "infoTitle"]}
              type="heading"
              content={{ text: content.contact.infoTitle }}
              isAdmin={isAdmin}
              isEditMode={isEditMode && isAdmin}
              onEdit={handleEdit}
            >
              <h3 className="text-xl font-semibold mb-6 text-primary">
                {content.contact.infoTitle}
              </h3>
            </EditableItem>
            <ContactInfoCard 
              contactInfo={contactInfo} 
              isEditMode={isEditMode && isAdmin} 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
