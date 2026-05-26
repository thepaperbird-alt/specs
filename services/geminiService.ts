
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { DesignAnalysis, ReferenceExample } from "../types";

const SYSTEM_INSTRUCTION = `
You are "Design Analyzer", an expert graphic design mentor and UI/UX critic.
Your job is to analyze graphic design images and provide clear, concise, practical suggestions.

CRITICAL TONE INSTRUCTIONS:
1. IF THE DESIGN IS GENERIC/TEMPLATE-LIKE: Be very frank and straightforward. Do not sugarcoat. Explicitly state if it looks boring, cookie-cutter, or lacks soul.
2. IF THE DESIGN IS GOOD: Be technical and appreciative.
3. GENERAL: Focus on teaching. Assume the user is a beginner to intermediate designer.

If the image is NOT a graphic design layout (e.g., random selfie, landscape), state this clearly in the summary and ask for a proper design.

Analyze based on:
1. LEGIBILITY & READABILITY
2. TYPOGRAPHY
3. LAYOUT & HIERARCHY
4. BALANCE, CONTRAST & COLOR
5. STYLE, VISUAL STORY & ORIGINALITY
   * Actively look for and appreciate if the design uses specific trends like:
     - Brutalism / Neo-brutalism
     - Neo-minimalism / Minimal-maximalism
     - 3D + motion-driven / Interactive / Immersive
     - Handcrafted / Handmade / Naive design
     - Mixed-media collage / Scrapbook style
     - Retro-inspired futurism / Retro psychedelia
     - Cartoon-inspired / Maximalist illustration
     - Texture-heavy (grain, noise)
     - Deconstructed / Chaotic layouts / Broken design
     - Split-personality branding
     - Blueprint / Schematic aesthetic
     - Infographic-first / Object-centric
     - Saturated organic / Cinematism / Microtype
6. HARMONY OF ELEMENTS
7. MODERNITY & CURRENT TRENDS
8. ACTIONABLE SUGGESTIONS (5-10 specific items)

Tone: Technical, accessible, but strictly honest about generic work.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    overall_summary: { type: Type.STRING },
    legibility: {
      type: Type.OBJECT,
      properties: {
        notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        priority: { type: Type.STRING, enum: ["low", "medium", "high"] }
      },
      required: ["notes", "priority"]
    },
    typography: {
      type: Type.OBJECT,
      properties: {
        notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        priority: { type: Type.STRING, enum: ["low", "medium", "high"] }
      },
      required: ["notes", "priority"]
    },
    layout_and_hierarchy: {
      type: Type.OBJECT,
      properties: {
        notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        priority: { type: Type.STRING, enum: ["low", "medium", "high"] }
      },
      required: ["notes", "priority"]
    },
    balance_contrast_color: {
      type: Type.OBJECT,
      properties: {
        notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        priority: { type: Type.STRING, enum: ["low", "medium", "high"] }
      },
      required: ["notes", "priority"]
    },
    style_and_story: {
      type: Type.OBJECT,
      properties: {
        notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        priority: { type: Type.STRING, enum: ["low", "medium", "high"] }
      },
      required: ["notes", "priority"]
    },
    harmony: {
      type: Type.OBJECT,
      properties: {
        notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        priority: { type: Type.STRING, enum: ["low", "medium", "high"] }
      },
      required: ["notes", "priority"]
    },
    modernity_and_trends: {
      type: Type.OBJECT,
      properties: {
        notes: { type: Type.ARRAY, items: { type: Type.STRING } },
        priority: { type: Type.STRING, enum: ["low", "medium", "high"] }
      },
      required: ["notes", "priority"]
    },
    actionable_suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: [
    "overall_summary",
    "legibility",
    "typography",
    "layout_and_hierarchy",
    "balance_contrast_color",
    "style_and_story",
    "harmony",
    "modernity_and_trends",
    "actionable_suggestions"
  ]
};

export async function analyzeImage(base64Image: string, references: ReferenceExample[] = []): Promise<DesignAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  try {
    const parts: any[] = [];

    // 1. Inject Training/Reference Data if available
    if (references.length > 0) {
      parts.push({ 
        text: "CONTEXT: The user has provided the following reference images to establish a baseline for 'Good' and 'Bad' design. Use these examples to calibrate your critique standards for the final image." 
      });

      for (const ref of references) {
        parts.push({
          inlineData: {
            mimeType: "image/png",
            data: ref.base64
          }
        });
        parts.push({
          text: `REFERENCE TYPE: ${ref.type.toUpperCase()} DESIGN.\nUser Notes: ${ref.notes || "No specific notes."}\n(Use this as a ${ref.type} benchmark).`
        });
      }

      parts.push({ 
        text: "INSTRUCTION: Now, analyze the TARGET IMAGE below. Compare it against the standards established by the reference images above where applicable." 
      });
    } else {
      parts.push({ 
        text: "Analyze this design based on the system instructions. Provide specific, critical, but constructive feedback." 
      });
    }

    // 2. Add the Target Image
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Image
      }
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.5,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    return JSON.parse(text) as DesignAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
