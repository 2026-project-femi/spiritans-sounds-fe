# Spiritans Sound — Setup & Integrations Reference

Complete reference for all technologies, third-party services, credentials, and environment variables required to run this project.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Environment Variables (.env)](#environment-variables)
3. [Service Setup Guides](#service-setup-guides)
   - [Sanity CMS](#1-sanity-cms)
   - [Paystack (Payments)](#2-paystack-payments)
   - [Resend (Email Sending)](#3-resend-email-sending)
   - [Zoho Mail (Email Receiving)](#4-zoho-mail-email-receiving)
   - [Upstash Redis (Webhook Deduplication)](#5-upstash-redis-webhook-deduplication)
4. [DNS Records](#dns-records)
5. [Project Structure](#project-structure)
6. [Frontend Libraries](#frontend-libraries)

---

## Tech Stack

| Layer           | Technology      | Version                        |
| --------------- | --------------- | ------------------------------ |
| Framework       | Next.js         | 16.1.1                         |
| Language        | TypeScript      | ^5                             |
| UI              | React           | 19.2.3                         |
| Styling         | Tailwind CSS    | ^4                             |
| CMS             | Sanity          | ^7.13.2                        |
| Payments        | Paystack        | (REST API)                     |
| Email Sending   | Resend          | ^6.9.4                         |
| Email Receiving | Zoho Mail       | (hosted inbox)                 |
| Caching         | Upstash Redis   | ^1.37.0                        |
| Email Templates | React Email     | ^2.0.4                         |
| UI Components   | Radix UI        | ^1.4.3                         |
| Carousel        | Embla Carousel  | ^8.6.0                         |
| Animations      | Framer Motion   | (via tw-animate-css)           |
| Icons           | Lucide React    | ^0.562.0                       |
| Fonts           | Google Fonts    | (Playfair Display, Montserrat) |
| Image CDN       | Sanity CDN      | cdn.sanity.io                  |
| Hosting         | (your platform) | —                              |

---

## Environment Variables

Copy the block below into your `.env` file and fill in every placeholder marked `YOUR_...`.

```env
# ─────────────────────────────────────────────────────────────────────────────
# SANITY CMS
# ─────────────────────────────────────────────────────────────────────────────
# Found at: sanity.io/manage → your project → Settings → API
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-05

# A read+write token — Sanity Studio → Settings → API → Tokens → Add token
SANITY_API_TOKEN=YOUR_SANITY_API_READ_WRITE_TOKEN

# ─────────────────────────────────────────────────────────────────────────────
# APP
# ─────────────────────────────────────────────────────────────────────────────
# Full URL of your deployed frontend (no trailing slash)
# Development: use ngrok or localhost — e.g. https://abc123.ngrok-free.app
# Production: https://spiritanssound.com
APP_URL=YOUR_APP_URL

# ─────────────────────────────────────────────────────────────────────────────
# PAYSTACK (Payments)
# ─────────────────────────────────────────────────────────────────────────────
# dashboard.paystack.com → Settings → API Keys & Webhooks
# Use sk_test_... during development, sk_live_... in production
PAYSTACK_SECRET_KEY=YOUR_PAYSTACK_SECRET_KEY

# Webhook secret — same page as above (used to verify webhook signatures)
PAYSTACK_WEBHOOK_SECRET=YOUR_PAYSTACK_WEBHOOK_SECRET

# ─────────────────────────────────────────────────────────────────────────────
# RESEND (Email Sending)
# ─────────────────────────────────────────────────────────────────────────────
# resend.com → API Keys → Create API Key
RESEND_API_KEY=YOUR_RESEND_API_KEY

# The "From" display name shown in all outbound emails
SMTP_FROM_NAME="Spiritans Sounds"

# The "From" address — must be from a domain verified in your Resend account
# e.g. noreply@spiritanssound.com
SMTP_FROM_EMAIL=YOUR_FROM_EMAIL_ADDRESS

# ─────────────────────────────────────────────────────────────────────────────
# ADMIN INBOX (Zoho Mail — receives all system notifications)
# ─────────────────────────────────────────────────────────────────────────────
# Contact form alerts, donation notifications, and failed charge alerts
# are all delivered TO this address.
ADMIN_EMAIL=YOUR_ZOHO_ADMIN_EMAIL_ADDRESS

# ─────────────────────────────────────────────────────────────────────────────
# NEWSLETTER CAMPAIGN SECURITY
# ─────────────────────────────────────────────────────────────────────────────
# A secret token that protects the /api/newsletter/send endpoint.
# Generate with: openssl rand -hex 32
# Must match SANITY_STUDIO_CAMPAIGN_SEND_SECRET in your Sanity Studio config.
CAMPAIGN_SEND_SECRET=YOUR_CAMPAIGN_SEND_SECRET_HEX_STRING

# The origin of your Sanity Studio (only this origin may call /api/newsletter/send)
# Development: http://localhost:3333
# Production: https://your-studio.sanity.studio
SANITY_STUDIO_ORIGIN=YOUR_SANITY_STUDIO_ORIGIN_URL

# ─────────────────────────────────────────────────────────────────────────────
# UPSTASH REDIS (Webhook Deduplication — optional but recommended in production)
# ─────────────────────────────────────────────────────────────────────────────
# console.upstash.com → Create Database → REST API → copy URL and token
# If omitted, the app falls back to an in-memory Set (works but resets on restart).
UPSTASH_REDIS_REST_URL=YOUR_UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN=YOUR_UPSTASH_REDIS_REST_TOKEN
```

---

## Service Setup Guides

### 1. Sanity CMS

**Purpose:** Headless content management — homilies, articles, music, publications, newsletter subscribers, email campaigns, orders.

**Setup steps:**

1. Go to [sanity.io/manage](https://sanity.io/manage) and sign in
2. open the existing one
3. Note the **Project ID** (short alphanumeric string) → `NEXT_PUBLIC_SANITY_PROJECT_ID`
4. Dataset is `production` by default → `NEXT_PUBLIC_SANITY_DATASET`
5. Go to **Settings → API → Tokens** → create a token with **Editor** permissions → `SANITY_API_TOKEN`
6. Under **Settings → API → CORS Origins**, add your frontend URL (e.g. `https://spiritanssound.com`) and your Studio URL

**Image CDN:** All images are served from `cdn.sanity.io` — no extra configuration required.

---

### 2. Paystack (Payments)

**Purpose:** Processes NGN donations and digital publication purchases. Webhook events trigger email confirmations.

**Setup steps:**

1. Go to [dashboard.paystack.com](https://dashboard.paystack.com) and sign in
2. **Settings → API Keys & Webhooks:**
   - Copy **Secret Key** → `PAYSTACK_SECRET_KEY`
   - The webhook secret is the same key → `PAYSTACK_WEBHOOK_SECRET`
3. Under **Webhooks**, add your webhook URL:
   ```
   https://spiritanssound.com/api/paystack/webhook
   ```
4. Test with the `sk_test_...` key first; switch to `sk_live_...` for production

**Events handled by the app:**
| Event | What the app does |
|-------|------------------|
| `charge.success` (donation) | Sends thank-you email to donor; notifies admin if ≥ ₦50,000 |
| `charge.success` (purchase) | Sends purchase confirmation with download link; marks order complete |
| `charge.failed` | Sends failed charge alert to admin inbox |

---

### 3. Resend (Email Sending)

**Purpose:** Delivers ALL outbound emails — transactional emails, admin notifications, newsletter campaigns.

**Setup steps:**

1. Go to [resend.com](https://resend.com) and sign in
2. **API Keys** → Create API Key → copy to `RESEND_API_KEY`
3. **Domains** → Add Domain → enter `spiritanssound.com`
4. Add the DNS records Resend provides (DKIM + Return-Path CNAMEs) — see [DNS Records](#dns-records)
5. Once the domain shows green/verified, set `SMTP_FROM_EMAIL` to an address on that domain

**Emails sent by this app:**

| Trigger                 | Recipient              | Template                        |
| ----------------------- | ---------------------- | ------------------------------- |
| Successful donation     | Donor                  | `ThankYouEmailPops.tsx`         |
| Successful purchase     | Buyer                  | `PurchaseConfirmationEmail.tsx` |
| Large donation (≥ ₦50k) | Admin (`ADMIN_EMAIL`)  | Inline HTML                     |
| Failed payment          | Admin (`ADMIN_EMAIL`)  | Inline HTML                     |
| Contact form submission | Admin (`ADMIN_EMAIL`)  | Inline HTML                     |
| Newsletter campaign     | All active subscribers | `NewsletterEmailTemplate.tsx`   |

---

### 4. Zoho Mail (Email Receiving)

**Purpose:** Professional admin inbox that receives all system notifications (contact form, donation alerts, failed charges).

**Setup steps:**

1. Go to [zoho.com/mail](https://zoho.com/mail) and sign in / create account
2. **Add a domain** → enter `spiritanssound.com`
3. **Create mailbox** → e.g. `info@spiritanssound.com` → set a strong password
4. Add the DNS records Zoho provides — see [DNS Records](#dns-records)
5. Set `ADMIN_EMAIL=info@spiritanssound.com` in your `.env`

**Reply flow:**
When the admin receives a contact form notification and clicks **Reply** in Zoho, the reply goes directly to the website visitor (the app sets the `replyTo` header to the visitor's address automatically).

**Unveiler section admin:**
For the `/unveiler` section of the site, the admin inbox is `editor@treasuresunveiler.com` — configure this separately in Zoho for the `treasuresunveiler.com` domain.

---

### 5. Upstash Redis (Webhook Deduplication)

**Purpose:** Prevents duplicate email sends when Paystack retries webhook deliveries. Stores processed transaction references for 24 hours.

**Setup steps:**

1. Go to [console.upstash.com](https://console.upstash.com) and sign in
2. **Create Database** → choose a region close to your hosting provider
3. Under **REST API**, copy:
   - `UPSTASH_REDIS_REST_URL` → your REST URL
   - `UPSTASH_REDIS_REST_TOKEN` → your REST token
4. Add both to `.env`

> **Note:** If these variables are omitted, the app uses an in-memory fallback. This is fine for development but not for production — server restarts will reset the in-memory set and allow reprocessing.

---

## DNS Records

Add all of the following to your DNS provider (Cloudflare, Namecheap, GoDaddy, etc.) for the domain `spiritanssound.com`.

### Zoho Mail — Inbound (required to receive emails)

| Type | Name | Value          | Priority |
| ---- | ---- | -------------- | -------- |
| MX   | `@`  | `mx.zoho.com`  | 10       |
| MX   | `@`  | `mx2.zoho.com` | 20       |
| MX   | `@`  | `mx3.zoho.com` | 50       |

### SPF — Combined (Zoho replies + Resend sending)

| Type | Name | Value                                                  |
| ---- | ---- | ------------------------------------------------------ |
| TXT  | `@`  | `"v=spf1 include:zoho.com include:amazonses.com ~all"` |

> Only one SPF record is allowed per domain. This combined record covers both Zoho (replies) and Resend (outbound).

### DKIM — Zoho (from Zoho Admin Panel)

> Go to **Zoho Mail Admin → Deliverability → DKIM** to get your exact record values.

| Type         | Name              | Value                |
| ------------ | ----------------- | -------------------- |
| TXT or CNAME | `zoho._domainkey` | _(provided by Zoho)_ |

### DKIM + Return-Path — Resend (from Resend Dashboard)

> Go to **Resend → Domains → spiritanssound.com** to get your exact record values.

| Type  | Name                | Value                  |
| ----- | ------------------- | ---------------------- |
| CNAME | `resend._domainkey` | _(provided by Resend)_ |
| CNAME | `em` (Return-Path)  | _(provided by Resend)_ |

---

## Project Structure

```
spiritans-sounds-fe/
│
├── app/                          # Next.js App Router pages & API routes
│   ├── layout.tsx                # Root layout — fonts, metadata, SEO
│   ├── globals.css               # Tailwind v4 + brand theme variables
│   ├── api/
│   │   ├── contact/route.ts      # Contact form → Resend → ADMIN_EMAIL
│   │   ├── newsletter/
│   │   │   ├── send/route.ts     # Bulk newsletter send via Resend
│   │   │   ├── subscribe/route.ts
│   │   │   └── unsubscribe/route.ts
│   │   ├── paystack/
│   │   │   ├── webhook/route.ts  # Paystack events → email triggers
│   │   │   ├── initialize/route.ts
│   │   │   └── purchase/initialize/route.ts
│   │   └── comment/route.ts
│   │
│   ├── homilies/
│   ├── articles/
│   ├── music/
│   ├── prayers/
│   ├── news/
│   ├── donations/
│   ├── unveiler/                 # Sub-brand section
│   ├── search/
│   └── contact/page.tsx          # Contact form UI
│
├── components/                   # Shared React components
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── magazine/
│   │   ├── BookCard.tsx          # Paystack purchase integration
│   │   └── IssueCard.tsx
│   └── PortableTextComponents.tsx # YouTube embed renderer
│
├── lib/
│   ├── emails/
│   │   ├── sendEmail.ts          # All Resend send functions
│   │   ├── ThankYouEmailPops.tsx # Donation thank-you template
│   │   ├── PurchaseConfirmationEmail.tsx
│   │   └── NewsletterEmailTemplate.tsx
│   ├── utils.ts
│   └── types.ts
│
├── sanity/
│   ├── env.ts                    # Sanity project constants
│   └── lib/
│       ├── client.ts             # Sanity client (CDN-enabled)
│       ├── image.ts              # urlFor() image helper
│       ├── queries.ts            # GROQ query library
│       └── live.ts               # Real-time content updates
│
├── public/                       # Static assets (favicon, OG image)
├── next.config.ts                # Next.js config (image domains)
├── tsconfig.json
├── package.json
├── .env                          # ← secrets (git-ignored)
└── SETUP.md                      # ← this file
```

---

## Frontend Libraries

These require no credentials — they're installed via `npm install`.

| Package                           | Purpose                               |
| --------------------------------- | ------------------------------------- |
| `framer-motion`                   | Page and element animations           |
| `@radix-ui/react-dialog`          | Accessible modal dialogs              |
| `@radix-ui/react-navigation-menu` | Accessible navigation                 |
| `embla-carousel-react`            | Touch-friendly carousels              |
| `embla-carousel-autoplay`         | Carousel autoplay plugin              |
| `lucide-react`                    | SVG icon set                          |
| `tailwind-merge`                  | Merges Tailwind class strings safely  |
| `class-variance-authority`        | Component variant styling             |
| `clsx`                            | Conditional class name utility        |
| `tw-animate-css`                  | Tailwind animation utilities          |
| `@portabletext/to-html`           | Converts Sanity Portable Text to HTML |
| `axios`                           | HTTP client for API calls             |
| `@sanity/image-url`               | Builds optimised Sanity image URLs    |

---

## Accounts & Credentials Checklist

Use this checklist when onboarding or setting up a new environment.

| Service       | What you need                     | Where to get it                   |
| ------------- | --------------------------------- | --------------------------------- |
| Sanity        | Project ID, API token             | sanity.io/manage                  |
| Paystack      | Secret key, webhook secret        | dashboard.paystack.com → API Keys |
| Resend        | API key, verified domain          | resend.com → API Keys + Domains   |
| Zoho Mail     | Email + password, MX/DKIM records | zoho.com/mail → Mail Admin        |
| Upstash Redis | REST URL + token                  | console.upstash.com               |

| Hosting platform Vercel

> **Security reminder:** Never commit the `.env` file to source control. Use your hosting platform's environment variable dashboard to inject secrets in production.
