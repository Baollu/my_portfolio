'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => setIsAuthenticated(data.authenticated))
      .catch(() => setIsAuthenticated(false))
  }, [pathname])

  const getPathWithoutLocale = () => {
    const segments = pathname.split('/')
    if (segments[1] === 'en' || segments[1] === 'fr') {
      return '/' + segments.slice(2).join('/')
    }
    return pathname
  }

  const currentPath = getPathWithoutLocale()

  const switchLocale = (newLocale: string) => {
    const newPath = currentPath === '/' ? `/${newLocale}` : `/${newLocale}${currentPath}`
    window.location.href = newPath
  }

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '' || currentPath === '/'
    return currentPath.startsWith(path)
  }

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/about', label: t('about') },
    { path: '/experience', label: t('experience') },
    { path: '/projects', label: t('projects') },
    { path: '/skills', label: t('skills') },
    { path: '/contact', label: t('contact') },
  ]

  return (
    <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-bold text-red-500">
            Boris CHENG
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                href={`/${locale}${link.path === '/' ? '' : link.path}`}
                className={`transition ${isActive(link.path) ? 'text-red-500' : 'hover:text-red-500'}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="flex items-center gap-1 ml-4 border-l border-zinc-700 pl-4">
              <button
                onClick={() => switchLocale('en')}
                className={`px-2 py-1 rounded text-sm ${
                  locale === 'en' 
                    ? 'bg-red-600 text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLocale('fr')}
                className={`px-2 py-1 rounded text-sm ${
                  locale === 'fr' 
                    ? 'bg-red-600 text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                FR
              </button>
            </div>

            {/* Login / Dashboard */}
            <Link
              href={`/${locale}${isAuthenticated ? '/admin' : '/login'}`}
              className={`ml-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                isAuthenticated
                  ? 'bg-red-600 text-white hover:bg-red-500'
                  : 'border border-zinc-700 hover:border-red-500 hover:text-red-500'
              }`}
            >
              {isAuthenticated ? t('dashboard') : t('login')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-zinc-800 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  href={`/${locale}${link.path === '/' ? '' : link.path}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`transition ${isActive(link.path) ? 'text-red-500' : 'hover:text-red-500'}`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center gap-2 pt-4 border-t border-zinc-800">
                <button
                  onClick={() => switchLocale('en')}
                  className={`px-3 py-1.5 rounded text-sm ${
                    locale === 'en' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => switchLocale('fr')}
                  className={`px-3 py-1.5 rounded text-sm ${
                    locale === 'fr' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  FR
                </button>
              </div>

              <Link
                href={`/${locale}${isAuthenticated ? '/admin' : '/login'}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-center transition ${
                  isAuthenticated
                    ? 'bg-red-600 text-white'
                    : 'border border-zinc-700'
                }`}
              >
                {isAuthenticated ? t('dashboard') : t('login')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
