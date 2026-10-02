# Sylvia's Basket Website: Version 2 Plan

**Status:** Source of truth for the Version 2 build. Agreed 2 October 2026.
**Rule:** If something is not in this file, it is not agreed. Any change to scope is written here first, then built.
**Background:** The full discussion, audit and reasoning are in the planning doc "Sylvia's Basket: Website Update Plan" (claude.ai artifact). This file records the outcomes only.

---

## 1. Goal

Evolve the existing site without rebuilding it:

- **Phase 1:** correct and refresh existing content.
- **Phase 2:** add a shop (merchandise and farm produce), paid courses with certificates, and farm-visit requests, all managed by Sylvia.
- Restructure navigation so the new sections fit.
- Target running cost: zero, apart from iPay's fee per transaction.

---

## 2. Current system (from the audit)

| Area | Today |
| --- | --- |
| Framework | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion |
| Hosting | Vercel, Hobby (free) plan. Auto-deploys from GitHub `master` |
| Content | Text hard-coded in page files. Blog posts in Contentful (`blogPost`) |
| Database | PostgreSQL (Neon) through Prisma. Tables: Donation, RecurringDonation |
| Email | Resend (receipts, alerts). Mailchimp for newsletter |
| Payments | iPay code is a placeholder. Not live |
| Admin / login | None |
| Code | GitHub: TugieVictor/sylviasbasket. Backup copy: `sylvias-basket-website-ORIGINAL-2026-10-02` |

**Known live problems (fixed in Stage 0):**

1. Get Involved contact form posts to `contact-handler.php`, which Vercel cannot run. Messages are lost.
2. Donation callback marks payments as paid without verifying them with iPay.
3. Every page shares the homepage title.

---

## 3. Decisions (settled)

### Content

| # | Decision |
| --- | --- |
| C1 | Hero tagline becomes **"Through Organic Farming & Agroecology"**. Only the hero line changes. Other uses of "sustainable agriculture" stay |
| C2 | CIFOR-ICRAF becomes **Landscape Alliance** on the Home partners list, Our Work partner card and About partners summary |
| C3 | About page line "Partner with CIFOR-ICRAF on smallholder agroecology training" is **removed** |
| C4 | Advocacy shows **all 13 HLPE principles equally**, in the three official groups. No "featured six" |
| C5 | Navigation label "News & Blog" becomes **"News & Publications"**. URL stays `/news/` |
| C6 | Publications will hold **Sylvia's previous writings** (new Contentful type, see section 6) |
| C7 | All other approved wording, stats, CTAs, partner order, logo, font and colours stay as they are |

**The 13 principles (HLPE 2019, UN Committee on World Food Security), in official order and groups:**

- *Improve resource efficiency:* 1 Recycling, 2 Input reduction
- *Strengthen resilience:* 3 Soil health, 4 Animal health, 5 Biodiversity, 6 Synergy, 7 Economic diversification
- *Secure social equity and responsibility:* 8 Co-creation of knowledge, 9 Social values and diets, 10 Fairness, 11 Connectivity, 12 Land and natural resource governance, 13 Participation

Names and short definitions are used as published. Source credited on the page.

### Hero (Option B)

- New photo fills the whole hero section, with text over it.
- Brand dark-green **gradient overlay**: strong behind the text, light over Sylvia.
- **Text block on the right**, so it does not cover Sylvia (she stands left of centre).
- Stats row (1,000+, 5+ tonnes, 50+, 2,000+) moves to a strip **directly below** the hero.
- The first pill ("1,000+ Farmers Trained") is dropped because it repeats a stat.
- Sylvia's portrait and quote move to a section lower on the homepage.
- Mobile: portrait crop anchored on Sylvia; text on the lower half over a bottom-up gradient.
- Image: converted from the 3.3 MB PNG to WebP and JPG, about 1600 and 800 px wide, under 300 KB each.
- Alt text: "Sylvia Kuria leads an agroecology training for farmers seated under trees".
- Confirmed: the trainer is Sylvia, and consent from the people pictured is in place.

### Navigation (confirmed)

Header: logo, five menu items, then two buttons.

| Menu | Type | Items |
| --- | --- | --- |
| About | Dropdown | Our Story (/about/), Meet Sylvia, Farmers Stories, Gallery, Partners |
| Our Work | Dropdown | Training (/our-work/), Advocacy, Markets and aggregation |
| Learn & Visit | Dropdown | Courses, Farm Visits |
| News & Publications | Single link | /news/ |
| Get Involved | Single link | /get-involved/ |
| **Shop** | Button, with cart count | Shop home |
| **Donate** | Button | /donate/ |

