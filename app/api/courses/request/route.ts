import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { newReference } from '@/lib/payments'
import { describeSessionDates } from '@/lib/courses'
import { emailCourseRequested } from '@/lib/email/courses'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { clientIp, isRateLimited } from '@/lib/security/rateLimit'
import { nairobiToday, parseDateOnly } from '@/lib/visits'
import { EMAIL_ERROR, PHONE_ERROR, isValidEmail, normaliseKenyanPhone } from '@/lib/validation'

export const dynamic = 'force-dynamic'

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

export async function POST(request: Request) {
  const ip = clientIp(request)
  if (isRateLimited(`course:${ip}`, 10)) {
    return NextResponse.json({ error: 'Too many requests in a short time. Please try again later.' }, { status: 429 })
  }
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  if (body.website) return NextResponse.json({ success: true, reference: 'CRS-RECEIVED' }) // spam field

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ error: 'We could not confirm you are human. Please refresh the page and try again.' }, { status: 400 })
  }

  const errors: Record<string, string> = {}
  const name = text(body.name, 100)
  const email = text(body.email, 200).toLowerCase()
  const phone = normaliseKenyanPhone(text(body.phone, 20))
  const organisation = text(body.organisation, 150)
  const message = text(body.message, 2000)
  const groupSize = Number(body.groupSize || 1)
  const courseId = text(body.courseId, 40)
  const sessionId = text(body.sessionId, 40)
  const preferredDate = body.preferredDate ? parseDateOnly(body.preferredDate) : null

  const course = courseId ? await prisma.course.findFirst({ where: { id: courseId, active: true } }) : null
  const session = sessionId && course ? await prisma.courseSession.findFirst({ where: { id: sessionId, courseId: course.id, status: 'OPEN' } }) : null

  if (courseId && !course) errors.courseId = 'Please choose a course from the list.'
  if (!name) errors.name = 'Please enter your name.'
  if (!phone) errors.phone = PHONE_ERROR
  if (!isValidEmail(email)) errors.email = EMAIL_ERROR
  if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 200) errors.groupSize = 'Please enter how many people would join.'
  if (body.preferredDate && !preferredDate) errors.preferredDate = 'Please choose a valid date.'
  else if (preferredDate && preferredDate < parseDateOnly(nairobiToday())!) errors.preferredDate = 'Please choose a date in the future.'

  if (Object.keys(errors).length > 0 || !phone) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', errors }, { status: 400 })
  }

  const saved = await prisma.courseRequest.create({
    data: {
      reference: newReference('CRS'),
      courseId: course?.id,
      courseTitle: course?.title || 'General interest (any course)',
      sessionId: session?.id,
      name,
      phone,
      email,
      organisation: organisation || null,
      groupSize,
      preferredDate: session ? null : preferredDate,
      message: message || null,
    },
  })

  const sessionLabel = session ? `${describeSessionDates(session.startDate, session.endDate)}, ${session.location}` : undefined
  await emailCourseRequested(saved, new URL(request.url).origin, sessionLabel).catch((error) => console.error('Course request emails failed:', error))

  return NextResponse.json({ success: true, reference: saved.reference })
}
