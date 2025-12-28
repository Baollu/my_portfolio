"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    sujet: '',
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
          nom: '',
          prenom: '',
          email: '',
          tel: '',
          sujet: '',
          message: '',
        })
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-red-500">Boris CHENG</h1>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-red-500">Accueil</Link>
              <Link href="/about" className="hover:text-red-500">À propos</Link>
              <Link href="/projects" className="hover:text-red-500">Projets</Link>
              <Link href="/skills" className="hover:text-red-500">Compétences</Link>
              <Link href="/contact" className="text-red-500">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-4">Contactez-moi</h1>
        <p className="text-zinc-400 text-lg mb-12">
          Vous avez une opportunité de stage, un projet freelance ou juste envie de discuter ?
          <br />
          N'hésitez pas à me contacter !
        </p>

        {status === 'success' ? (
          <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-6 text-center">
            <h2 className="text-2xl font-bold text-green-500 mb-2">Message envoyé ! ✅</h2>
            <p className="text-zinc-300">
              Merci pour votre message. Je vous répondrai dans les plus brefs délais.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-red-500 hover:underline"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="John"
                />
              </div>
            </div>

            {/* Email et Téléphone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email *
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
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.tel}
                  onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            {/* Sujet */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Sujet
              </label>
              <input
                type="text"
                value={formData.sujet}
                onChange={(e) => setFormData({ ...formData, sujet: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                placeholder="Opportunité de stage / Projet freelance / Autre"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Message *
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
                placeholder="Bonjour Boris, j'ai une opportunité..."
              />
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
                Une erreur est survenue. Veuillez réessayer.
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
            >
              {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>

            <p className="text-center text-sm text-zinc-500">
              Vos informations ne seront utilisées que pour vous répondre.
            </p>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500">
          <p>© 2024 Boris CHENG - Tous droits réservés</p>
        </div>
      </footer>
    </main>
  )
}
