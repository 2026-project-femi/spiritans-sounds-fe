# Young Creators Network — Developer Handoff

A self-contained frontend module for the **Young Creators Network**, a programme of
**TUYDEF** (Treasures Unveiler Youth Development Foundation), an arm of **Spiritans Sound Outreach**.

This module is integrated into the existing Spiritans Sound site (Next.js 16, Payload CMS,
PostgreSQL/Drizzle, Tailwind v4, Paystack, Stripe) as a self-contained section with its own
layout, palette, typography and sub-navigation.

Content is managed in Payload under the **Young Creators** admin group. Reads go through
`api/index.ts`; form submissions and checkout go through validated server actions in
`server/actions.ts`. There is no demo adapter left in the form path.

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
│   ├── index.ts              server-side Payload reads (creators, updates, settings)
│   └── actions.ts            shared SubmitResult / CheckoutResult types
├── server/actions.ts         "use server" actions: validate, write to Payload, start checkout
├── lib/
│   ├── schemas.ts            zod validation (mentor, opportunity, support)
│   └── filter.ts             pure creator filter (talent / class year / search)
├── data/demo-creators.ts     seed source for scripts/seed_young_creators.ts
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

## 3. Content sources

| Content | Managed in | Notes |
|---|---|---|
| Creators | `young-creators` collection | Drafts, published-only public reads, safeguarding fields hidden from the public API |
| Latest updates | `ycn-updates` collection | Linked to a creator; latest three published items appear on the landing page |
| Hero / workshop images | `ycn-settings` global | Upload media in Payload; add alt text on each Media item |
| Impact figures | `ycn-settings → impactStats` | Verified figures only. Empty = the qualitative pillars are shown without numbers |
| Footer contact link | `ycn-settings → contactLabel / contactHref` | Hidden when blank |
| Mentor applications | `ycn-mentor-applications` collection | Submitted through the server action; reviewed by admins |
| Opportunity offers | `ycn-opportunities` collection | Submitted through the server action; default status `pending-review` |

The original prototype content can be imported once with `pnpm seed:ycn`. The seed is
idempotent (matched by slug/title/filename) and refuses to touch existing records. The
sample photos remain in `public/young-creators/`; replace them with consented real photos
before launch. `YCN_DEMO_MODE` is `false` now that Payload is the source of truth.

## 4. Payload collections and security model

| Collection / global | Public read | Create | Update | Delete |
|---|---|---|---|---|
| `young-creators` | Published only | Admin, Editor | Admin, Editor | Admin |
| `ycn-updates` | Published only | Admin, Editor | Admin, Editor | Admin |
| `ycn-mentor-applications` | No | Admin, Publishing Admin (public form uses a server action) | Admin, Publishing Admin | Admin |
| `ycn-opportunities` | No | Admin, Publishing Admin (public form uses a server action) | Admin, Publishing Admin | Admin |
| `ycn-settings` (global) | Yes (except authors) | — | Admin, Publishing Admin | — |

Key points:

- Public REST writes to the application collections are **blocked**. The public forms call
  server actions, which validate with the zod schemas from `lib/schemas.ts` and then use the
  Payload Local API with `overrideAccess: true`. This keeps the REST endpoints private while
  still allowing unauthenticated submissions.
- The server actions rate-limit by IP using Upstash Redis (`lib/rateLimit.ts`) and fail open if
  Redis is unavailable. The clients cannot set `status` or `internalNotes`; these are admin-only
  fields.
- `young-creators` has a safeguarding collapsible: `legalName`, `isMinor`,
  `guardianConsentOnFile`, `consentDate`, `nameVisibility` and `internalNotes` are readable only
  by authenticated staff. Only `publicDisplayName` is rendered publicly.
- Minors' profile pages are `noindex, follow` in `generateMetadata`.
- Collection hooks revalidate `/young-creators` and `/young-creators/creators` after changes.
  Revalidation is wrapped so seed scripts and other non-request contexts do not crash.

## 5. Payments (Support page)

- **NGN → Paystack**, **GBP/USD → Stripe** (`lib/payments/youngCreators.ts`).
- Metadata sent to both providers: `programme: "young-creators"`, `designation`,
  `frequency`, `donor_name`. Stripe also sends `type: "donation"` so the existing webhook
  routes it to the donation handler rather than book fulfilment.
- Paystack callbacks and Stripe success URLs return to
  `/young-creators/support/complete`.
- The existing Paystack and Stripe webhooks store the payment in `donations` with the new
  `programme`, `designation` and `supportFrequency` fields. Book/e-book fulfilment is never
  triggered by a Young Creators gift.
- Monthly gifts use a Stripe subscription (`mode: "subscription"`). The initial payment and
  every renewal are recorded from the `invoice.paid` webhook (`lib/payments/stripeSubscription.ts`).
  `checkout.session.completed` deliberately skips subscription-mode donations so the first
  invoice is not counted twice.
- Paystack recurring plans are not configured here; monthly NGN is blocked in the UI and server
  action. Keep the monthly option only if the Paystack account supports recurring plans.
- Stripe Dashboard → Developers → Webhooks → your endpoint must subscribe to `invoice.paid`
  (and ideally `invoice.payment_failed`). No Products/Prices need to be created in the Dashboard:
  the app sends inline `price_data` with `recurring: { interval: "month" }`.

## 6. Creator data structure (`types.ts → Creator`)

`id, slug, publicDisplayName, nameVisibility?, isMinor, classYear, primaryCategory, talents[], location?,
tagline, portrait, bio[], giftsAndTalents, discoveryStory, interview[{question, answer}], videoUrl?, videoPoster?,
works[{title, type, year, description, image?, href?}], achievements[{year, title, detail?}], gallery[], featured?, isDemo?`

Admin-only fields (implemented on the collection, never rendered publicly): `_status`
(draft/published), `guardianConsentOnFile`, `consentDate`, `internalNotes`, `legalName`, `isMinor`.

## 7. Safeguarding fields

- **`publicDisplayName`** is the only name rendered. An administrator sets it according to consent:
  full name (with consent, e.g. an adult creator promoting their work), first name + initial, or an alias.
  `nameVisibility` records which basis was approved.
- **`location`** is optional; leave it empty to hide it. City/region only.
- The type has **no** phone, email, address or date-of-birth fields, so the frontend cannot expose them.
- All contact is routed through TUYDEF (`ORG.contact`). Mentor/opportunity forms require safeguarding consent.
- Payload access is enforced server-side: public read only for `_status = published`; applications are admin-only.

### Admin workflow

1. **Young Creators → Young Creators**: create a creator, upload a portrait, fill the profile,
   interview, portfolio and safeguarding tabs, then publish.
2. **Young Creators → Young Creators Updates**: add a short update linked to a creator.
3. **Young Creators → Young Creators Settings**: upload the hero and workshop images, add only
   verified impact figures, and set the footer contact link.
4. **Mentor Applications / Opportunity Offers**: review submissions, update `status`, and keep
   notes in `internalNotes`. All contact with creators goes through TUYDEF.

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
