
import { GoogleGenAI, Type } from "@google/genai";
import { AnalyticInsights } from "../types";

export async function fetchAnalyticInsights(query: string): Promise<AnalyticInsights> {
  // Initialize AI client right before use to ensure most up-to-date configuration
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    // Upgraded to pro model for complex Earth Observation Analysis tasks
    model: 'gemini-3-pro-preview',
    contents: `Act as a Senior Earth Observation Analyst. 
    Task: Provide a high-fidelity intelligence report for the query: "${query}".
    
    Context: Use the "TerraFusion" system which integrates Sentinel-1/2 (ESA), Landsat-8/9 (NASA), and Cartosat-3/Resourcesat-2 (ISRO) data.
    
    Requirements:
    1. Realistic regional analysis.
    2. Quantifiable metrics (e.g., NDVI index, building density, water levels, deforestation rates).
    3. Assessment of threat/risk level (Low/Medium/High).
    4. Trends (up/down/stable).
    5. Use Google Search to find current real-world ground truth (e.g., specific recent floods, new urban developments, current climate policies).
    
    Output must be JSON as per the schema. Be concise and professional.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          region: { type: Type.STRING, description: "Specific geographic area name" },
          threatLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          summary: { type: Type.STRING, description: "Professional 2-3 sentence executive summary" },
          keyMetrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Metric name e.g., Vegetation Health Index" },
                value: { type: Type.STRING, description: "Specific value e.g., 0.82 or 14% increase" },
                trend: { type: Type.STRING, enum: ['up', 'down', 'stable'] }
              }
            }
          }
        },
        required: ["region", "threatLevel", "summary", "keyMetrics"]
      }
    }
  });

  // Extract text from response (property access, no parentheses)
  const text = response.text || "{}";
  const parsed = JSON.parse(text);
  
  // Extract grounding citations from googleSearch tool output
  const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => chunk.web?.uri)
    .filter(Boolean) || [];

  return {
    ...parsed,
    groundingSources
  };
}
