'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  FiHeart, FiCheck, FiCopy, FiArrowRight, FiArrowLeft,
  FiUser, FiMail, FiPhone, FiMessageSquare, FiDollarSign
} from 'react-icons/fi'
import { GiFarmer } from 'react-icons/gi'
import {
  DONATION_AMOUNTS,
  PAYMENT_METHODS,
  type DonationFormData,
  type DonationType,
  type PaymentMethod
} from '@/lib/donations/types'
import { validateDonationForm, formatCurrency, sanitizeDonationData } from '@/lib/donations/utils'

const DonatePage = () => {
  const searchParams = useSearchParams()

  // Form state
  const [step, setStep] = useState(1)
  const [donationType, setDonationType] = useState<DonationType>('ONCE')
  const [selectedAmount, setSelectedAmount] = useState<number>(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [copiedBank, setCopiedBank] = useState(false)

  // Bank details (from environment variables in production)
  const bankDetails = {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || 'Equity Bank',
    accountName: 'Sylvia\'s Basket',
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || 'Pending Setup',
    branch: 'Limuru',
  }

  // Pre-fill amount from URL parameter
  useEffect(() => {
    const amountParam = searchParams.get('amount')
    if (amountParam) {
      const amount = parseInt(amountParam)
      if (!isNaN(amount) && amount > 0) {
        // Check if it's a preset amount
        const presetAmount = DONATION_AMOUNTS.find(a => a.value === amount)
        if (presetAmount) {
          setSelectedAmount(amount)
          setCustomAmount('')
        } else {
          // Set as custom amount
          setSelectedAmount(0)
          setCustomAmount(amount.toString())
        }
      }
    }
  }, [searchParams])

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value)
    const numValue = parseInt(value)
    if (!isNaN(numValue)) {
      setSelectedAmount(numValue)
    }
  }

  const handleNext = () => {
    if (step === 1 && !selectedAmount) {
      setErrors({ amount: 'Please select or enter a donation amount' })
      return
    }

    // Validate Step 2 (Donor Details) before moving to Step 3
    if (step === 2) {
      const newErrors: Record<string, string> = {}

      if (!formData.donorName.trim()) {
        newErrors.donorName = 'Name is required'
      }

      if (!formData.donorEmail.trim()) {
        newErrors.donorEmail = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donorEmail)) {
        newErrors.donorEmail = 'Please enter a valid email address'
      }

      if (!formData.donorPhone.trim()) {
        newErrors.donorPhone = 'Phone number is required'
      } else {
        // Basic Kenyan phone validation
        const cleaned = formData.donorPhone.replace(/\D/g, '')
        if (cleaned.length < 9 || cleaned.length > 12) {
          newErrors.donorPhone = 'Please enter a valid Kenyan phone number'
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
    }

    setErrors({})
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleSubmit = async () => {
    // Check if payment method is selected
    if (!paymentMethod) {
      setErrors({ paymentMethod: 'Please select a payment method' })
      return
    }

    // Double-check donor information is filled (shouldn't happen if validation works)
    if (!formData.donorName || !formData.donorEmail || !formData.donorPhone) {
      setErrors({
        submit: 'Please go back and complete your information in Step 2'
      })
      return
    }

    // Validate form
    const donationData: DonationFormData = {
      amount: selectedAmount,
      donationType,
      donorName: formData.donorName,
      donorEmail: formData.donorEmail,
      donorPhone: formData.donorPhone,
      message: formData.message,
      paymentMethod: paymentMethod!,
    }

    const validation = validateDonationForm(donationData)
    if (!validation.valid) {
      setErrors(validation.errors)
      // If validation fails, show user-friendly message
      if (Object.keys(validation.errors).length > 0) {
        setErrors({
          ...validation.errors,
          submit: 'Please check the information you entered and try again'
        })
      }
      return
    }

    setSubmitting(true)
    setErrors({})

    try {
      // Sanitize data
      const sanitized = sanitizeDonationData(donationData)

      // Create donation
      const response = await fetch('/api/donations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Process payment
        const paymentResponse = await fetch('/api/donations/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.orderId,
            paymentMethod: sanitized.paymentMethod,
          }),
        })

        const paymentData = await paymentResponse.json()

        if (paymentData.success) {
          // For bank transfer, go to step 4
          if (paymentMethod === 'BANK') {
            setStep(4)
          } else if (paymentData.redirectUrl) {
            // Redirect to iPay for M-Pesa/Card
            window.location.href = paymentData.redirectUrl
          } else {
            // Redirect to success page
            window.location.href = `/donate/success?orderId=${data.orderId}`
          }
        } else {
          // Show more specific error based on payment method
          let errorMessage = paymentData.error || 'Payment processing failed'

          if (paymentMethod === 'MPESA' || paymentMethod === 'CARD') {
            errorMessage = 'iPay payment gateway is not yet configured. Please use Bank Transfer or contact us at info@sylviasbasket.co.ke'
          }

          setErrors({ submit: errorMessage })
        }
      } else {
        // Show more specific error message
        let errorMessage = data.error || 'Failed to create donation'

        if (data.error && data.error.includes('database')) {
          errorMessage = 'Database connection error. Please try again or contact us at info@sylviasbasket.co.ke'
        }

        setErrors({ submit: errorMessage })
      }
    } catch (error) {
      console.error('Donation error:', error)
      setErrors({
        submit: 'Network error. Please check your connection and try again, or contact us at info@sylviasbasket.co.ke'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedBank(true)
    setTimeout(() => setCopiedBank(false), 2000)
  }

  return (
    <div className="overflow-hidden bg-gradient-to-br from-sage-50 via-white to-accent-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 top-0">
          <img
            src="/images/supportHero.jpg"
            alt="Support Sylvia's Basket"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-accent-900/85 via-sage-900/80 to-accent-900/85"></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl mb-6 border border-white/30">
              <FiHeart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Support Our{' '}
              <span className="text-harvest-300">Mission</span>
            </h1>
            <p className="text-xl text-white mb-4">
              Your donation helps empower smallholder farmers, build sustainable food systems, and create lasting change across Kenya
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s
                      ? 'bg-white text-accent-700 shadow-xl'
                      : 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                  }`}>
                    {step > s ? <FiCheck className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-12 h-1 ${step > s ? 'bg-white' : 'bg-white/30'}`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-12 mt-2 text-sm font-semibold text-white">
              <span className={step === 1 ? 'text-harvest-300' : 'opacity-80'}>Amount</span>
              <span className={step === 2 ? 'text-harvest-300' : 'opacity-80'}>Details</span>
              <span className={step === 3 ? 'text-harvest-300' : 'opacity-80'}>Payment</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Step 1: Amount Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  {...fadeInUp}
                  className="space-y-8"
                >
                  {/* Donation Type Toggle */}
                  <div className="flex justify-center">
                    <div className="inline-flex bg-gray-100 rounded-full p-1">
                      <button
                        onClick={() => setDonationType('ONCE')}
                        className={`px-8 py-3 rounded-full font-semibold transition-all ${
                          donationType === 'ONCE'
                            ? 'bg-white shadow-lg text-accent-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        One-Time
                      </button>
                      <button
                        onClick={() => setDonationType('MONTHLY')}
                        className={`px-8 py-3 rounded-full font-semibold transition-all ${
                          donationType === 'MONTHLY'
                            ? 'bg-white shadow-lg text-accent-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  {/* Predefined Amounts */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {DONATION_AMOUNTS.map((amt) => (
                      <motion.button
                        key={amt.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAmountSelect(amt.value)}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          selectedAmount === amt.value && !customAmount
                            ? 'border-accent-500 bg-accent-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-accent-300'
                        }`}
                      >
                        <div className="text-2xl font-bold text-gray-900 mb-1">{amt.label}</div>
                        <div className="text-sm text-gray-600">{amt.description}</div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Or enter a custom amount (KES)
                    </label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => handleCustomAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:outline-none text-lg"
                        min="100"
                      />
                    </div>
                    {errors.amount && (
                      <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                    )}
                  </div>

                  {/* Impact Message */}
                  {selectedAmount >= 100 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-accent-50 to-sage-50 p-6 rounded-xl border border-accent-200"
                    >
                      <div className="flex items-start gap-4">
                        <GiFarmer className="w-8 h-8 text-accent-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">Your Impact</h3>
                          <p className="text-gray-700">
                            {formatCurrency(selectedAmount)} {donationType === 'MONTHLY' ? 'every month ' : ''}
                            helps train farmers, build sustainable food systems, and create lasting change
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={!selectedAmount}
                    className="w-full bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Donor Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  {...fadeInUp}
                  className="space-y-6"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Information</h2>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={formData.donorName}
                          onChange={(e) => {
                            setFormData({ ...formData, donorName: e.target.value })
                            // Clear error when user starts typing
                            if (errors.donorName) {
                              setErrors({ ...errors, donorName: '' })
                            }
                          }}
                          placeholder="John Doe"
                          className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                            errors.donorName
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-200 focus:border-accent-500'
                          }`}
                        />
                      </div>
                      {errors.donorName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠</span> {errors.donorName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={formData.donorEmail}
                          onChange={(e) => {
                            setFormData({ ...formData, donorEmail: e.target.value })
                            // Clear error when user starts typing
                            if (errors.donorEmail) {
                              setErrors({ ...errors, donorEmail: '' })
                            }
                          }}
                          placeholder="john@example.com"
                          className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                            errors.donorEmail
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-200 focus:border-accent-500'
                          }`}
                        />
                      </div>
                      {errors.donorEmail && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠</span> {errors.donorEmail}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={formData.donorPhone}
                          onChange={(e) => {
                            setFormData({ ...formData, donorPhone: e.target.value })
                            // Clear error when user starts typing
                            if (errors.donorPhone) {
                              setErrors({ ...errors, donorPhone: '' })
                            }
                          }}
                          placeholder="0712345678 or 254712345678"
                          className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                            errors.donorPhone
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-200 focus:border-accent-500'
                          }`}
                        />
                      </div>
                      {errors.donorPhone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠</span> {errors.donorPhone}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Kenyan phone format: 0712345678 or 254712345678
                      </p>
                    </div>

                    {/* Message (Optional) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message (Optional)
                      </label>
                      <div className="relative">
                        <FiMessageSquare className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Share why you're supporting Sylvia's Basket..."
                          rows={4}
                          className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleBack}
                      className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                    >
                      <FiArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                    >
                      Continue
                      <FiArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  {...fadeInUp}
                  className="space-y-6"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Method</h2>
                    <p className="text-gray-600 mb-6">Choose how you'd like to donate</p>

                    {/* Payment Methods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {PAYMENT_METHODS.map((method) => (
                        <motion.button
                          key={method.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setPaymentMethod(method.id)}
                          disabled={!method.available}
                          className={`p-6 rounded-xl border-2 transition-all ${
                            paymentMethod === method.id
                              ? 'border-accent-500 bg-accent-50 shadow-lg'
                              : 'border-gray-200 bg-white hover:border-accent-300'
                          } ${!method.available && 'opacity-50 cursor-not-allowed'}`}
                        >
                          <div className="text-4xl mb-3">{method.icon}{method.emoji}</div>
                          <div className="font-bold text-gray-900 mb-1">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                        </motion.button>
                      ))}
                    </div>

                    {errors.paymentMethod && (
                      <p className="mb-4 text-sm text-red-600">{errors.paymentMethod}</p>
                    )}

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-accent-50 to-sage-50 p-6 rounded-xl border border-accent-200">
                      <h3 className="font-bold text-gray-900 mb-3">Donation Summary</h3>
                      <div className="space-y-2 text-gray-700">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-bold">{formatCurrency(selectedAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-bold">{donationType === 'ONCE' ? 'One-Time' : 'Monthly'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment:</span>
                          <span className="font-bold">{paymentMethod ? PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name : 'Not selected'}</span>
                        </div>
                      </div>
                    </div>

                    {errors.submit && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700">{errors.submit}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleBack}
                      className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                    >
                      <FiArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!paymentMethod || submitting}
                      className="flex-1 bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          {paymentMethod === 'BANK' ? 'Get Bank Details' : 'Proceed to Payment'}
                          <FiArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Bank Transfer Details */}
              {step === 4 && paymentMethod === 'BANK' && (
                <motion.div
                  key="step4"
                  {...fadeInUp}
                  className="space-y-6"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Bank Transfer Details</h2>
                    <p className="text-gray-600 mb-6">Please use the following details to make your donation</p>

                    <div className="bg-gradient-to-r from-accent-50 to-sage-50 p-6 rounded-xl border border-accent-200 space-y-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Bank Name</div>
                        <div className="font-bold text-gray-900">{bankDetails.bankName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Account Name</div>
                        <div className="font-bold text-gray-900">{bankDetails.accountName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Account Number</div>
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-gray-900 font-mono text-lg">{bankDetails.accountNumber}</div>
                          <button
                            onClick={() => copyToClipboard(bankDetails.accountNumber)}
                            className="p-2 hover:bg-accent-100 rounded-lg transition-colors"
                          >
                            <FiCopy className={`w-5 h-5 ${copiedBank ? 'text-green-600' : 'text-gray-600'}`} />
                          </button>
                        </div>
                        {copiedBank && (
                          <div className="text-sm text-green-600 mt-1">Copied to clipboard!</div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Branch</div>
                        <div className="font-bold text-gray-900">{bankDetails.branch}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Amount</div>
                        <div className="font-bold text-gray-900 text-xl">{formatCurrency(selectedAmount)}</div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> After making the transfer, please send us an email at info@sylviasbasket.co.ke with your transaction reference for confirmation.
                      </p>
                    </div>
                  </div>

                  <Link href="/">
                    <button className="w-full bg-gradient-to-r from-accent-600 to-sage-600 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all">
                      Back to Home
                    </button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DonatePage
