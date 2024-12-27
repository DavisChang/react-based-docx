// src/docxComponents.js
import { Paragraph, TextRun, AlignmentType } from "docx";

interface ParagraphSpacing {
  after?: number;
  before?: number;
}
/**
 * Styles for a TextRun
 */
interface TextRunStyles {
  bold?: boolean;
  color?: string; // Hexadecimal color code (e.g., "0070C0")
  size?: number; // Font size in half-points (e.g., 24 for 12pt)
}

/**
 * Styles for the title's text components
 */
interface TitleStyles {
  bold?: boolean;
  size?: number; // Font size in half-points (e.g., 34 for 17pt)
}

/**
 * Styles for the answer's text components
 */
interface TextRunStyles {
  bold?: boolean;
  color?: string; // Hexadecimal color code (e.g., "0070C0")
  size?: number; // Font size in half-points (e.g., 24 for 12pt)
}

/**
 * Create page properties for an A4-sized document.
 *
 * @param {object} margins - Optional custom margins (in twips).
 * @returns {object} Page properties for docx.
 */
export const A4PageProperties = (
  margins = { top: 1440, right: 1440, bottom: 1440, left: 1440 }
) => {
  return {
    page: {
      size: {
        width: 11906, // A4 width in twips
        height: 16838, // A4 height in twips
      },
      margin: {
        top: margins.top,
        right: margins.right,
        bottom: margins.bottom,
        left: margins.left,
      },
    },
  };
};

/**
 * Create a styled paragraph for student information.
 *
 * @returns {Paragraph} A Paragraph instance for the Word document.
 */
export const StudentInfoParagraph = () => {
  return new Paragraph({
    children: [
      new TextRun({
        text: "______年 ______班 ______號            姓名：__________        分數：_____",
        size: 24, // Font size in half-points (12pt)
      }),
    ],
    alignment: AlignmentType.LEFT,
    spacing: {
      after: 600, // Add some space after the text
    },
  });
};

/**
 * Create a styled paragraph for a title.
 *
 * @param titleText - The text of the title (e.g., "答案與詳解").
 * @param styles - Styles for the title (e.g., bold, size).
 * @param spacing - Spacing after the paragraph (default is 300 twips).
 * @returns A styled Paragraph instance.
 */
export const TitleParagraph = (
  titleText: string,
  styles: TitleStyles = { bold: true, size: 34 },
  spacing: ParagraphSpacing = { after: 300 }
): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text: titleText,
        bold: styles.bold || false,
        size: styles.size || 24, // Default font size (12pt)
      }),
    ],
    alignment: AlignmentType.CENTER, // Center-align the title
    spacing,
  });
};

/**
 * Create a styled title paragraph.
 *
 * @param {string} title - The title text to display.
 * @returns {Paragraph} A styled Paragraph instance.
 */
export const QuestionTitleParagraph = (title: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 28, // Font size in half-points
      }),
    ],
    spacing: { after: 200, before: 500 }, // Custom spacing
  });
};

/**
 * Create a styled paragraph for a multiple-choice option.
 *
 * @param optionText - The text of the option (e.g., "(A) 康有為").
 * @param styles - Styles for the option (e.g., bold, color, size).
 * @param spacing - Spacing after the paragraph (default is 100 twips).
 * @returns A styled Paragraph instance.
 */
export const MultipleChoiceOption = (
  optionText: string,
  styles: TextRunStyles = {},
  spacing: ParagraphSpacing = { after: 100 }
): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text: optionText,
        bold: styles.bold || false,
        color: styles.color || "000000", // Default color is black
        size: styles.size || 24, // Default font size (12pt)
      }),
    ],
    spacing,
  });
};

/**
 * Create a styled paragraph for a question.
 *
 * @param {string} questionText - The text of the question.
 * @returns {Paragraph} A styled Paragraph instance.
 */
export const QuestionParagraph = (questionText: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: questionText,
        size: 24, // Font size in half-points (12pt)
      }),
    ],
    spacing: { after: 200 }, // Add spacing after the question
  });
};

/**
 * Create a styled paragraph for an answer with explanation.
 *
 * @param answerText - The main answer label or heading (e.g., "《詳解》").
 * @param explanation - The explanation text for the answer.
 * @param styles - Styles for the text (e.g., bold, color, size).
 * @param spacing - Spacing after the paragraph (default is 300 twips).
 * @returns A styled Paragraph instance.
 */
export const AnswerParagraph = (
  answerText: string,
  explanation: string,
  styles: TextRunStyles = { bold: true, color: "0070C0", size: 24 },
  spacing: ParagraphSpacing = { after: 300 }
): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text: answerText,
        bold: styles.bold || false,
        color: styles.color || "000000", // Default color is black
        size: styles.size || 24, // Default font size (12pt)
      }),
      new TextRun({
        text: ` ${explanation}`, // Space before explanation text
        color: styles.color || "000000", // Default color is black
        size: styles.size || 24, // Default font size (12pt)
      }),
    ],
    spacing,
  });
};
