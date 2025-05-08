// import { generate } from '@pdfme/generator';
// import { BLANK_PDF } from '@pdfme/common';
// import template from '@/templates/pdfTemplate.json';
// import { Content } from '@/i18n/content';

// // Helper function to get proficiency level text
// const getProficiencyText = (
// 	level: number,
// 	proficiencyLevels?: Content['resume']['pdf']['proficiencyLevels']
// ): string => {
// 	if (!proficiencyLevels) return `${level}%`;
// 	if (level >= 95) return proficiencyLevels.expert;
// 	if (level >= 80) return proficiencyLevels.advanced;
// 	if (level >= 60) return proficiencyLevels.intermediate;
// 	if (level >= 40) return proficiencyLevels.basic;
// 	return proficiencyLevels.beginner || `${level}%`;
// };

// // Formatter for Contact Information
// const formatContactInfo = (content: Content): string => {
// 	const { personalInfo, contactInfo } = content.resume.pdf;
// 	const lines: string[] = [];

// 	if (personalInfo.phone) lines.push(`${contactInfo.phoneLabel} ${personalInfo.phone}`);
// 	if (personalInfo.email) lines.push(`${contactInfo.emailLabel} ${personalInfo.email}`);
// 	if (personalInfo.location) lines.push(`${contactInfo.locationLabel} ${personalInfo.location}`);
// 	if (personalInfo.github && contactInfo.githubLabel) {
// 		lines.push(`${contactInfo.githubLabel} ${personalInfo.github}`);
// 	}
// 	return lines.join('\n');
// };

// // Formatter for Summary section
// const formatSummary = (content: Content): string => {
// 	let summaryText = `${content.resume.pdf.summaryTitle}\n${content.about.paragraphs.join('\n\n')}`;
// 	if (content.resume.pdf.referencesTitle && content.resume.pdf.referencesAvailable) {
// 		summaryText += `\n\n${content.resume.pdf.referencesTitle}\n${content.resume.pdf.referencesAvailable}`;
// 	}
// 	return summaryText;
// };

// // Formatter for Skills section
// const formatSkills = (content: Content): string => {
// 	const { skillsTitle, proficiencyLevels } = content.resume.pdf;
// 	const { skillCategories, programmingSkills, toolsSkills, languageSkills } = content.skills;
// 	let skillsText = `${skillsTitle}\n\n`;

// 	if (programmingSkills.length > 0) {
// 		skillsText += `${skillCategories.programming}:\n`;
// 		programmingSkills.forEach(skill => {
// 			const levelText = getProficiencyText(skill.level, proficiencyLevels);
// 			skillsText += `- ${skill.name} (${levelText})${skill.description ? `: ${skill.description}` : ''}\n`;
// 		});
// 		skillsText += '\n';
// 	}

// 	if (toolsSkills.length > 0) {
// 		skillsText += `${skillCategories.tools}:\n`;
// 		toolsSkills.forEach(skill => {
// 			const levelText = getProficiencyText(skill.level, proficiencyLevels);
// 			skillsText += `- ${skill.name} (${levelText})${skill.description ? `: ${skill.description}` : ''}\n`;
// 		});
// 		skillsText += '\n';
// 	}

// 	if (languageSkills.length > 0) {
// 		skillsText += `${skillCategories.languages}:\n`;
// 		languageSkills.forEach(lang => {
// 			// For languages, description often IS the proficiency (e.g., "Fluent")
// 			// If level is 100 and proficiencyLevels.expert exists, use it, otherwise use description.
// 			const levelText = (lang.level === 100 && proficiencyLevels?.expert) ? proficiencyLevels.expert : 
// 			                  (proficiencyLevels ? getProficiencyText(lang.level, proficiencyLevels) : lang.description);
// 			skillsText += `- ${lang.name} (${levelText})\n`;
// 		});
// 	}
// 	return skillsText.trim();
// };

// // Formatter for Experience section
// const formatExperience = (content: Content): string => {
// 	const { experienceTitle } = content.resume.pdf;
// 	let expText = `${experienceTitle}\n\n`;
// 	content.experiences.items.forEach(item => {
// 		expText += `${item.position.toUpperCase()} at ${item.company.toUpperCase()}\n`;
// 		expText += `${item.period} | ${item.location}\n`;
// 		if (item.description) expText += `${item.description}\n`;
// 		if (item.responsibilities && item.responsibilities.length > 0) {
// 			expText += `Responsibilities:\n${item.responsibilities.map(r => `  • ${r}`).join('\n')}\n`;
// 		}
// 		expText += '\n';
// 	});
// 	return expText.trim();
// };

