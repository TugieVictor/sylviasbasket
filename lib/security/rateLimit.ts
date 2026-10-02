/**
 * Simple limit on how often one address can submit a form.
 * Kept in memory, so it applies per server instance: enough to slow down
 * casual abuse without any extra service.
 */
const hits = new Map<string, number[]>()

export function isRateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now()
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs)
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) hits.clear() // keep memory bounded
  return recent.length > limit
}

export const clientIp = (request: Request) =>
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