- Footer only: Verify a certificate, Delivery / Terms / Privacy, Admin login.
- Dropdowns open on click and keyboard, not hover only. Escape closes them.
- Mobile: Shop and menu icon stay in the top bar; menu opens full screen with expandable groups; Donate is a full-width button at the bottom.
- All existing URLs stay unchanged.

### Commerce and architecture

| # | Decision |
| --- | --- |
| A1 | **Option A:** products, stock, orders, courses, registrations and visit requests live in our own PostgreSQL database, managed through our own admin area |
| A2 | Contentful stays for articles and publications |
| A3 | Payments through **iPay only**. No Stripe or other providers |
| A4 | **Guest checkout**. No customer accounts |
| A5 | Merchandise and produce **launch together** |
| A6 | Delivery mainly in Nairobi, Kenya only. No international shipping |
| A7 | Courses are **paid**. Sylvia issues certificates after completion |
| A8 | Farm visits are expected to be **paid**. Request first, Sylvia confirms, then the fee is paid by iPay link |
| A9 | **Sylvia** manages orders, stock, courses and visits |
| A10 | Hosting is decided **after** the build (see section 9). The build must work on any host |
| A11 | The domain owners will be asked to add a `shop.` record if a separate shop host is used |

---

## 4. Best-case provisions (assumed now, changeable later from the admin)

Where details are still to come from Sylvia, we build the flexible version so her answers become settings, not code changes.

| Topic | Provision |
| --- | --- |
| Delivery | Admin-editable delivery zones, each with a fee (start: Nairobi CBD, Nairobi outskirts, Rest of Kenya). Farm pickup as an option that can be switched on or off |
| Delivery handling | Order statuses: Awaiting payment, Paid, Packed, Out for delivery, Delivered, Cancelled. Courier details can be added to an order as a note |
| Courses | Admin creates courses and sessions: title, description, what you learn, who it is for, duration, location, date(s), price, capacity. Places left shown automatically |
| Course payment | Full payment at registration through iPay. Registration confirmed only when payment is confirmed. Waitlist when full |
| Certificates | Sylvia marks a participant "Completed". The site creates a PDF certificate with a unique code and QR code, emails it, and a public page verifies it. Completion rules can be added as a text field per course |
| Farm visits | Admin-set visit types (Individual, Group, School) with fee, maximum group size, available weekdays and minimum notice (default 7 days) |
| Admin device | Admin screens built **phone-first**, also comfortable on a computer |
| Products | Admin adds products with photos, description, price in KES, sizes or weights, and stock. Produce has an "Available this week" switch |
| Prices | Prices shown are final prices in KES. No separate tax calculation |
| Publications | Each item can be a PDF upload, a Word file, or an external link, with title, date, summary and cover image |
| Notifications | All emails sent from the existing Resend setup. Admin alerts go to info@sylviasbasket.co.ke |
| Policies | I draft Delivery, Returns, Terms of Sale and Privacy pages as plain templates. Sylvia approves the wording before launch |

---

## 5. Waiting on the iPay call

The payment design is built against iPay's documented web checkout and confirmation (IPN) process, using test mode. These answers are needed before real payments:

- [ ] Is Sylvia's Paybill an iPay channel, or her own M-Pesa Paybill?
- [ ] Is web checkout active on her account? Which payment types (M-Pesa, Airtel, card)?
- [ ] Vendor ID and hash key for live use
- [ ] Test (demo) access, or confirmation that the public demo credentials can be used
- [ ] iPay's fee per transaction

---

## 6. Technical design

### Data model (first version)

- **Product**: name, slug, category (Merchandise, Produce), description, images, active, availableThisWeek (produce)
- **ProductVariant**: label (size or weight), price, stock
- **DeliveryZone**: name, fee, active
- **Order**: reference, customer name, phone, email, delivery method, zone, address notes, subtotal, delivery fee, total, status, timestamps
- **OrderItem**: product and variant names and prices copied at time of order, quantity
- **Payment**: purpose (Order, Course, Visit, Donation), linked record, amount, iPay transaction ID, status, raw callback, timestamps
- **Course**, **CourseSession**: course details; each session has dates, location, price, capacity
- **Registration**: person, session, status, payment, completedAt, certificateCode
- **VisitType**, **VisitRequest**: visit settings; request with name, phone, email, type, group size, two preferred dates, status, fee, admin notes
- **AdminUser**: name, email, password hash, role
- Existing **Donation** table stays and is moved onto the shared Payment flow

