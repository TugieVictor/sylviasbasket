/**
 * Creates (or resets the password of) an admin login.
 * Run with: npm run admin:create:dev   (development database)
 */
const readline = require('readline')
const { PrismaClient } = require('@prisma/client')
const { hashPassword } = require('../lib/auth/password')

const ask = (rl, question) => new Promise((resolve) => rl.question(question, resolve))

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const name = (await ask(rl, 'Name: ')).trim()
  const email = (await ask(rl, 'Email: ')).trim().toLowerCase()
  const password = await ask(rl, 'Password (at least 10 characters): ')
  rl.close()

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('A name and a valid email are required.')
  if (password.length < 10) throw new Error('Password must be at least 10 characters.')

  const prisma = new PrismaClient()
  const user = await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash: hashPassword(password), active: true },
    create: { name, email, passwordHash: hashPassword(password) },
  })
  await prisma.$disconnect()
  console.log(`Admin login ready for ${user.email}`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
