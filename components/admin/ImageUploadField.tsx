'use client'

import { useState } from 'react'
import { FiTrash2, FiUpload } from 'react-icons/fi'
import { uploadPhoto } from '@/lib/uploadPhoto'

/** A photo field for ordinary admin forms: uploads the photo and keeps its address in a hidden input. */
export default function ImageUploadField({ name, defaultValue, label }: { name: string; defaultValue?: string | null; label: string }) {
  const [url, setUrl] = useState(defaultValue || '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const choose = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setBusy(true)
    setError('')
    try {
      setUrl(await uploadPhoto(file, 2000))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <p className="block text-sm font-semibold text-gray-700 mb-1">{label}</p>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-center gap-3">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-24 w-auto rounded-lg border border-gray-200" />
        )}
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-300 cursor-pointer">
          <FiUpload /> {busy ? 'Uploading…' : url ? 'Change' : 'Upload'}
          <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={(e) => choose(e.target.files)} />
        </label>
        {url && (
          <button type="button" onClick={() => setUrl('')} className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-red-700 border border-gray-200">
            <FiTrash2 /> Remove
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
    </div>
  )
}
