'use client'

import { useRef, useState, useTransition } from 'react'
import { FiArrowLeft, FiArrowRight, FiPlus, FiTrash2, FiUpload } from 'react-icons/fi'
import { saveProduct, type ProductInput } from '../actions'

type Variant = { id?: string; label: string; priceKes: number | ''; stock: number | ''; active: boolean }
type Img = { url: string; alt: string }

const input = 'w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:border-accent-600 outline-none bg-white'
const MAX_SIDE = 1600

/** Shrinks a photo in the browser before upload, so phones can send big camera photos. */
async function shrink(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('This file could not be opened as a photo.'))
      el.src = url
    })
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
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

export default function ProductEditor({ categories, product }: { categories: { id: string; name: string }[]; product?: ProductInput & { id: string } }) {
  const [p, setP] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    shopCategoryId: product?.shopCategoryId || categories[0]?.id || '',
    category: product?.category || 'PRODUCE',
    summary: product?.summary || '',
    description: product?.description || '',
    active: product ? product.active : true,
    availableThisWeek: product ? product.availableThisWeek : true,
    sortOrder: product?.sortOrder ?? 0,
  })
  const [images, setImages] = useState<Img[]>(product?.images || [])
  const [variants, setVariants] = useState<Variant[]>(product?.variants || [{ label: 'Standard', priceKes: '', stock: '', active: true }])
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState('')
  const [saving, startSaving] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof typeof p>(key: K, value: (typeof p)[K]) => setP((s) => ({ ...s, [key]: value }))
  const setVariant = (index: number, changes: Partial<Variant>) => setVariants((list) => list.map((v, i) => (i === index ? { ...v, ...changes } : v)))
  const moveImage = (index: number, step: number) =>
    setImages((list) => {
      const next = [...list]
      const target = index + step
      if (target < 0 || target >= next.length) return list
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })

  const upload = async (files: FileList | null) => {
    if (!files) return
    setError('')
    const chosen = Array.from(files).slice(0, 8 - images.length)
    setUploading((n) => n + chosen.length)
    for (const file of chosen) {
      try {
        const { blob, width, height } = await shrink(file)
        const form = new FormData()
        form.append('file', blob, blob.type === 'image/webp' ? 'photo.webp' : 'photo.jpg')
        form.append('width', String(width))
        form.append('height', String(height))
        const response = await fetch('/api/admin/images', { method: 'POST', body: form })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Upload failed.')
        setImages((list) => [...list, { url: data.url, alt: '' }])
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setUploading((n) => n - 1)
      }
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const save = () => {
    setError('')
    startSaving(async () => {
      const result = await saveProduct({
        id: product?.id,
        ...p,
        images,
        variants: variants.map((v) => ({ id: v.id, label: v.label, priceKes: Number(v.priceKes) || 0, stock: Number(v.stock) || 0, active: v.active })),
      })
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">About the product</h2>
        <div>
          <label htmlFor="p-name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input id="p-name" value={p.name} onChange={(e) => set('name', e.target.value)} className={input} placeholder="e.g. Pure honey" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="p-cat" className="block text-sm font-semibold text-gray-700 mb-1">Shop category</label>
            <select id="p-cat" value={p.shopCategoryId} onChange={(e) => set('shopCategoryId', e.target.value)} className={input}>
              <option value="">No category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="p-kind" className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
            <select id="p-kind" value={p.category} onChange={(e) => set('category', e.target.value as 'PRODUCE' | 'MERCHANDISE')} className={input}>
              <option value="PRODUCE">Farm produce (can be switched off weekly)</option>
              <option value="MERCHANDISE">Merchandise</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="p-summary" className="block text-sm font-semibold text-gray-700 mb-1">Short line (shown on the product card)</label>
          <input id="p-summary" value={p.summary} onChange={(e) => set('summary', e.target.value)} maxLength={200} className={input} placeholder="e.g. Pure, natural honey in glass jars." />
        </div>
        <div>
          <label htmlFor="p-desc" className="block text-sm font-semibold text-gray-700 mb-1">Full description</label>
          <textarea id="p-desc" rows={6} value={p.description} onChange={(e) => set('description', e.target.value)} className={input} placeholder="What it is, how it is grown or made, how to use or store it." />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold text-gray-900">Photos</h2>
          <p className="text-xs text-gray-500">Up to 8. The first photo is the main one.</p>
        </div>
        {images.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <li key={img.url} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="relative aspect-square bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {index === 0 && <span className="absolute top-2 left-2 bg-accent-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Main</span>}
                </div>
                <div className="p-2 space-y-2">
                  <input value={img.alt} onChange={(e) => setImages((list) => list.map((x, i) => (i === index ? { ...x, alt: e.target.value } : x)))} className="w-full px-2 py-1.5 rounded-lg border border-gray-300 text-xs" placeholder="What the photo shows" aria-label={`Description of photo ${index + 1}`} />
                  <div className="flex justify-between">
                    <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label="Move left" className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30"><FiArrowLeft /></button>
                    <button type="button" onClick={() => setImages((list) => list.filter((_, i) => i !== index))} aria-label="Remove photo" className="p-1.5 rounded-lg border border-gray-200 text-red-700"><FiTrash2 /></button>
                    <button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1} aria-label="Move right" className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30"><FiArrowRight /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {images.length < 8 && (
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-accent-400 rounded-xl p-6 cursor-pointer text-center">
            <FiUpload className="w-6 h-6 text-accent-600" />
            <span className="text-sm font-semibold text-gray-800">{uploading ? `Uploading ${uploading}…` : 'Add photos'}</span>
            <span className="text-xs text-gray-500">From your phone or computer. Large photos are made smaller for you.</span>
            <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => upload(e.target.files)} disabled={uploading > 0} />
          </label>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
        <div>
          <h2 className="font-bold text-gray-900">Sizes, prices and stock</h2>
          <p className="text-sm text-gray-600">One row for each size or weight. If there is only one, keep the name &quot;Standard&quot;.</p>
        </div>
        <div className="space-y-3">
          {variants.map((v, index) => (
            <div key={v.id || `new-${index}`} className="grid grid-cols-2 sm:grid-cols-[1.4fr_1fr_1fr_auto_auto] gap-2 items-end border-b border-gray-100 pb-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Size or option</label>
                <input value={v.label} onChange={(e) => setVariant(index, { label: e.target.value })} className={input} placeholder="e.g. 500 g" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Price (KES)</label>
                <input type="number" inputMode="numeric" min={1} value={v.priceKes} onChange={(e) => setVariant(index, { priceKes: e.target.value === '' ? '' : Number(e.target.value) })} className={input} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">In stock</label>
                <input type="number" inputMode="numeric" min={0} value={v.stock} onChange={(e) => setVariant(index, { stock: e.target.value === '' ? '' : Number(e.target.value) })} className={input} />
              </div>
              <label className="flex items-center gap-1.5 text-xs text-gray-700 pb-3"><input type="checkbox" checked={v.active} onChange={(e) => setVariant(index, { active: e.target.checked })} /> On sale</label>
              <button type="button" onClick={() => setVariants((list) => list.filter((_, i) => i !== index))} disabled={variants.length === 1} aria-label="Remove this option" className="p-3 rounded-xl border border-gray-200 text-red-700 disabled:opacity-30 justify-self-start"><FiTrash2 /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setVariants((list) => [...list, { label: '', priceKes: '', stock: '', active: true }])} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300">
          <FiPlus /> Add a size or option
        </button>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm text-gray-800"><input type="checkbox" checked={p.active} onChange={(e) => set('active', e.target.checked)} /> Shown in the shop</label>
        {p.category === 'PRODUCE' && (
          <label className="flex items-center gap-2 text-sm text-gray-800"><input type="checkbox" checked={p.availableThisWeek} onChange={(e) => set('availableThisWeek', e.target.checked)} /> Available this week</label>
        )}
        <label className="flex items-center gap-2 text-sm text-gray-800">
          Position in the shop <input type="number" value={p.sortOrder} onChange={(e) => set('sortOrder', Number(e.target.value) || 0)} className="w-20 px-2 py-1.5 rounded-lg border border-gray-300" />
        </label>
      </section>

      {error && <p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{error}</p>}
      <div className="sticky bottom-4 flex justify-end">
        <button type="button" onClick={save} disabled={saving || uploading > 0} className="px-8 py-3.5 rounded-xl font-semibold bg-accent-600 hover:bg-accent-700 text-white shadow-lg disabled:opacity-60">
          {saving ? 'Saving…' : product ? 'Save changes' : 'Add product'}
        </button>
      </div>
    </div>
  )
}
