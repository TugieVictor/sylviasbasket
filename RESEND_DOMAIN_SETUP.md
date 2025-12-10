# Resend Domain Verification Setup

## Current Status
- ✅ Resend API Key configured: `re_YcCyuV2q_54YzZ9gq4J4TbrwwnTFJAujr`
- ❌ Domain `sylviasbasket.co.ke` NOT verified
- ❌ Emails currently failing with error: "The sylviasbasket.co.ke domain is not verified"

## Why Domain Verification is Required

Resend requires domain verification to:
- Prevent email spoofing
- Improve email deliverability
- Allow sending from `donations@sylviasbasket.co.ke` instead of `onboarding@resend.dev`

## Step-by-Step Setup in Vercel

### Step 1: Add Domain in Resend

1. Go to https://resend.com/domains
2. Click **"Add Domain"**
3. Enter domain: `sylviasbasket.co.ke`
4. Click **"Add"**

Resend will provide you with DNS records to add. You'll see something like:

**TXT Record (for domain verification):**
- Name: `@` or `sylviasbasket.co.ke`
- Value: `resend-verify=XXXXXXXXXXXXXXXX`

**MX Records (for receiving bounces/replies):**
- Name: `@`
- Priority: `10`
- Value: `feedback-smtp.us-east-1.amazonses.com`

**DKIM Records (for email authentication):**
- Name: `resend._domainkey`
- Value: `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...`

### Step 2: Add DNS Records in Vercel

1. Go to https://vercel.com/dashboard
2. Navigate to your project: **sylvias-basket-website**
3. Go to **Settings → Domains**
4. Find `sylviasbasket.co.ke` and click **"Manage DNS Records"**
5. Click **"Add Record"**

Add each record provided by Resend:

**TXT Record:**
- Type: `TXT`
- Name: `@`
- Value: `resend-verify=XXXXXXXXXXXXXXXX` (copy from Resend)
- TTL: `Auto`

**MX Record:**
- Type: `MX`
- Name: `@`
- Priority: `10`
- Value: `feedback-smtp.us-east-1.amazonses.com`
- TTL: `Auto`

**DKIM TXT Record:**
- Type: `TXT`
- Name: `resend._domainkey`
- Value: `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...` (copy from Resend)
- TTL: `Auto`

### Step 3: Verify Domain in Resend

1. Go back to https://resend.com/domains
2. Click **"Verify"** next to your domain
3. Wait for verification (can take 1-15 minutes)
4. Once verified, you'll see a green checkmark ✅

### Step 4: Update Email Configuration

Once verified, update `lib/donations/email.ts` to use your verified domain:

```typescript
from: 'Sylvia\'s Basket <donations@sylviasbasket.co.ke>'
```

This is already configured correctly in the code.

## Testing After Verification

Once the domain is verified:

1. Submit a test donation at http://localhost:3002/donate
2. Check logs for successful email sending
3. Check inbox at the donor email address
4. Check spam folder if not in inbox

## Troubleshooting

**DNS propagation taking too long?**
- DNS changes can take 5-60 minutes to propagate
- Check DNS status: https://dnschecker.org/
- Enter `sylviasbasket.co.ke` and check TXT records

**Still not receiving emails after verification?**
- Check Resend logs: https://resend.com/logs
- Verify email address isn't in spam
- Check Resend API key is correct in `.env.local`

**Want to test without domain verification?**
- Change the `from` address to use Resend's default:
  ```typescript
  from: 'Sylvia\'s Basket <onboarding@resend.dev>'
  ```
- This will work immediately but looks less professional

## Alternative: Use Resend Default Domain (Quick Test)

If you want to test emails immediately without DNS setup, we can temporarily use Resend's default sending domain:

Change in `lib/donations/email.ts`:
```typescript
// Temporary - for testing only
from: 'Sylvias Basket <onboarding@resend.dev>'
```

This will work right away, but emails will come from `@resend.dev` instead of `@sylviasbasket.co.ke`.

## Next Steps

1. ✅ Add domain in Resend dashboard
2. ✅ Copy DNS records from Resend
3. ✅ Add DNS records in Vercel
4. ⏳ Wait for DNS propagation (5-60 minutes)
5. ✅ Verify domain in Resend
6. ✅ Test donation emails

---

**Important:** Once domain is verified, all emails from the donation system will work perfectly!
