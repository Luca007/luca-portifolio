import { jsPDF } from 'jspdf';
import { Content, contentMap, Project, Certificate } from '@/i18n/content'; // Added Certificate
import 'jspdf-autotable';

/**
 * Generate a PDF resume based on the content in the selected language,
 * mimicking the style of "Currículo Luca 2025.pdf".
 * @param content The content object with translations for the selected language.
 * @returns Blob URL of the generated PDF.
 */
export const generateResumePDF = (content: Content): string => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // --- Determine Language ---
  let langCode = 'en';
  if (content === contentMap.pt) langCode = 'pt';
  if (content === contentMap.es) langCode = 'es';

  // --- Document Properties ---
  doc.setProperties({
    title: `${content.resume.pdf.personalInfo.name} - ${content.resume.pdf.title}`,
    author: content.resume.pdf.personalInfo.name,
    subject: content.resume.pdf.subtitle,
    keywords: 'resume, cv, portfolio, full stack developer, currículo, luca clerot aviani',
    creator: 'Luca Clerot Portfolio Generator v2'
  });

  // --- Layout Constants ---
  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();

  const PAGE_MARGIN_Y = 18;
  const PAGE_MARGIN_X_LEFT = 15; // Margin for the edge of the left column background
  const PAGE_MARGIN_X_RIGHT = 15; // Margin for the right edge of the right column content

  const LEFT_COL_BG_WIDTH_RATIO = 0.33; // Adjusted based on reference
  const LEFT_COL_BG_X_START = PAGE_MARGIN_X_LEFT;
  const LEFT_COL_BG_WIDTH = (PAGE_WIDTH * LEFT_COL_BG_WIDTH_RATIO) - PAGE_MARGIN_X_LEFT;


  const CONTENT_PADDING_LEFT_COL = 8;
  const CONTENT_PADDING_RIGHT_COL = 10;

  const LEFT_COL_CONTENT_X_START = LEFT_COL_BG_X_START + CONTENT_PADDING_LEFT_COL;
  const LEFT_COL_CONTENT_WIDTH = LEFT_COL_BG_WIDTH - (2 * CONTENT_PADDING_LEFT_COL);

  const COLUMN_GUTTER = 10;

  const RIGHT_COL_X_START = LEFT_COL_BG_X_START + LEFT_COL_BG_WIDTH + COLUMN_GUTTER;
  const RIGHT_COL_CONTENT_WIDTH = PAGE_WIDTH - RIGHT_COL_X_START - PAGE_MARGIN_X_RIGHT;

  const VERTICAL_BAR_WIDTH = 1.5;
  const VERTICAL_BAR_OFFSET_X = -4; // Offset from the text start for the bar
  const VERTICAL_BAR_MARGIN_BOTTOM = 2;


  const SECTION_TITLE_MARGIN_BOTTOM_LEFT = 4;
  const SECTION_TITLE_MARGIN_BOTTOM_RIGHT = 2; // Space after title text, before content

  const INTER_SECTION_SPACING = 8;
  const INTRA_SECTION_ITEM_SPACING = 6;
  const ITEM_ELEMENT_SPACING = 2; // Space between elements like title and date
  const BULLET_POINT_INDENT = 5;
  const BULLET_ITEM_SPACING = 1.5;

  const LINE_HEIGHT_MULTIPLIER = 1.4;

  // --- Color Palette (Inspired by "Currículo Luca 2025.pdf") ---
  const COLOR_LEFT_COL_BG = '#2A2A2A'; // Dark Gray
  const COLOR_TEXT_ON_DARK_BG = '#FFFFFF';
  const COLOR_TEXT_ON_DARK_BG_MUTED = '#B0B0B0'; // Lighter gray for less emphasis
  const COLOR_TEXT_HEADING_RIGHT = '#000000'; // Black for right column headings
  const COLOR_TEXT_BODY_RIGHT = '#333333';    // Dark gray for body text
  const COLOR_TEXT_MUTED_RIGHT = '#555555';   // Medium gray for dates, locations
  const COLOR_LINK = '#0000EE'; // Standard blue for links, can be changed
  const COLOR_LINK_UNDERLINE = '#0000EE'; // Or use COLOR_LINK
  const COLOR_VERTICAL_BAR = '#000000'; // Black
  const COLOR_PROGRESS_BAR_BG_LEFT = '#4A4A4A'; // Darker gray for progress bar background on dark
  const COLOR_PROGRESS_BAR_FILL_LEFT = '#FFFFFF'; // White fill for progress bar on dark

  // --- Font Constants (Using Helvetica to emulate) ---
  const FONT_FAMILY_SANS = 'helvetica';
  const FONT_WEIGHT_NORMAL = 'normal';
  const FONT_WEIGHT_BOLD = 'bold';

  // Approximate sizes based on visual hierarchy of reference
  const FONT_SIZE_MAIN_NAME_LEFT = 22; // LUCA CLEROT
  const FONT_SIZE_MAIN_TITLE_LEFT = 10; // PROGRAMADOR FULL STACK

  const FONT_SIZE_SECTION_TITLE_LEFT = 11; // CONTATO, HABILIDADES, IDIOMAS
  const FONT_SIZE_SECTION_TITLE_RIGHT = 12; // PERFIL, EXPERIÊNCIA PROFISSIONAL, etc.

  const FONT_SIZE_ITEM_TITLE_LEFT = 9;    // Skill names (if not part of progress bar label)
  const FONT_SIZE_ITEM_TITLE_RIGHT = 10;  // Job Position, Degree, Certificate Title

  const FONT_SIZE_BODY_LEFT = 8.5;        // Contact details, language proficiency text
  const FONT_SIZE_BODY_RIGHT = 9;         // Descriptions, bullet points
  const FONT_SIZE_META_TEXT_LEFT = 7.5;   // Small text in left col if any
  const FONT_SIZE_META_TEXT_RIGHT = 8;    // Dates, locations, "Certificado on-line"

  // --- State Variables ---
  let yPosLeft = PAGE_MARGIN_Y;
  let yPosRight = PAGE_MARGIN_Y;
  let currentPage = 1;

  // --- Helper Functions ---
  const getLineHeight = (fontSize: number, multiplier: number = LINE_HEIGHT_MULTIPLIER): number => fontSize * 0.352777 * multiplier; // mm conversion

  const checkPageBreak = (currentY: number, requiredHeight: number, isLeftCol: boolean): number => {
    if (currentY + requiredHeight > PAGE_HEIGHT - PAGE_MARGIN_Y) {
      if (doc.internal.getCurrentPageInfo().pageNumber === currentPage) { // Avoid adding page if already on a new one
        doc.addPage();
        currentPage++;
        if (isLeftCol) {
          drawLeftColumnBackground();
        }
      }
      return PAGE_MARGIN_Y;
    }
    return currentY;
  };

  const drawLeftColumnBackground = () => {
    doc.setFillColor(COLOR_LEFT_COL_BG);
    doc.rect(LEFT_COL_BG_X_START, 0, LEFT_COL_BG_WIDTH, PAGE_HEIGHT, 'F');
  };

  const addSectionTitle = (
    title: string,
    x: number,
    y: number,
    _width: number, // width might not be needed if titles are short or not constrained
    isLeftCol: boolean
  ): number => {
    const textColor = isLeftCol ? COLOR_TEXT_ON_DARK_BG : COLOR_TEXT_HEADING_RIGHT;
    const fontSize = isLeftCol ? FONT_SIZE_SECTION_TITLE_LEFT : FONT_SIZE_SECTION_TITLE_RIGHT;
    // Ensure title is not undefined or null before calling toUpperCase
    const titleText = title ? title.toUpperCase() : "";
    let newY = y;

    doc.setFont(FONT_FAMILY_SANS, FONT_WEIGHT_BOLD);
    doc.setFontSize(fontSize);
    doc.setTextColor(textColor);

    if (isLeftCol) {
      doc.text(titleText, x, newY);
      newY += getLineHeight(fontSize) * 0.8 + SECTION_TITLE_MARGIN_BOTTOM_LEFT;
    } else {
      // Right column: Title with vertical bar
      const titleHeight = getLineHeight(fontSize);
      const textMetrics = doc.getTextDimensions(titleText, { fontSize: fontSize, font: doc.getFont() });
      const barHeight = textMetrics.h * 0.9; 
      
      // Ensure y for rect is positive
      const barY = newY - barHeight + (titleHeight * 0.15);
      doc.setFillColor(COLOR_VERTICAL_BAR);
      doc.rect(x + VERTICAL_BAR_OFFSET_X, Math.max(0, barY), VERTICAL_BAR_WIDTH, barHeight, 'F');

      doc.text(titleText, x, newY);
      newY += titleHeight * 0.7 + SECTION_TITLE_MARGIN_BOTTOM_RIGHT + VERTICAL_BAR_MARGIN_BOTTOM;
    }
    return newY;
  };
  
  const addTextLines = (
    text: string | string[] | undefined,
    x: number,
    y: number,
    width: number,
    fontSize: number,
    fontStyle: string = FONT_WEIGHT_NORMAL,
    color: string = COLOR_TEXT_BODY_RIGHT,
    charSpace: number = 0,
    lineHeightScale: number = 1,
    isUppercase: boolean = false
  ): number => {
    if (!text || text.length === 0) return y;
    
    let processedText = Array.isArray(text) ? text.join('\n') : text;
    if (isUppercase) {
      processedText = processedText.toUpperCase();
    }

    doc.setFont(FONT_FAMILY_SANS, fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    
    const lineHeight = getLineHeight(fontSize, LINE_HEIGHT_MULTIPLIER * lineHeightScale);
    const lines = doc.splitTextToSize(processedText, width);
    
    doc.text(lines, x, y, { charSpace: charSpace, lineHeightFactor: LINE_HEIGHT_MULTIPLIER * lineHeightScale });
    return y + lines.length * lineHeight;
  };

  const addLink = (
    text: string | undefined,
    url: string | undefined,
    x: number,
    y: number,
    width: number,
    fontSize: number,
    fontStyle: string = FONT_WEIGHT_NORMAL,
    color: string = COLOR_LINK,
    underlineColor: string = COLOR_LINK_UNDERLINE
  ): number => {
    if (!text || !url) return y;
    doc.setFont(FONT_FAMILY_SANS, fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color);

    const lines = doc.splitTextToSize(text, width);
    const lineHeight = getLineHeight(fontSize);
    let currentY = y;

    lines.forEach((line, index) => {
      const textWidth = doc.getTextWidth(line);
      doc.textWithLink(line, x, currentY, { url });
      doc.setDrawColor(underlineColor);
      doc.setLineWidth(0.2);
      // jsPDF doesn't support dashed lines for textWithLink underline directly.
      // Drawing a manual line:
      doc.line(x, currentY + 1, x + textWidth, currentY + 1); // Adjust Y offset for underline
      currentY += lineHeight;
    });
    
    return y + lines.length * lineHeight;
  };

  const drawProgressBar = ( // Simplified for minimalist look
    x: number,
    y: number,
    width: number,
    level: number, // Percentage 0-100
    barHeight: number = 2, // Thinner bar
    label: string,
    labelColor: string,
    bgColor: string,
    fillColor: string
  ): number => {
    let currentY = y;
    // Add label above the bar
    currentY = addTextLines(label, x, currentY, width, FONT_SIZE_META_TEXT_LEFT, FONT_WEIGHT_NORMAL, labelColor);
    currentY += ITEM_ELEMENT_SPACING * 0.3;

    const clampedLevel = Math.max(0, Math.min(100, level));
    const fillWidth = width * (clampedLevel / 100);

    doc.setFillColor(bgColor);
    doc.rect(x, currentY, width, barHeight, 'F');
    doc.setFillColor(fillColor);
    doc.rect(x, currentY, fillWidth, barHeight, 'F');
    return currentY + barHeight;
  };
  
  const mapSkillLevelToText = (level: number, lang: string): string => {
    const currentLangContent = contentMap[lang] || contentMap.en;
    // Assuming proficiency levels are part of resume.pdf for direct access
    // This needs to be adapted if proficiency levels are structured differently in your content.ts
    const proficiencyMapping = currentLangContent.resume.pdf.proficiencyLevels || {
      expert: "Expert",
      advanced: "Advanced",
      intermediate: "Intermediate",
      basic: "Basic",
      beginner: "Beginner"
    };

    if (level >= 90) return proficiencyMapping.expert;
    if (level >= 70) return proficiencyMapping.advanced;
    if (level >= 50) return proficiencyMapping.intermediate;
    if (level >= 30) return proficiencyMapping.basic;
    return proficiencyMapping.beginner;
  };


  // --- PDF Generation Starts ---
  // Page 1: Left Column Background
  drawLeftColumnBackground();

  // --- Left Column Content ---
  // Name and Title
  yPosLeft = addTextLines(content.resume.pdf.personalInfo.name, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_MAIN_NAME_LEFT, FONT_WEIGHT_BOLD, COLOR_TEXT_ON_DARK_BG, 0, 1, true);
  yPosLeft += ITEM_ELEMENT_SPACING / 2;
  yPosLeft = addTextLines(content.resume.pdf.personalInfo.title, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_MAIN_TITLE_LEFT, FONT_WEIGHT_NORMAL, COLOR_TEXT_ON_DARK_BG_MUTED, 0, 1, true);
  yPosLeft += INTER_SECTION_SPACING * 1.5;


  // Contact Info (Simulating reference: "Celular", "E-mail", "Localização")
  yPosLeft = checkPageBreak(yPosLeft, getLineHeight(FONT_SIZE_SECTION_TITLE_LEFT) + SECTION_TITLE_MARGIN_BOTTOM_LEFT, true);
  yPosLeft = addSectionTitle(content.resume.pdf.contactInfo.title, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, true);
  
  // Contact Phone
  let phoneLabelHeight = getLineHeight(FONT_SIZE_BODY_LEFT);
  let phoneValueHeight = getLineHeight(FONT_SIZE_BODY_LEFT);
  yPosLeft = checkPageBreak(yPosLeft, phoneLabelHeight + phoneValueHeight + ITEM_ELEMENT_SPACING, true);
  yPosLeft = addTextLines(content.resume.pdf.contactInfo.phoneLabel, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_LEFT, FONT_WEIGHT_BOLD, COLOR_TEXT_ON_DARK_BG_MUTED);
  yPosLeft = addTextLines(content.resume.pdf.personalInfo.phone, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_LEFT, FONT_WEIGHT_NORMAL, COLOR_TEXT_ON_DARK_BG);
  yPosLeft += ITEM_ELEMENT_SPACING;

  // Contact Email
  let emailLabelHeight = getLineHeight(FONT_SIZE_BODY_LEFT);
  let emailValueHeight = getLineHeight(FONT_SIZE_BODY_LEFT); // addLink also returns height
  yPosLeft = checkPageBreak(yPosLeft, emailLabelHeight + emailValueHeight + ITEM_ELEMENT_SPACING, true);
  yPosLeft = addTextLines(content.resume.pdf.contactInfo.emailLabel, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_LEFT, FONT_WEIGHT_BOLD, COLOR_TEXT_ON_DARK_BG_MUTED);
  yPosLeft = addLink(content.resume.pdf.personalInfo.email, `mailto:${content.resume.pdf.personalInfo.email}`, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_LEFT, FONT_WEIGHT_NORMAL, COLOR_TEXT_ON_DARK_BG, COLOR_TEXT_ON_DARK_BG_MUTED);
  yPosLeft += ITEM_ELEMENT_SPACING;

  // Contact Location
  let locationLabelHeight = getLineHeight(FONT_SIZE_BODY_LEFT);
  let locationValueHeight = getLineHeight(FONT_SIZE_BODY_LEFT);
  yPosLeft = checkPageBreak(yPosLeft, locationLabelHeight + locationValueHeight + ITEM_ELEMENT_SPACING, true);
  yPosLeft = addTextLines(content.resume.pdf.contactInfo.locationLabel, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_LEFT, FONT_WEIGHT_BOLD, COLOR_TEXT_ON_DARK_BG_MUTED);
  yPosLeft = addTextLines(content.resume.pdf.personalInfo.location, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_LEFT, FONT_WEIGHT_NORMAL, COLOR_TEXT_ON_DARK_BG);
  yPosLeft += INTER_SECTION_SPACING;
  
  // Skills Section (Reference shows "HABILIDADES")
  yPosLeft = checkPageBreak(yPosLeft, getLineHeight(FONT_SIZE_SECTION_TITLE_LEFT) + SECTION_TITLE_MARGIN_BOTTOM_LEFT, true);
  yPosLeft = addSectionTitle(content.resume.pdf.skillsTitle, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, true);
  
  const SKILL_BAR_HEIGHT_LEFT = 2.5;
  const SKILL_ITEM_SPACING_LEFT = 3.5;

  // Programming Skills (if you want to keep bars)
  if (content.skills.programmingSkills.length > 0) {
    // yPosLeft = addTextLines(content.skills.skillCategories.programming, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_ITEM_TITLE_LEFT, FONT_WEIGHT_BOLD, COLOR_TEXT_ON_DARK_BG);
    // yPosLeft += ITEM_ELEMENT_SPACING * 0.5;
    content.skills.programmingSkills.forEach(skill => {
      const skillDisplayHeight = getLineHeight(FONT_SIZE_META_TEXT_LEFT) + ITEM_ELEMENT_SPACING * 0.3 + SKILL_BAR_HEIGHT_LEFT + SKILL_ITEM_SPACING_LEFT;
      yPosLeft = checkPageBreak(yPosLeft, skillDisplayHeight, true);
      yPosLeft = drawProgressBar(LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, skill.level, SKILL_BAR_HEIGHT_LEFT, skill.name, COLOR_TEXT_ON_DARK_BG_MUTED, COLOR_PROGRESS_BAR_BG_LEFT, COLOR_PROGRESS_BAR_FILL_LEFT);
      yPosLeft += SKILL_ITEM_SPACING_LEFT;
    });
    yPosLeft += ITEM_ELEMENT_SPACING;
  }

  // Tools Skills (if you want to keep bars)
  if (content.skills.toolsSkills.length > 0) {
    // yPosLeft = addTextLines(content.skills.skillCategories.tools, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_ITEM_TITLE_LEFT, FONT_WEIGHT_BOLD, COLOR_TEXT_ON_DARK_BG);
    // yPosLeft += ITEM_ELEMENT_SPACING * 0.5;
    content.skills.toolsSkills.forEach(skill => {
      const skillDisplayHeight = getLineHeight(FONT_SIZE_META_TEXT_LEFT) + ITEM_ELEMENT_SPACING * 0.3 + SKILL_BAR_HEIGHT_LEFT + SKILL_ITEM_SPACING_LEFT;
      yPosLeft = checkPageBreak(yPosLeft, skillDisplayHeight, true);
      yPosLeft = drawProgressBar(LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, skill.level, SKILL_BAR_HEIGHT_LEFT, skill.name, COLOR_TEXT_ON_DARK_BG_MUTED, COLOR_PROGRESS_BAR_BG_LEFT, COLOR_PROGRESS_BAR_FILL_LEFT);
      yPosLeft += SKILL_ITEM_SPACING_LEFT;
    });
    yPosLeft += ITEM_ELEMENT_SPACING;
  }
  yPosLeft += INTER_SECTION_SPACING;

  // Languages Section (Reference shows "IDIOMAS")
  yPosLeft = checkPageBreak(yPosLeft, getLineHeight(FONT_SIZE_SECTION_TITLE_LEFT) + SECTION_TITLE_MARGIN_BOTTOM_LEFT, true);
  yPosLeft = addSectionTitle(content.skills.skillCategories.languages, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, true);
  if (content.skills.languageSkills.length > 0) {
    content.skills.languageSkills.forEach(lang => {
      const proficiencyText = mapSkillLevelToText(lang.level, langCode); // Use langCode
      const langLabel = `${lang.name.toUpperCase()}`; // As per reference: "INGLES", "ESPANHOL"
      const langDesc = `(${proficiencyText})`; // As per reference: "(100%)" or "(Fluente)"

      let langLineHeight = getLineHeight(FONT_SIZE_BODY_LEFT);
      yPosLeft = checkPageBreak(yPosLeft, langLineHeight * 2 + ITEM_ELEMENT_SPACING, true);
      
      yPosLeft = addTextLines(langLabel, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_LEFT, FONT_WEIGHT_BOLD, COLOR_TEXT_ON_DARK_BG);
      yPosLeft = addTextLines(langDesc, LEFT_COL_CONTENT_X_START, yPosLeft, LEFT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_LEFT, FONT_WEIGHT_NORMAL, COLOR_TEXT_ON_DARK_BG_MUTED);
      yPosLeft += ITEM_ELEMENT_SPACING * 1.5;
    });
  }
  yPosLeft += INTER_SECTION_SPACING;


  // --- Right Column Content ---
  // Profile / Summary (Reference: "PERFIL")
  const summaryTitleText = content.resume.pdf.summaryTitle;
  const summarySectionTitleHeight = getLineHeight(FONT_SIZE_SECTION_TITLE_RIGHT) + SECTION_TITLE_MARGIN_BOTTOM_RIGHT + VERTICAL_BAR_MARGIN_BOTTOM;
  
  const summaryTextContent = content.about.paragraphs.join('\n\n');
  const summaryTextLines = doc.splitTextToSize(summaryTextContent, RIGHT_COL_CONTENT_WIDTH);
  const summaryTextHeight = summaryTextLines.length * getLineHeight(FONT_SIZE_BODY_RIGHT);

  yPosRight = checkPageBreak(yPosRight, summarySectionTitleHeight + summaryTextHeight, false);
  
  yPosRight = addSectionTitle(summaryTitleText, RIGHT_COL_X_START, yPosRight, RIGHT_COL_CONTENT_WIDTH, false);
  yPosRight = addTextLines(summaryTextContent, RIGHT_COL_X_START, yPosRight, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_RIGHT, FONT_WEIGHT_NORMAL, COLOR_TEXT_BODY_RIGHT);
  yPosRight += INTER_SECTION_SPACING;

  // Experience (Reference: "EXPERIÊNCIA PROFISSIONAL")
  const expTitleText = content.resume.pdf.experienceTitle;
  let expSectionContentEstHeight = 0;
  content.experiences.items.forEach(exp => {
    expSectionContentEstHeight += getLineHeight(FONT_SIZE_ITEM_TITLE_RIGHT) + ITEM_ELEMENT_SPACING; // Position
    expSectionContentEstHeight += getLineHeight(FONT_SIZE_BODY_RIGHT) + ITEM_ELEMENT_SPACING; // Company
    expSectionContentEstHeight += getLineHeight(FONT_SIZE_META_TEXT_RIGHT) + ITEM_ELEMENT_SPACING; // Period | Location
    const descLines = doc.splitTextToSize(exp.description, RIGHT_COL_CONTENT_WIDTH);
    expSectionContentEstHeight += descLines.length * getLineHeight(FONT_SIZE_BODY_RIGHT, 1.1) + ITEM_ELEMENT_SPACING; // Description
    if (exp.responsibilities) {
      exp.responsibilities.forEach(resp => {
        const respLines = doc.splitTextToSize(`• ${resp}`, RIGHT_COL_CONTENT_WIDTH - BULLET_POINT_INDENT);
        expSectionContentEstHeight += respLines.length * getLineHeight(FONT_SIZE_BODY_RIGHT, 1.1) + (BULLET_ITEM_SPACING / 2);
      });
    }
    expSectionContentEstHeight += INTRA_SECTION_ITEM_SPACING;
  });

  yPosRight = checkPageBreak(yPosRight, summarySectionTitleHeight + expSectionContentEstHeight, false);
  yPosRight = addSectionTitle(expTitleText, RIGHT_COL_X_START, yPosRight, RIGHT_COL_CONTENT_WIDTH, false);
  
  content.experiences.items.forEach((exp, index) => {
    let currentItemY = yPosRight; // Use a temporary Y for the current item to avoid accumulating checkPageBreak resets
    
    // Estimate height for this single experience item before drawing it
    let singleExpEstHeight = getLineHeight(FONT_SIZE_ITEM_TITLE_RIGHT) + ITEM_ELEMENT_SPACING; // Position
    singleExpEstHeight += getLineHeight(FONT_SIZE_BODY_RIGHT) + ITEM_ELEMENT_SPACING; // Company
    singleExpEstHeight += getLineHeight(FONT_SIZE_META_TEXT_RIGHT) + ITEM_ELEMENT_SPACING; // Period | Location
    const descLines = doc.splitTextToSize(exp.description, RIGHT_COL_CONTENT_WIDTH);
    singleExpEstHeight += descLines.length * getLineHeight(FONT_SIZE_BODY_RIGHT, 1.1) + ITEM_ELEMENT_SPACING;
    if (exp.responsibilities) {
        exp.responsibilities.forEach(resp => {
            const respLines = doc.splitTextToSize(`• ${resp}`, RIGHT_COL_CONTENT_WIDTH - BULLET_POINT_INDENT);
            singleExpEstHeight += respLines.length * getLineHeight(FONT_SIZE_BODY_RIGHT, 1.1) + (BULLET_ITEM_SPACING / 2);
        });
    }
    
    yPosRight = checkPageBreak(yPosRight, singleExpEstHeight, false);
    currentItemY = yPosRight; // Update currentItemY if page break happened

    currentItemY = addTextLines(exp.position.toUpperCase(), RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_ITEM_TITLE_RIGHT, FONT_WEIGHT_BOLD, COLOR_TEXT_HEADING_RIGHT);
    currentItemY += ITEM_ELEMENT_SPACING / 2;
    currentItemY = addTextLines(exp.company, RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_RIGHT, FONT_WEIGHT_NORMAL, COLOR_TEXT_MUTED_RIGHT);
    currentItemY += ITEM_ELEMENT_SPACING / 2;
    currentItemY = addTextLines(`${exp.period} | ${exp.location}`, RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_META_TEXT_RIGHT, FONT_WEIGHT_NORMAL, COLOR_TEXT_MUTED_RIGHT);
    currentItemY += ITEM_ELEMENT_SPACING;
    currentItemY = addTextLines(exp.description, RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_RIGHT, FONT_WEIGHT_NORMAL, COLOR_TEXT_BODY_RIGHT, 0, 1.1);

    if (exp.responsibilities && exp.responsibilities.length > 0) {
        currentItemY += ITEM_ELEMENT_SPACING * 0.8;
        exp.responsibilities.forEach(resp => {
            const bulletText = `• ${resp}`;
            const bulletLines = doc.splitTextToSize(bulletText, RIGHT_COL_CONTENT_WIDTH - BULLET_POINT_INDENT);
            const bulletHeightEst = bulletLines.length * getLineHeight(FONT_SIZE_BODY_RIGHT, 1.1);
            
            // Check break for each bullet point individually if they can be long
            yPosRight = checkPageBreak(currentItemY, bulletHeightEst + BULLET_ITEM_SPACING / 2, false);
            if (yPosRight < currentItemY) currentItemY = yPosRight; // Update currentItemY if page break

            currentItemY = addTextLines(bulletText, RIGHT_COL_X_START + BULLET_POINT_INDENT, currentItemY, RIGHT_COL_CONTENT_WIDTH - BULLET_POINT_INDENT, FONT_SIZE_BODY_RIGHT, FONT_WEIGHT_NORMAL, COLOR_TEXT_BODY_RIGHT, 0, 1.1);
            currentItemY += BULLET_ITEM_SPACING / 2;
        });
    }
    yPosRight = currentItemY + (index < content.experiences.items.length - 1 ? INTRA_SECTION_ITEM_SPACING : 0);
  });
  yPosRight += INTER_SECTION_SPACING;

  // Education (Reference: "FORMAÇÕES")
  const eduTitleText = content.resume.pdf.educationTitle;
  let eduSectionContentEstHeight = 0;
  content.education.items.forEach(edu => {
    eduSectionContentEstHeight += getLineHeight(FONT_SIZE_ITEM_TITLE_RIGHT) + ITEM_ELEMENT_SPACING; // Degree
    eduSectionContentEstHeight += getLineHeight(FONT_SIZE_BODY_RIGHT) + ITEM_ELEMENT_SPACING; // Institution
    eduSectionContentEstHeight += getLineHeight(FONT_SIZE_META_TEXT_RIGHT) + ITEM_ELEMENT_SPACING; // Period
    eduSectionContentEstHeight += INTRA_SECTION_ITEM_SPACING;
  });

  yPosRight = checkPageBreak(yPosRight, summarySectionTitleHeight + eduSectionContentEstHeight, false); // summarySectionTitleHeight is a generic title height
  yPosRight = addSectionTitle(eduTitleText, RIGHT_COL_X_START, yPosRight, RIGHT_COL_CONTENT_WIDTH, false);
  
  content.education.items.forEach((edu, index) => {
    let currentItemY = yPosRight;
    let singleEduEstHeight = getLineHeight(FONT_SIZE_ITEM_TITLE_RIGHT) + ITEM_ELEMENT_SPACING;
    singleEduEstHeight += getLineHeight(FONT_SIZE_BODY_RIGHT) + ITEM_ELEMENT_SPACING;
    singleEduEstHeight += getLineHeight(FONT_SIZE_META_TEXT_RIGHT);

    yPosRight = checkPageBreak(yPosRight, singleEduEstHeight, false);
    currentItemY = yPosRight;

    currentItemY = addTextLines(edu.degree.toUpperCase(), RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_ITEM_TITLE_RIGHT, FONT_WEIGHT_BOLD, COLOR_TEXT_HEADING_RIGHT);
    currentItemY += ITEM_ELEMENT_SPACING / 2;
    currentItemY = addTextLines(edu.institution, RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_RIGHT, FONT_WEIGHT_NORMAL, COLOR_TEXT_MUTED_RIGHT);
    currentItemY += ITEM_ELEMENT_SPACING / 2;
    currentItemY = addTextLines(edu.period, RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_META_TEXT_RIGHT, FONT_WEIGHT_NORMAL, COLOR_TEXT_MUTED_RIGHT);
    yPosRight = currentItemY + (index < content.education.items.length - 1 ? INTRA_SECTION_ITEM_SPACING : 0);
  });
  yPosRight += INTER_SECTION_SPACING;

  // Certificates (Reference: "CERTIFICADOS")
  if (content.certificates && content.certificates.items.length > 0 && content.resume.pdf.certificatesTitle) {
    const certTitleText = content.resume.pdf.certificatesTitle;
    let certSectionContentEstHeight = 0;
    content.certificates.items.forEach(cert => {
        certSectionContentEstHeight += getLineHeight(FONT_SIZE_ITEM_TITLE_RIGHT) + ITEM_ELEMENT_SPACING; // Title
        if(cert.issuer) certSectionContentEstHeight += getLineHeight(FONT_SIZE_META_TEXT_RIGHT) + ITEM_ELEMENT_SPACING/2; // Issuer
        if(cert.link) certSectionContentEstHeight += getLineHeight(FONT_SIZE_META_TEXT_RIGHT); // Link
        certSectionContentEstHeight += INTRA_SECTION_ITEM_SPACING;
    });
    
    yPosRight = checkPageBreak(yPosRight, summarySectionTitleHeight + certSectionContentEstHeight, false);
    yPosRight = addSectionTitle(certTitleText, RIGHT_COL_X_START, yPosRight, RIGHT_COL_CONTENT_WIDTH, false);
    
    content.certificates.items.forEach((cert: Certificate, index: number) => {
      let currentItemY = yPosRight;
      let singleCertEstHeight = getLineHeight(FONT_SIZE_ITEM_TITLE_RIGHT) + ITEM_ELEMENT_SPACING / 2;
      if(cert.issuer) singleCertEstHeight += getLineHeight(FONT_SIZE_META_TEXT_RIGHT) + ITEM_ELEMENT_SPACING / 2;
      if(cert.link) singleCertEstHeight += getLineHeight(FONT_SIZE_META_TEXT_RIGHT);

      yPosRight = checkPageBreak(yPosRight, singleCertEstHeight, false);
      currentItemY = yPosRight;

      currentItemY = addTextLines(cert.title.toUpperCase(), RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_ITEM_TITLE_RIGHT, FONT_WEIGHT_BOLD, COLOR_TEXT_HEADING_RIGHT);
      currentItemY += ITEM_ELEMENT_SPACING / 2;
      if (cert.issuer) {
        currentItemY = addTextLines(cert.issuer, RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_META_TEXT_RIGHT, FONT_WEIGHT_NORMAL, COLOR_TEXT_MUTED_RIGHT);
        currentItemY += ITEM_ELEMENT_SPACING /2;
      }
      if (cert.link) {
        const linkText = content.resume.pdf.certificateLinkText || "Online Certificate";
        currentItemY = addLink(linkText, cert.link, RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_META_TEXT_RIGHT, FONT_WEIGHT_NORMAL, COLOR_LINK, COLOR_LINK_UNDERLINE);
      }
      yPosRight = currentItemY + (index < content.certificates.items.length - 1 ? INTRA_SECTION_ITEM_SPACING : 0);
    });
    yPosRight += INTER_SECTION_SPACING;
  }


  // Projects
  if (content.projects.items.length > 0 && content.resume.pdf.projectsTitle) {
    const projTitleText = content.resume.pdf.projectsTitle;
    let projSectionContentEstHeight = 0;
    content.projects.items.slice(0,2).forEach(project => {
        projSectionContentEstHeight += getLineHeight(FONT_SIZE_ITEM_TITLE_RIGHT) + ITEM_ELEMENT_SPACING;
        const descLines = doc.splitTextToSize(project.description, RIGHT_COL_CONTENT_WIDTH);
        projSectionContentEstHeight += descLines.length * getLineHeight(FONT_SIZE_BODY_RIGHT, 1.1) + ITEM_ELEMENT_SPACING / 2;
        if (project.link || project.githubLink) projSectionContentEstHeight += getLineHeight(FONT_SIZE_META_TEXT_RIGHT);
        projSectionContentEstHeight += INTRA_SECTION_ITEM_SPACING;
    });

    yPosRight = checkPageBreak(yPosRight, summarySectionTitleHeight + projSectionContentEstHeight, false);
    yPosRight = addSectionTitle(projTitleText, RIGHT_COL_X_START, yPosRight, RIGHT_COL_CONTENT_WIDTH, false);
    
    content.projects.items.slice(0,2).forEach((project: Project, index: number) => {
      let currentItemY = yPosRight;
      let singleProjEstHeight = getLineHeight(FONT_SIZE_ITEM_TITLE_RIGHT) + ITEM_ELEMENT_SPACING / 2;
      const descLines = doc.splitTextToSize(project.description, RIGHT_COL_CONTENT_WIDTH);
      singleProjEstHeight += descLines.length * getLineHeight(FONT_SIZE_BODY_RIGHT, 1.1) + ITEM_ELEMENT_SPACING / 2;
      if (project.link || project.githubLink) singleProjEstHeight += getLineHeight(FONT_SIZE_META_TEXT_RIGHT);
      
      yPosRight = checkPageBreak(yPosRight, singleProjEstHeight, false);
      currentItemY = yPosRight;

      currentItemY = addTextLines(project.title.toUpperCase(), RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_ITEM_TITLE_RIGHT, FONT_WEIGHT_BOLD, COLOR_TEXT_HEADING_RIGHT);
      currentItemY += ITEM_ELEMENT_SPACING / 2;
      
      currentItemY = addTextLines(project.description, RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_RIGHT, FONT_WEIGHT_NORMAL, COLOR_TEXT_BODY_RIGHT, 0, 1.1);
      currentItemY += ITEM_ELEMENT_SPACING / 2;

      const projectLinkUrl = project.link || project.githubLink;
      // Ensure projectLinkText is defined in content.ts or provide a default
      const projectLinkDefaultText = project.link ? (content.resume.pdf.projectLinkViewText || "View Project") : (project.githubLink ? (content.resume.pdf.projectLinkGithubText || "View on GitHub") : "");

      if (projectLinkUrl && projectLinkDefaultText) {
        currentItemY = addLink(projectLinkDefaultText, projectLinkUrl, RIGHT_COL_X_START, currentItemY, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_META_TEXT_RIGHT, FONT_WEIGHT_NORMAL, COLOR_LINK, COLOR_LINK_UNDERLINE);
      }
      yPosRight = currentItemY + (index < content.projects.items.slice(0,2).length - 1 ? INTRA_SECTION_ITEM_SPACING : 0);
    });
    yPosRight += INTER_SECTION_SPACING;
  }
  
  // GitHub Link
  if (content.resume.pdf.personalInfo.github && content.resume.pdf.contactInfo.githubLabel) {
    const githubSectionTitleText = content.resume.pdf.contactInfo.githubLabel; // Already uppercase in content.ts if needed by design
    const githubUrl = content.resume.pdf.personalInfo.github;
    const githubLinkHeight = getLineHeight(FONT_SIZE_BODY_RIGHT);

    yPosRight = checkPageBreak(yPosRight, summarySectionTitleHeight + githubLinkHeight, false);
    yPosRight = addSectionTitle(githubSectionTitleText.toUpperCase(), RIGHT_COL_X_START, yPosRight, RIGHT_COL_CONTENT_WIDTH, false);
    yPosRight = addLink(githubUrl, githubUrl, RIGHT_COL_X_START, yPosRight, RIGHT_COL_CONTENT_WIDTH, FONT_SIZE_BODY_RIGHT, FONT_WEIGHT_NORMAL, COLOR_LINK, COLOR_LINK_UNDERLINE);
    yPosRight += INTER_SECTION_SPACING;
  }

  // --- Finalize PDF ---
  const pdfOutput = doc.output('blob');
  return URL.createObjectURL(pdfOutput);
};

export default generateResumePDF;
