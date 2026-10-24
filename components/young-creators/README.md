# Young Creators Network — Developer Handoff

A self-contained frontend module for the **Young Creators Network**, a programme of
**TUYDEF** (Treasures Unveiler Youth Development Foundation), an arm of **Spiritans Sound Outreach**.

This module is integrated into the existing Spiritans Sound site (Next.js 16, Payload CMS,
PostgreSQL/Drizzle, Tailwind v4, Paystack, Stripe) as a self-contained section with its own
layout, palette, typography and sub-navigation.
**It adds no backend, auth, CMS, database or payment system.** Every form and the checkout
currently use **demo adapters** that you will swap for the site's existing infrastructure.

---

## 1. Folder structure

```text
components/young-creators/
├── README.md                 this file
├── index.ts                  public exports (barrel)
├── types.ts                  data contracts (map to Payload collections)
├── constants.ts              categories, journey steps, ORG names, contact destination
├── demo.ts                   YCN_DEMO_MODE — single switch for all demo labels
├── api/
│   ├── index.ts              server-side reads (creators, updates, impact stats)
│   └── actions.ts            client-safe form submits + checkout hand-off
├── lib/
│   ├── schemas.ts            zod validation (mentor, opportunity, support)
│   └── filter.ts             pure creator filter (talent / class year / search)
├── data/demo-creators.ts     ⚠ TEMPORARY sample creators + latest posts
└── components/
    ├── primitives.tsx        YCN_PATHS, YcnLink (next/link), btn styles,
    │                         Eyebrow, SectionHeading, DemoBadge
    ├── YcnShell.tsx          YcnSubNav + YcnBreadcrumb + YcnFooter (route layout)
    ├── YoungCreatorsHero.tsx, JourneySection.tsx, CreatorSpotlight.tsx,
    │   LatestCreators.tsx, GetInvolved.tsx, ImpactSection.tsx, FinalCTA.tsx
    ├── CreatorCard.tsx, TalentTags.tsx, CreatorFilters.tsx, CreatorDirectory.tsx
    ├── CreatorProfile.tsx, CreatorProfileSections.tsx
    │     (ProfileBlock, CreatorInterview, VideoInterview, CreativeWorks,
    │      Achievements, CreatorGallery + lightbox)
    ├── form-fields.tsx       Field, ChipMulti, Consent, SuccessPanel, inputCls
    ├── MentorForm.tsx, OpportunityForm.tsx, SupportYoungCreators.tsx
```

Sample photos live in `public/young-creators/` (⚠ TEMPORARY AI-generated images).

## 2. Route layout and identity

Route files:

| Route | Page |
|---|---|
| `/young-creators` | `app/(frontend)/young-creators/page.tsx` — Hero, Journey, Spotlight, creators, Latest, Get Involved, Impact, Final CTA |
| `/young-creators/creators` | `.../creators/page.tsx` — Directory with talent + class-year filters and search |
| `/young-creators/creators/[slug]` | `.../creators/[slug]/page.tsx` — Full creator profile (`notFound()` if missing) |
| `/young-creators/support` | `.../support/page.tsx` — Donation UI + Impact |
| `/young-creators/mentor` | `.../mentor/page.tsx` — Become a Mentor form |
| `/young-creators/opportunity` | `.../opportunity/page.tsx` — Offer an Opportunity form |

The section identity is applied by `app/(frontend)/young-creators/layout.tsx`:

1. `.ycn-theme` scopes the YCN palette/typography tokens in `app/(frontend)/globals.css`
   so the rest of the site is unaffected.
2. Bricolage Grotesque + DM Sans are loaded with `next/font/google`.
3. `<YcnSubNav />` and `<YcnBreadcrumb />` provide the standalone section header, and `<YcnFooter />` closes the page.
4. `components/layout/SiteChrome.tsx` omits the mother Spiritans Sound Header/Footer on `/young-creators` (and `/unveiler`), so each brand renders as its own website.
5. `components/layout/NetworkBar.tsx` sits above every brand header (and inside the mother header) to switch cleanly between Spiritans Sound, Treasures Unveiler and Young Creators.

To go live, replace the read bodies in `api/index.ts` and the write bodies in `api/actions.ts`
(see §4), and remove demo content (see §3). Components don't need to change.

## 3. Demo content and how to remove it

| Item | Location | Status |
|---|---|---|
| 8 sample creators, latest posts | `data/demo-creators.ts` | ⚠ DEMO |
| Sample photos | `public/young-creators/*.jpg` | ⚠ DEMO (AI-generated) |
| "Demo" badges | `DemoBadge` in `primitives.tsx` | controlled by `demo.ts` |
| Form submissions (mentor, opportunity) | `api/actions.ts` | ⚠ DEMO — logs to console and returns a fake reference |
| Checkout | `api/actions.ts → startSupportCheckout` | ⚠ DEMO — no payment, no redirect |
| Contact destination | `constants.ts → ORG.contact.href` | `null` = not connected; the footer shows "link to be connected" |
| Impact figures | `api/index.ts → getImpactStats` | returns `[]`, so no numbers are shown |

**To remove:** set `YCN_DEMO_MODE = false` in `demo.ts` (hides every banner/badge/"demo" suffix),
delete `data/` and the images in `public/young-creators/`, and remove the demo imports from `api/index.ts`. The only other file that imports
`data/` directly is the landing and support route (for `heroImage`/`workshopImage`), so pass CMS media there instead.

## 4. Integration points

