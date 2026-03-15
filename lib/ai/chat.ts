import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are an AI assistant for OmDataverse, an AI consulting company that helps businesses build enterprise data platforms using Microsoft Fabric, Azure, Databricks, and modern AI technologies.

Your role is to:
- Help visitors understand our AI consulting services
- Explain how we can help with data platform architecture
- Guide users toward booking demos or consultations
- Answer questions about our services, case studies, and offerings
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

If a user expresses interest in our services, suggest they book a demo or contact us for a consultation.

Keep your responses engaging and use emojis where appropriate to make conversations more friendly.`;

export class ChatService {
  private ai: GoogleGenAI;
  // gemini-3.1-pro-preview is the current string for the latest 3.1 Pro model
  private modelId: string = "gemini-1.5-pro"; // Update this to the latest model as needed

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    // Initialize the new GoogleGenAI client
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateResponse(message: string): Promise<string> {
    try {
      // Call generateContent using the new SDK syntax
      const response = await this.ai.models.generateContent({
        model: this.modelId,
        contents: message,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          // You can also add things like temperature here if needed:
          // temperature: 0.7, 
        }
      });
      
      // Note: In the new SDK, 'text' is a property, not a method
      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new Error("Failed to generate AI response");
    }
  }
}

export const chatService = new ChatService();