# Donation System Installation Guide

## ⚡ Quick Install (5 Minutes)

Run these commands in order:

```bash
# 1. Install dependencies
npm install

# 2. Set up database (choose ONE):

# Option A: Neon (Recommended - Free serverless PostgreSQL)
# Go to https://neon.tech → Create project → Copy connection string
# Add to .env.local: DATABASE_URL=postgresql://...

# Option B: Supabase (Free)
# Go to https://supabase.com → Create project → Get connection string
# Add to .env.local: DATABASE_URL=postgresql://...

# Option C: Local PostgreSQL
createdb sylvias_basket
# Add to .env.local: DATABASE_URL=postgresql://postgres:password@localhost:5432/sylvias_basket

# 3. Initialize database
npm run db:generate
npm run db:push

# 4. Start development server
npm run dev
```

Visit: **http://localhost:3000/donate**

## ✅ Verification

Test the system works:

1. Visit `/donate`
2. Select amount (e.g., KES 1,000)
3. Fill in your details
4. Choose "Bank Transfer"
5. Submit
6. ✅ You should see bank details displayed

## 📋 Environment Variables

Create or update `.env.local`:

### Minimum Required (System works with just these)

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://username:password@hostname:5432/database_name

# Email receipts (RECOMMENDED)
RESEND_API_KEY=re_your_key_here
```

### Full Configuration (For production)

```env
# Database
DATABASE_URL=postgresql://...

# Email Service
RESEND_API_KEY=re_...

# iPay Payment Gateway (Get from client)
IPAY_VENDOR_ID=
IPAY_HASH_KEY=
IPAY_CALLBACK_URL=https://sylviasbasket.co.ke/api/donations/callback
IPAY_MODE=test

# Bank Transfer Details
NEXT_PUBLIC_BANK_NAME=Equity Bank
NEXT_PUBLIC_BANK_ACCOUNT_NUMBER=

# Site URL
NEXT_PUBLIC_SITE_URL=https://sylviasbasket.co.ke
```

## 🗄️ Database Setup Details

### Neon (Recommended)

**Why Neon?**
- ✅ Free tier: 10GB storage, 100 hours compute/month
- ✅ Serverless (auto-scales)
- ✅ Built-in connection pooling
- ✅ Perfect for Next.js/Vercel
- ✅ No credit card required

**Setup:**
1. Go to https://neon.tech
2. Sign up with GitHub/Google
3. Create new project
4. Copy connection string
5. Add to `.env.local`:
   ```env
   DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Supabase

**Why Supabase?**
- ✅ Free tier: 500MB database, unlimited API requests
- ✅ Includes auth, storage, real-time features
- ✅ Built-in dashboard
- ✅ Great for future expansion

**Setup:**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy "Connection pooling" string (not "Direct connection")
5. Add to `.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres:pass@db.xxx.supabase.co:6543/postgres?pgbouncer=true
   ```

### Local PostgreSQL

**When to use:**
- Development only
- You have PostgreSQL installed
- Don't want to use cloud services

**Setup:**
```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt install postgresql
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/

# Create database
createdb sylvias_basket

# Add to .env.local
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/sylvias_basket
```

## 📧 Email Setup (Resend)

**Why needed:**
- Send donation receipts to donors
- Send admin notifications

**Setup:**
1. Go to https://resend.com
2. Sign up (free: 3,000 emails/month)
3. Go to API Keys → Create API Key
4. Copy key (starts with `re_`)
5. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_key_here
   ```

**Domain Verification (Production):**
1. In Resend dashboard → Domains
2. Add `sylviasbasket.co.ke`
3. Add DNS records (ask Mark from SSLCorp)
4. Verify domain
5. Now you can send from `donations@sylviasbasket.co.ke`

**For Development:**
Can use Resend's default sending domain without verification.

## 🔧 Useful Commands

```bash
# View database in browser GUI
npm run db:studio

# Reset database (WARNING: Deletes all data)
npm run db:push -- --force-reset

# Create migration (for production)
npm run db:migrate

# Check Prisma client is generated
npm run db:generate

# View all donations
npx prisma studio
# Then go to http://localhost:5555
```

## 🧪 Testing Checklist

After installation:

- [ ] Visit `/donate` - page loads
- [ ] Select amount - works
- [ ] Fill form - validation works
- [ ] Submit with Bank Transfer - shows bank details
- [ ] Check database - `npm run db:studio` shows record
- [ ] Check email receipt - sent if RESEND_API_KEY configured

## ❌ Troubleshooting

### Error: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npm install
npm run db:generate
```

### Error: "Can't reach database server"

**Solutions:**
1. Check `DATABASE_URL` is correct
2. For Neon/Supabase: ensure `?sslmode=require` is in URL
3. For local: ensure PostgreSQL is running
4. Test connection: `psql $DATABASE_URL`

### Error: "relation 'Donation' does not exist"

**Solution:**
```bash
npm run db:push
```

### Donation page shows errors

**Check:**
1. Database is set up: `npm run db:studio`
2. Prisma client generated: `npm run db:generate`
3. Console for errors: Open browser DevTools

### Email not sending

**Solutions:**
1. Check `RESEND_API_KEY` is in `.env.local`
2. Restart dev server after adding env var
3. Check Resend dashboard for logs
4. For production: verify domain in Resend

## 🚀 Next Steps

After installation:

1. **Test locally**: Use bank transfer option
2. **Get iPay credentials**: Contact client for vendor ID and hash key
3. **Configure bank details**: Add account number to `.env.local`
4. **Deploy**: See `DONATION_SYSTEM_SETUP.md` for deployment guide

## 📚 Documentation

- **Setup Guide**: `DONATION_SYSTEM_SETUP.md`
- **Complete README**: `DONATION_SYSTEM_README.md`
- **Database Setup**: `PRISMA_SETUP.md`
- **This File**: Quick installation only

## 🆘 Support

If you get stuck:

1. Check the error message in console
2. Check `DONATION_SYSTEM_SETUP.md` for detailed troubleshooting
3. Run `npm run db:studio` to inspect database
4. Check environment variables are correct
5. Contact: info@sylviasbasket.co.ke

---

**Installation Time**: ~5 minutes
**Database Provider**: Neon or Supabase recommended
**Email Service**: Resend (free tier sufficient)
**iPay**: Optional (can test with bank transfer)

Ready to accept donations! 🎉
