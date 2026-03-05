import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Let’s build your data future—today. Request a complimentary Microsoft data platform Strategy Audit and get a 48-hour acceleration roadmap.",
};

export default function ContactPage() {
  return (
    <div>
      <ContactForm
        heading="Let’s build your data future—today."
        subheading="Fill out this quick form for your complimentary Strategy Audit. We’ll review your stack and deliver a custom acceleration roadmap in 48 hours."
      />
    </div>
  );
}

