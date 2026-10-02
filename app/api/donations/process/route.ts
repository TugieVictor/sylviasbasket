import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initiateIPayPayment } from '@/lib/donations/ipay'
import type { PaymentMethod } from '@/lib/donations/types'

export async function POST(request: Request) {
  try {
    console.log('🔵 Payment processing started')
    const { orderId, paymentMethod } = await request.json()
    console.log('🔵 Received:', { orderId, paymentMethod })

    if (!orderId || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing orderId or paymentMethod' },
        { status: 400 }
      )
    }

    // Get donation from database
    const donation = await prisma.donation.findUnique({
      where: { orderId },
    })
    console.log('🔵 Donation found:', donation?.orderId)

    if (!donation) {
      return NextResponse.json(
        { success: false, error: 'Donation not found' },
        { status: 404 }
      )
    }

    if (donation.status !== 'PENDING') {
      return NextResponse.json(
        { success: false, error: 'Donation already processed' },
        { status: 400 }
      )
    }

    console.log('🔵 Payment method:', paymentMethod)

    // Handle bank transfer (manual process)
    if (paymentMethod === 'BANK') {
      console.log('🟡 Bank transfer detected - sending emails')
      // Send email with bank transfer details
      try {
        const { sendDonationReceipt, sendAdminNotification } = await import('@/lib/donations/email')

        // Send donor receipt with bank details
        await sendDonationReceipt({
          orderId: donation.orderId,
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          amount: donation.amount,
          paymentMethod: donation.paymentMethod,
          donationType: donation.donationType,
          transactionId: donation.transactionId || undefined,
          createdAt: donation.createdAt,
        })

        // Send admin notification
        await sendAdminNotification({
          orderId: donation.orderId,
          donorName: donation.donorName,
          donorEmail: donation.donorEmail,
          donorPhone: donation.donorPhone,
          amount: donation.amount,
          paymentMethod: donation.paymentMethod,
          donationType: donation.donationType,
          message: donation.message || undefined,
        })

        console.log(`✅ Bank transfer emails sent for donation: ${orderId}`)
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Don't fail the request if email fails
      }

      // User will be shown bank details on the frontend
      return NextResponse.json({
        success: true,
        message: 'Bank transfer details will be displayed',
        orderId,
      })
    }

    // For M-Pesa and Card, initiate iPay payment
    // TODO: When iPay credentials are available, this will redirect to iPay
    console.log('🟡 M-Pesa/Card detected - attempting iPay')
    const paymentResult = await initiateIPayPayment({
      orderId: donation.orderId,
      amount: donation.amount,
      currency: 'KES',
      email: donation.donorEmail,
      phone: donation.donorPhone,
      customerName: donation.donorName,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sylviasbasket.co.ke'}/api/donations/callback`,
      paymentMethod: paymentMethod as PaymentMethod,
    })
    console.log('🟡 iPay result:', paymentResult)

    if (paymentResult.success && paymentResult.redirectUrl) {
      console.log('🟢 iPay configured - redirecting')
      return NextResponse.json({
        success: true,
        redirectUrl: paymentResult.redirectUrl,
        orderId,
      })
    }

    // Online payment is not available yet. The donation stays PENDING and is
    // never marked as completed without a confirmed payment.
    return NextResponse.json(
      {
        success: false,
        error: 'Online payment is not available yet. Please use Bank Transfer or contact us at info@sylviasbasket.co.ke',
        orderId,
      },
      { status: 503 }
    )

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
