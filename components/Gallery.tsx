'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { GalleryImage } from '@/lib/galleryData'

interface GalleryProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4
}

export default function Gallery({ images, columns = 3 }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedImage(null)
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'ArrowRight') handleNext()
  }

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => new Set(prev).add(imageId))
  }

  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns]

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid ${gridColsClass} gap-6`}>
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer group"
            onClick={() => setSelectedImage(index)}
          >
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg glass-card">
              {imageErrors.has(image.id) ? (
                // Placeholder for missing images
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-accent-100">
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-gray-600 font-medium px-4 text-center">
                    {image.title || 'Image coming soon'}
                  </p>
                </div>
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={() => handleImageError(image.id)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {image.title && (
                    <h3 className="font-display font-bold text-lg mb-1">
                      {image.title}
                    </h3>
                  )}
                  {image.description && (
                    <p className="text-sm opacity-90">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedImage(null)}
            onKeyDown={handleKeyPress}
            tabIndex={0}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Previous button */}
            {images.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next button */}
            {images.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                aria-label="Next image"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image container */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full">
                {imageErrors.has(images[selectedImage].id) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl">
                    <div className="text-9xl mb-6">📷</div>
                    <p className="text-white text-2xl font-medium">
                      {images[selectedImage].title || 'Image coming soon'}
                    </p>
                  </div>
                ) : (
                  <Image
                    src={images[selectedImage].src}
                    alt={images[selectedImage].alt}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    priority
                    onError={() => handleImageError(images[selectedImage].id)}
                  />
                )}
              </div>

              {/* Image info */}
              {(images[selectedImage].title || images[selectedImage].description) && (
                <div className="mt-4 text-center text-white">
                  {images[selectedImage].title && (
                    <h3 className="text-2xl font-display font-bold mb-2">
                      {images[selectedImage].title}
                    </h3>
                  )}
                  {images[selectedImage].description && (
                    <p className="text-lg opacity-90">
                      {images[selectedImage].description}
                    </p>
                  )}
                  <p className="text-sm opacity-70 mt-2">
                    {selectedImage + 1} / {images.length}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              Use arrow keys to navigate • ESC to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
