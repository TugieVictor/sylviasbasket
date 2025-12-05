import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initiateIPayPayment } from '@/lib/donations/ipay'
import type { PaymentMethod } from '@/lib/donations/types'

export async function POST(request: Request) {
  try {
    const { orderId, paymentMethod } = await request.json()

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

    // Handle bank transfer (manual process)
    if (paymentMethod === 'BANK') {
      // Bank transfer doesn't need immediate processing
      // User will be shown bank details on the frontend
      return NextResponse.json({
        success: true,
        message: 'Bank transfer details will be displayed',
        orderId,
      })
    }

    // For M-Pesa and Card, initiate iPay payment
    // TODO: When iPay credentials are available, this will redirect to iPay
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

    if (paymentResult.success && paymentResult.redirectUrl) {
      return NextResponse.json({
        success: true,
        redirectUrl: paymentResult.redirectUrl,
        orderId,
      })
    }

    // If iPay not configured, return placeholder response
    return NextResponse.json({
      success: true,
      message: 'Payment gateway integration pending',
      orderId,
      // For now, redirect to success page (remove when iPay is configured)
      redirectUrl: `/donate/success?orderId=${orderId}`,
    })

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}
