'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth/session'
import { cancelOrder } from '@/lib/orders'
import { emailOrderUpdate } from '@/lib/email/orders'

async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login/')
}

const str = (form: FormData, key: string, max = 2000) => String(form.get(key) ?? '').trim().slice(0, max)
const PAID_STEPS = ['PAID', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const

export async function setOrderStatus(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 40)
  const status = str(form, 'status', 20) as (typeof PAID_STEPS)[number]
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) redirect('/admin/orders/')
  // Only paid orders move along; unpaid ones cannot be marked as sent
  if (!(PAID_STEPS as readonly string[]).includes(status) || !(PAID_STEPS as readonly string[]).includes(order.status)) {
    redirect(`/admin/orders/${id}/?error=This+order+cannot+be+changed+to+that+step`)
  }
  const updated = await prisma.order.update({ where: { id }, data: { status } })
  const emailed = form.get('sendEmail') === 'on' && (status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED')
  if (emailed) await emailOrderUpdate(updated, status as 'OUT_FOR_DELIVERY' | 'DELIVERED', str(form, 'note', 500) || undefined).catch((e) => console.error(e))
  revalidatePath('/admin/orders')
  redirect(`/admin/orders/${id}/?done=${emailed ? 'emailed' : 'updated'}`)
}

export async function cancelOrderAction(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 40)
  if (form.get('confirm') !== 'on') redirect(`/admin/orders/${id}/?error=Tick+the+box+to+confirm+cancelling`)
  const done = await cancelOrder(id)
  revalidatePath('/admin/orders')
  revalidatePath('/shop')
  redirect(`/admin/orders/${id}/?${done ? 'done=cancelled' : 'error=This+order+can+no+longer+be+cancelled'}`)
}

export async function saveOrderNotes(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 40)
  await prisma.order.update({ where: { id }, data: { adminNotes: str(form, 'adminNotes', 5000) || null } })
  redirect(`/admin/orders/${id}/?done=notes`)
}

export async function saveDeliveryZone(form: FormData) {
  await requireAdmin()
  const id = str(form, 'id', 40)
  const name = str(form, 'name', 80)
  if (!name) redirect('/admin/delivery/?error=Please+enter+a+name')
  const data = {
    name,
    feeKes: Math.max(0, Math.round(Number(str(form, 'feeKes', 10)) || 0)),
    isPickup: form.get('isPickup') === 'on',
    active: form.get('active') === 'on',
    sortOrder: Math.round(Number(str(form, 'sortOrder', 5)) || 0),
  }
  if (id) await prisma.deliveryZone.update({ where: { id }, data })
  else await prisma.deliveryZone.create({ data })
  revalidatePath('/shop/checkout')
  redirect('/admin/delivery/?done=saved')
}
