/**
 * Shop and privacy policies (version_2_plan.md: "plain templates, Sylvia
 * approves the wording before launch"). Edit the wording here.
 * Set `approved: true` once Sylvia has approved a page; until then a small
 * "draft" note shows while developing (never on the live site).
 */

export type PolicySection = { heading: string; paragraphs?: string[]; bullets?: string[] }
export type Policy = {
  slug: string
  title: string
  summary: string
  updated: string // shown as "Last updated"
  approved: boolean
  sections: PolicySection[]
}

const CONTACT = 'info@sylviasbasket.co.ke or +254 738 895395'

export const policies: Policy[] = [
  {
    slug: 'delivery',
    title: 'Delivery and collection',
    summary: 'Where we deliver, what it costs, and how collection from the farm works.',
    updated: 'October 2026',
    approved: false,
    sections: [
      {
        heading: 'Where we deliver',
        paragraphs: [
          'We deliver mainly within Nairobi and to other towns in Kenya. We do not ship outside Kenya.',
          'You choose a delivery area at checkout. The fee for that area is shown before you pay and added to your order total.',
        ],
      },
      {
        heading: 'Collecting from the farm',
        paragraphs: [
          'You can also choose to collect your order from the farm in Limuru, Kiambu County, at no extra cost. We will call you when your order is ready and agree a time with you.',
        ],
      },
      {
        heading: 'When your order arrives',
        paragraphs: [
          'We pack orders once payment is confirmed. We will call or text you on the number you gave us to arrange a delivery time.',
          'Fresh produce is harvested and packed close to delivery, so it may be delivered on our next harvest day. We will tell you when to expect it.',
        ],
        bullets: [
          'Please give a clear address and directions, and keep your phone on.',
          'If nobody is available to receive the order, we will contact you to arrange another time. A second delivery may carry a fee.',
          'Please check your order when it arrives and tell us about any problem the same day.',
        ],
      },
      {
        heading: 'Questions',
        paragraphs: [`Contact us at ${CONTACT} and quote your order number.`],
      },
    ],
  },
  {
    slug: 'returns',
    title: 'Returns and refunds',
    summary: 'What to do if something is wrong with your order.',
    updated: 'October 2026',
    approved: false,
    sections: [
      {
        heading: 'Fresh produce and honey',
        paragraphs: [
          'Because fresh produce and food items spoil, we cannot accept returns of them once delivered. If an item arrives damaged, spoiled or is not what you ordered, tell us within 24 hours of delivery and send a photo. We will replace it or refund you for that item.',
        ],
      },
      {
        heading: 'Merchandise',
        paragraphs: [
          'You can return unused merchandise in its original condition within 7 days of delivery. Contact us first so we can arrange the return. If the item was faulty or we sent the wrong one, we cover the cost of the return.',
          'For other returns, the cost of sending the item back is yours, and we refund the price of the item once we receive it.',
        ],
      },
      {
        heading: 'Cancelling an order',
        paragraphs: [
          'Unpaid orders are cancelled automatically after 60 minutes. If you have paid and want to cancel, contact us as soon as possible. If your order has not yet been packed or sent, we will cancel it and refund you in full.',
        ],
      },
      {
        heading: 'How refunds are paid',
        paragraphs: [
          'Refunds are paid back to the M-Pesa number or method you paid with, usually within 7 working days of agreeing the refund. Delivery fees are refunded only when the problem was our mistake.',
        ],
      },
      {
        heading: 'Contact us',
        paragraphs: [`Email or call us at ${CONTACT}. Please include your order number and, where possible, a photo.`],
      },
    ],
  },
  {
    slug: 'terms-of-sale',
    title: 'Terms of sale',
    summary: "The terms that apply when you buy from the Sylvia's Basket shop.",
    updated: 'October 2026',
    approved: false,
    sections: [
      {
        heading: 'Who you are buying from',
        paragraphs: ["The shop is run by Sylvia's Basket, Limuru, Kiambu County, Kenya. You can reach us at " + CONTACT + '.'],
      },
      {
        heading: 'Prices and payment',
        bullets: [
          'All prices are in Kenyan Shillings and are the final price for the item. Delivery fees are shown separately at checkout.',
          'Payment is made online through iPay, our payment provider. We do not see or store your M-Pesa PIN or card details.',
          'Your order is confirmed only once iPay confirms your payment. We then send you a confirmation email.',
        ],
      },
      {
        heading: 'Stock and availability',
        paragraphs: [
          'When you place an order we hold the items for you for 60 minutes while you pay. If payment is not completed in that time, the order expires and the items are released.',
          'Fresh produce depends on the season and harvest. If something you paid for is no longer available, we will contact you to offer a replacement or a refund for that item.',
        ],
      },
      {
        heading: 'Delivery, returns and refunds',
        paragraphs: ['Delivery is covered on our Delivery and collection page, and returns and refunds on our Returns and refunds page. Both form part of these terms.'],
      },
      {
        heading: 'Product information',
        paragraphs: [
          'We describe and photograph our products as accurately as we can. Natural products such as produce and honey vary in look, size and taste, and photos are a guide.',
        ],
      },
      {
        heading: 'Changes to these terms',
        paragraphs: ['We may update these terms from time to time. The version on this page when you place your order applies to that order.'],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy notice',
    summary: 'What personal information we collect, why, and your rights under the Kenya Data Protection Act, 2019.',
    updated: 'October 2026',
    approved: false,
    sections: [
      {
        heading: 'Who we are',
        paragraphs: [`Sylvia's Basket, Limuru, Kiambu County, Kenya, is responsible for the personal information described here. Contact us about privacy at ${CONTACT}.`],
      },
      {
        heading: 'What we collect',
        bullets: [
          'When you order from the shop: your name, phone number, email, delivery address and what you ordered.',
          'When you request a farm visit or a course: your name, phone number, email, group or organisation, the dates you prefer and any message you send.',
          'When you contact us or subscribe to our newsletter: your name, email and your message.',
          'When you pay or donate: a record of the payment from iPay, such as the amount, date and transaction reference. We never see your M-Pesa PIN or card details.',
        ],
      },
      {
        heading: 'Why we use it',
        bullets: [
          'To process and deliver your order, arrange your visit or course, and reply to you.',
          'To send you emails about your order, visit or course.',
          'To send our newsletter, only if you subscribed. You can unsubscribe at any time from any newsletter email.',
          'To keep records we are required to keep, such as payment records.',
          'To protect our forms from spam and misuse.',
        ],
      },
      {
        heading: 'Who we share it with',
        paragraphs: ['We do not sell your information. We share it only with services that help us run the website, and only as needed:'],
        bullets: [
          'iPay, to process payments.',
          'Our website host, database and email providers, to run the site and send emails.',
          'Cloudflare Turnstile, which checks that forms are sent by people and not bots.',
          'Mailchimp, for newsletter subscribers only.',
          'A courier or rider, who receives your name, phone number and address to deliver your order.',
        ],
      },
      {
        heading: 'How long we keep it',
        paragraphs: [
          'We keep order and payment records for as long as the law requires for business records. We keep visit, course and contact requests for up to two years, unless you ask us to delete them sooner.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: ['Under the Kenya Data Protection Act, 2019, you have the right to:'],
        bullets: [
          'Be told how your personal information is used.',
          'Ask for a copy of the information we hold about you.',
          'Ask us to correct information that is wrong.',
          'Ask us to delete your information, where we are not required to keep it.',
          'Object to us using your information, including for our newsletter.',
        ],
      },
      {
        heading: 'How to use your rights or complain',
        paragraphs: [
          `Contact us at ${CONTACT}. We will reply within a reasonable time. If you are not satisfied, you can complain to the Office of the Data Protection Commissioner (ODPC) in Kenya.`,
        ],
      },
      {
        heading: 'Cookies',
        paragraphs: [
          'We use only the small files (cookies and browser storage) needed for the site to work, such as remembering what is in your shopping cart. We do not use advertising cookies.',
        ],
      },
    ],
  },
]

export const getPolicy = (slug: string) => policies.find((p) => p.slug === slug)
