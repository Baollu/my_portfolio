'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

type SocialLink = {
  platform: string
  url: string
}

export default function HomePage() {
  const locale = useLocale()
  const t = useTranslations('home')
  const [socials, setSocials] = useState<SocialLink[]>([])

  useEffect(() => {
    fetch('/api/socials')
      .then(res => res.json())
      .then(data => setSocials(data.links || []))
      .catch(console.error)
  }, [])

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      case 'linkedin':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      case 'email':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section - Plus aéré */}
      <section className="flex min-h-[90vh] items-center justify-center px-6 md:px-8">
        <div className="text-center max-w-5xl">

          {/* Nom - Typographie plus espacée */}
          <h1 className="text-5xl md:text-5xl lg:text-5xl font-bold mb-8 tracking-tight">
            <span className="text-white">{t('greeting')}</span>
            <br className="md:hidden" />
            <span className="text-red-500 ml-0 md:ml-4">Boris CHENG</span>
          </h1>
          
          {/* Rôle - Plus grand espacement */}
          <p className="text-2xl md:text-xl lg:text-4xl text-zinc-300 mb-6 tracking-wide font-light">
            {t('role')}
          </p>

          {/* Location */}
          <p className="text-lg md:text-xl text-zinc-500 mb-6 tracking-widest uppercase">
            📍 Paris, France
          </p>

          {/* Tagline */}
          <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide">
            {t('tagline')}
          </p>

          {/* Social Links - Plus d'espace */}
          <div className="flex justify-center gap-6 mb-16">
            {socials.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-full border border-zinc-700 text-zinc-400 hover:text-red-500 hover:border-red-500 hover:scale-110 transition-all duration-300"
                aria-label={social.platform}
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
          </div>

          {/* CTA Buttons - Plus d'espace et plus grands */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-20">
            <Link
              href={`/${locale}/projects`}
              className="rounded-xl bg-red-600 px-10 py-4 text-lg font-medium tracking-wide transition-all hover:bg-red-500 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
            >
              {t('viewProjects')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="rounded-xl border border-zinc-600 px-10 py-4 text-lg font-medium tracking-wide transition-all hover:border-red-500 hover:text-red-500 hover:scale-105"
            >
              {t('contactMe')}
            </Link>
            <a
              href="/cv-boris-cheng.pdf"
              target="_blank"
              className="rounded-xl border border-zinc-600 px-10 py-4 text-lg font-medium tracking-wide transition-all hover:border-zinc-400 hover:scale-105 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('downloadCV')}
            </a>
          </div>
        </div>
      </section>

      {/* Section Expériences rapide */}
      <section className="py-20 md:py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
            {locale === 'fr' ? 'Expériences récentes' : 'Recent Experience'}
          </h2>
          <p className="text-zinc-400 mb-12 text-lg">
            {locale === 'fr' 
              ? 'Développeur Full-Stack avec expérience en startup et entreprise'
              : 'Full-Stack Developer with startup and company experience'
            }
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Davensi */}
            <div className="text-left p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-red-500 font-semibold text-lg">Davensi</span>
                <span className="text-zinc-500 text-sm">2025 - 2026</span>
              </div>
              <p className="text-white font-medium mb-3">Développeur Full Stack</p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Backend Go, Frontend Vue.js, Mobile React Native
              </p>
            </div>

            {/* Une Robe Un Soir */}
            <div className="text-left p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-red-500 font-semibold text-lg">Une Robe Un Soir</span>
                <span className="text-zinc-500 text-sm">2024</span>
              </div>
              <p className="text-white font-medium mb-3">Développeur Full Stack</p>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Automatisation Node.js, Outils internes, KPI
              </p>
            </div>
          </div>

          <Link
            href={`/${locale}/experience`}
            className="inline-flex items-center gap-2 mt-12 text-red-500 hover:text-red-400 transition-colors tracking-wide"
          >
            {locale === 'fr' ? 'Voir tout mon parcours' : 'View my full journey'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
