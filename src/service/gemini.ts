import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: (import.meta.env as any).VITE_GEMINI_API_KEY,
});

export const test = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
};

export type questionType = {
  question: string;
  choices: string[];
  correctAnswer: number;
};

export const generateTetQuestion = async (
  questionLevel: string
): Promise<{
  question: string;
  choices: string[];
  correctAnswer: number;
}> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a quiz generator for Vietnamese Tet (Lunar New Year) holiday questions. Generate questions in Vietnamese about Tet traditions, customs, food, decorations, and cultural practices. Return ONLY a valid JSON text object with this exact structure:
    "{
      "question": "the question text",
      "choices": ["A: answer A", "B: answer B", "C: answer C", "D: answer D"],
      "correctAnswer": 0
    }"
    Where correctAnswer is the index (0-3) of the correct choice in the choices array. 
    Do not include any other text in the response. The difficulty level should be ${questionLevel}.
    `,
  });

  const result =
    response.text
      ?.replaceAll("```", "")
      .trim()
      .replaceAll("json", "")
      .replaceAll("JSON", "") || "";

  const parsed: questionType = JSON.parse(result);

  return parsed;
};
