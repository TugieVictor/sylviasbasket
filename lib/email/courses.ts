import type { CourseRequest } from '@prisma/client'
import { adminEmail, renderEmail, sendEmail } from './index'
import { formatDate } from '@/lib/visits'

const details = (r: CourseRequest, sessionLabel?: string) => [
  { label: 'Reference', value: r.reference },
  { label: 'Course', value: r.courseTitle },
  ...(sessionLabel ? [{ label: 'Date', value: sessionLabel }] : []),
  ...(!sessionLabel && r.preferredDate ? [{ label: 'Preferred date', value: formatDate(r.preferredDate) }] : []),
  { label: 'People', value: String(r.groupSize) },
]

export async function emailCourseRequested(r: CourseRequest, siteOrigin: string, sessionLabel?: string) {
  await Promise.all([
    sendEmail({
      to: adminEmail(),
      replyTo: r.email,
      subject: `New course request from ${r.name} (${r.reference})`,
      html: renderEmail({
        title: 'New course request',
        intro: `${r.name} would like to join a course.`,
        details: [
          ...details(r, sessionLabel),
          { label: 'Phone', value: `+${r.phone}` },
          { label: 'Email', value: r.email },
          ...(r.organisation ? [{ label: 'Organisation', value: r.organisation }] : []),
          ...(r.message ? [{ label: 'Message', value: r.message }] : []),
        ],
        button: { label: 'Open in admin', url: `${siteOrigin}/admin/courses/requests/${r.id}/` },
      }),
    }),
    sendEmail({
      to: r.email,
      subject: `We received your course request (${r.reference})`,
      html: renderEmail({
        title: 'Thank you for your interest',
        intro: `Hello ${r.name},`,
        paragraphs: ['Thank you for asking to join a course at Sylvia’s Basket. Sylvia will get back to you soon with the details.'],
        details: details(r, sessionLabel),
        footerNote: 'You received this email because you sent a course request on sylviasbasket.co.ke.',
      }),
    }),
  ])
}
