'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiXCircle, FiRefreshCw, FiMail, FiHome } from 'react-icons/fi'

function FailureContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [donation, setDonation] = useState<any>(null)

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
    }
  }, [orderId])

  return (
    <div className="overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50 min-h-screen">
      <div className="container-custom py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Failure Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-2xl mb-6"
            >
              <FiXCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>
            <p className="text-xl text-gray-600">
              We couldn't process your donation at this time
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What happened?</h2>
            <div className="space-y-3 text-gray-600 mb-6">
              <p>Your donation payment could not be completed. This could be due to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Insufficient funds in your account</li>
                <li>Payment was cancelled</li>
                <li>Network connectivity issues</li>
                <li>Incorrect payment details</li>
                <li>Bank or payment provider declined the transaction</li>
              </ul>
            </div>

            {orderId && donation && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                <div className="text-sm text-gray-600 mb-2">Reference Number:</div>
                <div className="font-mono text-gray-900 font-bold">{orderId}</div>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <FiMail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Need Help?</p>
                <p>
                  If you continue to experience issues, please contact us at{' '}
                  <a href="mailto:info@sylviasbasket.co.ke" className="underline font-semibold">
                    info@sylviasbasket.co.ke
                  </a>
                  {orderId && ' with reference number ' + orderId}
                </p>
              </div>
            </div>
          </div>

          {/* Alternative Donation Methods */}
          <div className="bg-gradient-to-r from-accent-50 to-sage-50 p-8 rounded-2xl shadow-xl border border-accent-200 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Alternative Ways to Donate</h3>
            <div className="space-y-3 text-gray-700">
              <div>
                <strong>Bank Transfer:</strong>
                <br />
                You can make a direct bank transfer to our account and send us a confirmation email.
              </div>
              <div>
                <strong>M-Pesa Paybill:</strong>
                <br />
                Try using M-Pesa mobile money if your card payment didn't work.
              </div>
              <div>
                <strong>Email Us:</strong>
                <br />
                Contact <a href="mailto:info@sylviasbasket.co.ke" className="text-accent-700 font-semibold underline">
                  info@sylviasbasket.co.ke
                </a> for assistance with your donation.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/donate" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
              >
                <FiRefreshCw className="w-5 h-5" />
                Try Again
              </motion.button>
            </Link>
            <Link href="/" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                Back to Home
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function DonateFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <FailureContent />
    </Suspense>
  )
}
