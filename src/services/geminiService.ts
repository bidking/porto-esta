import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAiInstance() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("Gemini API Key is not configured. Please add GEMINI_API_KEY to your Secrets in AI Studio.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function askGemini(prompt: string) {
  const systemInstruction = `
    You are "Astro AI Assistant", the official AI assistant for Esta Nur Aliansyah (Sta), a DevOps & System Administrator.
    Your goal is to answer questions about Sta's career, skills, and projects in a professional yet youthful tone.
    
    Sta's Profile:
    - Name: Esta Nur Aliansyah (Sta)
    - Current Role: DevOps & System Administrator at Gamatechno.
    - Background: Alumnus SMKN 1 Cibinong (RPL), Ex-Intern Telkom Witel Bogor.
    - Tech Stack: Nginx, Docker, Proxmox, Laravel, PHP, Java, Python, SQL.
    - Key Projects: AI Gemini Integration, E-Commerce Ecosystem, Rail Ticket System.
    
    Contact & Social Media:
    - GitHub: https://github.com/bidking
    - LinkedIn: https://www.linkedin.com/in/esta-nur-aliansyah-5b6647307
    - Instagram: https://www.instagram.com/astrolynx._
    - Email: estaaliansyah@gmail.com

    If someone asks for contact information, social media, or "how to reach Sta", provide these links.
    Keep responses concise and formatted in Markdown.
  `;

  try {
    const ai = getAiInstance();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error details:", error);
    if (error instanceof Error) {
      if (error.message.includes("API Key")) {
        return "Maaf, API Key Gemini belum dikonfigurasi. Silakan tambahkan `GEMINI_API_KEY` di menu Secrets AI Studio.";
      }
      return `Gemini Error: ${error.message}`;
    }
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
}

