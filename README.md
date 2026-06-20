# OmDataverse - AI Consulting Website

## Project Overview

This is a modern, enterprise-ready AI consulting website built with Next.js 16. It showcases services for building data platforms using Microsoft Cloud technologies like Fabric, Azure, and Databricks. The site includes a contact form, case studies, services pages, and a self-hosted backend (PostgreSQL via Prisma) with custom authentication and role-based access control. See [SETUP.md](SETUP.md) for backend setup.

**New Features Added:**
- **Lead Management System**: Complete lead capture, demo booking, and admin dashboard
- **AI Chatbot**: Google Gemini-powered assistant for visitor engagement and lead conversion
- **Demo Booking Page**: `/book-demo` for scheduling personalized demos
- **Admin Dashboard**: `/admin/leads` for managing leads and tracking conversions
- **Email Notifications**: Automated email notifications for new leads using Resend

As a beginner-friendly project, this README will explain how everything works step by step, including Next.js fundamentals, component usage, and API calls.

## Lead Management System

The project now includes a complete lead management and demo booking system:

### Features
- **Contact Form**: Enhanced with phone, service selection, and lead tracking
- **Demo Booking**: Dedicated page for scheduling personalized demos
- **Admin Dashboard**: Lead management interface with filtering and status updates
- **Email Notifications**: Automated emails for new leads using Resend
- **Lead Pipeline**: Track leads through stages (New → Contacted → Demo Scheduled → Proposal Sent → Converted/Lost)

### API Endpoints
- `POST /api/leads` - Create new leads (contact or demo)
- `GET /api/leads/list` - Retrieve all leads (admin only)
- `PATCH /api/leads/update` - Update lead status (admin only)

### Database Schema
Leads are stored in our PostgreSQL database via Prisma (`Lead` model) with the following fields:
- Basic info: name, email, phone, company
- Service interest and message
- Type: contact, demo, or chatbot
- Status: new, contacted, demo_scheduled, proposal_sent, converted, lost
- Demo details: date, time, use case (for demo leads)

### Environment Variables
Add these to your `.env` (see [.env.example](.env.example) and [SETUP.md](SETUP.md)):
```
DATABASE_URL=postgresql://user:pass@localhost:5432/omdataverse?schema=public
JWT_ACCESS_SECRET=your_long_random_secret
RESEND_API_KEY=your_resend_key
CONTACT_EMAIL=hello@example.com
```

### Email Setup
Configure Resend for automated lead notifications

## AI Chatbot

The website now includes a modern AI chatbot powered by Google Gemini Pro that helps engage visitors and convert them into leads.

### Features
- **Floating Chat Widget**: Appears on all pages in the bottom-right corner
- **Google Gemini Integration**: AI-powered responses about OmDataverse services
- **Lead Capture**: Automatically collects contact information when users show interest
- **Quick Suggestions**: Pre-built action buttons for common inquiries
- **Modern UI**: Glassmorphism design with smooth animations
- **Mobile Responsive**: Works perfectly on all devices

### Chatbot Capabilities
- Answer questions about AI consulting services
- Explain data platform architecture and technologies
- Guide users toward booking demos or consultations
- Provide information about Microsoft Fabric, Azure, Databricks
- Capture leads automatically when users express interest

### API Integration
- **Endpoint**: `POST /api/chat` - Handles chat messages and Gemini API calls
- **AI Model**: Google Gemini Pro for intelligent responses
- **System Prompt**: Configured with OmDataverse service information

### Components
- `ChatWidget.tsx` - Floating button and main container
- `ChatWindow.tsx` - Chat interface with messages and lead capture
- `ChatMessage.tsx` - Individual message rendering with markdown support
- `ChatInput.tsx` - Input field with quick suggestions

### Quick Actions
The chatbot includes these quick suggestion buttons:
- "Book a Demo"
- "AI Consulting Services"
- "Data Platform Architecture"
- "Pricing & Consultation"
- "Talk to an Expert"

### Lead Integration
When users express interest in services, demos, or consultations, the chatbot automatically:
1. Displays a lead capture form within the chat
2. Collects name, email, and company information
3. Submits the lead to the existing `/api/leads` endpoint
4. Stores the lead in the database with type "chatbot"
5. Sends confirmation and follow-up information

### Setup Requirements
1. **Google AI API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Environment Variable**: Add `GOOGLE_AI_API_KEY=your_key_here` to `.env.local`
3. **Dependencies**: `@google/generative-ai` and `react-markdown` are already installed

The chatbot enhances user engagement and significantly improves lead conversion rates by providing instant, intelligent responses and seamless lead capture.

## How Next.js Works in This Project

Next.js is a React framework that makes building web applications easier. Here's how it works here:

### 1. App Router
This project uses Next.js 16's **App Router** (in the `app/` directory). Unlike the older Pages Router, App Router uses:
- `layout.tsx` - Shared layout for all pages
- `page.tsx` - Individual page components
- `route.ts` - API endpoints

### 2. File-Based Routing
- `app/page.tsx` → Home page (`/`)
- `app/about/page.tsx` → About page (`/about`)
- `app/contact/page.tsx` → Contact page (`/contact`)
- `app/api/contact/route.ts` → API endpoint (`/api/contact`)

### 3. Server Components vs Client Components
- **Server Components** (default): Run on the server, can fetch data directly
- **Client Components**: Use `"use client"` directive, run in browser

