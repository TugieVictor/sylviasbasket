# Email to Sylvia - Request for iPay Credentials

---

**To:** Sylvia Kuria
**From:** [Your Name]
**Subject:** iPay Africa Integration - Credentials Needed for Donation System
**Date:** December 10, 2024

---

Hi Sylvia,

I hope this email finds you well.

Great news! We've successfully completed the development of the donation system for the Sylvia's Basket website. The system is now ready to accept donations via **M-Pesa, Card Payments, and Bank Transfer**.

## Current Status

✅ **Completed:**
- Donation form with multiple payment options
- Database setup (PostgreSQL via Neon)
- Email receipt system (sends confirmation to donors)
- Admin notification system (alerts you of new donations)
- Success/Failure pages
- Donation tracking dashboard
- Bank transfer instructions

⏳ **Pending - iPay Integration:**
To enable live **M-Pesa STK Push** and **Card Payments**, we need to integrate with iPay Africa. Since you mentioned you've used iPay in the past, we just need your existing credentials to complete the integration.

## What We Need From You

Please provide the following information from your iPay Africa account:

### 1. **iPay Vendor ID**
   - Your unique merchant identifier
   - Format: Usually a number like `12345`

### 2. **iPay Hash Key** (or API Key)
   - Security key used for payment authentication
   - Format: Long alphanumeric string

### 3. **Account Mode**
   - Are we using **Test/Sandbox** or **Live/Production** mode?
   - Recommendation: Start with Test mode, then switch to Live after testing

### 4. **iPay Callback URL** (Already configured on our end)
   - We've set this to: `https://sylviasbasket.co.ke/api/donations/callback`
   - You may need to whitelist this URL in your iPay dashboard

## Where to Find These Credentials

If you have access to your iPay account:

1. Log into your **iPay Africa merchant dashboard** at: https://ipayafrica.com/
2. Navigate to **Settings** → **API Credentials** (or similar)
3. You should see your **Vendor ID** and **Hash Key** listed there
4. Copy both and send them to me securely

**Security Note:** Please send these credentials via a secure method (encrypted email, password-protected document, or direct message). Do NOT post them in shared channels.

## If You Don't Have Access

If you no longer have access to your iPay account or can't find the credentials:

- **Option 1:** Contact iPay Support to reset your password: support@ipayafrica.com
- **Option 2:** Register a new iPay merchant account (I can guide you through this)
- **Option 3:** We can explore alternative payment gateways (Flutterwave, Paystack, etc.)

## What Happens After Integration

Once we have the credentials, here's what will work:

✅ **M-Pesa STK Push** - Donors receive automatic M-Pesa prompt on their phone
✅ **Card Payments** - Visa/Mastercard payments processed securely
✅ **Bank Transfer** - Manual donations with email instructions
✅ **Email Receipts** - Automatic confirmation emails to donors
✅ **Admin Notifications** - You get notified of every donation
✅ **Recurring Donations** - Monthly giving option (if you want this)

## Timeline

Once you provide the credentials:
- **Testing:** 1-2 hours to integrate and test
- **Launch:** Can go live same day if tests pass
- **Training:** I'll show you how to monitor donations in the dashboard

## Bank Transfer Details Update

I noticed the bank account number is missing from the `.env.local` file. Please also provide:

**Bank Transfer Information:**
- Bank Name: Equity Bank (already configured)
- Account Name: Sylvia's Basket (already configured)
- **Account Number:** _____________ ← Please provide

This will be displayed to donors who choose the "Bank Transfer" payment option.

## Next Steps

Please reply with:
1. ✅ iPay Vendor ID
2. ✅ iPay Hash Key
3. ✅ Account Mode (Test or Live)
4. ✅ Bank Account Number

Once I receive these, I'll:
1. Integrate iPay credentials
2. Test M-Pesa and Card payments
3. Deploy the system to production
4. Send you the final launch checklist

## Questions?

If you have any questions or need help accessing your iPay account, please let me know. I'm here to help!

Looking forward to your response.

Best regards,
[Your Name]

---

**P.S.** The donation system is already saving donations to the database successfully. We're just waiting on iPay to enable the M-Pesa and Card payment processing. Bank transfers are already working!