| Function | Connect to |
|---|---|
| `listCreators(query)` | `payload.find({ collection: "young-creators", where, sort: "-classYear" })`, filtering `status = published`. `lib/filter.ts` shows the where-logic (talent, classYear, search). |
| `getCreatorBySlug(slug)` | `payload.find({ where: { slug: { equals } }, limit: 1 })` |
| `listClassYears()` | distinct `classYear` of published creators |
| `getFeaturedCreators()` | `where: { featured: { equals: true } }` |
| `getLatestPosts()` | new `ycn-updates` collection or the existing posts collection, filtered by tag |
| `getImpactStats()` | `ycn-settings` global → array of `{ value, label }`. **Verified figures only.** Empty = the Impact section shows the four qualitative pillars. |
| `submitMentorApplication(data)` | Server action → `payload.create({ collection: "ycn-mentor-applications" })` + notify the TUYDEF safeguarding lead with the existing mailer |
| `submitOpportunity(data)` | Server action → `payload.create({ collection: "ycn-opportunities" })`, status `pending-review` |
| `startSupportCheckout(intent)` | The site's **existing** checkout initialiser (see §5) |

Forms also accept an override prop: `<MentorForm onSubmit={serverAction} />`,
`<OpportunityForm onSubmit={…} />`, `<SupportYoungCreators onCheckout={…} />`.
Each must return `{ ok: true, reference } | { ok: false, error }`. Checkout returns `{ ok: true; provider; redirectUrl } | { ok: false; error }`; only a non-demo result with a `redirectUrl` should count as live success.
Validate again on the server with the same zod schemas from `lib/schemas.ts`.

**PostgreSQL / Drizzle relationships (suggested):**
- `young_creators` ↔ `media` (portrait, gallery, work images; Payload upload relation)
- `young_creators` ↔ `ycn_works` (one-to-many) and `ycn_achievements` (one-to-many), or Payload arrays
- `ycn_updates.creator_id` → `young_creators.id`
- `ycn_mentor_applications.expertise` / `ycn_opportunities.categories` → talent enum
- Support payments: reuse the existing orders/payments table with `metadata.programme = "young-creators"`
  and `metadata.designation`. **Keep it separate from book/e-book order handling**, so donations never trigger e-book delivery.

## 5. Payments (Support page)

- UI rule: **NGN → Paystack**, **GBP/USD → Stripe** (`startSupportCheckout` + the label under the button).
- One-off vs monthly: `intent.frequency`. Monthly needs a Paystack Plan / Stripe subscription price. Check that the existing setup supports recurring payments, otherwise hide the monthly toggle.
- **Paystack:** call the existing initialise endpoint with `amount * 100` (kobo), `email`, `metadata: { programme, designation, frequency }` and return `authorization_url` as `redirectUrl`.
- **Stripe:** create a Checkout Session with the existing Stripe client (`mode: "payment"` or `"subscription"`), with the same metadata, and return `session.url`.
- Confirmation goes through the **existing webhooks**. Branch on `metadata.programme === "young-creators"` so book fulfilment is skipped.
- Preset amounts live in `SupportYoungCreators.tsx → PRESETS` (they are suggestions, not invented impact claims).

## 6. Creator data structure (`types.ts → Creator`)

`id, slug, publicDisplayName, nameVisibility?, isMinor, classYear, primaryCategory, talents[], location?,
tagline, portrait, bio[], giftsAndTalents, discoveryStory, interview[{question, answer}], videoUrl?, videoPoster?,
works[{title, type, year, description, image?, href?}], achievements[{year, title, detail?}], gallery[], featured?, isDemo?`

Suggested admin-only fields, never rendered: `status` (draft/published), `guardianConsentOnFile`,
`consentDate`, `internalNotes`, `legalName`.

## 7. Safeguarding fields

- **`publicDisplayName`** is the only name rendered. An administrator sets it according to consent:
  full name (with consent, e.g. an adult creator promoting their work), first name + initial, or an alias.
  `nameVisibility` records which basis was approved. The demo includes both full-name and initial examples.
- **`location`** is optional; leave it empty to hide it (e.g. demo creator Funke B.). City/region only.
- The type has **no** phone, email, address or date-of-birth fields, so the frontend cannot expose them.
- All contact is routed through TUYDEF (`ORG.contact`). Mentor/opportunity forms require safeguarding consent.
- Restrict Payload access: public read only for `status = published`; applications are admin-only.

## 8. Media requirements

- Portrait: 4:5, ≥ 800×1000. Work images: 16:10, ≥ 1200×750. Gallery: any, ≥ 1200px long edge.
- Alt text is required on every media item (`MediaItem.alt`).
- Video: an embeddable YouTube/Vimeo **embed** URL in `videoUrl`. Without it, the player shows "coming soon" (not clickable).
- In Next.js, swap `<img>` for `next/image` if the site already uses it.

## 9. SEO

Each route sets title, description, og:title, og:description. For CMS pages, add `seo.title`, `seo.description`,
and `seo.image` fields (or the existing Payload SEO plugin) and use `generateMetadata`. Creator pages use
`publicDisplayName` + `tagline`. Avoid indexing profiles of minors if TUYDEF policy requires it (`robots: noindex`).

## 10. Dependencies

No new dependencies were added for this feature. It uses packages already common to the stack:
`react`, `zod` (v3 API), `lucide-react` (icons), Tailwind v4. The only router dependency is `YcnLink`.

## 11. Testing done in the prototype

- Desktop (1280), tablet (768), mobile (375): every page, no horizontal scrolling.
- All nav, footer, CTA and profile links resolve (no dead links). The mobile menu works.
- Filters: talent + class year + search. Gallery lightbox: click, arrow keys, Escape.
- Mentor + Opportunity forms: required fields, email validation, error messages, dropdowns, textareas,
  submitting state, success panel, keyboard (Tab/Space/Enter).
- Support: once/monthly, NGN/GBP/USD presets, custom amount, Paystack/Stripe label, validation, demo success.
