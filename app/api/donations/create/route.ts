import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateDonationForm, sanitizeDonationData, generateOrderId } from '@/lib/donations/utils'
import type { DonationFormData } from '@/lib/donations/types'

export async function POST(request: Request) {
  try {
    const body = await request.json() as DonationFormData

    // Validate donation data
    const validation = validateDonationForm(body)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Sanitize data
    const sanitized = sanitizeDonationData(body)

    // Generate unique order ID
    const orderId = generateOrderId()

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        orderId,
        donorName: sanitized.donorName,
        donorEmail: sanitized.donorEmail,
        donorPhone: sanitized.donorPhone,
        amount: sanitized.amount,
        currency: 'KES',
        paymentMethod: sanitized.paymentMethod,
        donationType: sanitized.donationType,
        status: 'PENDING',
        message: sanitized.message,
      },
    })

    // If monthly donation, create recurring record
    if (sanitized.donationType === 'MONTHLY') {
      const nextBillingDate = new Date()
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)

      await prisma.recurringDonation.create({
        data: {
          donationId: donation.id,
          frequency: 'MONTHLY',
          nextBillingDate,
          status: 'ACTIVE',
        },
      })
    }

    return NextResponse.json({
      success: true,
      orderId: donation.orderId,
      message: 'Donation created successfully',
    })

  } catch (error) {
    console.error('Donation creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create donation' },
      { status: 500 }
    )
  }
}
