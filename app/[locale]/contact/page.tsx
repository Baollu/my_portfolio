'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setStatus('success')
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-4">{t('title')}</h1>
        <p className="text-zinc-400 text-lg mb-2">
          {t('subtitle')}
        </p>
        <p className="text-zinc-400 text-lg mb-12">
          {t('subtitle2')}
        </p>

        {status === 'success' ? (
          <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-6 text-center">
            <h2 className="text-2xl font-bold text-green-500 mb-2">{t('success.title')} ✅</h2>
            <p className="text-zinc-300">
              {t('success.message')}
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-red-500 hover:underline"
            >
              {t('success.sendAnother')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {t('form.lastName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {t('form.firstName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="John"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {t('form.email')} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {t('form.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {t('form.subject')}
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                placeholder={t('form.subjectPlaceholder')}
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                {t('form.message')} *
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                placeholder={t('form.messagePlaceholder')}
              />
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
                {t('error')}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
            >
              {status === 'loading' ? t('form.sending') : t('form.submit')}
            </button>

            <p className="text-center text-sm text-zinc-500">
              {t('privacy')}
            </p>
          </form>
        )}
      </div>

      <Footer />
    </main>
  )
}
