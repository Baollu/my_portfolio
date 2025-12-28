'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

type AboutSection = {
  id: string
  title: string
  content: string
  order: number
}

export default function AboutPage() {
  const t = useTranslations('about')
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
      <Navigation />

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-12">{t('title')}</h1>

        {loading ? (
          <Loading />
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

      <Footer />
    </main>
  )
}
