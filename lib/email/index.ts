/**
 * Shared email sending (Resend) and a branded layout for all website emails.
 *
 * Settings:
 *   RESEND_API_KEY  required
 *   EMAIL_FROM      e.g. "Sylvia's Basket <hello@sylviasbasket.co.ke>" once the
 *                   domain is verified in Resend; until then Resend's test sender
 *   ADMIN_EMAIL     where alerts for Sylvia go
 */

const DEFAULT_FROM = "Sylvia's Basket <onboarding@resend.dev>"

export const adminEmail = () => process.env.ADMIN_EMAIL || 'info@sylviasbasket.co.ke'

export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export const formatKes = (amount: number) => `KES ${Math.round(amount).toLocaleString('en-KE')}`

type SendEmail = { to: string | string[]; subject: string; html: string; replyTo?: string }

export async function sendEmail({ to, subject, html, replyTo }: SendEmail): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set; email not sent:', subject)
    return { ok: false, error: 'Email is not configured' }
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || DEFAULT_FROM,
        to,
        subject: subject.replace(/[\r\n]+/g, ' '),
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    })
    if (!response.ok) {
      const detail = await response.text()
      console.error('Resend error:', response.status, detail)
      return { ok: false, error: 'Email could not be sent' }
    }
    return { ok: true }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { ok: false, error: 'Email could not be sent' }
  }
}

type Detail = { label: string; value: string }
type Layout = {
  title: string
  intro?: string // plain text, escaped
  paragraphs?: string[] // plain text, escaped
  details?: Detail[] // plain text, escaped
  button?: { label: string; url: string }
  footerNote?: string
}

/** Branded email in the site's colours. All text is escaped, so it is safe for customer input. */
export function renderEmail({ title, intro, paragraphs = [], details = [], button, footerNote }: Layout) {
  const rows = details
    .map(
      (d) =>
        `<tr><td style="padding:8px 0;color:#6b7280;font-size:14px;width:40%;vertical-align:top">${escapeHtml(d.label)}</td>` +
        `<td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600">${escapeHtml(d.value)}</td></tr>`
    )
    .join('')

  return `<!doctype html>
<html><body style="margin:0;background:#f5f1ea;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f1ea;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
        <tr><td style="background:#2b392b;padding:28px 32px">
          <p style="margin:0;color:#87d4af;font-size:13px;letter-spacing:1px;text-transform:uppercase">Sylvia's Basket</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;line-height:1.3">${escapeHtml(title)}</h1>
        </td></tr>
        <tr><td style="padding:28px 32px">
          ${intro ? `<p style="margin:0 0 16px;color:#111827;font-size:16px;line-height:1.6">${escapeHtml(intro)}</p>` : ''}
          ${paragraphs.map((p) => `<p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6">${escapeHtml(p)}</p>`).join('')}
          ${rows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 16px;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb">${rows}</table>` : ''}
          ${
            button
              ? `<p style="margin:24px 0 8px"><a href="${escapeHtml(button.url)}" style="background:#1a6546;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:bold;display:inline-block">${escapeHtml(button.label)}</a></p>`
              : ''
          }
        </td></tr>
        <tr><td style="padding:20px 32px;background:#faf7f2;color:#6b7280;font-size:12px;line-height:1.6">
          ${footerNote ? `${escapeHtml(footerNote)}<br>` : ''}
          Sylvia's Basket, Limuru, Kiambu County, Kenya · info@sylviasbasket.co.ke · +254 738 895395
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}
