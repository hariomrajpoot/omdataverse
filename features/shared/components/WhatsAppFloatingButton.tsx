"use client";

import { Phone } from "lucide-react";

// this component renders a fixed-position WhatsApp chat button.  the
// phone number is read from NEXT_PUBLIC_WHATSAPP_NUMBER which should be
// supplied in the environment (omit country prefix separators: e.g.
// `15551234567`).
export function WhatsAppFloatingButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919754799646";
  // we supply a very short default message; when the form redirect
  // happens the text will be customized on the fly.
  const defaultText = "Hi, I’d like to chat about a data project.";
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(defaultText)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-colors"
    >
      <Phone className="h-6 w-6" />
      <span className="sr-only">Chat on WhatsApp</span>
    </a>
  );
}
