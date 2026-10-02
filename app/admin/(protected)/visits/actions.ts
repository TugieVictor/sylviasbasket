'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth/session'
import { siteOriginFromHeaders } from '@/lib/siteOrigin'
import { parseDateOnly } from '@/lib/visits'
import { emailVisitConfirmed, emailVisitDeclined } from '@/lib/email/visits'

async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login/')
  return admin
}

const str = (form: FormData, key: string, max = 2000) => String(form.get(key) ?? '').trim().slice(0, max)

export async function confirmVisit(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 50)
  const date = parseDateOnly(str(form, 'confirmedDate', 10))
  const fee = Math.round(Number(str(form, 'feeKes', 10)))
  if (!date || !Number.isFinite(fee) || fee < 0) redirect(`/admin/visits/${id}/?error=Please+enter+a+valid+date+and+fee`)

  const visit = await prisma.visitRequest.update({
    where: { id },
    data: { status: 'CONFIRMED', confirmedDate: date, feeKes: fee },
  })
  const sendEmail = form.get('sendEmail') === 'on'
  if (sendEmail) await emailVisitConfirmed(visit, siteOriginFromHeaders()).catch((e) => console.error(e))
  revalidatePath('/admin/visits')
  redirect(`/admin/visits/${id}/?done=${sendEmail ? 'confirmed-emailed' : 'confirmed'}`)
}

export async function declineVisit(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 50)
  const reason = str(form, 'reason', 1000)
  const visit = await prisma.visitRequest.update({ where: { id }, data: { status: 'DECLINED' } })
  if (form.get('sendEmail') === 'on') await emailVisitDeclined(visit, reason).catch((e) => console.error(e))
  revalidatePath('/admin/visits')
  redirect(`/admin/visits/${id}/?done=declined`)
}

export async function setVisitStatus(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 50)
  const status = str(form, 'status', 20)
  if (!['COMPLETED', 'CANCELLED', 'REQUESTED', 'PAID'].includes(status)) redirect(`/admin/visits/${id}/`)
  await prisma.visitRequest.update({ where: { id }, data: { status: status as 'COMPLETED' | 'CANCELLED' | 'REQUESTED' | 'PAID' } })
  revalidatePath('/admin/visits')
  redirect(`/admin/visits/${id}/?done=updated`)
}

export async function saveVisitNotes(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 50)
  await prisma.visitRequest.update({ where: { id }, data: { adminNotes: str(form, 'adminNotes', 5000) || null } })
  redirect(`/admin/visits/${id}/?done=notes`)
}

export async function saveVisitType(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 50)
  const weekdays = form.getAll('weekdays').map(String).filter((d) => /^[0-6]$/.test(d)).join(',')
  const data = {
    name: str(form, 'name', 80),
    description: str(form, 'description', 300) || null,
    feeKes: Math.max(0, Math.round(Number(str(form, 'feeKes', 10)) || 0)),
    maxGroupSize: Math.max(1, Math.round(Number(str(form, 'maxGroupSize', 5)) || 1)),
    minNoticeDays: Math.max(0, Math.round(Number(str(form, 'minNoticeDays', 3)) || 0)),
    weekdays: weekdays || '1,2,3,4,5',
    active: form.get('active') === 'on',
    sortOrder: Math.round(Number(str(form, 'sortOrder', 5)) || 0),
  }
  if (!data.name) redirect('/admin/visits/types/?error=Please+enter+a+name')
  if (id) await prisma.visitType.update({ where: { id }, data })
  else await prisma.visitType.create({ data })
  revalidatePath('/farm-visits')
  redirect('/admin/visits/types/?done=saved')
}
