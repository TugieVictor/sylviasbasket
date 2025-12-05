# Donation System - Complete Implementation

## ✅ What's Been Built

A complete, production-ready donation system for Sylvia's Basket with:

### Core Features
- **Multi-payment support**: M-Pesa, Card, Bank Transfer
- **Donation types**: One-time and monthly recurring
- **Beautiful UI**: Mobile-responsive with Sylvia's Basket branding
- **Email receipts**: Automatic receipts sent to donors
- **Admin notifications**: Email alerts for new donations
- **Order tracking**: Unique order IDs and status tracking
- **Success/failure pages**: Professional post-payment pages

### Technical Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Database**: Prisma ORM + PostgreSQL
- **Payments**: iPay Africa (placeholder ready)
- **Email**: Resend API
- **Validation**: Zod-like validation utilities
- **Animations**: Framer Motion

## 📁 Files Created

### Pages
- `/app/donate/page.tsx` - Main donation page (3-step form)
- `/app/donate/success/page.tsx` - Success page with receipt
- `/app/donate/failure/page.tsx` - Failure page with retry option

### API Routes
- `/app/api/donations/create/route.ts` - Create donation record
- `/app/api/donations/process/route.ts` - Process payment
- `/app/api/donations/callback/route.ts` - iPay webhook handler
- `/app/api/donations/[orderId]/status/route.ts` - Check donation status

### Library Code
- `/lib/donations/types.ts` - TypeScript types
- `/lib/donations/utils.ts` - Utility functions (validation, formatting)
- `/lib/donations/ipay.ts` - iPay integration (ready for credentials)
- `/lib/donations/email.ts` - Email receipt service
- `/lib/prisma.ts` - Prisma client singleton

### Database
- `/prisma/schema.prisma` - Database schema (Donation + RecurringDonation models)

### Documentation
- `DONATION_SYSTEM_SETUP.md` - Complete setup guide
- `DONATION_SYSTEM_README.md` - This file
- `PRISMA_SETUP.md` - Database setup instructions

### Configuration
- `.env.local` - Updated with donation variables
- `.env.example` - Updated with donation variables template

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install prisma @prisma/client
```

### 2. Set Up Database

Choose ONE of these (Neon recommended):

**Option A: Neon (Free, Serverless)**
1. Go to https://neon.tech
2. Create a project
3. Copy connection string
4. Add to `.env.local` as `DATABASE_URL`

**Option B: Supabase (Free)**
1. Go to https://supabase.com
2. Create a project
3. Get connection string from Settings → Database
4. Add to `.env.local` as `DATABASE_URL`

**Option C: Local PostgreSQL**
```bash
# Install PostgreSQL
createdb sylvias_basket
# Connection string: postgresql://postgres:password@localhost:5432/sylvias_basket
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Test the System

```bash
npm run dev
```

Visit: http://localhost:3000/donate

## ⚙️ Environment Variables

Add these to `.env.local`:

### Required (System won't work without these)

```env
# Database - REQUIRED
DATABASE_URL=postgresql://...

# Email Receipts - REQUIRED
RESEND_API_KEY=re_...
```

### Optional (Can test without these)

```env
# iPay Payment Gateway - Get from client
IPAY_VENDOR_ID=
IPAY_HASH_KEY=
IPAY_MODE=test

# Bank Transfer Details
NEXT_PUBLIC_BANK_NAME=Equity Bank
NEXT_PUBLIC_BANK_ACCOUNT_NUMBER=

# Site URL
NEXT_PUBLIC_SITE_URL=https://sylviasbasket.co.ke
```

## 🧪 Testing

### Test Bank Transfer (Works Now)

1. Visit `/donate`
2. Select any amount
3. Fill in details
4. Choose "Bank Transfer"
5. Submit
6. ✅ Should see bank details

### Test M-Pesa/Card (Needs iPay Credentials)

1. Get iPay credentials from client
2. Add to `.env.local`
3. Visit `/donate`
4. Choose M-Pesa or Card
5. Should redirect to iPay checkout

## 📊 Database Schema

### Donation Table
```sql
- id (unique ID)
- orderId (DONATE-{timestamp}-{random})
- donorName
- donorEmail
- donorPhone (Kenyan format: 254XXXXXXXXX)
- amount (Float)
- currency (KES)
- paymentMethod (MPESA/CARD/BANK)
- donationType (ONCE/MONTHLY)
- status (PENDING/COMPLETED/FAILED/CANCELLED)
- transactionId (from iPay)
- message (optional)
- createdAt
- updatedAt
```

### RecurringDonation Table
```sql
- id
- donationId (foreign key)
- subscriptionId (iPay subscription)
- frequency (MONTHLY)
- nextBillingDate
- status (ACTIVE/CANCELLED/PAUSED)
```

## 🔄 User Flow

### One-Time Donation Flow