Contentful: new **Publication** content type. Product photos: stored in Contentful through its management API, so Contentful handles resizing (no new paid service).

### Payment flow (all money in)

1. Server recalculates every price from the database. Never trusts prices from the browser.
2. Record created as "Awaiting payment". Shop stock held for 60 minutes.
3. Customer sent to iPay hosted checkout (HMAC hash as documented by iPay).
4. iPay calls our callback. We confirm the transaction with iPay's IPN query, then check order reference and amount.
5. Only then: mark Paid, reduce stock, send emails. Repeat callbacks are ignored.
6. Pending payments re-checked for up to 24 hours. Unpaid after 60 minutes: expired, stock released. Amount mismatch: flagged for Sylvia, never auto-confirmed.

### Security

- Payment verification as above. No code path skips verification.
- Cloudflare Turnstile (free) and rate limits on all public forms.
- Input validation on every API route. Admin routes behind login. Passwords stored hashed.
- Secrets only in environment settings, never in code.
- Remove `contact-handler.php` and the placeholder code that skips checks.
- Privacy notice in line with Kenya's Data Protection Act.

### Code organisation

- One codebase. Shop, checkout, admin and payment routes in their own folders.
- A setting (environment variable) switches commerce features on or off, so the same code can run as the information site, the shop, or both. This keeps every hosting option open.
- New work does not grow the existing large page files. Parts we touch may be extracted into components; no wider refactor.

---

## 7. Build stages

| Stage | Scope | Needs before start |
| --- | --- | --- |
| 0 | Fix live site: contact form to Resend, secure donation callback, remove PHP file, page titles per page | Nothing |
| 1 | Phase 1 content: tagline, Landscape Alliance, About line removal, News & Publications label and headings | Nothing |
| 2 | Advocacy: all 13 principles in 3 groups | Nothing |
| 3 | Hero Option B and stats strip | Nothing |
| 4 | New navigation (desktop and mobile) | Nothing |
| 5 | Shared foundations: database tables, admin login, payment module (iPay test mode), email templates, Turnstile | Development database (section 8) |
| 6 | Publications in Contentful and on /news/ | Contentful access |
| 7 | Farm visits: request form, admin, emails, fee by payment link | Stage 5 |
| 8 | Shop: catalogue, product page, cart, checkout, orders, stock, delivery zones, admin | Stage 5 |
| 9 | Courses and certificates | Stage 5 |
| 10 | Policies pages, testing on phones, small real payments, Sylvia trained on admin | iPay answers |
| 11 | Hosting decision and launch | Section 9 |

**How each stage is delivered:** work in the real project folder, preview in the browser, screenshots of desktop and phone, one Git commit per logical change, your review before the next stage.

---

## 8. Working rules for this build

- All work happens on a new Git branch, **`v2`**. Nothing is merged to `master` until you approve, because `master` deploys straight to the live site.
- The backup folder is never edited.
- Database changes are made on a **separate development database** (a free Neon branch), never on the live one.
- No new paid services. Any new free service is named and explained first.
- No changes to approved wording unless agreed here.

---

## 9. Hosting (decided after the build)

Facts to weigh when we decide:

- Vercel Hobby is free but limited to personal, non-commercial use. Selling on it breaks its terms.
- The domain's DNS is controlled by others, so moving the main site is harder than adding one `shop.` record.
- Likely route: main site stays on Vercel; the same codebase runs with commerce switched on at a free host that allows selling (to be verified), at `shop.sylviasbasket.co.ke`.

---

## 10. Still to confirm (does not block early stages)

- [ ] iPay answers (section 5)
- [ ] Sylvia's real details for delivery fees, courses, visit fees and products (entered by her in the admin)
- [ ] Sylvia's writings for Publications
- [ ] Contentful access to add the Publication type and a management token for product photos
- [ ] Access to create a free Neon development branch (or the Neon account login)
- [ ] Cloudflare account (free) for Turnstile keys
- [ ] Approval of policy page wording before launch

---

## 11. Change log

| Date | Change |
| --- | --- |
| 2026-10-02 | First version agreed |
