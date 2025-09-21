import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiApiResponse } from "../types";

// Use a singleton pattern for the GoogleGenAI client to avoid re-initialization
// and to prevent top-level execution of code that depends on browser-injected variables.
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    // This will only be executed on the first API call, ensuring that the
    // environment is fully loaded and `process.env.API_KEY` is available.
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
}


const responseSchema = {
  type: Type.OBJECT,
  properties: {
    searchedMedicine: {
      type: [Type.OBJECT, Type.NULL],
      description: "Details of the medicine the user searched for. Null if not found.",
      properties: {
        brandName: { type: Type.STRING, description: "The brand name of the medicine." },
        salt: { type: Type.STRING, description: "The active salt or chemical composition." },
        dosage: { type: Type.STRING, description: "The dosage of the medicine, e.g., '500 mg'." },
        company: { type: Type.STRING, description: "The name of the manufacturing company." }
      },
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
  const ai = getAiClient(); // Lazily get the client instance
  try {
    const prompt = `
      You are an extremely fast and efficient pharmacy assistant. A user is looking for alternatives to the medicine "${medicineName}".

      Your task is to:
      1.  First, identify the primary salt, dosage, and manufacturing company of "${medicineName}". Populate this information in the \`searchedMedicine\` object. If "${medicineName}" is not a valid or known medicine, set \`searchedMedicine\` to null.
      2.  Then, find and categorize alternatives based on the following rules, including the manufacturing company for each:
          - First Category: List medicines from POPULAR and well-known brands with the exact same primary salt and dosage. Title this category "Same Salt & Dosage (Popular Brands)".
          - Second Category: List medicines from OTHER or less common brands with the exact same primary salt and dosage. Title this category "Same Salt & Dosage (Other Brands)".
          - Third Category: List medicines with the same primary salt but DIFFERENT dosages. Title this category "Same Salt (Different Dosages)".

      Provide the output in the specified JSON format. If no alternatives are found, the \`categories\` array can be empty or have categories with empty \`medicines\` arrays, but the \`searchedMedicine\` object should still be populated if the original medicine was identified. Do not invent information. Base your results on publicly available data. Be quick and precise.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 0 }, // For faster responses
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    // Validate the parsed structure
    if (parsedResponse && Array.isArray(parsedResponse.categories) && ('searchedMedicine' in parsedResponse)) {
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