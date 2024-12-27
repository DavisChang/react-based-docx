import React, { useEffect, useRef, useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Header,
  Table,
  BorderStyle,
  ImageRun,
  TableRow,
  TableCell,
} from "docx";
import { renderAsync } from "docx-preview";
import logo from "./assets/HeaderLogo.png";
import {
  A4PageProperties,
  AnswerParagraph,
  MultipleChoiceOption,
  QuestionParagraph,
  StudentInfoParagraph,
  QuestionTitleParagraph,
  TitleParagraph,
} from "./paragraph/docxComponents";

/**
 * Fetch an image from a URL and convert it to a Base64-encoded string.
 *
 * @param url - The URL of the image to fetch.
 * @returns A promise that resolves to the Base64 string of the image (without the data URI prefix).
 */
const fetchImageAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(",")[1];
      if (base64) {
        resolve(base64); // Get Base64 without prefix
      } else {
        reject(new Error("Failed to convert image to Base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

function App() {
  const [base64Image, setBase64Image] = useState<string | null>(null); // State to store the Base64 image

  // Load the Base64 image on mount
  useEffect(() => {
    const loadImage = async () => {
      const base64 = await fetchImageAsBase64(logo);
      setBase64Image(base64);
    };
    loadImage();
  }, []);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewContainerRef = useRef(null); // Create a ref for the preview container

  const createWordDocument = async () => {
    const doc = new Document({
      sections: [
        {
          properties: A4PageProperties(), // Use default A4 page settings
          headers: {
            default: new Header({
              children: [
                new Table({
                  rows: [
                    new TableRow({
                      children: [
                        // Left Cell: "ClassSwift"
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new ImageRun({
                                  data: base64Image, // Pass the Base64 string
                                  transformation: {
                                    width: 30, // Specify the width in points
                                    height: 30, // Specify the height in points
                                  },
                                }),
                                new TextRun({
                                  text: "Word Document Generator",
                                  bold: true,
                                  size: 28, // Font size in half-points (14pt)
                                }),
                              ],
                              alignment: "left", // Align to the left
                            }),
                          ],
                          verticalAlign: "center",
                        }),
                        // Middle Cell: Empty (for spacing)
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [],
                            }),
                          ],
                          verticalAlign: "center",
                        }),
                        // Right Cell: Date
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "2024-08-21", // Replace with the desired date
                                  size: 24, // Font size in half-points (12pt)
                                }),
                              ],
                              alignment: "right", // Align to the right
                            }),
                          ],
                          verticalAlign: "center",
                        }),
                      ],
                    }),
                  ],
                  width: {
                    size: 100,
                    type: "pct", // Table spans 100% of the page width
                  },
                  borders: {
                    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    bottom: {
                      style: BorderStyle.NONE,
                      size: 0,
                      color: "FFFFFF",
                    },
                    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    right: {
                      style: BorderStyle.NONE,
                      size: 0,
                      color: "FFFFFF",
                    },
                  },
                }),
                // Add empty paragraph for spacing below the header
                new Paragraph({
                  spacing: { after: 600 }, // Add spacing after the header
                }),
              ],
            }),
          },
          children: [
            StudentInfoParagraph(),

            // "選擇題" Title
            QuestionTitleParagraph("選擇題"),

            // Question 1
            QuestionParagraph(
              "（  ）1. 某人在閱讀西方政治思想著作時，曾感嘆道：「自由，則物各得其所自致，而於天擇之用存其最宜，太平之盛可不期而自至。」請問這是誰的主張?"
            ),
            MultipleChoiceOption("(A) 康有為"),
            MultipleChoiceOption("(B) 梁啟超"),
            MultipleChoiceOption("(C) 嚴復"),
            MultipleChoiceOption("(D) 魏源"),

            // "是非題" Title
            QuestionTitleParagraph("是非題"),

            // True/False Question
            QuestionParagraph(
              "（  ）2. 清代官方已無需再發展茶馬貿易，主要原因是因為國防需求減弱，交通改善及其他經濟方式興起。請問這個說法是否正確？"
            ),

            // "簡答題" Title
            QuestionTitleParagraph("簡答題"),

            // Short Answer Question
            QuestionParagraph(
              "（  ）3. 茶馬古道是指商人在中國西南地區開闢的商貿通道，歷代政府出於國防與外交需要，因而發展茶馬貿易，由官方經營此條交通線。到了清代，官方已無需再發展茶馬貿易，請問其原因為何？"
            ),
          ],
        },
        {
          properties: A4PageProperties(), // Use default A4 page settings

          children: [
            TitleParagraph("答案與詳解", { bold: true, size: 34 }),

            // Multiple-Choice Explanation
            QuestionTitleParagraph("選擇題"),

            QuestionParagraph(
              "（ A ）1. 某人在閱讀西方政治思想著作時，曾感嘆道：「自由，則物各得其所自致，而於天擇之用存其最宜，太平之盛可不期而自至。」請問這是誰的主張?"
            ),

            MultipleChoiceOption("(A) 康有為", { bold: true, color: "0070C0" }),
            MultipleChoiceOption("(B) 梁啟超"),
            MultipleChoiceOption("(C) 嚴復"),
            MultipleChoiceOption("(D) 魏源"),

            // True/False Explanation
            QuestionTitleParagraph("是非題"),
            QuestionParagraph(
              "（ O ）2. 清代官方已無需再發展茶馬貿易，主要原因是因為國防需求減弱，交通改善及其他經濟方式興起。請問這個說法是否正確？"
            ),

            AnswerParagraph(
              "《詳解》",
              "茶馬貿易是中國歷代官方為滿足國防和外交需求而開展的重要經濟活動，主要通過茶葉與馬匹的交換來支持軍事和邊疆穩定。",
              { bold: true, color: "0070C0", size: 24 }
            ),

            // Short Answer Explanation
            QuestionTitleParagraph("簡答題"),
            QuestionParagraph(
              "3. 茶馬古道是指商人在中國西南地區開闢的商貿通道，歷代政府出於國防與外交需求，因而發展茶馬貿易，由官方經營此條交通線。但到了清代，官方已無需再發展茶馬貿易，請問其原因為何？"
            ),
            AnswerParagraph(
              "《參考答案》",
              " 茶馬貿易在早期的發展，主要是出於邊疆地區的國防需要，利用茶葉換取馬匹以供軍事用途。然而到了清代，清朝統治者已經成功控制西南地區和邊疆的穩定，對馬匹的需求大幅減少，茶馬貿易的國防功能也逐漸失去意義。",
              { bold: true, color: "0070C0", size: 24 }
            ),
          ],
        },
      ],
    });

    // Convert the document to a Blob
    const blob = await Packer.toBlob(doc);

    // Generate a preview using docx-preview
    const arrayBuffer = await blob.arrayBuffer();
    if (previewContainerRef.current) {
      renderAsync(arrayBuffer, previewContainerRef.current); // Use the ref
    }

    // Save the blob URL for downloading
    const blobUrl = URL.createObjectURL(blob);
    setPreviewUrl(blobUrl);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Word Document Generator</h1>
      <button onClick={createWordDocument}>Generate Word Document</button>

      {previewUrl && (
        <div style={{ marginTop: "20px" }}>
          <a
            href={previewUrl}
            download={`example_${new Date().getTime() / 1000}.docx`}
          >
            Download Word Document
          </a>
        </div>
      )}

      {/* Attach the ref to the preview container */}
      <div
        ref={previewContainerRef}
        id="preview"
        style={{ border: "1px solid #ccc", marginTop: "20px", padding: "10px" }}
      >
        {/* Word preview will be rendered here */}
      </div>
    </div>
  );
}

export default App;
