import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiApiResponse } from "../types";

// Singleton pattern for GoogleGenAI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
}

// Fixed response schema
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    searchedMedicine: {
      any_of: [
        {
          type: Type.OBJECT,
          description: "Details of the medicine the user searched for.",
          properties: {
            brandName: { type: Type.STRING, description: "The brand name of the medicine." },
            salt: { type: Type.STRING, description: "The active salt or chemical composition." },
            dosage: { type: Type.STRING, description: "The dosage of the medicine, e.g., '500 mg'." },
            company: { type: Type.STRING, description: "The name of the manufacturing company." }
          },
          required: ["brandName", "salt", "dosage", "company"]
        },
        { type: Type.NULL, description: "Null if the medicine is not found." }
      ]
    },
    categories: {
      type: Type.ARRAY,
      description: "A list of categories for medicine alternatives.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The title of the category, e.g., 'Same Salt & Dosage (Popular Brands)'."
          },
          medicines: {
            type: Type.ARRAY,
            description: "A list of medicines within this category.",
            items: {
              type: Type.OBJECT,
              properties: {
                brandName: { type: Type.STRING, description: "The brand name of the medicine." },
                salt: { type: Type.STRING, description: "The active salt or chemical composition." },
                dosage: { type: Type.STRING, description: "The dosage of the medicine, e.g., '500 mg'." },
                company: { type: Type.STRING, description: "The name of the manufacturing company." }
              },
              required: ["brandName", "salt", "dosage", "company"]
            }
          }
        },
        required: ["title", "medicines"]
      }
    }
  },
  required: ["searchedMedicine", "categories"]
};

export const findAlternatives = async (medicineName: string): Promise<GeminiApiResponse> => {
  const ai = getAiClient();
  try {
    const prompt = `
      You are an extremely fast and efficient pharmacy assistant. A user is looking for alternatives to the medicine "${medicineName}".

      Your task is to:
      1. Identify the primary salt, dosage, and manufacturing company of "${medicineName}". Populate this in \`searchedMedicine\`. If "${medicineName}" is not known, set \`searchedMedicine\` to null.
      2. Find and categorize alternatives based on these rules, including the company:
          - First Category: Popular brands with the same salt & dosage. Title: "Same Salt & Dosage (Popular Brands)".
          - Second Category: Other brands with the same salt & dosage. Title: "Same Salt & Dosage (Other Brands)".
          - Third Category: Same salt, different dosages. Title: "Same Salt (Different Dosages)".

      Provide output in the specified JSON format. If no alternatives, \`categories\` can be empty, but \`searchedMedicine\` should still be populated if identified. Do not invent information.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    if (parsedResponse && Array.isArray(parsedResponse.categories) && ("searchedMedicine" in parsedResponse)) {
      return parsedResponse as GeminiApiResponse;
    } else {
      console.error("Parsed response is not in the expected format:", parsedResponse);
      return { searchedMedicine: null, categories: [] };
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the medicine database. Please try again later.");
  }
};
