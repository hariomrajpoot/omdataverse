import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LenisProvider } from "@/components/layout/LenisProvider";
import { ChatWidget } from "@/components/chatbot/ChatWidget";

// Public marketing site layout: standard navbar + footer + smooth-scroll +
// floating AI chat. This is the "client-facing" chrome.
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <LenisProvider>
        <main id="main" className="flex-1">
          {children}
        </main>
      </LenisProvider>
      <Footer />
      <ChatWidget />
    </div>
  );
}
