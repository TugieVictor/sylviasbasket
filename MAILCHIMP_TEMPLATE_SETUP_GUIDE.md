# Mailchimp Newsletter Template Setup Guide

## Overview
This guide will help you implement the custom Sylvia's Basket newsletter template in Mailchimp.

---

## Part 1: Uploading the Template to Mailchimp

### Step 1: Access Email Templates
1. Log in to your Mailchimp account
2. Click on **"Campaigns"** in the top navigation
3. Click **"Email templates"** in the dropdown
4. Click the **"Create Template"** button

### Step 2: Choose Template Type
1. Select **"Code your own"** option
2. Choose **"Paste in code"**

### Step 3: Import the HTML Code
1. Open the file `mailchimp-newsletter-template.html`
2. Copy ALL the HTML code from the file
3. Paste it into the code editor in Mailchimp
4. Name your template: **"Sylvia's Basket Newsletter Template"**
5. Click **"Save"**

---

## Part 2: Customizing Your Template

### Sections You Need to Edit Before Sending

#### 1. **Featured Story Section** (Lines 77-90)
Replace:
```html
<h3>Featured Story: [ARTICLE TITLE]</h3>
<p>[Insert your featured article summary here...]</p>
<a href="[ARTICLE_LINK]">Read More →</a>
```

With your actual content:
```html
<h3>Featured Story: How Jane Increased Her Harvest by 200%</h3>
<p>Meet Jane Wanjiru from Limuru, who transformed her farm using organic methods learned at Sylvia's Basket training. Her story shows the power of sustainable agriculture.</p>
<a href="https://yourwebsite.com/blog/jane-success-story">Read More →</a>
```

#### 2. **Update Items** (Lines 124-173)
Replace the three update items with your actual monthly updates:

**Update 1 - Training Programs:**
```html
<p style="color: #2d3748; font-size: 16px; font-weight: bold; margin: 0 0 5px 0;">
  Organic Farming Workshop - March 2025
</p>
<p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0;">
  Join us for a 3-day intensive workshop on organic pest management.
  Registration closes March 15th. Limited to 30 participants.
</p>
```

**Update 2 - Success Stories:**
```html
<p style="color: #2d3748; font-size: 16px; font-weight: bold; margin: 0 0 5px 0;">
  Farmer of the Month: Peter Kamau
</p>
<p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0;">
  Peter has successfully transitioned his 2-acre farm to 100% organic production.
  Read his journey and tips for new farmers.
</p>
```

**Update 3 - Events:**
```html
<p style="color: #2d3748; font-size: 16px; font-weight: bold; margin: 0 0 5px 0;">
  Community Farmers Market - Every Saturday
</p>
<p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0;">
  Visit our organic produce market in Limuru town center, 8am-2pm.
  Fresh vegetables, fruits, and herbs directly from our farmer network.
</p>
```

#### 3. **Call to Action Links** (Lines 181-197)
Replace placeholder links:
```html
<a href="[DONATION_LINK]">Donate Now</a>
<a href="[WEBSITE_LINK]">Visit Our Website</a>
```

With your actual URLs:
```html
<a href="https://yourwebsite.com/get-involved">Donate Now</a>
<a href="https://yourwebsite.com">Visit Our Website</a>
```

#### 4. **Social Media Links** (Lines 210-227)
Replace placeholder social media links with your actual profiles:
```html
<a href="[FACEBOOK_LINK]">Facebook</a>
<a href="[TWITTER_LINK]">Twitter</a>
<a href="https://www.instagram.com/sylvias_basket/">Instagram</a>
<a href="[LINKEDIN_LINK]">LinkedIn</a>
```

Example:
```html
<a href="https://www.facebook.com/sylviasbasket">Facebook</a>
<a href="https://twitter.com/sylviasbasket">Twitter</a>
<a href="https://www.instagram.com/sylvias_basket/">Instagram</a>
<a href="https://www.linkedin.com/company/sylviasbasket">LinkedIn</a>
```

---

