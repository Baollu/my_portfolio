'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function LoginPage() {
  const t = useTranslations('login')
  const locale = useLocale()
  const router = useRouter()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(false)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push(`/${locale}/admin`)
        router.refresh()
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            {t('title')}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {t('username')}
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400 text-center">
                {t('error')}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
            >
              {loading ? t('loading') : t('submit')}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}
