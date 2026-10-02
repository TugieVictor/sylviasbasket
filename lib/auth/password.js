// Password hashing with Node's built-in scrypt (no extra package needed).
// Stored format: scrypt$N$r$p$salt$hash (salt and hash in base64).
// Plain JavaScript so the command-line scripts can use it too.
const crypto = require('crypto')

const N = 16384
const R = 8
const P = 1
const KEY_LENGTH = 64

function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH, { N, r: R, p: P })
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${hash.toString('base64')}`
}

function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false
  const [, n, r, p, saltB64, hashB64] = parts
  const expected = Buffer.from(hashB64, 'base64')
  const actual = crypto.scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  })
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}

module.exports = { hashPassword, verifyPassword }
