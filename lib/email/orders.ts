import type { Order, OrderItem } from '@prisma/client'
import { adminEmail, formatKes, renderEmail, sendEmail } from './index'

/** Emails for shop orders */

const itemDetails = (items: OrderItem[]) =>
  items.map((i) => ({
    label: `${i.quantity} × ${i.productName}${i.variantLabel.toLowerCase() === 'standard' ? '' : ` (${i.variantLabel})`}`,
    value: formatKes(i.lineTotalKes),
  }))

const totals = (order: Order) => [
  { label: 'Subtotal', value: formatKes(order.subtotalKes) },
  { label: order.isPickup ? 'Collection' : `Delivery (${order.deliveryZoneName})`, value: order.deliveryFeeKes ? formatKes(order.deliveryFeeKes) : 'Free' },
  { label: 'Total paid', value: formatKes(order.totalKes) },
]

export async function emailOrderPaid(order: Order & { items: OrderItem[] }, stockWarning: boolean, siteOrigin?: string) {
  const origin = (siteOrigin || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  const delivery = order.isPickup
    ? [{ label: 'Collection', value: 'From the farm in Limuru' }]
    : [{ label: 'Deliver to', value: order.address || '' }]

  const jobs: Promise<unknown>[] = [
    sendEmail({
      to: adminEmail(),
      subject: `${stockWarning ? 'CHECK STOCK: ' : ''}New paid order ${order.reference} from ${order.customerName}`,
      replyTo: order.customerEmail || undefined,
      html: renderEmail({
        title: stockWarning ? 'New paid order: please check stock' : 'New paid order',
        intro: stockWarning
          ? 'This order was paid after its 60-minute hold ran out, and some items had sold out in the meantime. Please check stock before packing, and contact the customer if needed.'
          : 'A new order has been paid and is ready to pack.',
        details: [
          { label: 'Order', value: order.reference },
          { label: 'Customer', value: order.customerName },
          { label: 'Phone', value: `+${order.customerPhone}` },
          { label: 'Email', value: order.customerEmail || 'Not given' },
          ...delivery,
          ...(order.notes ? [{ label: 'Customer notes', value: order.notes }] : []),
          ...itemDetails(order.items),
          ...totals(order),
        ],
        ...(origin ? { button: { label: 'Open in the admin', url: `${origin}/admin/orders/${order.id}/` } } : {}),
      }),
    }),
  ]

  if (order.customerEmail) {
    jobs.push(
      sendEmail({
        to: order.customerEmail,
        subject: `Thank you for your order ${order.reference}`,
        html: renderEmail({
          title: 'Thank you for your order',
          intro: `Hello ${order.customerName},`,
          paragraphs: [
            'We have received your payment and Sylvia is preparing your order.',
            order.isPickup
              ? 'We will contact you when it is ready to collect from the farm.'
              : 'We will contact you on the phone number you gave us to arrange delivery.',
          ],
          details: [{ label: 'Order', value: order.reference }, ...itemDetails(order.items), ...totals(order), ...delivery],
          ...(origin ? { button: { label: 'View your order', url: `${origin}/shop/order/${order.reference}/` } } : {}),
          footerNote: 'Questions about your order? Reply to this email or call us.',
        }),
      })
    )
  }
  await Promise.all(jobs)
}

/** Tells the customer their order is on the way, ready to collect, or delivered. */
export async function emailOrderUpdate(order: Order, status: 'OUT_FOR_DELIVERY' | 'DELIVERED', note?: string) {
  if (!order.customerEmail) return
  const onTheWay = status === 'OUT_FOR_DELIVERY'
  const title = onTheWay ? (order.isPickup ? 'Your order is ready to collect' : 'Your order is on the way') : order.isPickup ? 'Thank you for collecting your order' : 'Your order has been delivered'
  const text = onTheWay
    ? order.isPickup
      ? 'Your order is packed and ready. You can collect it from the farm in Limuru.'
      : 'Your order has left the farm and is on its way to you.'
    : 'We hope you enjoy it. Thank you for supporting Sylvia’s Basket and organic farming.'
  await sendEmail({
    to: order.customerEmail,
    subject: `${title} (${order.reference})`,
    html: renderEmail({
      title,
      intro: `Hello ${order.customerName},`,
      paragraphs: [text, ...(note ? [note] : [])],
      details: [{ label: 'Order', value: order.reference }],
      footerNote: 'Questions about your order? Reply to this email or call us.',
    }),
  })
}
