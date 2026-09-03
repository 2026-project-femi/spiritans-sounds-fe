# Author Publishing, Book Sales, and Royalty Management System - Task Checklist

## Phase 1: Payload CMS Data Model Updates
- [x] Update `Users` collection (roles, author fields)
- [x] Update `Publications` collection (author, category, status, financials)
- [x] Update `Orders` collection (financial breakdown fields)
- [x] Create `BookSubmissions` collection
- [x] Create `Payouts` collection
- [x] Create `CommissionSettings` global
- [x] Register new collections and globals in `payload.config.ts`

## Phase 2: Public Pages (Next.js App Router)
- [x] Create `/unveiler/publish` page and form
- [x] Implement Server Actions for book submission
- [x] Create `/unveiler/books` marketplace listing
- [x] Create `/unveiler/books/[slug]` detail page
- [x] Update Paystack/Stripe checkout API to support book sales with correct fees/commissions
- [x] Create `/unveiler/terms` page
- [x] Implement secure email delivery of download links on successful purchase (via Webhook)

## Phase 3: Author Dashboard (Next.js Protected Routes)
- [x] Implement Dashboard Layout & Auth protection (`/unveiler/dashboard/layout.tsx`)
- [x] Create Overview Page (`/unveiler/dashboard/page.tsx` - Sales metrics, charts)
- [x] Create My Books page (`/unveiler/dashboard/books/page.tsx`)
- [x] Create Sales page (`/unveiler/dashboard/sales/page.tsx`)
- [x] Create Earnings & Payments page (`/unveiler/dashboard/earnings/page.tsx`)

## Phase 4: Admin Publishing & Financial Dashboard (Payload CMS)
- [x] Implement custom Payload view/component for `AdminFinancialDashboard`

## Verification
- [ ] Verify standard author successful sale
- [ ] Verify standard author multiple sales
- [ ] Verify young creator successful sale (0% commission)
- [ ] Verify refunded transaction
- [ ] Verify author payout
