import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/** Serves a photo uploaded in the admin. Each upload gets a new address, so it can be cached for a long time. */
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const image = await prisma.storedImage.findUnique({ where: { id: params.id.slice(0, 40) } })
  if (!image) return new Response('Not found', { status: 404 })
  return new Response(new Uint8Array(image.data), {
    headers: {
      'Content-Type': image.contentType,
      'Content-Length': String(image.bytes),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
