import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyIPayCallback, handleIPayResponse } from '@/lib/donations/ipay'

/**
 * iPay Webhook Callback Handler
 * This endpoint receives payment notifications from iPay Africa
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('iPay callback received:', body)

    // Verify iPay callback authenticity
    const verification = verifyIPayCallback(body)
    if (!verification.valid) {
      console.error('Invalid iPay callback:', verification.error)
      return NextResponse.json(
        { success: false, error: 'Invalid callback' },
        { status: 400 }
      )
    }

    // Process the payment response
    const result = await handleIPayResponse(body)

    if (!result.success) {
      console.error('Failed to handle iPay response:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // Update donation status in database
    const { orderId, status, transactionId } = result

    const donation = await prisma.donation.update({
      where: { orderId },
      data: {
        status: status as 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED',
        transactionId,
        updatedAt: new Date(),
      },
    })

    // Send email receipt when donation is completed
    if (status === 'COMPLETED') {
      const { sendDonationReceipt, sendAdminNotification } = await import('@/lib/donations/email')

      // Send receipt to donor (don't block on email failures)
      sendDonationReceipt({
        orderId: donation.orderId,
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        amount: donation.amount,
        donationType: donation.donationType,
        paymentMethod: donation.paymentMethod,
        transactionId: donation.transactionId || undefined,
        createdAt: donation.createdAt,
      }).catch(err => console.error('Failed to send receipt:', err))

      // Send notification to admin
      sendAdminNotification({
        orderId: donation.orderId,
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        donorPhone: donation.donorPhone,
        amount: donation.amount,
        donationType: donation.donationType,
        paymentMethod: donation.paymentMethod,
        message: donation.message || undefined,
      }).catch(err => console.error('Failed to send admin notification:', err))
    }

    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully',
    })

  } catch (error) {
    console.error('Callback processing error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process callback' },
      { status: 500 }
    )
  }
}

/**
 * Handle GET requests (iPay may send some callbacks as GET)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')
  const status = searchParams.get('status')
  const transactionId = searchParams.get('transactionId')

  if (!orderId) {
    return NextResponse.redirect('/donate/failure')
  }

  try {
    // Update donation status
    await prisma.donation.update({
      where: { orderId },
      data: {
        status: status === 'success' ? 'COMPLETED' : 'FAILED',
        transactionId: transactionId || undefined,
        updatedAt: new Date(),
      },
    })

    // Redirect to appropriate page
    if (status === 'success') {
      return NextResponse.redirect(`/donate/success?orderId=${orderId}`)
    } else {
      return NextResponse.redirect(`/donate/failure?orderId=${orderId}`)
    }

  } catch (error) {
    console.error('Callback GET error:', error)
    return NextResponse.redirect('/donate/failure')
  }
}
