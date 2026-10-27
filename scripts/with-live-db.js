/**
 * Runs a command against the LIVE database (the DATABASE_URL in .env), after
 * you confirm by typing LIVE. Used once when launching the new features.
 *
 * Usage: node scripts/with-live-db.js prisma db push
 */
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { spawnSync } = require('child_process')

const root = path.join(__dirname, '..')
const file = path.join(root, '.env')
const match = fs.existsSync(file) && fs.readFileSync(file, 'utf8').match(/^\s*DATABASE_URL\s*=\s*"?([^"\r\n]+)"?/m)
if (!match) {
  console.error('Stopped: no DATABASE_URL in .env')
  process.exit(1)
}
const url = match[1].trim()
const host = (() => { try { return new URL(url).host } catch { return '(unreadable address)' } })()

const [command, ...args] = process.argv.slice(2)
if (!command) {
  console.error('Usage: node scripts/with-live-db.js <command> [args]')
  process.exit(1)
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
console.log(`\nThis will run "${[command, ...args].join(' ')}" on the LIVE database:\n  ${host}\n`)
rl.question('Make sure you have a backup. Type LIVE to continue: ', (answer) => {
  rl.close()
  if (answer.trim() !== 'LIVE') {
    console.log('Cancelled. Nothing was changed.')
    process.exit(0)
  }
  if (command === 'node') {
    // Run the script in this same process, so its own questions (name, email,
    // password) get your typing. A separate process would compete for the keyboard.
    process.env.DATABASE_URL = url
    const script = path.resolve(root, args[0])
    process.argv = [process.argv[0], script, ...args.slice(1)]
    require(script)
    return
  }
  const result = spawnSync('npx', [command, ...args], { stdio: 'inherit', env: { ...process.env, DATABASE_URL: url }, cwd: root, shell: true })
  process.exit(result.status ?? 1)
})