## Part 3: Using Mailchimp Merge Tags

### Pre-configured Merge Tags in the Template

The template already includes these Mailchimp merge tags:

1. **`*|FNAME|*`** - Subscriber's first name
   - Shows in greeting: "Hello *|FNAME|*!"
   - If no first name, shows: "Hello !"

2. **`*|CURRENT_YEAR|*`** - Current year
   - Shows in footer copyright

3. **`*|UNSUB|*`** - Unsubscribe link
   - Required by law - DO NOT REMOVE

4. **`*|UPDATE_PROFILE|*`** - Update preferences link
   - Allows subscribers to manage their info

5. **`*|REWARDS|*`** - Mailchimp badge (for free accounts)
   - Required if you have a free Mailchimp account

### How to Add More Personalization

If you want to add the subscriber's full name or other fields:

```html
<!-- First Name -->
Hello *|FNAME|*!

<!-- Last Name -->
Hello *|FNAME|* *|LNAME|*!

<!-- Email -->
Your email: *|EMAIL|*

<!-- Custom Field (if you created it in Mailchimp) -->
Your location: *|LOCATION|*
```

---

## Part 4: Creating a Campaign with Your Template

### Step 1: Create New Campaign
1. Go to **"Campaigns"** → **"Create Campaign"**
2. Select **"Email"**
3. Choose **"Regular"**

### Step 2: Campaign Setup
1. **To**: Select your audience (the one with your subscribers)
2. **From**: Set sender name to "Sylvia's Basket" and email to "info@sylviasbasket.org"
3. **Subject**: Write an engaging subject line
   - Example: "🌱 March Newsletter: New Training Program + Farmer Success Stories"

### Step 3: Select Template
1. In the **"Design Email"** step
2. Click **"Saved templates"**
3. Select **"Sylvia's Basket Newsletter Template"**

### Step 4: Edit Content
1. Click on any section to edit
2. Replace all `[PLACEHOLDERS]` with your actual content
3. Update images if needed
4. Test all links

### Step 5: Preview & Test
1. Click **"Preview and Test"** at the top
2. **"Enter Preview Mode"** - see how it looks
3. **"Send a Test Email"** - send to your email to review
4. Check on mobile and desktop

### Step 6: Send or Schedule
1. Once satisfied, click **"Continue"**
2. Review all settings
3. Choose to **"Send Now"** or **"Schedule"** for later
4. Click **"Send"** when ready!

---

## Part 5: Best Practices

### Content Tips
1. **Subject Lines**
   - Keep under 50 characters
   - Use emojis sparingly (one or two max)
   - Create urgency or curiosity
   - Examples:
     - "🌱 Your Monthly Organic Farming Updates"
     - "New Training Alert: Limited Spots Available"
     - "Meet This Month's Farmer Success Story"

2. **Preheader Text**
   - Set in campaign settings
   - Shows after subject line in inbox
   - 40-50 characters recommended
   - Example: "Training updates, farmer stories & upcoming events"

3. **Content Length**
   - Keep newsletters concise (300-500 words)
   - Use bullet points and short paragraphs
   - Focus on 1-2 main stories
   - Include clear calls-to-action

4. **Images**
   - Keep file sizes small (under 1MB each)
   - Use alt text for accessibility
   - Optimize for mobile viewing

### Sending Schedule
- **Frequency**: Monthly is recommended to start
- **Best Days**: Tuesday, Wednesday, Thursday
- **Best Times**:
  - 10am-11am (morning coffee break)
  - 1pm-2pm (lunch time)
  - 7pm-8pm (evening relaxation)

