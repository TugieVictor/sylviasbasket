'use client'

import { useState } from 'react'
import ProductPhoto from './ProductPhoto'

type Image = { url: string; alt?: string }

export default function ProductGallery({ images, category }: { images: Image[]; category: 'PRODUCE' | 'MERCHANDISE' }) {
  const [active, setActive] = useState(0)
  const main = images[active] || null
  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-3xl overflow-hidden shadow-xl bg-white">
        <ProductPhoto key={main?.url} image={main} category={category} sizes="large" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3" role="group" aria-label="Product photos">
          {images.slice(0, 8).map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1} of ${images.length}`}
              aria-current={index === active}
              className={`aspect-square rounded-xl overflow-hidden bg-white shadow transition-all ${
                index === active ? 'ring-2 ring-accent-600 ring-offset-2' : 'opacity-75 hover:opacity-100'
              }`}
            >
              <ProductPhoto image={image} category={category} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
