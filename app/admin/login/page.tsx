'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        router.replace('/admin/')
        router.refresh()
      } else {
        setError(data.error || 'Could not sign in.')
      }
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-earth-50 via-primary-50 to-harvest-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
        <img src="/images/sylvias-logo.png" alt="Sylvia's Basket" className="h-14 mx-auto mb-6" />
        <h1 className="text-2xl font-display font-bold text-gray-900 text-center">Admin sign in</h1>
        <p className="text-sm text-gray-600 text-center mt-2 mb-6">Manage the shop, courses and visits.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-600 focus:ring-2 focus:ring-accent-200 outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent-600 focus:ring-2 focus:ring-accent-200 outline-none"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-accent-600 to-sage-600 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
