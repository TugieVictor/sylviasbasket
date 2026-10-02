/**
 * Sample data for the DEVELOPMENT database only, so the shop, courses and
 * visits can be built and tested before Sylvia's real details arrive.
 * All names, prices and fees here are placeholders.
 * Run with: npm run db:seed:dev   (safe to run more than once)
 */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function upsertByName(model, name, data) {
  const existing = await prisma[model].findFirst({ where: { name } })
  return existing
    ? prisma[model].update({ where: { id: existing.id }, data })
    : prisma[model].create({ data: { name, ...data } })
}

async function main() {
  // Delivery zones (placeholder fees)
  const zones = [
    { name: 'Nairobi CBD', feeKes: 300, sortOrder: 1 },
    { name: 'Nairobi outskirts', feeKes: 500, sortOrder: 2 },
    { name: 'Rest of Kenya', feeKes: 800, sortOrder: 3 },
    { name: 'Collect from the farm', feeKes: 0, isPickup: true, sortOrder: 4 },
  ]
  for (const { name, ...data } of zones) await upsertByName('deliveryZone', name, data)

  // Visit types (placeholder fees and limits)
  const visitTypes = [
    { name: 'Individual or family', feeKes: 1500, maxGroupSize: 6, sortOrder: 1 },
    { name: 'Group', feeKes: 5000, maxGroupSize: 30, sortOrder: 2 },
    { name: 'School', feeKes: 3000, maxGroupSize: 60, sortOrder: 3 },
  ]
  for (const { name, ...data } of visitTypes) await upsertByName('visitType', name, data)

  // Sample products
  const products = [
    {
      slug: 'sample-sukuma-wiki',
      name: 'Sukuma wiki (sample)',
      category: 'PRODUCE',
      summary: 'Freshly harvested organic kale.',
      variants: [{ label: '1 bunch', priceKes: 50, stock: 40 }],
    },
    {
      slug: 'sample-tote-bag',
      name: "Sylvia's Basket tote bag (sample)",
      category: 'MERCHANDISE',
      summary: 'Reusable cotton tote bag.',
      variants: [{ label: 'Standard', priceKes: 800, stock: 25 }],
    },
    {
      slug: 'sample-t-shirt',
      name: "Sylvia's Basket T-shirt (sample)",
      category: 'MERCHANDISE',
      summary: 'Cotton T-shirt with the Sylvia\'s Basket logo.',
      variants: [
        { label: 'Small', priceKes: 1500, stock: 10, sortOrder: 1 },
        { label: 'Medium', priceKes: 1500, stock: 10, sortOrder: 2 },
        { label: 'Large', priceKes: 1500, stock: 0, sortOrder: 3 },
      ],
    },
  ]
  for (const { variants, ...product } of products) {
    const saved = await prisma.product.upsert({ where: { slug: product.slug }, update: product, create: product })
    const count = await prisma.productVariant.count({ where: { productId: saved.id } })
    if (count === 0) {
      await prisma.productVariant.createMany({ data: variants.map((v) => ({ ...v, productId: saved.id })) })
    }
  }

  // Sample course with one upcoming session
  const course = await prisma.course.upsert({
    where: { slug: 'sample-organic-farming-basics' },
    update: {},
    create: {
      slug: 'sample-organic-farming-basics',
      title: 'Organic farming basics (sample)',
      summary: 'A hands-on introduction to organic and agroecological farming.',
      duration: '2 days',
      completionRules: 'Attend both days.',
    },
  })
  if ((await prisma.courseSession.count({ where: { courseId: course.id } })) === 0) {
    const start = new Date()
    start.setDate(start.getDate() + 30)
    await prisma.courseSession.create({
      data: { courseId: course.id, startDate: start, location: 'Limuru, Kiambu County', priceKes: 5000, capacity: 20 },
    })
  }

  console.log('Sample data ready.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
