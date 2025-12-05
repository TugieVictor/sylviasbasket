'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiCheckCircle, FiMail, FiHome, FiShare2 } from 'react-icons/fi'
import { formatCurrency, formatDate } from '@/lib/donations/utils'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [donation, setDonation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      // Fetch donation details
      fetch(`/api/donations/${orderId}/status`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setDonation(data.donation)
          }
        })
        .catch(error => console.error('Error fetching donation:', error))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [orderId])

  const handleShare = async () => {
    const shareText = "I just donated to Sylvia's Basket to support sustainable farming in Kenya! Join me in making a difference."
    const shareUrl = 'https://sylviasbasket.co.ke/donate'

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Support Sylvia's Basket",
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Share canceled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="overflow-hidden bg-gradient-to-br from-sage-50 via-white to-accent-50 min-h-screen">
      <div className="container-custom py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl mb-6"
            >
              <FiCheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Thank You for Your Donation!
            </h1>
            <p className="text-xl text-gray-600">
              Your generous support is making a real difference
            </p>
          </div>

          {/* Donation Details */}
          {loading ? (
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : donation ? (
            <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Donation Receipt
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-bold text-gray-900">{donation.orderId}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-gray-900 text-xl">
                    {formatCurrency(donation.amount)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-bold text-gray-900">
                    {donation.donationType === 'ONCE' ? 'One-Time' : 'Monthly Recurring'}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-bold text-gray-900">{donation.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-bold text-gray-900">
                    {formatDate(new Date(donation.createdAt))}
                  </span>
                </div>
                {donation.transactionId && (
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm text-gray-900">{donation.transactionId}</span>
                  </div>
                )}
              </div>

              {donation.isRecurring && (
                <div className="mt-6 p-4 bg-accent-50 border border-accent-200 rounded-lg">
                  <p className="text-sm text-accent-900">
                    <strong>Recurring Donation:</strong> Your monthly donation of{' '}
                    {formatCurrency(donation.amount)} will be automatically processed.
                    Next billing date:{' '}
                    {donation.nextBillingDate && formatDate(new Date(donation.nextBillingDate))}
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <FiMail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Receipt Sent!</p>
                  <p>A confirmation email with your donation receipt has been sent to your email address.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 text-center">
              <p className="text-gray-600">
                Unable to load donation details. Please check your email for the receipt.
              </p>
            </div>
          )}

          {/* Impact Message */}
          <div className="bg-gradient-to-r from-accent-600 to-sage-600 p-8 rounded-2xl shadow-xl text-white mb-8">
            <h3 className="text-2xl font-bold mb-4">Your Impact</h3>
            <p className="text-lg opacity-90 mb-4">
              Your donation helps us empower smallholder farmers, promote sustainable agriculture,
              and build resilient food systems across Kenya.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">1,000+</div>
                <div className="text-sm opacity-80">Farmers Trained</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">50+</div>
                <div className="text-sm opacity-80">Partner Farms</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">5+ tonnes</div>
                <div className="text-sm opacity-80">Organic Produce/Month</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 px-6 py-4 rounded-full font-semibold hover:border-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                Home
              </motion.button>
            </Link>
            <button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-accent-600 to-sage-600 text-white px-6 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <FiShare2 className="w-5 h-5" />
              Share
            </button>
            <Link href="/our-work" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white border-2 border-accent-600 text-accent-700 px-6 py-4 rounded-full font-semibold hover:bg-accent-50 transition-all"
              >
                See Our Work
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function DonateSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
