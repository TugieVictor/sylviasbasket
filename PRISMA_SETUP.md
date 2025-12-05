# Prisma Database Setup for Donation System

## Prerequisites

You need a PostgreSQL database. Options:
1. **Local PostgreSQL** - Install on your machine
2. **Neon** (Recommended) - Free serverless PostgreSQL: https://neon.tech
3. **Supabase** - Free tier with PostgreSQL: https://supabase.com
4. **Railway** - Free tier: https://railway.app

## Step 1: Install Prisma

```bash
npm install prisma @prisma/client
npm install -D prisma
```

## Step 2: Set Up Database URL

Add to `.env.local`:

```env
# For Neon/Supabase/Railway - you'll get this connection string from them
DATABASE_URL="postgresql://username:password@hostname:5432/database_name?sslmode=require"

# For local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/sylvias_basket"
```

## Step 3: Generate Prisma Client

```bash
npx prisma generate
```

## Step 4: Create Database Tables

```bash
npx prisma db push
```

Or for production (with migrations):

```bash
npx prisma migrate dev --name init
```

## Step 5: Verify Setup

```bash
npx prisma studio
```

This opens a GUI to view your database at http://localhost:5555

## Database Provider Options

### Option A: Neon (Recommended - Free & Easy)

1. Go to https://neon.tech
2. Sign up (free tier: 10GB storage, 100 hours compute/month)
3. Create a new project
4. Copy the connection string
5. Add to `.env.local` as `DATABASE_URL`

### Option B: Supabase

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the "Connection String" (make sure to use the pooling connection string)
5. Add to `.env.local`

### Option C: Local PostgreSQL

1. Install PostgreSQL: https://www.postgresql.org/download/
2. Create a database:
   ```bash
   createdb sylvias_basket
   ```
3. Use connection string: `postgresql://postgres:yourpassword@localhost:5432/sylvias_basket`

## Troubleshooting

### Error: "Can't reach database server"
- Check your DATABASE_URL is correct
- Ensure database is running
- For cloud databases, check firewall/IP allowlist settings

### Error: "relation does not exist"
- Run `npx prisma db push` to create tables
- Or run migrations: `npx prisma migrate dev`

### Error: "prisma client is not generated"
- Run `npx prisma generate`

## Using Prisma in Code

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create a donation
const donation = await prisma.donation.create({
  data: {
    orderId: 'DONATE-123',
    donorName: 'John Doe',
    donorEmail: 'john@example.com',
    donorPhone: '254712345678',
    amount: 1000,
    paymentMethod: 'MPESA',
    donationType: 'ONCE',
  }
})

// Find donations
const donations = await prisma.donation.findMany({
  where: { status: 'COMPLETED' },
  orderBy: { createdAt: 'desc' }
})
```

## Production Deployment

When deploying to production:

1. Use `npx prisma migrate deploy` instead of `db push`
2. Set `DATABASE_URL` in your production environment variables
3. Run `npx prisma generate` during build
4. Consider connection pooling for serverless (e.g., PgBouncer with Neon/Supabase)

## Next Steps

After setting up Prisma:
1. Update `.env.local` with your `DATABASE_URL`
2. Run `npx prisma generate`
3. Run `npx prisma db push`
4. The donation API routes will now work with the database
