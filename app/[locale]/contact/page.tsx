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
      const dbRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!dbRes.ok) {
        throw new Error('Database save failed')
      }

      setStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">{t('title')}</h1>
        <p className="text-zinc-400 text-lg mb-3 leading-relaxed">
          {t('subtitle')}
        </p>
        <p className="text-zinc-400 text-lg mb-12 leading-relaxed">
          {t('subtitle2')}
        </p>

        {/* Info de contact direct */}
        <div className="mb-12 p-6 rounded-xl border border-zinc-800 bg-zinc-900/40">
          <p className="text-zinc-300 mb-4">
            📧 <a href="mailto:cheng.boris@hotmail.com" className="text-red-500 hover:underline">cheng.boris@hotmail.com</a>
          </p>
          <p className="text-zinc-300 mb-4">
            📱 <a href="tel:+33788586061" className="text-red-500 hover:underline">07 88 58 60 61</a>
          </p>
          <p className="text-zinc-300">
            🔗 <a href="https://www.linkedin.com/in/boris-cheng-8010992a1/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">LinkedIn</a>
          </p>
        </div>

        {status === 'success' ? (
          <div className="rounded-xl border border-green-500/50 bg-green-500/10 p-8 text-center">
            <h2 className="text-2xl font-bold text-green-500 mb-4">{t('success.title')} ✅</h2>
            <p className="text-zinc-300 leading-relaxed">
              {t('success.message')}
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-6 text-green-500 hover:underline"
            >
              {t('success.sendAnother')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3 tracking-wide">
                  {t('form.lastName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3 tracking-wide">
                  {t('form.firstName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3 tracking-wide">
                  {t('form.email')} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3 tracking-wide">
                  {t('form.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3 tracking-wide">
                {t('form.subject')}
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder={t('form.subjectPlaceholder')}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3 tracking-wide">
                {t('form.message')} *
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('form.messagePlaceholder')}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {status === 'error' && (
              <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-5 text-red-400 text-center">
                {t('error')}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-red-600 px-8 py-4 text-lg font-medium text-white tracking-wide transition-all hover:bg-red-500 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {status === 'loading' ? t('form.sending') : t('form.submit')}
            </button>

            <p className="text-center text-sm text-zinc-500 leading-relaxed">
              {t('privacy')}
            </p>
          </form>
        )}
      </div>

      <Footer />
    </main>
  )
}