// // Formatter for Education section
// const formatEducation = (content: Content): string => {
// 	const { educationTitle } = content.resume.pdf;
// 	let eduText = `${educationTitle}\n\n`;
// 	content.education.items.forEach(item => {
// 		eduText += `${item.degree.toUpperCase()} - ${item.institution.toUpperCase()}\n`;
// 		eduText += `${item.period}\n`;
// 		if (item.description) eduText += `${item.description}\n`;
// 		if (item.courses && item.courses.length > 0) {
// 			eduText += `Relevant Courses: ${item.courses.map(c => `${c.name}${c.grade ? ` (${c.grade})` : ''}`).join(', ')}\n`;
// 		}
// 		eduText += '\n';
// 	});
// 	return eduText.trim();
// };

// // Formatter for Projects section
// const formatProjects = (content: Content): string => {
// 	const { projectsTitle, projectLinkViewText, projectLinkGithubText } = content.resume.pdf;
// 	if (!content.projects.items || content.projects.items.length === 0) return '';
// 	let projText = `${projectsTitle}\n\n`;
// 	content.projects.items.forEach(item => {
// 		projText += `${item.title.toUpperCase()}\n`;
// 		if (item.description) projText += `${item.description}\n`;
// 		if (item.tags && item.tags.length > 0) {
// 			projText += `Tags: ${item.tags.join(', ')}\n`;
// 		}
// 		if (item.link && projectLinkViewText) {
// 			projText += `${projectLinkViewText}: ${item.link}\n`;
// 		}
// 		if (item.githubLink && projectLinkGithubText) {
// 			projText += `${projectLinkGithubText}: ${item.githubLink}\n`;
// 		}
// 		projText += '\n';
// 	});
// 	return projText.trim();
// };

// // Formatter for Certificates section
// const formatCertificates = (content: Content): string => {
// 	const { certificatesTitle, certificateLinkText } = content.resume.pdf;
// 	if (!content.certificates || !content.certificates.items || content.certificates.items.length === 0) {
// 		return '';
// 	}
// 	const title = certificatesTitle || 'Certificates'; // Fallback title
// 	let certText = `${title}\n\n`;
// 	content.certificates.items.forEach(item => {
// 		certText += `${item.title.toUpperCase()}${item.issuer ? ` - ${item.issuer}` : ''}\n`;
// 		if (item.date) {
// 			certText += `Date: ${item.date}\n`;
// 		}
// 		if (item.link && certificateLinkText) {
// 			certText += `${certificateLinkText}: ${item.link}\n`;
// 		}
// 		certText += '\n';
// 	});
// 	return certText.trim();
// };

// // Formatter for Date Generated footer
// const formatDateGenerated = (content: Content): string => {
// 	return `${content.resume.pdf.dateGenerated} ${new Date().toLocaleDateString()}`;
// };

// // Busca recursiva por path “a.b.c” dentro de um objeto
// const getNested = (obj: any, path: string): any =>
//   path.split('.').reduce((o, key) => o?.[key], obj) ?? '';

// // Preenche todos os {{chave}} do JSON com conteúdo vindo de content
// function applyPlaceholders<T>(raw: T, content: Content): T {
//   const str = JSON.stringify(raw);
//   const filled = str.replace(/{{\s*([^}]+)\s*}}/g, (_, path) => {
//     // permite chamar funções de formatação pré-definidas
//     if (path === 'formatContactInfo') {
//       return formatContactInfo(content).replace(/\n/g, '\\n');
//     }
//     // outros “helpers” podem ser tratados aqui...
//     const val = getNested(content, path);
//     return typeof val === 'string' ? val : JSON.stringify(val);
//   });
//   return JSON.parse(filled) as T;
// }

// export const generateResumePDF = async (content: Content): Promise<string> => {
// 	// Define fallback schemas. A detailed pdfTemplate.json is highly recommended for good layout.
// 	// These positions and dimensions are illustrative.
// 	const fallbackSchemas = [
// 		[
// 			// Header
// 			{ type: 'text', name: 'pdfName', position: { x: 20, y: 20 }, width: 280, height: 18, style: 'nameStyle' },
// 			{ type: 'text', name: 'pdfJobTitle', position: { x: 20, y: 40 }, width: 280, height: 12, style: 'jobTitleStyle' },
// 			// Contact Info (right column)
// 			{ type: 'text', name: 'contactDetails', position: { x: 350, y: 20 }, width: 225, height: 50, style: 'contactStyle', alignment: 'left' },
			
