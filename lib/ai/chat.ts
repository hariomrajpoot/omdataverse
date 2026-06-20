import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are an AI assistant for Omansai, an AI consulting company that helps businesses build enterprise data platforms using Microsoft Fabric, Azure, Databricks, and modern AI technologies.

Your role is to:
- Help visitors understand our AI consulting services
- Explain how we can help with data platform architecture
- Guide users toward booking demos or consultations
- Answer questions about our services, case studies, trainings, and offerings
- Be friendly, professional, and helpful
- Keep responses concise but informative
- If someone asks about pricing, demos, or consultations, encourage them to provide their contact information

Key services we offer:
- Enterprise Data Platform Architecture
- AI Analytics and Machine Learning Solutions
- Microsoft Fabric Implementation
- Azure Cloud Solutions
- Databricks Lakehouse Architecture
- Custom AI Development
- Data Governance and Security
- Hands-on trainings & workshops (Power BI, Databricks)

If a user expresses interest in our services, suggest they book a demo or contact us for a consultation.

Keep your responses engaging and use emojis where appropriate to make conversations more friendly.`;

const FALLBACK =
  "Thanks for reaching out! Our live assistant isn't configured just yet, but I'd love to help. You can book a demo or contact our team and we'll get right back to you. 🙌";

// Provider-flexible chat service. Prefers OpenRouter (set OPENROUTER_API_KEY),
// falls back to Google Gemini (GOOGLE_AI_API_KEY), and degrades gracefully to a
// friendly message when neither is configured (so the widget never errors out).
export class ChatService {
  async generateResponse(message: string): Promise<string> {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const googleKey = process.env.GOOGLE_AI_API_KEY;

    if (openRouterKey) {
      return this.viaOpenRouter(message, openRouterKey);
    }
    if (googleKey) {
      return this.viaGemini(message, googleKey);
    }
    return FALLBACK;
  }

  private async viaOpenRouter(message: string, apiKey: string): Promise<string> {
    const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Optional attribution headers recommended by OpenRouter:
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Omansai Assistant",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`OpenRouter request failed (${res.status}): ${detail.slice(0, 200)}`);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
  }

  private async viaGemini(message: string, apiKey: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-1.5-pro",
      contents: message,
      config: { systemInstruction: SYSTEM_PROMPT },
    });
    return response.text || "Sorry, I couldn't generate a response.";
  }
}

export const chatService = new ChatService();
