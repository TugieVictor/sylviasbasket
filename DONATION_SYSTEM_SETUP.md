# Donation System Setup Guide

## Overview

The donation system is fully built and ready for testing. It supports:
- ✅ M-Pesa payments (via iPay)
- ✅ Card payments (Visa/Mastercard via iPay)
- ✅ Bank transfer (manual)
- ✅ One-time donations
- ✅ Monthly recurring donations
- ✅ Email receipts
- ✅ Admin notifications

## Current Status

**PHASE 1 (CORE) - ✅ COMPLETE**
- Database schema (Prisma)
- Donation page UI (`/donate`)
- API routes
- Success/failure pages
- Email receipts

**PHASE 2 (PAYMENT) - ⏳ WAITING FOR CREDENTIALS**
- iPay integration structure is ready
- Waiting for client to provide iPay credentials

**PHASE 3 (POLISH) - 📋 TODO LATER**
- Admin dashboard
- Donation widget for homepage

## Quick Start

### 1. Install Dependencies

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Set Up Database

Follow instructions in `PRISMA_SETUP.md` to:
1. Choose a database provider (Neon recommended - free)
2. Add `DATABASE_URL` to `.env.local`
3. Run `npx prisma generate`
4. Run `npx prisma db push`

### 3. Configure Environment Variables

Add to `.env.local`:

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://...

# Resend Email (REQUIRED for receipts)
RESEND_API_KEY=re_...

# iPay Africa (PENDING - get from client)
IPAY_VENDOR_ID=
IPAY_HASH_KEY=
IPAY_CALLBACK_URL=https://sylviasbasket.co.ke/api/donations/callback
IPAY_MODE=test

# Bank Details (OPTIONAL - for bank transfer option)
NEXT_PUBLIC_BANK_NAME=Equity Bank
NEXT_PUBLIC_BANK_ACCOUNT_NUMBER=...

# Site URL
NEXT_PUBLIC_SITE_URL=https://sylviasbasket.co.ke
```

### 4. Test the System

1. Start dev server: `npm run dev`
2. Visit: http://localhost:3000/donate
3. Fill out the form and select "Bank Transfer" (works without iPay)
4. You should see bank details displayed

## iPay Integration (When Credentials Arrive)

### Step 1: Get iPay Credentials from Client

Ask the client for:
1. **Vendor ID** (iPay account ID)
2. **Hash Key** (Security key for API)
3. **Account Type** (Test vs Live)

### Step 2: Add to Environment Variables

```env
IPAY_VENDOR_ID=your_vendor_id_here
IPAY_HASH_KEY=your_hash_key_here
IPAY_MODE=test  # Change to 'live' for production
```

### Step 3: Test iPay Integration

1. Restart your server
2. Visit `/donate`
3. Try M-Pesa or Card payment
4. Should redirect to iPay checkout

### Step 4: Verify Webhooks

iPay will send callbacks to:
```
https://sylviasbasket.co.ke/api/donations/callback
```

Make sure this URL is:
- Accessible from the internet
- Added to iPay dashboard as callback URL
- Using HTTPS (required by iPay)

## File Structure

```
app/
├── donate/
│   ├── page.tsx                    # Main donation page
│   ├── success/page.tsx            # Success page
│   └── failure/page.tsx            # Failure page
├── api/
│   └── donations/
│       ├── create/route.ts         # Create donation
│       ├── process/route.ts        # Process payment
│       ├── callback/route.ts       # iPay webhook
│       └── [orderId]/status/route.ts  # Check status

lib/
├── donations/
│   ├── types.ts                    # TypeScript types
│   ├── utils.ts                    # Utilities
│   ├── ipay.ts                     # iPay integration
│   └── email.ts                    # Email receipts
└── prisma.ts                       # Prisma client

prisma/
└── schema.prisma                   # Database schema
```

## Testing Checklist

### Local Testing (Bank Transfer)

- [ ] Visit `/donate`
- [ ] Select amount
- [ ] Fill in donor details
- [ ] Choose "Bank Transfer"
- [ ] Submit form
- [ ] See bank details displayed
- [ ] Check database for donation record

### iPay Testing (When Configured)

- [ ] M-Pesa payment flow
- [ ] Card payment flow
- [ ] Callback handling
- [ ] Email receipt sent
- [ ] Admin notification sent
- [ ] Success page displays correctly
- [ ] Failure page displays correctly

### Recurring Donations

- [ ] Select "Monthly" donation type
- [ ] Complete payment
- [ ] Check `recurringDonation` table
- [ ] Verify nextBillingDate is set

## Common Issues

### "Email service not configured"
**Solution:** Add `RESEND_API_KEY` to `.env.local`

### "Database not found"
**Solution:** Run `npx prisma db push` to create tables

### "iPay credentials pending"
**Solution:** This is normal. System works with bank transfer until iPay is configured.

### Emails not sending
**Solution:**
1. Verify `RESEND_API_KEY` is correct
2. Verify domain `donations@sylviasbasket.co.ke` in Resend dashboard
3. Check Resend logs for errors

## Production Deployment

### Before Going Live

1. **Database**
   - Use production PostgreSQL (Neon/Supabase)
   - Run migrations: `npx prisma migrate deploy`

2. **iPay**
   - Test thoroughly in sandbox mode
   - Switch to live mode: `IPAY_MODE=live`
   - Update callback URL in iPay dashboard

3. **Email**
   - Verify `donations@sylviasbasket.co.ke` domain in Resend
   - Test email deliverability

4. **Environment Variables**
   - Set all production values in hosting platform
   - Never commit `.env.local` to git

### Deployment Platforms

**Recommended: Vercel**
```bash
vercel --prod
```

Add environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add all vars from `.env.local`

**Alternative: Netlify, Railway, Render**
- Follow their docs for Next.js deployment
- Add environment variables in their dashboard

## Security Checklist

- [ ] `.env.local` in `.gitignore`
- [ ] Database uses SSL connections
- [ ] iPay hash verification enabled
- [ ] HTTPS enabled for production
- [ ] Webhook URL uses HTTPS
- [ ] API rate limiting considered
- [ ] Input validation on all forms

## Support

For issues:
1. Check console logs
2. Check Prisma Studio: `npx prisma studio`
3. Check Resend dashboard for email logs
4. Check iPay dashboard for payment logs

## Next Steps (Phase 3 - Optional)

Future enhancements:
1. **Admin Dashboard**
   - View all donations
   - Export to CSV
   - Filter by date/status
   - Analytics and charts

2. **Homepage Widget**
   - Donation progress bar
   - Recent donors (anonymous)
   - Impact counter

3. **Recurring Management**
   - Donor portal to manage subscriptions
   - Pause/cancel recurring donations
   - Update payment method

4. **Advanced Features**
   - Donation campaigns
   - Fundraising goals
   - Donor leaderboard
   - Tax receipts (if applicable)

## Contact

For questions about the donation system:
- Email: info@sylviasbasket.co.ke
- Or contact the developer who built this system

---

**Built with:**
- Next.js 14
- Prisma ORM
- PostgreSQL
- iPay Africa
- Resend Email
- Tailwind CSS
- Framer Motion
