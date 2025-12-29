'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

type AboutSection = {
  id: string
  key: string
  title: string
  content: string
  order: number
}

export default function AboutPage() {
  const t = useTranslations('about')
  const [sections, setSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<string>('')
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        setSections(data.sections || [])
        if (data.sections?.length > 0) {
          setActiveSection(data.sections[0].id)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150

      for (const section of sections) {
        const element = sectionRefs.current[section.id]
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-12">{t('title')}</h1>

        {loading ? (
          <Loading />
        ) : (
          <div className="flex gap-12">
            {/* Navigation latérale */}
            <nav className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-red-500/20 text-red-500 border-l-4 border-red-500'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </nav>

            {/* Navigation mobile */}
            <div className="lg:hidden mb-8 overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                      activeSection === section.id
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 space-y-16">
              {sections.map((section) => (
                <section
                  key={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el }}
                  id={section.key}
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-red-500 mb-4">{section.title}</h2>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-300">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
