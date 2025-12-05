# Contact Form Setup Instructions

The contact form is configured to use your existing email infrastructure on the shared hosting at SSLCorp, without requiring any third-party email services like Resend.

## How It Works

The form sends data to a PHP script (`contact-handler.php`) on your shared hosting, which uses the server's built-in mail function to send emails to `info@sylviasbasket.co.ke`.

## Setup Steps

### Step 1: Upload the PHP Handler to Your Shared Hosting

1. **Locate the file**: `public/contact-handler.php` in this project
2. **Connect to your shared hosting** via:
   - **cPanel File Manager**, or
   - **FTP client** (FileZilla, etc.)
3. **Upload `contact-handler.php`** to the root directory of your website (usually `public_html/` or `www/`)

   The file should be accessible at: `https://sylviasbasket.co.ke/contact-handler.php`

### Step 2: Set Correct Permissions

Using cPanel File Manager or FTP client:
1. Right-click on `contact-handler.php`
2. Set permissions to **644** (read/write for owner, read for group/others)

### Step 3: Configure CORS (Security)

For better security, edit `contact-handler.php` on the server and update this line:

```php
header('Access-Control-Allow-Origin: *');
```

Replace `*` with your actual domain:

```php
header('Access-Control-Allow-Origin: https://sylviasbasket.co.ke');
```

This prevents other websites from using your contact form.

### Step 4: Test the Form

1. Visit your website's "Get Involved" page
2. Fill out the contact form
3. Submit it
4. Check if you receive an email at `info@sylviasbasket.co.ke`

### Step 5: Verify the Production URL

In `app/get-involved/page.tsx` (line 44), confirm the URL matches your domain:

```typescript
const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://sylviasbasket.co.ke/contact-handler.php'  // ✓ Confirm this matches
  : '/contact-handler.php'
```

## Troubleshooting

### Emails Not Sending?

1. **Check PHP mail() is enabled** on your hosting:
   - Contact Mark at SSLCorp to confirm mail() function is available
   - Most shared hosting enables this by default

2. **Check spam folder**: Server emails often land in spam initially

3. **Enable error logging** in `contact-handler.php`:
   - Temporarily enable error reporting (already enabled in the file for debugging)
   - Check PHP error logs in cPanel

4. **Test the script directly**:
   - Visit `https://sylviasbasket.co.ke/contact-handler.php` in your browser
   - You should see: `{"error":"Method not allowed"}` (This is correct - it means the script is working)

### CORS Errors?

If you see CORS errors in the browser console:
1. Verify the `Access-Control-Allow-Origin` header in `contact-handler.php`
2. Make sure the header is set to `*` or your specific domain
3. Clear browser cache and try again

### Alternative: Ask Mark to Configure

If you prefer, you can ask Mark at SSLCorp to:
1. Upload the `contact-handler.php` file for you
2. Verify that PHP's `mail()` function is enabled
3. Configure the proper email headers for your domain

## What Happens When Someone Submits the Form

1. User fills out the contact form on your website
2. Form data is sent to `contact-handler.php` on your shared hosting
3. PHP script validates the data
4. Email is sent using the server's mail function
5. Email arrives at `info@sylviasbasket.co.ke` with:
   - **From**: noreply@sylviasbasket.co.ke
   - **Reply-To**: The user's email address
   - **Subject**: "New Contact Form Submission from [Name]"
   - **Body**: Formatted HTML with the user's name, email, and message

## Benefits of This Approach

✅ No third-party email services needed (no Resend, SendGrid, etc.)
✅ Uses your existing email infrastructure
✅ No monthly costs or API limits
✅ No additional configuration with domain DNS
✅ Works with existing info@sylviasbasket.co.ke email

## Security Notes

- The PHP script validates and sanitizes all input
- HTML special characters are escaped to prevent XSS
- Email addresses are validated
- CORS headers can be restricted to your domain only
- File permissions should be set to 644 (not executable)

## Need Help?

Contact Mark at SSLCorp if you need assistance with:
- Uploading the PHP file
- Verifying mail() function is enabled
- Checking email logs
- Troubleshooting delivery issues
