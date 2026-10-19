import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { newReference } from '@/lib/payments'
import { MAX_PER_ITEM } from '@/lib/shop'

/**
 * Shop orders. See version_2_plan.md, section 6 "Payment flow":
 * prices always come from the database, stock is held for 60 minutes while
 * the customer pays, and unpaid orders give their stock back.
 */
export const HOLD_MINUTES = 60

export const ORDER_STATUS_LABELS = {
  AWAITING_PAYMENT: 'Awaiting payment',
  PAID: 'Paid',
  PACKED: 'Packed',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired (not paid)',
} as const

export class OrderProblem extends Error {}

/** Puts back the stock of orders that were not paid in time. Safe to call often. */
export async function releaseExpiredOrders() {
  const expired = await prisma.order.findMany({
    where: { status: 'AWAITING_PAYMENT', stockHeldUntil: { lt: new Date() } },
    select: { id: true },
    take: 50,
  })
  for (const { id } of expired) {
    await prisma.$transaction(async (tx) => {
      // Only one request can move the order to EXPIRED, so stock is returned once
      const moved = await tx.order.updateMany({
        where: { id, status: 'AWAITING_PAYMENT', stockHeldUntil: { lt: new Date() } },
        data: { status: 'EXPIRED', stockHeldUntil: null },
      })
      if (moved.count !== 1) return
      await returnStock(tx, id)
    })
  }
}

async function returnStock(tx: Prisma.TransactionClient, orderId: string) {
  const items = await tx.orderItem.findMany({ where: { orderId, variantId: { not: null } } })
  for (const item of items) {
    await tx.productVariant.updateMany({ where: { id: item.variantId! }, data: { stock: { increment: item.quantity } } })
  }
}

/** Takes stock for every item, or nothing at all if one item is short. */
async function takeStock(tx: Prisma.TransactionClient, items: { variantId: string; quantity: number; productName: string }[]) {
  for (const item of items) {
    const taken = await tx.productVariant.updateMany({
      where: { id: item.variantId, active: true, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } },
    })
    if (taken.count !== 1) throw new OrderProblem(`Sorry, there is not enough ${item.productName} left. Please update your cart.`)
  }
}

type NewOrder = {
  items: { variantId: string; quantity: number }[]
  zoneId: string
  customerName: string
  customerPhone: string // already checked, 2547XXXXXXXX
  customerEmail: string
  address: string
  notes: string
}

export async function createOrder(input: NewOrder) {
  await releaseExpiredOrders()

  // Merge repeated lines and limit quantities
  const wanted = new Map<string, number>()
  for (const item of input.items) {
    const q = Math.floor(Number(item.quantity))
    if (!item.variantId || !Number.isFinite(q) || q < 1) continue
    wanted.set(item.variantId, Math.min(MAX_PER_ITEM, (wanted.get(item.variantId) || 0) + q))
  }
  if (wanted.size === 0) throw new OrderProblem('Your cart is empty.')
  if (wanted.size > 30) throw new OrderProblem('Too many different items in one order.')

  const zone = await prisma.deliveryZone.findFirst({ where: { id: input.zoneId, active: true } })
  if (!zone) throw new OrderProblem('Please choose how you would like to receive your order.')
  if (!zone.isPickup && input.address.length < 5) throw new OrderProblem('Please enter your delivery address.')

  const variants = await prisma.productVariant.findMany({
    where: { id: { in: Array.from(wanted.keys()) } },
    include: { product: true },
  })
  const lines = Array.from(wanted.entries()).map(([variantId, quantity]) => {
    const v = variants.find((x) => x.id === variantId)
    if (!v || !v.active || !v.product.active) throw new OrderProblem('An item in your cart is no longer available. Please update your cart.')
    if (v.product.category === 'PRODUCE' && !v.product.availableThisWeek) {
      throw new OrderProblem(`${v.product.name} is not available this week. Please remove it from your cart.`)
    }
    return {
      variantId,
      quantity,
      productName: v.product.name,
      variantLabel: v.label,
      unitPriceKes: v.priceKes,
      lineTotalKes: v.priceKes * quantity,
    }
  })

  const subtotalKes = lines.reduce((sum, l) => sum + l.lineTotalKes, 0)
  const deliveryFeeKes = zone.feeKes
  const totalKes = subtotalKes + deliveryFeeKes
  if (totalKes < 1) throw new OrderProblem('This order has nothing to pay for.')

  return prisma.$transaction(async (tx) => {
    await takeStock(tx, lines)
    return tx.order.create({
      data: {
        reference: newReference('SB'),
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        deliveryZoneId: zone.id,
        deliveryZoneName: zone.name,
        isPickup: zone.isPickup,
        address: zone.isPickup ? null : input.address,
        notes: input.notes || null,
        subtotalKes,
        deliveryFeeKes,
        totalKes,
        stockHeldUntil: new Date(Date.now() + HOLD_MINUTES * 60 * 1000),
        items: { create: lines },
      },
      include: { items: true },
    })
  })
}

/**
 * Called once a payment for an order is confirmed. Returns the order and
 * whether Sylvia needs to check stock (paid after the hold ran out).
 */
export async function markOrderPaid(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } })
  if (!order) return null

  if (order.status === 'AWAITING_PAYMENT') {
    const moved = await prisma.order.updateMany({
      where: { id: orderId, status: 'AWAITING_PAYMENT' },
      data: { status: 'PAID', stockHeldUntil: null },
    })
    return moved.count === 1 ? { order: { ...order, status: 'PAID' as const }, stockWarning: false } : null
  }

  if (order.status === 'EXPIRED' || order.status === 'CANCELLED') {
    // Money arrived after the stock was released: try to take it again
    let stockWarning = false
    try {
      await prisma.$transaction(async (tx) => {
        const moved = await tx.order.updateMany({ where: { id: orderId, status: order.status }, data: { status: 'PAID' } })
        if (moved.count !== 1) throw new Error('already handled')
        await takeStock(
          tx,
          order.items.filter((i) => i.variantId).map((i) => ({ variantId: i.variantId!, quantity: i.quantity, productName: i.productName }))
        )
      })
    } catch (error) {
      if ((error as Error).message === 'already handled') return null
      stockWarning = true
      await prisma.order.updateMany({
        where: { id: orderId, status: order.status },
        data: {
          status: 'PAID',
          adminNotes: [order.adminNotes, 'Paid after the 60-minute hold ran out and stock was short. Please check stock before packing.']
            .filter(Boolean)
            .join('\n'),
        },
      })
    }
    return { order: { ...order, status: 'PAID' as const }, stockWarning }
  }
  return null
}

export const orderStatusBadge = (status: string) => {
  const colours: Record<string, string> = {
    AWAITING_PAYMENT: 'bg-harvest-100 text-harvest-800',
    PAID: 'bg-accent-100 text-accent-800',
    PACKED: 'bg-sky-100 text-sky-800',
    OUT_FOR_DELIVERY: 'bg-violet-100 text-violet-800',
    DELIVERED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-gray-100 text-gray-500',
  }
  return `inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colours[status] || 'bg-gray-100'}`
}

/** Cancels an order and puts its items back in stock (unless already cancelled, expired or delivered). */
export async function cancelOrder(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, select: { status: true } })
    if (!order || ['CANCELLED', 'EXPIRED', 'DELIVERED'].includes(order.status)) return false
    const moved = await tx.order.updateMany({ where: { id: orderId, status: order.status }, data: { status: 'CANCELLED', stockHeldUntil: null } })
    if (moved.count !== 1) return false
    await returnStock(tx, orderId)
    return true
  })
}
