
import { GoogleGenAI, Type } from "@google/genai";
import { ActionPlan } from "../types";

// Inicialización siguiendo estrictamente las guías: uso exclusivo de process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePlanFromBoard = async (boardUrl: string): Promise<ActionPlan> => {
  const prompt = `
    Analyze this Pinterest board URL: "${boardUrl}". 
    Based on the words in the URL and common aesthetic trends, imagine what kind of life inspiration this board represents (e.g., fitness, home decor, mindfulness, productivity, fashion).
    
    Create a detailed "Life Action Plan" that turns this visual inspiration into real-world reality.
    Be encouraging, "bestie-like", and actionable.
    
    The response must be in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          goal: { 
            type: Type.STRING, 
            description: "A catchy, motivating summary of the detected goal." 
          },
          weeklyPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                actions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["day", "actions"]
            }
          },
          firstSteps: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "3-5 very small, immediate actions." 
          },
          suggestedHabits: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "2-3 long-term habits." 
          }
        },
        required: ["goal", "weeklyPlan", "firstSteps", "suggestedHabits"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  try {
    return JSON.parse(text) as ActionPlan;
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("Invalid AI response format");
  }
};
