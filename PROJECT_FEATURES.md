# Spiritans Sounds — Project Features & Deliverables

**Client:** Spiritans Sounds / Treasures Unveiler
**Platform:** Web Application (spiritanssounds.org)
**Stack:** Next.js 16, TypeScript, Tailwind CSS v4, Sanity CMS

---

## Overview

A full-scale, production-ready digital ministry platform featuring spiritual content, community engagement, digital publications, radio streaming, and integrated donation/payment processing.

---

## 1. Core Website Pages

| Page | Description |
|---|---|
| Home | Hero carousel, latest homilies, articles, prayers, music highlights, FAQ section |
| About | Ministry overview with hero carousel |
| Contact | Contact form with email notification to admin |
| Terms of Service | Legal terms page |
| Privacy Policy | Data privacy policy page |
| Search | Full-text search across homilies, articles, and prayers |

---

## 2. Spiritual Content Sections

### Homilies
- Full listing page with pagination (9 items/page)
- Individual homily detail page with rich text rendering
- Audio/video embed support
- Comments section (moderated)
- Sidebar: recent posts & categories

### Articles
- Full listing page with pagination
- Individual article detail page with rich text
- Comments section (moderated)
- Sidebar: recent posts & categories

### Prayers
- Full listing page with pagination
- Individual prayer detail page with rich text
- Comments section (moderated)
- Sidebar: recent posts & categories

### Music
- Sacred music/worship track listing
- Individual music track pages

---

## 3. Treasures Unveiler Sub-Platform

A complete sub-section with its own identity and navigation.

| Feature | Description |
|---|---|
| Unveiler Feed | Event listings with featured/popular filtering and search |
| Magazine Issues | Digital magazine catalog with issue cover images |
| Magazine Reader | Individual issue pages with download/purchase support |
| Books / Publications | Digital books catalog with cover images |
| Radio Player | Streaming internet radio with live programming schedule |
| Adverts | Advertising/sponsorship information page |
| Unveiler About | Sub-section about page |
| Newsletter Signup | Dedicated newsletter subscription within Unveiler |

---

## 4. Donation & Payment System

- Donation form with variable amount input (₦100 – ₦10,000,000)
- Paystack payment gateway integration (NGN)
- Secure checkout flow with real-time redirect
- Donation completion/confirmation page
- HMAC-SHA512 webhook signature verification
- Duplicate transaction prevention (Redis-backed deduplication)
- Admin notification email for donations ≥ ₦50,000
- Failed payment alert emails to admin
- Donation record storage in Sanity CMS

---

## 5. Digital Product Purchase System

- Purchase flow for books and magazine issues
- Paystack payment gateway integration
- Post-purchase confirmation page with download link
- Automatic order tracking in Sanity CMS
- Receipt email with download URL sent to buyer
- Webhook deduplication for idempotent processing

---

## 6. Email Automation System

All emails rendered with React Email and sent via Resend:

| Trigger | Recipient | Email Sent |
|---|---|---|
| Donation received | Donor | Thank-you confirmation |
| Donation ≥ ₦50,000 | Admin (Zoho) | Large donation alert |
| Payment failed | Admin (Zoho) | Failed payment alert |
| Digital purchase | Buyer | Receipt + download link |
| Contact form submission | Admin (Zoho) | Contact message forwarded |
| Newsletter signup | Subscriber | Welcome / confirmation |
| Newsletter send (admin) | All subscribers | Campaign email |

---

## 7. Comment System

- Comment submission form on homilies, articles, and prayers
- Admin moderation workflow (comments not published until approved in Sanity Studio)
- Display of approved comments per content piece

---

## 8. Newsletter System

- Public subscription form (with duplicate-email prevention)
- Unsubscribe page and flow
- Admin-triggered newsletter campaigns (protected API endpoint)
- Subscriber list managed in Sanity CMS

---

## 9. CMS Integration (Sanity)

- Full headless CMS setup with 30+ GROQ content queries
- Content types: homilies, articles, prayers, music, events, magazines, books, radio, orders, donations, subscribers, contacts, pages
- Real-time image CDN delivery (cdn.sanity.io)
- Portable Text rendering with custom components
- Featured/popular content flagging
- Category tagging system
- Per-page SEO metadata (title, description, OG image)

