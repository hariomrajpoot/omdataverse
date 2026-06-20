# Backend Setup — Database & Authentication

This project uses a **self-hosted backend**: PostgreSQL via **Prisma ORM**, with
a custom **hybrid JWT + database-session** authentication system and
**role-based access control** (ADMIN / CLIENT). Sanity.io has been fully removed.

## Prerequisites

- Node.js 18+
- A PostgreSQL database (local, Neon, Supabase, RDS, etc.)

## Step 1 — Environment variables

Copy the template and fill in your values:

```bash
cp .env.example .env
```

| Variable                     | Required | Notes                                                        |
| ---------------------------- | -------- | ------------------------------------------------------------ |
| `DATABASE_URL`               | ✅       | PostgreSQL connection string                                 |
| `JWT_ACCESS_SECRET`          | ✅       | Long random string used to sign access-token JWTs            |
| `ACCESS_TOKEN_TTL_SECONDS`   | –        | Access-token lifetime (default `900` = 15 min)               |
| `REFRESH_TOKEN_TTL_SECONDS`  | –        | Refresh-token lifetime (default `2592000` = 30 days)         |
| `RESEND_API_KEY`, `LEAD_NOTIFY_TO` | –  | Lead/contact email notifications (unchanged)                 |

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Step 2 — Create the database schema

```bash
npx prisma migrate dev --name init   # creates tables + a migration history
# or, for a quick non-versioned sync:
# npx prisma db push
```

This creates the `User`, `Profile`, `Session`, `Lead`, and `Contact` tables.

## Step 3 — Run

```bash
npm run dev
```

- Visit `/register` — **the first account created automatically becomes ADMIN**;
  every subsequent account is a CLIENT.
- ADMIN users land in `/admin` (dashboard, leads, users).
- CLIENT users land in `/account` (profile settings).

Inspect data anytime with `npm run db:studio`.

## Architecture

### Authentication (hybrid)

- **Access token** — short-lived JWT (`jose`, HS256) in an HTTP-only cookie,
  carrying `{ sub, role, sid }`.
- **Refresh token** — opaque random string in an HTTP-only cookie; only its
  SHA-256 hash is stored in the `Session` table, so a DB leak exposes no usable
  tokens. Revoking a `Session` row kills the session server-side.
- `GET /api/auth/me` is **self-healing**: if the access token has expired but the
  refresh token is still valid, it rotates the session and re-issues cookies.
- The client `AuthProvider` runs a silent-refresh timer (every 10 min) so access
  tokens stay fresh ahead of the 15-min expiry.

### Auth API

| Route                  | Method    | Purpose                                  |
| ---------------------- | --------- | ---------------------------------------- |
| `/api/auth/register`   | POST      | Create account (bcrypt hash) + session   |
| `/api/auth/login`      | POST      | Verify credentials, issue tokens         |
| `/api/auth/logout`     | POST      | Revoke session, clear cookies            |
| `/api/auth/me`         | GET       | Persistent session check (self-healing)  |
| `/api/auth/refresh`    | POST      | Rotate refresh token, mint access token  |
| `/api/profile`         | GET/PATCH | Read/update the current user's profile   |

### RBAC & route protection

- **`proxy.ts`** (Next 16's renamed middleware) guards `/admin/*` and `/account/*`
  at the edge using the access-token JWT — fast, coarse gating.
- **`requireUser()` / `requireRole()`** in `lib/auth/current-user.ts` re-check on
  the server inside layouts (defense in depth).
- Admin API routes (`/api/leads/*`) verify `role === "ADMIN"` server-side.

### Layouts (route groups)

```
app/
  layout.tsx          # root shell: <html>/<body>, theme, AuthProvider
  (site)/             # public marketing site — navbar + footer chrome
  (auth)/             # login / register — centered card
  account/            # CLIENT area — navbar + profile settings (auth required)
  admin/              # ADMIN area — sidebar dashboard (ADMIN required)
```

### Key files

```
prisma/schema.prisma              # User, Profile, Session, Lead, Contact + enums
lib/prisma.ts                     # PrismaClient singleton
lib/auth/                         # jwt, password, session, cookies, current-user, constants
lib/validations/auth.ts           # zod schemas for register/login/profile
proxy.ts                          # edge RBAC guard
components/auth/AuthProvider.tsx  # client session context + silent refresh
features/leads/lib/repository.ts  # Prisma-backed lead/contact persistence
```


