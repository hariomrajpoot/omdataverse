import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/features/shared/components/Navbar";
import { Footer } from "@/features/shared/components/Footer";
import { siteConfig } from "@/features/shared/lib/site";
import { DebugHydrationProbe } from "@/features/shared/components/DebugHydrationProbe";
import { WhatsAppFloatingButton } from "@/features/shared/components/WhatsAppFloatingButton";
import { LenisProvider } from "@/components/LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Open Graph`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "development" ? (
          // #region agent log
          <script
            dangerouslySetInnerHTML={{
              __html: `
(() => {
  try {
    const orig = console.error;
    console.error = (...args) => {
      try {
        const msg = args && args.length ? String(args[0]) : "";
        fetch('http://127.0.0.1:7330/ingest/c0c88dee-b2fb-41bc-b468-aec6c2f47154',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dca985'},body:JSON.stringify({sessionId:'dca985',runId:'pre-fix',hypothesisId:'H2',location:'app/layout.tsx:head-console-error-hook',message:'console.error observed',data:{firstArg:msg},timestamp:Date.now()})}).catch(()=>{});
      } catch {}
      orig(...args);
    };
  } catch {}
})();`,
            }}
          />
          // #endregion
        ) : null}
        <script
          // Set theme before paint to avoid white-on-white flash.
          dangerouslySetInnerHTML={{
            __html: `
(() => {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch {}
})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}
      >
        {process.env.NODE_ENV === "development" ? <DebugHydrationProbe /> : null}
        {process.env.NEXT_PUBLIC_PLAUSIBLE ? (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE}
            src="https://plausible.io/js/script.js"
          />
        ) : null}
        <div className="flex min-h-dvh flex-col">
          <Navbar />
          <LenisProvider>
            <main id="main" className="flex-1">
              {children}
            </main>
          </LenisProvider>
          <Footer />
          {/* floating chat button is rendered globally; the link is configured via env */}
          <WhatsAppFloatingButton />
        </div>
      </body>
    </html>
  );
}
