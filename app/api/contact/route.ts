import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Get Resend API key from environment
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us directly at info@sylviasbasket.co.ke' },
        { status: 500 }
      )
    }

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Website Contact Form <noreply@sylviasbasket.co.ke>',
        to: 'info@sylviasbasket.co.ke',
        reply_to: email,
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>

            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #374151; margin-top: 0; font-size: 18px; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">Contact Details</h2>
                <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #22c55e;">${email}</a></p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h2 style="color: #374151; margin-top: 0; font-size: 18px; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">Message</h2>
                <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  💡 <strong>Tip:</strong> You can reply directly to this email to respond to ${name}
                </p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
              <p>This email was sent from the Sylvia's Basket contact form</p>
              <p>© ${new Date().getFullYear()} Sylvia's Basket. All rights reserved.</p>
            </div>
          </div>
        `,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend API error:', data)
      return NextResponse.json(
        { error: 'Failed to send message. Please try emailing us directly at info@sylviasbasket.co.ke' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again or email us at info@sylviasbasket.co.ke' },
      { status: 500 }
    )
  }
}
