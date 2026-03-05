# Contact Form Setup Guide

This guide walks you through setting up the contact form with email and database storage using Sanity CMS and Resend.

## Prerequisites

- Node.js 18+ installed
- Existing Sanity project (or create one at https://sanity.io)
- Resend account (or SMTP credentials)

## Step 1: Sanity Configuration

### 1.1 Get Your Sanity Credentials

1. Go to https://manage.sanity.io
2. Select your project
3. Navigate to **Settings → API**
4. Copy these values:
   - **Project ID** (under API Settings)
   - **Dataset name** (usually `production`)

### 1.2 Create API Tokens

1. Click **Tokens** in the API section
2. **Create new token** with these settings:
   - Name: "Contact Form Write Token"
   - Permissions: `Editor` (to write documents)
   - Copy the token value

3. (Optional) Create another token for reading:
   - Name: "Contact Form Read Token"
   - Permissions: `Viewer`

### 1.3 Create Contact Schema in Sanity Studio

In your Sanity project directory, create a new schema file:

**`schemas/contact.ts`** (or `.js`):

```typescript
export default {
  name: "contact",
  title: "Contact Submission",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: "company",
      title: "Company",
      type: "string",
    },
    {
      name: "message",
      title: "Message",
      type: "text",
      validation: (Rule) => Rule.required().min(20).max(2000),
    },
    {
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In Progress", value: "in-progress" },
          { title: "Resolved", value: "resolved" },
          { title: "Spam", value: "spam" },
        ],
      },
      initialValue: "new",
    },
    {
      name: "notes",
      title: "Internal Notes",
      type: "text",
    },
  ],
};
```

Then register it in **`sanity.config.ts`**:

```typescript
import contact from './schemas/contact'

export default defineConfig({
  // ... other config
  schema: {
    types: [schemaTypes, contact], // Add contact here
  },
})
```

Finally, deploy to your Sanity Studio:

```bash
sanity deploy
```

## Step 2: Environment Configuration

### 2.1 Copy Environment Template

```bash
cp .env.example .env.local
```

### 2.2 Fill in Your Credentials

Edit `.env.local` and add:

```env
# Sanity
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_WRITE_TOKEN=your_write_token_here

# Email (Choose one)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM=noreply@yourdomain.com

# Contact recipient
CONTACT_EMAIL=your-email@example.com
```

## Step 3: Set Up Resend (Email Service)

### 3.1 Create Resend Account

1. Go to https://resend.com
2. Sign up and verify your email
3. Add your domain (or use `resend.dev` for testing)

### 3.2 Get API Key

1. Navigate to **Settings → API Keys**
2. Click **Create API Key**
3. Copy the key and add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3.3 Verify Sender Email

1. Go to **Settings → Domains**
2. Add your domain and verify DNS records
3. Update `RESEND_FROM` in `.env.local`:

```env
RESEND_FROM=hello@yourdomain.com
```

## Step 4: Testing

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test Contact Form

1. Navigate to `http://localhost:3000/contact`
2. Fill out the form and submit
3. Check that:
   - Success message appears
   - Email is received at `CONTACT_EMAIL`
   - New "Contact" document appears in Sanity Studio under Content

### 4.3 Verify in Sanity

1. Go to your Sanity Studio
2. Select **Contact** from the sidebar
3. You should see new submissions with:
   - Name, email, company, message
   - Submission timestamp
   - Status field (default: "New")

## Step 5: Managing Submissions

You can now manage contact submissions directly in Sanity Studio:

- **View all submissions**: Click "Contact" in the sidebar
- **Change status**: Update the "Status" field (New → In Progress → Resolved)
- **Add notes**: Use the "Internal Notes" field to track responses
- **Search**: Use the search bar to find submissions by name or email

## Troubleshooting

### "Sanity write token not configured"

**Solution**: Add `SANITY_WRITE_TOKEN` to `.env.local`

```bash
SANITY_WRITE_TOKEN=your_write_token_here
```

### Email not sending

**Solution**: Check these steps:

1. Verify `RESEND_API_KEY` is set correctly
2. Ensure sender domain is verified in Resend
3. Check that `CONTACT_EMAIL` is valid
4. Review server logs for detailed error messages

### Documents not appearing in Sanity

**Solution**:
1. Verify `SANITY_WRITE_TOKEN` has "Editor" permissions
2. Confirm `SANITY_PROJECT_ID` and `SANITY_DATASET` match your project
3. Check that the "contact" schema is deployed to Sanity Studio
4. Try refreshing Sanity Studio in the browser

### Rate limit errors

**Solution**: The form is limited to 5 submissions per 10 minutes per IP address. This is intentional to prevent spam. Wait 10 minutes and try again.

## Alternative: Using SMTP Instead of Resend

If you prefer to use an existing email service via SMTP:

1. Get your SMTP credentials from your email provider
2. Add to `.env.local`:

```env
SMTP_URL=smtp://username:password@smtp.example.com:587
SMTP_FROM=hello@example.com
```

3. Remove or comment out `RESEND_API_KEY`

## Next Steps

- Monitor submissions in Sanity Studio
- Integrate with your internal systems (CRM, ticketing, etc.)
- Set up automations (e.g., auto-respond, webhook notifications)
- Review and respond to contacts regularly

---

For more help, check:
- [Sanity Documentation](https://www.sanity.io/docs)
- [Resend Documentation](https://resend.com/docs)
- [NextJS API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
