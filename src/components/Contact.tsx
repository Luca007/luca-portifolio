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
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ContactInfoCard = ({ contactInfo, currentLanguage }) => (
  <Card className="bg-gradient-to-br from-background to-muted/20 border border-border/30 shadow-sm h-full hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
    <CardContent className="p-6">
      <h3 className="text-xl font-semibold mb-6">
        {currentLanguage.code === "pt" ? "Informações de Contato" : "Contact Information"}
      </h3>
      <div className="space-y-4">
        {contactInfo.map((info, index) => (
          <motion.a
            key={index}
            href={info.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start hover:bg-muted/20 p-3 rounded-lg transition-colors group"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="bg-primary/10 p-2 rounded-full mr-4 group-hover:bg-primary/20 transition-colors duration-300">
              {info.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {info.title}
              </p>
              <p className="group-hover:text-primary transition-colors font-medium">
                {info.value}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ContactForm = ({ handleSubmit, formRef, isSubmitting, submitted, error, resetForm, currentLanguage, content }) => (
  <Card className="bg-gradient-to-br from-background to-muted/20 border border-border/30 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-500">
    <CardContent className="p-6">
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {currentLanguage.code === "pt" ? "Mensagem Enviada!" : "Message Sent!"}
          </h3>
          <p className="text-muted-foreground text-center max-w-md">
            {content.contact.form.success}
          </p>
          <Button
            className="mt-6 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            onClick={resetForm}
          >
            {currentLanguage.code === "pt" ? "Enviar outra mensagem" : "Send another message"}
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
                placeholder={currentLanguage.code === "pt" ? "Seu nome" : "John Doe"}
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
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              {currentLanguage.code === "pt" ? "Assunto" : "Subject"}
            </label>
            <Input
              id="subject"
              name="subject"
              required
              className="bg-background/50"
              placeholder={currentLanguage.code === "pt" ? "Como posso ajudar?" : "How can I help you?"}
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
              placeholder={currentLanguage.code === "pt" ? "Digite sua mensagem aqui..." : "Enter your message here..."}
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

export default function Contact() {
  const { content, currentLanguage } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: "Email",
      value: "luca.clerot@gmail.com",
      link: "mailto:luca.clerot@gmail.com"
    },
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      title: currentLanguage.code === "pt" ? "Telefone" : "Phone",
      value: "(61) 99916-6442",
      link: "tel:+5561999166442"
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: currentLanguage.code === "pt" ? "Localização" : "Location",
      value: "SHIGS 703 Bl O Casa 41, Brasília, DF",
      link: "https://maps.google.com/?q=SHIGS+703+Bl+O+Casa+41+Brasília+DF+70331-715"
    },
    {
      icon: <Github className="h-5 w-5 text-primary" />,
      title: "GitHub",
      value: "github.com/Luca007",
      link: "https://github.com/Luca007"
    },
    {
      icon: <Linkedin className="h-5 w-5 text-primary" />,
      title: "LinkedIn",
      value: "Luca Clerot",
      link: "https://www.linkedin.com/in/luca-clerot-aviani-10042128a"
    }
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
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error instanceof Error ? error.message : content.contact.form.error);
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

        <motion.p
          className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {content.contact.description}
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContactForm
              handleSubmit={handleSubmit}
              formRef={formRef}
              isSubmitting={isSubmitting}
              submitted={submitted}
              error={error}
              resetForm={resetForm}
              currentLanguage={currentLanguage}
              content={content}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ContactInfoCard contactInfo={contactInfo} currentLanguage={currentLanguage} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
