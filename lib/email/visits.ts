import type { VisitRequest } from '@prisma/client'
import { adminEmail, formatKes, renderEmail, sendEmail } from './index'
import { formatDate } from '@/lib/visits'

/** Emails for farm visit requests */

const details = (visit: VisitRequest) => [
  { label: 'Reference', value: visit.reference },
  { label: 'Visit type', value: visit.visitTypeName },
  { label: 'Group size', value: String(visit.groupSize) },
  { label: 'Preferred date', value: formatDate(visit.preferredDate1) },
  ...(visit.preferredDate2 ? [{ label: 'Second choice', value: formatDate(visit.preferredDate2) }] : []),
]

export async function emailVisitRequested(visit: VisitRequest, siteOrigin: string) {
  const jobs: Promise<unknown>[] = [
    sendEmail({
      to: adminEmail(),
      replyTo: visit.email || undefined,
      subject: `New farm visit request from ${visit.name} (${visit.reference})`,
      html: renderEmail({
        title: 'New farm visit request',
        intro: `${visit.name} would like to visit the farm.`,
        details: [
          ...details(visit),
          { label: 'Phone', value: visit.phone },
          { label: 'Email', value: visit.email || 'Not given' },
          ...(visit.organisation ? [{ label: 'Organisation', value: visit.organisation }] : []),
          ...(visit.message ? [{ label: 'Message', value: visit.message }] : []),
        ],
        button: { label: 'Open in admin', url: `${siteOrigin}/admin/visits/${visit.id}/` },
      }),
    }),
  ]
  if (visit.email) {
    jobs.push(
      sendEmail({
        to: visit.email,
        subject: `We received your farm visit request (${visit.reference})`,
        html: renderEmail({
          title: 'Thank you for your visit request',
          intro: `Hello ${visit.name},`,
          paragraphs: [
            'Thank you for asking to visit the farm. Sylvia will look at your request and get back to you to confirm a date.',
          ],
          details: details(visit),
          footerNote: 'You received this email because you requested a farm visit on sylviasbasket.co.ke.',
        }),
      })
    )
  }
  await Promise.all(jobs)
}

export async function emailVisitConfirmed(visit: VisitRequest, siteOrigin: string) {
  if (!visit.email || !visit.confirmedDate) return
  const needsPayment = (visit.feeKes || 0) > 0
  await sendEmail({
    to: visit.email,
    subject: `Your farm visit is confirmed (${visit.reference})`,
    html: renderEmail({
      title: 'Your farm visit is confirmed',
      intro: `Hello ${visit.name},`,
      paragraphs: [
        `Your visit is confirmed for ${formatDate(visit.confirmedDate)}.`,
        needsPayment
          ? 'Please pay the visit fee using the button below to secure your visit.'
          : 'There is no fee for this visit. We look forward to welcoming you.',
      ],
      details: [
        { label: 'Reference', value: visit.reference },
        { label: 'Date', value: formatDate(visit.confirmedDate) },
        { label: 'Group size', value: String(visit.groupSize) },
        ...(needsPayment ? [{ label: 'Fee', value: formatKes(visit.feeKes!) }] : []),
      ],
      button: needsPayment ? { label: 'Pay the visit fee', url: `${siteOrigin}/farm-visits/pay/${visit.reference}/` } : undefined,
      footerNote: 'Questions? Reply to info@sylviasbasket.co.ke or call +254 738 895395.',
    }),
  })
}

export async function emailVisitDeclined(visit: VisitRequest, reason: string) {
  if (!visit.email) return
  await sendEmail({
    to: visit.email,
    subject: `About your farm visit request (${visit.reference})`,
    html: renderEmail({
      title: 'About your farm visit request',
      intro: `Hello ${visit.name},`,
      paragraphs: [
        'Thank you for your interest in visiting the farm. Unfortunately we are not able to host your visit on the dates you asked for.',
        ...(reason ? [reason] : []),
        'You are welcome to send a new request for other dates.',
      ],
      details: [{ label: 'Reference', value: visit.reference }],
    }),
  })
}

export async function emailVisitPaid(visit: VisitRequest) {
  const jobs: Promise<unknown>[] = [
    sendEmail({
      to: adminEmail(),
      subject: `Visit fee paid: ${visit.name} (${visit.reference})`,
      html: renderEmail({
        title: 'Visit fee paid',
        details: [
          { label: 'Reference', value: visit.reference },
          { label: 'Name', value: visit.name },
          { label: 'Date', value: visit.confirmedDate ? formatDate(visit.confirmedDate) : 'Not set' },
          { label: 'Amount', value: formatKes(visit.feeKes || 0) },
        ],
      }),
    }),
  ]
  if (visit.email) {
    jobs.push(
      sendEmail({
        to: visit.email,
        subject: `Payment received for your farm visit (${visit.reference})`,
        html: renderEmail({
          title: 'Payment received',
          intro: `Hello ${visit.name},`,
          paragraphs: ['Thank you, we have received your payment. See you at the farm!'],
          details: [
            { label: 'Reference', value: visit.reference },
            { label: 'Date', value: visit.confirmedDate ? formatDate(visit.confirmedDate) : 'To be confirmed' },
            { label: 'Amount paid', value: formatKes(visit.feeKes || 0) },
          ],
        }),
      })
    )
  }
  await Promise.all(jobs)
}