### Email List Hygiene
- Remove bounced emails regularly
- Monitor open rates (aim for 15-25%)
- Remove inactive subscribers after 6 months
- Always include unsubscribe link (it's the law!)

---

## Part 6: Tracking & Analytics

### Key Metrics to Monitor

1. **Open Rate**
   - Good: 15-25%
   - Check in Mailchimp dashboard after sending

2. **Click Rate**
   - Good: 2-5%
   - Shows engagement with your content

3. **Bounce Rate**
   - Should be under 2%
   - Remove bounced emails

4. **Unsubscribe Rate**
   - Should be under 0.5%
   - If higher, review content quality

### Where to Find Analytics
1. Go to **"Campaigns"**
2. Click on your sent campaign
3. View **"Reports"**
4. Check:
   - Open rate
   - Click map (which links were clicked)
   - Geographic data
   - Time of opens/clicks

---

## Part 7: Mobile Optimization

The template is already mobile-responsive, but always:

1. **Test on Mobile** before sending
   - Use Mailchimp's preview tool
   - Send test email to your phone

2. **Check These Elements**:
   - Text is readable (minimum 14px font size)
   - Buttons are easy to tap (minimum 44px height)
   - Images load quickly
   - Layout doesn't break

---

## Part 8: Troubleshooting

### Issue: Images Not Showing
**Solution**:
- Use absolute URLs (https://...) for images
- Host images on your website or use Mailchimp's image hosting
- Check image file size (keep under 1MB)

### Issue: Formatting Looks Wrong
**Solution**:
- Clear browser cache
- Use "Preview Mode" in Mailchimp
- Send test email to different email clients (Gmail, Outlook, Yahoo)

### Issue: Links Not Working
**Solution**:
- Ensure all `href` attributes have full URLs starting with `https://`
- Test all links in preview mode
- Check for broken links before sending

### Issue: Going to Spam
**Solution**:
- Avoid spam trigger words ("free", "buy now", "click here")
- Don't use all caps in subject line
- Balance text vs images (more text than images)
- Use a verified domain for sender email
- Encourage subscribers to add you to contacts

---

## Part 9: A/B Testing

Test different elements to improve performance:

1. **Subject Lines**
   - Test emoji vs no emoji
   - Test question vs statement
   - Test length (short vs long)

2. **Send Times**
   - Test morning vs afternoon vs evening
   - Test weekday vs weekend

3. **Content**
   - Test image placement
   - Test CTA button text
   - Test content length

### How to A/B Test in Mailchimp:
1. Create campaign as usual
2. Enable "A/B Test" option
3. Choose what to test
4. Set test group size (10-20%)
5. Mailchimp sends winner to remaining subscribers

---

## Part 10: Legal Compliance

### Required Elements (Already in Template)
✅ Unsubscribe link
✅ Physical address (update with your real address)
✅ Clear sender identification

### GDPR Compliance (if applicable)
- Get explicit consent before subscribing
- Explain what emails they'll receive
- Honor unsubscribe requests immediately
- Store data securely

---

## Quick Checklist Before Sending

- [ ] All `[PLACEHOLDER]` text replaced with real content
- [ ] All links tested and working
- [ ] Social media links updated
- [ ] Contact information is current
- [ ] Images load properly
- [ ] Merge tags working (`*|FNAME|*` shows subscriber name)
- [ ] Preview on desktop and mobile
- [ ] Test email sent and reviewed
- [ ] Subject line is engaging
- [ ] Preheader text set
- [ ] Scheduled for optimal send time
- [ ] Final proofread for typos

---

## Support & Resources

### Mailchimp Resources
- [Mailchimp Knowledge Base](https://mailchimp.com/help/)
- [Email Marketing Best Practices](https://mailchimp.com/resources/email-marketing-best-practices/)
- [Template Language Reference](https://mailchimp.com/help/getting-started-with-mailchimps-template-language/)

### Need Help?
- Mailchimp Support: Available in your dashboard
- Community Forum: [Mailchimp Community](https://mailchimp.com/community/)

---

## Next Steps

1. ✅ Upload the HTML template to Mailchimp
2. ✅ Customize with your content
3. ✅ Update all links and social media
4. ✅ Create your first campaign
5. ✅ Send test email
6. ✅ Schedule and send!

**Good luck with your newsletter! 🌱**

---

*Last Updated: November 2025*
*Template Version: 1.0*