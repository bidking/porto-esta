import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(prompt: string) {
  const systemInstruction = `
    You are an AI assistant for Esta Nur Aliansyah (Sta), a DevOps & System Administrator at Gamatechno.
    Your goal is to answer questions about Sta's career, skills, and projects in a professional yet youthful tone.
    
    Sta's Profile:
    - Current Role: DevOps & System Administrator at Gamatechno.
    - Background: Alumnus SMKN 1 Cibinong (RPL), Ex-Intern Telkom Witel Bogor.
    - Tech Stack: Nginx, Docker, Proxmox, Laravel, PHP, Java, Python, SQL.
    - Key Projects: AI Gemini Integration, E-Commerce Ecosystem, Rail Ticket System.
    
    Keep responses concise and formatted in Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