### 4. Data Fetching
- Server components can use `async/await` to fetch data
- Marketing content ships from local data (`lib/mockData.ts`); dynamic business data (users, leads) lives in PostgreSQL via Prisma

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root shell (<html>/<body>, theme, AuthProvider)
│   ├── (site)/            # Public marketing site (navbar + footer chrome)
│   ├── (auth)/            # Login / register
│   ├── account/           # CLIENT area (profile settings, auth required)
│   ├── admin/             # ADMIN area (sidebar dashboard, ADMIN required)
│   └── api/               # API routes (auth, profile, leads, contact, chat)
├── components/            # Reusable UI components
│   ├── auth/             # AuthProvider, AuthNav
│   ├── admin/            # Admin sidebar
│   └── ...
├── features/             # Feature-based organization
│   ├── shared/           # Shared components & utilities
│   ├── leads/            # Lead service + Prisma repository
│   └── contact/          # Contact feature
├── lib/                  # Utility libraries
│   ├── auth/             # jwt, password, sessions, cookies, current-user
│   ├── prisma.ts         # PrismaClient singleton
│   └── validations/      # Zod schemas
├── prisma/               # schema.prisma (User, Profile, Session, Lead, Contact)
├── proxy.ts              # Edge RBAC guard (Next 16 middleware)
└── public/               # Static assets
```

## How Components Work

Components are reusable pieces of UI. Here's how they're used:

### 1. Importing Components
```tsx
import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
```

The `@/` is an alias for the project root (configured in `tsconfig.json`).

### 2. Using Components in Pages
In `app/page.tsx`:
```tsx
export default async function Home() {
  // Marketing content ships from local data
  const services = mockServices;

  return (
    <div>
      <Hero title="..." subtitle="..." primaryCta={...} />
      <ServicesGrid services={services} />
    </div>
  );
}
```

### 3. Component Props
Components receive data via props:
```tsx
interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
}

export function Hero({ title, subtitle, primaryCta }: HeroProps) {
  return (
    <h1>{title}</h1>
    <p>{subtitle}</p>
    <Link href={primaryCta.href}>{primaryCta.label}</Link>
  );
}
```

### 4. Client Components
Some components need browser features (like event handlers):
```tsx
"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </form>
  );
}
```

## How APIs Work

APIs in Next.js are defined in `app/api/` directory.

### 1. API Route Structure
`app/api/contact/route.ts` defines the `/api/contact` endpoint.

### 2. HTTP Methods
```tsx
export async function POST(req: Request) {
  // Handle POST requests to /api/contact
}

export async function OPTIONS() {
  // Handle CORS preflight requests
}
```

### 3. Calling APIs from Components
From a client component:
```tsx
"use client";

async function submitForm(data) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  // Handle response
}
```

### 4. API Flow for Contact Form
1. User fills contact form
2. Form submits to `/api/contact`
3. API validates data with Zod schema
4. Persists to PostgreSQL via Prisma
5. Sends email via Resend
6. Returns success/error response

## Setup and Installation

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` (see [.env.example](.env.example)):
```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:pass@localhost:5432/omdataverse?schema=public

# Auth
JWT_ACCESS_SECRET=your_long_random_secret

# Email (Resend)
RESEND_API_KEY=your_resend_key

# Optional
NEXT_PUBLIC_PLAUSIBLE=your_domain

# optionally provide a WhatsApp number to enable chat features
NEXT_PUBLIC_WHATSAPP_NUMBER=919754799646  # your WhatsApp number in international format (country code + number, no plus or separators)

# use free endpoints only
# the contact form will redirect to WhatsApp via wa.me, which is a free service.
# the backend email send uses whatever SMTP/Resend provider you configure;
# no paid API is required – omit RESEND_API_KEY/SMTP_URL to skip email entirely.
```

### 3. Database Setup
```bash
npx prisma migrate dev --name init   # create tables
npm run db:studio                     # (optional) inspect data
```
The first account registered at `/register` automatically becomes ADMIN.

## Running the Project

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

### Testing
```bash
npm test
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

## Key Features Explained

### 1. Authentication & RBAC
- Hybrid JWT access tokens + DB-backed refresh sessions (HTTP-only cookies)
- bcrypt password hashing; roles ADMIN and CLIENT
- Edge `proxy.ts` guard + server-side `requireRole()` (defense in depth)

### 2. Contact Form
- Client-side validation with Zod
- Rate limiting to prevent spam
- Persists to PostgreSQL via Prisma + sends email
- CORS enabled for cross-origin requests

### 3. Responsive Design
- Mobile-first with Tailwind CSS
- Dark mode support
- Accessible components

### 4. SEO & Performance
- Server-side rendering
- Optimized fonts
- Open Graph meta tags
- Sitemap generation

### 5. Type Safety
- Full TypeScript coverage
- Zod schemas for API validation
- Strict type checking

## Learning Next.js Concepts

### Server vs Client Components
- **Server**: Data fetching, no interactivity
- **Client**: Event handlers, state management

### Routing
- File-based: `app/page.tsx` = `/`
- Dynamic: `app/case-studies/[slug]/page.tsx` = `/case-studies/my-case`

### Data Fetching
- Server components: Direct database/API calls
- Client components: `useEffect` + `fetch`

### Styling
- Tailwind utility classes
- CSS variables for theming
- Responsive design with `sm:`, `lg:` prefixes

## Next Steps for Beginners

1. **Read the code**: Start with `app/page.tsx` and `components/Hero.tsx`
2. **Try modifying**: Change text in Hero component
3. **Add a page**: Create `app/test/page.tsx`
4. **Build a component**: Add a new reusable component
5. **Learn React**: Focus on hooks, props, state
6. **Explore APIs**: Look at contact form submission

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests: `npm test`
5. Submit pull request

## Deployment

Deploy to Vercel, Netlify, or any Node.js hosting:
```bash
npm run build
```

The app is production-ready with optimized builds, static generation, and CDN-ready assets.
