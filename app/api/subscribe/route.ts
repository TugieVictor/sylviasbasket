import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
    const API_KEY = process.env.MAILCHIMP_API_KEY
    const DATACENTER = process.env.MAILCHIMP_SERVER_PREFIX

    if (!AUDIENCE_ID || !API_KEY || !DATACENTER) {
      console.error('Mailchimp configuration is missing')
      return NextResponse.json(
        { error: 'Subscription service is not configured' },
        { status: 500 }
      )
    }

    const data = {
      email_address: email,
      status: 'subscribed',
      tags: ['Website Signup'],
    }

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    const result = await response.json()

    if (response.status >= 400) {
      // Check if already subscribed
      if (result.title === 'Member Exists') {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter!' },
          { status: 400 }
        )
      }

      console.error('Mailchimp API error:', result)
      return NextResponse.json(
        { error: result.detail || 'Failed to subscribe. Please try again.' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
