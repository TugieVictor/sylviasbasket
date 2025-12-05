import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params

    const donation = await prisma.donation.findUnique({
      where: { orderId },
      include: {
        recurringDonation: true,
      },
    })

    if (!donation) {
      return NextResponse.json(
        { success: false, error: 'Donation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      donation: {
        orderId: donation.orderId,
        amount: donation.amount,
        currency: donation.currency,
        status: donation.status,
        donationType: donation.donationType,
        paymentMethod: donation.paymentMethod,
        transactionId: donation.transactionId,
        createdAt: donation.createdAt,
        updatedAt: donation.updatedAt,
        isRecurring: !!donation.recurringDonation,
        recurringStatus: donation.recurringDonation?.status,
        nextBillingDate: donation.recurringDonation?.nextBillingDate,
      },
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check donation status' },
      { status: 500 }
    )
  }
}
