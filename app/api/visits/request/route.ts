import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { newReference } from '@/lib/payments'
import { EMAIL_ERROR, PHONE_ERROR, isValidEmail, normaliseKenyanPhone } from '@/lib/validation'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { clientIp, isRateLimited } from '@/lib/security/rateLimit'
import { checkVisitDate, parseDateOnly } from '@/lib/visits'
import { emailVisitRequested } from '@/lib/email/visits'

export const dynamic = 'force-dynamic'

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

export async function POST(request: Request) {
  const ip = clientIp(request)
  if (isRateLimited(`visit:${ip}`, 10)) {
    return NextResponse.json({ error: 'Too many requests in a short time. Please try again later.' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  // Hidden spam field: pretend success
  if (body.website) return NextResponse.json({ success: true, reference: 'VIS-RECEIVED' })

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ error: 'We could not confirm you are human. Please refresh the page and try again.' }, { status: 400 })
  }

  const errors: Record<string, string> = {}
  const name = text(body.name, 100)
  const email = text(body.email, 200).toLowerCase()
  const organisation = text(body.organisation, 150)
  const message = text(body.message, 2000)
  const phone = normaliseKenyanPhone(text(body.phone, 20))
  const groupSize = Number(body.groupSize)
  const date1 = parseDateOnly(body.preferredDate1)
  const date2 = body.preferredDate2 ? parseDateOnly(body.preferredDate2) : null

  const visitType = await prisma.visitType.findFirst({ where: { id: text(body.visitTypeId, 50), active: true } })

  if (!visitType) errors.visitTypeId = 'Please choose a type of visit.'
  if (!name) errors.name = 'Please enter your name.'
  if (!phone) errors.phone = PHONE_ERROR
  if (!isValidEmail(email)) errors.email = EMAIL_ERROR
  if (!Number.isInteger(groupSize) || groupSize < 1) errors.groupSize = 'Please enter how many people will come.'
  else if (visitType && groupSize > visitType.maxGroupSize) {
    errors.groupSize = `This type of visit is for up to ${visitType.maxGroupSize} people.`
  }
  if (!date1) errors.preferredDate1 = 'Please choose a date.'
  else if (visitType) {
    const problem = checkVisitDate(date1, visitType)
    if (problem) errors.preferredDate1 = problem
  }
  if (body.preferredDate2 && !date2) errors.preferredDate2 = 'Please choose a valid date.'
  else if (date2 && visitType) {
    const problem = checkVisitDate(date2, visitType)
    if (problem) errors.preferredDate2 = problem
  }

  if (Object.keys(errors).length > 0 || !visitType || !phone || !date1) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', errors }, { status: 400 })
  }

  const visit = await prisma.visitRequest.create({
    data: {
      reference: newReference('VIS'),
      visitTypeId: visitType.id,
      visitTypeName: visitType.name,
      name,
      phone,
      email,
      organisation: organisation || null,
      groupSize,
      preferredDate1: date1,
      preferredDate2: date2,
      message: message || null,
      feeKes: visitType.feeKes,
    },
  })

  await emailVisitRequested(visit, new URL(request.url).origin).catch((error) =>
    console.error('Visit request emails failed:', error)
  )

  return NextResponse.json({ success: true, reference: visit.reference })
}
