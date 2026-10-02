/**
 * Runs a command (usually a Prisma command) against the DEVELOPMENT database only.
 *
 * Prisma reads DATABASE_URL from .env, which points at the LIVE database.
 * This script loads DATABASE_URL from .env.development.local instead, and
 * refuses to run if that address is missing or is the same as the live one.
 *
 * Usage: node scripts/with-dev-db.js prisma db push
 */
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const root = path.join(__dirname, '..')

function readDatabaseUrl(file) {
  const full = path.join(root, file)
  if (!fs.existsSync(full)) return null
  const match = fs.readFileSync(full, 'utf8').match(/^\s*DATABASE_URL\s*=\s*"?([^"\r\n]+)"?/m)
  return match ? match[1].trim() : null
}

const hostOf = (url) => {
  try {
    return new URL(url).host
  } catch {
    return null
  }
}

const devUrl = readDatabaseUrl('.env.development.local')
const liveUrl = readDatabaseUrl('.env')

if (!devUrl) {
  console.error('Stopped: no DATABASE_URL in .env.development.local')
  process.exit(1)
}
if (liveUrl && hostOf(devUrl) === hostOf(liveUrl)) {
  console.error('Stopped: .env.development.local points at the LIVE database. Use the Neon "dev" branch address.')
  process.exit(1)
}

const [command, ...args] = process.argv.slice(2)
if (!command) {
  console.error('Usage: node scripts/with-dev-db.js <command> [args]')
  process.exit(1)
}

console.log(`Using development database: ${hostOf(devUrl)}`)
// Run plain Node scripts with this same Node; everything else (prisma) through npx
const result =
  command === 'node'
    ? spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit', env: { ...process.env, DATABASE_URL: devUrl } })
    : spawnSync('npx', [command, ...args], { cwd: root, stdio: 'inherit', shell: true, env: { ...process.env, DATABASE_URL: devUrl } })
process.exit(result.status ?? 1)
