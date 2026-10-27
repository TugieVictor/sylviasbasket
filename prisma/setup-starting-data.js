/**
 * Real starting data for the website (live or development).
 * Safe to run more than once: it only ADDS what is missing and never changes
 * anything Sylvia has already edited in the admin.
 *
 *   npm run db:setup:dev    (test database)
 *   npm run db:setup:live   (live database, asks you to confirm)
 *
 * Prices and fees marked "placeholder" are to be updated in the admin.
 */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const day = (iso) => new Date(`${iso}T00:00:00Z`)

async function createIfNone(model, rows) {
  if ((await prisma[model].count()) > 0) return console.log(`  ${model}: already set up, left as is`)
  for (const data of rows) await prisma[model].create({ data })
  console.log(`  ${model}: added ${rows.length}`)
}

async function main() {
  console.log('Setting up starting data...')

  // Shop sections
  const sections = [
    { slug: 'honey', name: 'Honey', description: 'Pure, natural honey.', sortOrder: 1 },
    { slug: 'fresh-produce', name: 'Fresh produce', description: 'Organic vegetables and fruit from the farm.', sortOrder: 2 },
    { slug: 'merchandise', name: 'Merchandise', description: "Sylvia's Basket bags, clothing and more.", sortOrder: 3 },
  ]
  const sectionIds = {}
  for (const s of sections) {
    const saved = await prisma.shopCategory.upsert({ where: { slug: s.slug }, update: {}, create: s })
    sectionIds[s.slug] = saved.id
  }
  console.log('  shop sections: ready')

  // Honey (placeholder prices and stock)
  if (!(await prisma.product.findUnique({ where: { slug: 'pure-honey' } }))) {
    await prisma.product.create({
      data: {
        slug: 'pure-honey',
        name: 'Pure honey',
        category: 'PRODUCE',
        shopCategoryId: sectionIds.honey,
        sortOrder: 1,
        summary: 'Pure, natural honey, packed in glass jars.',
        description:
          'Golden, pure honey with nothing added. Enjoy it in tea, on bread, in porridge or straight from the spoon.\n\nStore in a cool, dry place. Natural honey can thicken or crystallise over time; stand the jar in warm water to soften it.',
        images: [
          { url: '/images/shop/honey-jar-1200.webp', alt: 'A glass jar of golden honey on a wooden table' },
          { url: '/images/shop/honey-dipper-1200.webp', alt: 'Honey dripping from a wooden dipper into a jar' },
          { url: '/images/shop/honey-glass-jar-1200.webp', alt: 'Honey being poured into a glass jar' },
          { url: '/images/shop/honeycomb-1200.webp', alt: 'Close-up of honeycomb filled with honey' },
        ],
        variants: {
          create: [
            { label: '250 g', priceKes: 500, stock: 20, sortOrder: 1 },
            { label: '500 g', priceKes: 900, stock: 20, sortOrder: 2 },
            { label: '1 kg', priceKes: 1700, stock: 10, sortOrder: 3 },
          ],
        },
      },
    })
    console.log('  honey: added (placeholder prices)')
  } else console.log('  honey: already there, left as is')

  // Delivery options (placeholder fees)
  await createIfNone('deliveryZone', [
    { name: 'Nairobi CBD', feeKes: 300, sortOrder: 1 },
    { name: 'Nairobi outskirts', feeKes: 500, sortOrder: 2 },
    { name: 'Rest of Kenya', feeKes: 800, sortOrder: 3 },
    { name: 'Collect from the farm', feeKes: 0, isPickup: true, sortOrder: 4 },
  ])

  // Farm visit types (placeholder fees and limits)
  await createIfNone('visitType', [
    { name: 'Individual or family', feeKes: 1500, maxGroupSize: 6, sortOrder: 1 },
    { name: 'Group', feeKes: 5000, maxGroupSize: 30, sortOrder: 2 },
    { name: 'School', feeKes: 3000, maxGroupSize: 60, sortOrder: 3 },
  ])

  // The kitchen garden course from the partner's poster
  if (!(await prisma.course.findUnique({ where: { slug: 'grow-your-own-food-safely' } }))) {
    await prisma.course.create({
      data: {
        slug: 'grow-your-own-food-safely',
        title: 'Grow your own food. Safely.',
        summary: 'A 3-month hands-on kitchen garden course in Mai Mahiu. Learn to grow your own food, safely.',
        duration: '3 months, 3 farm visits',
        description:
          'Farm visits, 10 am to 1 pm:\n- Visit 1: Wednesday 4 November\n- Visit 2: Wednesday 2 December\n- Visit 3: Wednesday 20 January, your own harvest\n\nIncluded:\n- Seedlings to start your garden\n- A step-by-step guidebook\n- A certificate on completion\n- Return transport from Nairobi\n\nOnly 10 places.',
        image: '/images/courses/grow-your-own-food.webp',
        registrationUrl: 'https://forms.gle/WdmsaUxeij43x2pT7',
        registrationEnds: day('2026-10-30'),
        sortOrder: 1,
        sessions: { create: [{ startDate: day('2026-11-04'), endDate: day('2027-01-20'), location: 'Mai Mahiu', priceKes: 0, capacity: 10 }] },
      },
    })
    console.log('  kitchen garden course: added')
  } else console.log('  kitchen garden course: already there, left as is')

  console.log('Done.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
