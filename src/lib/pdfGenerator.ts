import { jsPDF } from 'jspdf';
import { Content } from '@/i18n/content';
import 'jspdf-autotable';

// Helper function to format date
const formatDate = (lang: string = 'en') => {
  const date = new Date();
  return date.toLocaleDateString(
    lang === 'pt' ? 'pt-BR' :
    lang === 'es' ? 'es-ES' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );
};

/**
 * Generate a PDF resume based on the content in the selected language
 * @param content The content object with translations
 * @returns Blob URL of the generated PDF
 */
export const generateResumePDF = (content: Content): string => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Extract the language code from the content
  let langCode = 'en';
  if (content === contentMap.pt) langCode = 'pt';
  if (content === contentMap.es) langCode = 'es';

  // Set up document properties
  doc.setProperties({
    title: `${content.resume.pdf.personalInfo.name} - ${content.resume.pdf.title}`,
    author: content.resume.pdf.personalInfo.name,
    subject: content.resume.pdf.subtitle,
    keywords: 'resume, cv, portfolio',
    creator: 'Portfolio Website'
  });

  // Define colors
  const primaryColor = [59, 130, 246]; // blue-500
  const secondaryColor = [30, 58, 138]; // blue-900
  const textColor = [15, 23, 42]; // slate-900
  const mutedColor = [100, 116, 139]; // slate-500

  // Default font
  doc.setFont('helvetica', 'normal');

  // Add header with name and title
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(content.resume.pdf.personalInfo.name, 15, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(content.resume.pdf.personalInfo.title, 15, 23);

  // Add contact information
  doc.setFontSize(10);

  // First column
  doc.text(`${content.resume.pdf.personalInfo.email}`, 15, 35);

  // Second column
  doc.text(`${content.resume.pdf.personalInfo.phone}`, 90, 35);

  // Third column
  doc.text(`${content.resume.pdf.personalInfo.location}`, 150, 35);

  // Add Summary
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(content.resume.pdf.summaryTitle, 15, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

  // Generate summary from paragraphs
  const paragraphs = content.about.paragraphs;
  let yPos = 55;

  paragraphs.forEach(paragraph => {
    const splitText = doc.splitTextToSize(paragraph, 180);
    doc.text(splitText, 15, yPos);
    yPos += 10 * (splitText.length || 1);
  });

  // Add Skills section
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(14);
  doc.text(content.resume.pdf.skillsTitle, 15, yPos);

  yPos += 5;

  // Add horizontal line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, 195, yPos);

  yPos += 5;

  // Programming skills
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(content.skills.skillCategories.programming, 15, yPos);

  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('JavaScript, TypeScript, React, Next.js, Node.js, HTML, CSS, SQL, Python', 15, yPos);

  yPos += 8;

  // Tools
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(content.skills.skillCategories.tools, 15, yPos);

  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Git, GitHub, VS Code, Docker, AWS, Firebase, MongoDB, Figma', 15, yPos);

  yPos += 8;

  // Languages
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(content.skills.skillCategories.languages, 15, yPos);

  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Portuguese (Native), English (Fluent), Spanish (Intermediate)', 15, yPos);

  yPos += 10;

  // Add Experience section
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(14);
  doc.text(content.resume.pdf.experienceTitle, 15, yPos);

  yPos += 5;

  // Add horizontal line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, 195, yPos);

  yPos += 5;

  // Check if we need a new page
  if (yPos > 280) {
    doc.addPage();
    yPos = 20;
  }

  // Add experiences from content
  content.experiences.items.forEach(exp => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(exp.position, 15, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(exp.company, 15, yPos + 5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(`${exp.period} | ${exp.location}`, 15, yPos + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descSplit = doc.splitTextToSize(exp.description, 180);
    doc.text(descSplit, 15, yPos + 15);

    yPos += 15 + (descSplit.length * 5);

    // Add responsibilities as bullet points
    if (exp.responsibilities && exp.responsibilities.length > 0) {
      exp.responsibilities.forEach(resp => {
        const bulletText = `• ${resp}`;
        const respSplit = doc.splitTextToSize(bulletText, 170);
        doc.text(respSplit, 20, yPos);
        yPos += respSplit.length * 5;
      });
    }

    yPos += 8;

    // Check if we need a new page
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Add Education section
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(14);
  doc.text(content.resume.pdf.educationTitle, 15, yPos);

  yPos += 5;

  // Add horizontal line
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, 195, yPos);

  yPos += 5;

  // Check if we need a new page
  if (yPos > 280) {
    doc.addPage();
    yPos = 20;
  }

  // Add education items
  content.education.items.forEach(edu => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(edu.degree, 15, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(edu.institution, 15, yPos + 5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.text(edu.period, 15, yPos + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const eduDescSplit = doc.splitTextToSize(edu.description, 180);
    doc.text(eduDescSplit, 15, yPos + 15);

    yPos += 15 + (eduDescSplit.length * 5) + 8;

    // Check if we need a new page
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Add Projects section
  if (content.projects.items.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(14);
    doc.text(content.resume.pdf.projectsTitle, 15, yPos);

    yPos += 5;

    // Add horizontal line
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, 195, yPos);

    yPos += 5;

    // Check if we need a new page
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }

    // Add projects (limit to 3 most recent)
    const selectedProjects = content.projects.items.slice(0, 3);

    selectedProjects.forEach(project => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(project.title, 15, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(project.githubLink, 15, yPos + 5);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      const tags = project.tags.join(', ');
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(tags, 15, yPos + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const projDescSplit = doc.splitTextToSize(project.description, 180);
      doc.text(projDescSplit, 15, yPos + 15);

      yPos += 15 + (projDescSplit.length * 5) + 8;

      // Check if we need a new page
      if (yPos > 280 && project !== selectedProjects[selectedProjects.length - 1]) {
        doc.addPage();
        yPos = 20;
      }
    });
  }

  // Add References
  if (yPos < 260) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(14);
    doc.text(content.resume.pdf.referencesTitle, 15, yPos);

    yPos += 5;

    // Add horizontal line
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, 195, yPos);

    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(content.resume.pdf.referencesAvailable, 15, yPos);
  }

  // Add footer with pagination
  const pageCount = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Add date generated
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text(`${content.resume.pdf.dateGenerated} ${formatDate(langCode)}`, 15, 290);

    // Add page number
    doc.text(`${content.resume.pdf.page} ${i} ${content.resume.pdf.of} ${pageCount}`, 180, 290);
  }

  // Generate PDF file URL
  const pdfOutput = doc.output('blob');
  return URL.createObjectURL(pdfOutput);
};

import { contentMap } from '@/i18n/content';
export default generateResumePDF;
