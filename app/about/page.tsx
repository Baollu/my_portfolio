"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

type AboutSection = {
  id: string
  title: string
  content: string
  order: number
}

export default function AboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        setSections(data.sections || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-red-500">Boris CHENG</h1>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-red-500">Accueil</Link>
              <Link href="/about" className="text-red-500">À propos</Link>
              <Link href="/projects" className="hover:text-red-500">Projets</Link>
              <Link href="/skills" className="hover:text-red-500">Compétences</Link>
              <Link href="/contact" className="hover:text-red-500">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-12">À propos de moi</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} className="space-y-4">
                <h2 className="text-2xl font-bold text-red-500">{section.title}</h2>
                <p className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-300">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
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
