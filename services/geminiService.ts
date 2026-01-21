
import { GoogleGenAI, Type } from "@google/genai";
import { AnalyticInsights } from "../types";

export async function fetchAnalyticInsights(query: string): Promise<AnalyticInsights> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a Senior Earth Observation and Environmental Intelligence Analyst. 
    Task: Provide a high-fidelity intelligence report for the query: "${query}".
    
    Context: Use the "TerraFusion" system which integrates multi-spectral satellite data with real-time ground truth.
    
    Requirements:
    1. Realistic regional environmental analysis.
    2. CURRENT WEATHER: temperature, condition, humidity, and wind speed.
    3. AIR PURITY: Air Quality Index (AQI), dominant pollutant, and a brief description of air safety.
    4. Assessment of environmental threat/risk level (Low/Medium/High).
    5. Use Google Search to find current REAL-TIME ground truth for the specific location mentioned or implied.
    
    Output must be JSON as per the schema. Be concise and data-driven.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          region: { type: Type.STRING, description: "Specific geographic area name" },
          threatLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          summary: { type: Type.STRING, description: "Professional executive summary focusing on environmental state" },
          weather: {
            type: Type.OBJECT,
            properties: {
              temp: { type: Type.STRING, description: "e.g. 24°C" },
              condition: { type: Type.STRING, description: "e.g. Partly Cloudy" },
              humidity: { type: Type.STRING, description: "e.g. 65%" },
              windSpeed: { type: Type.STRING, description: "e.g. 12 km/h" }
            },
            required: ["temp", "condition", "humidity", "windSpeed"]
          },
          airQuality: {
            type: Type.OBJECT,
            properties: {
              aqi: { type: Type.NUMBER, description: "AQI value (0-500)" },
              dominantPollutant: { type: Type.STRING, description: "e.g. PM2.5" },
              description: { type: Type.STRING, description: "e.g. Moderate" }
            },
            required: ["aqi", "dominantPollutant", "description"]
          },
          keyMetrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Metric name e.g., Vegetation Health" },
                value: { type: Type.STRING, description: "Specific value" },
                trend: { type: Type.STRING, enum: ['up', 'down', 'stable'] }
              }
            }
          }
        },
        required: ["region", "threatLevel", "summary", "weather", "airQuality", "keyMetrics"]
      }
    }
  });

  const text = response.text || "{}";
  let parsed: any = {};
  
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    console.error("Gemini JSON parse failed:", error);
    parsed = {
      region: "Environmental Sector",
      threatLevel: "Low",
      summary: "Data synthesis incomplete. Please re-run specific location scan.",
      keyMetrics: []
    };
  }
  
  const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => chunk.web?.uri)
    .filter(Boolean) || [];

  return {
    region: parsed.region || "Target Zone",
    threatLevel: parsed.threatLevel || "Low",
    summary: parsed.summary || "",
    weather: parsed.weather,
    airQuality: parsed.airQuality,
    keyMetrics: parsed.keyMetrics || [],
    groundingSources
  };
}