1. **User visits `/donate`**
2. **Step 1**: Select amount (predefined or custom)
3. **Step 2**: Enter details (name, email, phone, message)
4. **Step 3**: Choose payment method (M-Pesa/Card/Bank)
5. **Submit**:
   - For Bank Transfer → Show bank details
   - For M-Pesa/Card → Redirect to iPay
6. **Payment processed**
7. **Redirect to success page**
8. **Email receipt sent**
9. **Admin notification sent**

### Monthly Recurring Flow

Same as above, but:
- User toggles "Monthly" on Step 1
- Creates recurring record in database
- iPay handles auto-billing monthly
- User can cancel anytime via email

## 🎨 Design Features

- ✅ Matches Sylvia's Basket green theme
- ✅ Mobile-responsive
- ✅ Smooth animations (Framer Motion)
- ✅ Progress indicator (3 steps)
- ✅ Form validation with helpful errors
- ✅ Loading states
- ✅ Success animations (checkmark)
- ✅ Failure animations (X icon)
- ✅ Copy-to-clipboard for bank details

## 🔐 Security Features

- ✅ Input validation (Kenyan phone, email, amounts)
- ✅ iPay hash verification (when configured)
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (HTML escaping)
- ✅ HTTPS required for webhooks
- ✅ Environment variable protection

## 📧 Email Features

### Donor Receipt Email
- Professional HTML template
- Sylvia's Basket branding
- Donation details and receipt
- Impact message
- Call-to-action (See Our Work)
- Mobile-responsive

### Admin Notification
- New donation alert
- Donor contact info
- Donation details
- Optional message from donor

## ⏳ What's Pending

### From Client

1. **iPay Credentials** (Required for M-Pesa/Card)
   - Vendor ID
   - Hash Key
   - Test vs Live mode

2. **Bank Account Number** (Optional for Bank Transfer)
   - Account number to display
   - Branch name if needed

3. **Database Setup** (Required)
   - Choose provider (Neon/Supabase/etc)
   - Get connection string
   - Run migrations

### Optional Enhancements (Phase 3)

1. **Admin Dashboard**
   - View all donations
   - Export to CSV
   - Charts and analytics

2. **Homepage Widget**
   - Donation button
   - Progress bar
   - Impact counter

3. **Donor Portal**
   - Manage recurring donations
   - View donation history
   - Update payment info

## 🛠️ Maintenance

### Check Donation Status

```bash
npx prisma studio
```
Opens GUI at http://localhost:5555

### View Database Records

```typescript
import { prisma } from '@/lib/prisma'

// Get all donations
const donations = await prisma.donation.findMany()

// Get by status
const completed = await prisma.donation.findMany({
  where: { status: 'COMPLETED' }
})

// Get recurring donations
const recurring = await prisma.recurringDonation.findMany({
  include: { donation: true }
})
```

### Export Donations to CSV

```typescript
// Create API route: /api/admin/export
const donations = await prisma.donation.findMany()
// Convert to CSV and download
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add environment variables in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add all variables from `.env.local`

### Other Platforms

Works with:
- Netlify
- Railway
- Render
- AWS Amplify

Just ensure:
1. Add all environment variables
2. Run `npx prisma generate` during build
3. Use PostgreSQL connection pooling for serverless

## 📝 Notes

### Phone Number Format
- Accepts: 0712345678, 712345678, +254712345678
- Converts to: 254712345678
- Validation: Must be Kenyan (254 + 9 digits)

### Amount Limits
- Minimum: KES 100
- Maximum: KES 1,000,000
- Validation on frontend and backend

### Order ID Format
- Format: `DONATE-{timestamp}-{random}`
- Example: `DONATE-1701234567890-XYZ123`
- Unique per donation

### Payment Methods

**M-Pesa** (via iPay)
- STK Push (automatic)
- Customer enters PIN
- Instant notification

**Card** (via iPay)
- Visa/Mastercard
- 3D Secure enabled
- International cards supported

**Bank Transfer** (Manual)
- Shows bank details
- User makes transfer
- Email confirmation required

## 🐛 Troubleshooting

### "Database not found"
```bash
npx prisma db push
```

### "Email service not configured"
Add `RESEND_API_KEY` to `.env.local`

### "iPay credentials pending"
Normal - system works with bank transfer only

### Donations not appearing
Check Prisma Studio: `npx prisma studio`

### Emails not sending
1. Check Resend dashboard
2. Verify domain `donations@sylviasbasket.co.ke`
3. Check API key is correct

## 📞 Support

For issues:
1. Check `DONATION_SYSTEM_SETUP.md` for detailed setup
2. Check console logs for errors
3. Check database with Prisma Studio
4. Contact: info@sylviasbasket.co.ke

---

**System Status**: ✅ **READY FOR TESTING**

**Waiting On**:
- [ ] iPay credentials from client
- [ ] Database setup (Neon/Supabase)
- [ ] Bank account number (optional)

**Next Steps**:
1. Set up database (15 minutes)
2. Test with bank transfer
3. Get iPay credentials
4. Test M-Pesa/Card payments
5. Deploy to production

Built with ❤️ for Sylvia's Basket