---

## 10. API Routes (Backend)

| Endpoint | Purpose |
|---|---|
| `POST /api/paystack/initialize` | Initiate donation checkout |
| `POST /api/paystack/purchase/initialize` | Initiate product purchase checkout |
| `POST /api/paystack/webhook` | Handle all Paystack events (server-side) |
| `POST /api/comment` | Submit comment for moderation |
| `POST /api/contact` | Process contact form |
| `POST /api/newsletter/subscribe` | Newsletter signup |
| `POST /api/newsletter/unsubscribe` | Newsletter opt-out |
| `POST /api/newsletter/send` | Admin: trigger newsletter campaign |

---

## 11. Performance & Technical Features

- Incremental Static Regeneration (ISR) — pages cached and auto-refreshed hourly
- Image optimization via Sanity CDN
- Pagination on all listing pages
- Upstash Redis integration for webhook deduplication with in-memory fallback
- Fully responsive design (mobile, tablet, desktop)
- Mobile navigation menu with dropdown support
- Auto-rotating image carousel (Embla Carousel)
- SEO: Open Graph images, meta tags, structured page titles
- Input sanitization and XSS prevention
- TypeScript throughout for type safety

---

## 12. Design & UI

- Custom typography: Playfair Display (headings) + Montserrat (body)
- Tailwind CSS v4 with custom animation utilities
- Radix UI components (accessible dialogs, navigation menus)
- Lucide React icon set
- Consistent brand identity across main site and Unveiler sub-section
- Sticky header navigation with dropdowns

---

## 13. Environment & Deployment

- 20+ environment variables managed for dev/production
- Ngrok support for local webhook development/testing
- Separate Sanity API versioning (pinned to 2026-01-05)
- Ready for Vercel deployment

---

## Cost Estimate (Nigerian Naira)

| Service Category | Estimated Hours | Rate (₦/hr) | Cost (₦) |
|---|---|---|---|
| Project architecture & setup | 20 hrs | ₦8,000 | ₦160,000 |
| Sanity CMS schema & queries | 40 hrs | ₦8,000 | ₦320,000 |
| Frontend pages (30+ routes) | 80 hrs | ₦8,000 | ₦640,000 |
| API routes & backend logic | 30 hrs | ₦8,000 | ₦240,000 |
| Paystack payment integration | 20 hrs | ₦8,000 | ₦160,000 |
| Email automation (Resend + templates) | 20 hrs | ₦8,000 | ₦160,000 |
| Newsletter system | 15 hrs | ₦8,000 | ₦120,000 |
| Comment system | 10 hrs | ₦8,000 | ₦80,000 |
| Search feature | 10 hrs | ₦8,000 | ₦80,000 |
| Radio player (Unveiler) | 15 hrs | ₦8,000 | ₦120,000 |
| Magazine/book section (Unveiler) | 20 hrs | ₦8,000 | ₦160,000 |
| Responsive design & mobile nav | 20 hrs | ₦8,000 | ₦160,000 |
| Testing, QA & debugging | 20 hrs | ₦8,000 | ₦160,000 |
| Deployment & environment setup | 10 hrs | ₦8,000 | ₦80,000 |
| **TOTAL** | **330 hrs** | | **₦2,640,000** |

### Pricing Tiers

| Tier | Total (₦) | Best For |
|---|---|---|
| **Budget** | ₦1,800,000 | Established relationship, smaller scope perception |
| **Standard** *(recommended)* | ₦2,640,000 | Fair market rate for this complexity |
| **Premium / Agency Rate** | ₦4,000,000 – ₦5,000,000 | Agency billing or client with high budget |

> **Note:** Rates above reflect senior Next.js developer market rates in Nigeria (2025–2026). The ₦2.64M figure is based on 330 estimated hours at ₦8,000/hr.

### Not Included (Billed Separately or to Client)
- Domain name registration/renewal
- Web hosting (Vercel, etc.)
- Sanity CMS subscription (if above free tier)
- Paystack transaction fees (charged per transaction by Paystack)
- Resend email service subscription
- Upstash Redis subscription
- Ongoing maintenance & content updates

---

*Document prepared: April 2026*
