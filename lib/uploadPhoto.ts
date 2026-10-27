'use client'

/** Client helpers for admin photo uploads: shrink in the browser, then upload. */
const MAX_SIDE = 1600

/** Shrinks a photo in the browser before upload, so phones can send big camera photos. */
export async function shrink(file: File, maxSide = MAX_SIDE): Promise<{ blob: Blob; width: number; height: number }> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('This file could not be opened as a photo.'))
      el.src = url
    })
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
    const width = Math.round(img.naturalWidth * scale)
    const height = Math.round(img.naturalHeight * scale)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
    const toBlob = (type: string, quality: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, quality))
    let blob = await toBlob('image/webp', 0.82)
    if (!blob || blob.type !== 'image/webp') blob = await toBlob('image/jpeg', 0.85)
    if (!blob) throw new Error('This photo could not be prepared.')
    return { blob, width, height }
  } finally {
    URL.revokeObjectURL(url)
  }
}


/** Shrinks and uploads one photo; returns its address on the site. */
export async function uploadPhoto(file: File, maxSide = MAX_SIDE): Promise<string> {
  const { blob, width, height } = await shrink(file, maxSide)
  const form = new FormData()
  form.append('file', blob, blob.type === 'image/webp' ? 'photo.webp' : 'photo.jpg')
  form.append('width', String(width))
  form.append('height', String(height))
  const response = await fetch('/api/admin/images', { method: 'POST', body: form })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Upload failed.')
  return data.url
}
