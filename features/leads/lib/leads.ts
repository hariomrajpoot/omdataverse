import { leadSchema, sanitizeLead } from "@/lib/validations";
import { sendLead } from "@/features/shared/lib/email/sendLead";
import { saveLead } from "@/features/leads/lib/repository";

export interface LeadData {
  name: string;
  email: string;
  company: string;
  service?: string;
  message?: string;
  source?: string;
}

export class LeadService {
  async createLead(leadData: LeadData) {
    // Validate the lead data
    const validatedData = leadSchema.parse(leadData);
    const sanitizedData = sanitizeLead(validatedData);

    // Persist to our database
    const savedLead = await saveLead(sanitizedData);

    // Send notification email
    try {
      await sendLead(sanitizedData);
    } catch (emailError) {
      console.error("Failed to send lead notification email:", emailError);
      // Don't fail the request if email fails
    }

    return savedLead;
  }
}

export const leadService = new LeadService();