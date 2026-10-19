import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentAdmin } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

const MAX_BYTES = 1.5 * 1024 * 1024
const TYPES = ['image/webp', 'image/jpeg', 'image/png']

// File signatures, so only real images are stored
function looksLikeImage(bytes: Uint8Array, type: string) {
  const starts = (...sig: number[]) => sig.every((b, i) => bytes[i] === b)
  if (type === 'image/jpeg') return starts(0xff, 0xd8, 0xff)
  if (type === 'image/png') return starts(0x89, 0x50, 0x4e, 0x47)
  if (type === 'image/webp') return starts(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  return false
}

/** Uploads one product photo (already resized in the browser). Admin only. */
export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 })

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof Blob)) return NextResponse.json({ error: 'No photo received.' }, { status: 400 })
  if (!TYPES.includes(file.type)) return NextResponse.json({ error: 'Please use a JPG, PNG or WebP photo.' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'This photo is too large. Please use a smaller one.' }, { status: 400 })

  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!looksLikeImage(bytes, file.type)) return NextResponse.json({ error: 'This file is not a valid photo.' }, { status: 400 })

  const size = (key: string) => Math.max(1, Math.min(10000, Math.round(Number(form?.get(key)) || 1)))
  const image = await prisma.storedImage.create({
    data: { contentType: file.type, data: Buffer.from(bytes), width: size('width'), height: size('height'), bytes: bytes.length },
    select: { id: true },
  })
  return NextResponse.json({ url: `/api/images/${image.id}` })
}
