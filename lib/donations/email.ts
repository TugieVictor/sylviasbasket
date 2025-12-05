/**
 * Email Receipt Service for Donations
 * Uses Resend API (already configured for contact form)
 */

import { formatCurrency, formatDate, getPaymentMethodName } from './utils'
import type { Donation } from './types'

/**
 * Send donation receipt email to donor
 */
export async function sendDonationReceipt(donation: {
  orderId: string
  donorName: string
  donorEmail: string
  amount: number
  donationType: string
  paymentMethod: string
  transactionId?: string
  createdAt: Date
}): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error('RESEND_API_KEY not configured')
    return {
      success: false,
      error: 'Email service not configured',
    }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sylvias Basket <donations@sylviasbasket.co.ke>',
        to: donation.donorEmail,
        subject: `Thank you for your donation - ${donation.orderId}`,
        html: generateReceiptHTML(donation),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend API error:', data)
      return {
        success: false,
        error: 'Failed to send receipt email',
      }
    }

    return { success: true }

  } catch (error) {
    console.error('Email sending error:', error)
    return {
      success: false,
      error: 'Failed to send receipt email',
    }
  }
}

/**
 * Generate HTML email template for donation receipt
 */
function generateReceiptHTML(donation: {
  orderId: string
  donorName: string
  amount: number
  donationType: string
  paymentMethod: string
  transactionId?: string
  createdAt: Date
}): string {
  const isRecurring = donation.donationType === 'MONTHLY'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
      padding: 40px 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .header p {
      color: rgba(255, 255, 255, 0.9);
      margin: 10px 0 0 0;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .receipt-box {
      background: #f9f9f9;
      border: 2px solid #4CAF50;
      border-radius: 8px;
      padding: 25px;
      margin: 25px 0;
    }
    .receipt-title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
      text-align: center;
      padding-bottom: 15px;
      border-bottom: 2px solid #4CAF50;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .receipt-row:last-child {
      border-bottom: none;
    }
    .receipt-label {
      color: #666;
      font-size: 14px;
    }
    .receipt-value {
      color: #333;
      font-weight: 600;
      font-size: 14px;
      text-align: right;
    }
    .amount-highlight {
      font-size: 24px;
      color: #4CAF50;
      font-weight: bold;
    }
    .info-box {
      background: #e8f5e9;
      border-left: 4px solid #4CAF50;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box p {
      margin: 0;
      color: #2e7d32;
      font-size: 14px;
    }
    .impact-section {
      background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin: 30px 0;
      text-align: center;
    }
    .impact-section h2 {
      margin: 0 0 15px 0;
      font-size: 22px;
    }
    .impact-section p {
      margin: 0;
      opacity: 0.95;
      font-size: 15px;
      line-height: 1.6;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
    }
    .stat {
      text-align: center;
    }
    .stat-number {
      font-size: 28px;
      font-weight: bold;
      display: block;
      margin-bottom: 5px;
    }
    .stat-label {
      font-size: 12px;
      opacity: 0.9;
    }
    .button {
      display: inline-block;
      background: #4CAF50;
      color: white;
      padding: 14px 30px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 600;
      margin: 20px auto;
      text-align: center;
    }
    .footer {
      background: #f5f5f5;
      padding: 30px;
      text-align: center;
      color: #666;
      font-size: 13px;
      border-radius: 0 0 10px 10px;
    }
    .footer p {
      margin: 5px 0;
    }
    .footer a {
      color: #4CAF50;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Thank You for Your Donation!</h1>
      <p>Supporting sustainable farming in Kenya</p>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Dear ${donation.donorName},</p>

      <p>
        Thank you for your generous ${isRecurring ? 'monthly recurring' : ''} donation to Sylvia's Basket.
        Your support helps us empower smallholder farmers, promote sustainable agriculture, and build
        resilient food systems across Kenya.
      </p>

      <!-- Receipt -->
      <div class="receipt-box">
        <div class="receipt-title">Donation Receipt</div>

        <div class="receipt-row">
          <span class="receipt-label">Receipt Number:</span>
          <span class="receipt-value">${donation.orderId}</span>
        </div>

        <div class="receipt-row">
          <span class="receipt-label">Date:</span>
          <span class="receipt-value">${formatDate(donation.createdAt)}</span>
        </div>

        <div class="receipt-row">
          <span class="receipt-label">Donation Type:</span>
          <span class="receipt-value">${isRecurring ? 'Monthly Recurring' : 'One-Time'}</span>
        </div>

        <div class="receipt-row">
          <span class="receipt-label">Payment Method:</span>
          <span class="receipt-value">${getPaymentMethodName(donation.paymentMethod as any)}</span>
        </div>

        ${donation.transactionId ? `
        <div class="receipt-row">
          <span class="receipt-label">Transaction ID:</span>
          <span class="receipt-value">${donation.transactionId}</span>
        </div>
        ` : ''}

        <div class="receipt-row" style="padding-top: 20px; margin-top: 15px; border-top: 2px solid #4CAF50;">
          <span class="receipt-label" style="font-size: 16px;">Total Amount:</span>
          <span class="receipt-value amount-highlight">${formatCurrency(donation.amount)}</span>
        </div>
      </div>

      ${isRecurring ? `
      <div class="info-box">
        <p>
          <strong>Recurring Donation:</strong> Your monthly donation of ${formatCurrency(donation.amount)}
          will be automatically processed. You can manage or cancel your recurring donation at any time
          by contacting us at info@sylviasbasket.co.ke
        </p>
      </div>
      ` : ''}

      <!-- Impact Section -->
      <div class="impact-section">
        <h2>Your Impact</h2>
        <p>
          Your contribution directly supports our mission to train farmers, promote organic farming,
          and create sustainable livelihoods across Kenya.
        </p>
        <div class="stats">
          <div class="stat">
            <span class="stat-number">1,000+</span>
            <span class="stat-label">Farmers Trained</span>
          </div>
          <div class="stat">
            <span class="stat-number">50+</span>
            <span class="stat-label">Partner Farms</span>
          </div>
          <div class="stat">
            <span class="stat-number">5+ tonnes</span>
            <span class="stat-label">Monthly Produce</span>
          </div>
        </div>
      </div>

      <p>
        Want to see the impact of your donation? Visit our website to learn more about our work
        and the farmers we're supporting.
      </p>

      <center>
        <a href="https://sylviasbasket.co.ke/our-work" class="button">See Our Work</a>
      </center>

      <p style="margin-top: 30px;">
        If you have any questions about your donation, please don't hesitate to contact us at
        <a href="mailto:info@sylviasbasket.co.ke" style="color: #4CAF50; text-decoration: none; font-weight: 600;">
          info@sylviasbasket.co.ke
        </a>
      </p>

      <p style="margin-top: 20px; font-style: italic; color: #666;">
        With gratitude,<br>
        <strong style="color: #333;">The Sylvia's Basket Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Sylvia's Basket</strong></p>
      <p>Limuru, Kiambu County, Kenya</p>
      <p>
        <a href="https://sylviasbasket.co.ke">sylviasbasket.co.ke</a> |
        <a href="mailto:info@sylviasbasket.co.ke">info@sylviasbasket.co.ke</a> |
        +254 738 895395
      </p>
      <p style="margin-top: 15px; font-size: 11px; color: #999;">
        This is an automated receipt. Please save it for your records.
      </p>
      <p style="margin-top: 10px;">
        © ${new Date().getFullYear()} Sylvia's Basket. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Send admin notification email about new donation
 */
export async function sendAdminNotification(donation: {
  orderId: string
  donorName: string
  donorEmail: string
  donorPhone: string
  amount: number
  donationType: string
  paymentMethod: string
  message?: string
}): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sylvias Basket <donations@sylviasbasket.co.ke>',
        to: 'info@sylviasbasket.co.ke',
        subject: `New Donation: ${formatCurrency(donation.amount)} from ${donation.donorName}`,
        html: `
          <h2>New Donation Received!</h2>
          <p><strong>Order ID:</strong> ${donation.orderId}</p>
          <p><strong>Amount:</strong> ${formatCurrency(donation.amount)}</p>
          <p><strong>Type:</strong> ${donation.donationType === 'MONTHLY' ? 'Monthly Recurring' : 'One-Time'}</p>
          <p><strong>Payment Method:</strong> ${getPaymentMethodName(donation.paymentMethod as any)}</p>
          <hr/>
          <h3>Donor Information</h3>
          <p><strong>Name:</strong> ${donation.donorName}</p>
          <p><strong>Email:</strong> ${donation.donorEmail}</p>
          <p><strong>Phone:</strong> ${donation.donorPhone}</p>
          ${donation.message ? `<p><strong>Message:</strong> ${donation.message}</p>` : ''}
        `,
      }),
    })

    if (!response.ok) {
      return { success: false, error: 'Failed to send admin notification' }
    }

    return { success: true }

  } catch (error) {
    console.error('Admin notification error:', error)
    return { success: false, error: 'Failed to send admin notification' }
  }
}