// 			// Main content sections (single column, simple flow)
// 			// Heights are estimates and content may overflow or be cut if too long without a proper template.
// 			{ type: 'text', name: 'summarySection', position: { x: 20, y: 75 }, width: 555, height: 70, style: 'sectionBodyStyle' },
// 			{ type: 'text', name: 'experienceSection', position: { x: 20, y: 150 }, width: 555, height: 170, style: 'sectionBodyStyle' },
// 			{ type: 'text', name: 'skillsSection', position: { x: 20, y: 325 }, width: 555, height: 130, style: 'sectionBodyStyle' },
// 			{ type: 'text', name: 'educationSection', position: { x: 20, y: 460 }, width: 555, height: 100, style: 'sectionBodyStyle' },
// 			{ type: 'text', name: 'projectsSection', position: { x: 20, y: 565 }, width: 555, height: 100, style: 'sectionBodyStyle' },
// 			{ type: 'text', name: 'certificatesSection', position: { x: 20, y: 670 }, width: 555, height: 80, style: 'sectionBodyStyle' },
			
// 			// Footer
// 			{ type: 'text', name: 'footerDateText', position: { x: 20, y: 780 }, width: 555, height: 10, style: 'footerStyle' },
// 		],
// 	];

// 	// 1. Preenchemos o template JSON
// 	const dynamicTemplate = applyPlaceholders(template as any, content);

// 	// 2. Construímos o objeto esperado pelo @pdfme/generator
// 	const pdfTemplate = {
// 		basePdf: BLANK_PDF,
// 		schemas: dynamicTemplate.schemas ?? fallbackSchemas,
// 		styles: dynamicTemplate.styles ?? {
// 			nameStyle: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#333333' },
// 			jobTitleStyle: { fontSize: 14, fontFamily: 'Helvetica', color: '#555555' },
// 			contactStyle: { fontSize: 9, fontFamily: 'Helvetica', color: '#444444', lineHeight: 1.4, alignment: 'left' },
// 			sectionTitleStyle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#333333',  marginBottom: 4 /* Not directly used by 'text' type, but for reference */ },
// 			sectionBodyStyle: { fontSize: 10, fontFamily: 'Helvetica', color: '#333333', lineHeight: 1.3 },
// 			footerStyle: { fontSize: 8, fontFamily: 'Helvetica', color: 'gray' },
// 			text: { fontSize: 10, fontFamily: 'Helvetica', color: 'black', lineHeight: 1.3 }, // Default
// 		},
// 		defaultStyle: dynamicTemplate.defaultStyle,
// 		pageSize: dynamicTemplate.pageSize,
// 	};

// 	const inputs = [
// 		{
// 			pdfName: content.resume.pdf.personalInfo.name || 'N/A',
// 			pdfJobTitle: content.resume.pdf.personalInfo.title || 'N/A',
// 			contactDetails: formatContactInfo(content),
// 			summarySection: formatSummary(content),
// 			skillsSection: formatSkills(content),
// 			experienceSection: formatExperience(content),
// 			educationSection: formatEducation(content),
// 			projectsSection: formatProjects(content),
// 			certificatesSection: formatCertificates(content),
// 			footerDateText: formatDateGenerated(content),
// 		},
// 	];

// 	try {
// 		const pdf = await generate({ template: pdfTemplate, inputs });
// 		const blob = new Blob([pdf.buffer as ArrayBuffer], { type: 'application/pdf' });
// 		return URL.createObjectURL(blob);
// 	} catch (error) {
// 		console.error('Error generating PDF:', error);
// 		const errorMessage = error instanceof Error ? error.message : String(error);
// 		throw new Error(`PDF generation failed: ${errorMessage}`);
// 	}
// };

// Export stub that returns the static PDF URL from public/
export const generateResumePDF = async (_content: any): Promise<string> => {
  // Point to the PDF placed under public/templates/
  return '/resume_prebuild/staticPDF_PT_BR.pdf';
};

export default generateResumePDF;
