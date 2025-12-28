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

  return (
    <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-bold text-red-500">
            Boris CHENG
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              href={`/${locale}`} 
              className={isActive('/') ? 'text-red-500' : 'hover:text-red-500'}
            >
              {t('home')}
            </Link>
            <Link 
              href={`/${locale}/about`} 
              className={isActive('/about') ? 'text-red-500' : 'hover:text-red-500'}
            >
              {t('about')}
            </Link>
            <Link 
              href={`/${locale}/projects`} 
              className={isActive('/projects') ? 'text-red-500' : 'hover:text-red-500'}
            >
              {t('projects')}
            </Link>
            <Link 
              href={`/${locale}/skills`} 
              className={isActive('/skills') ? 'text-red-500' : 'hover:text-red-500'}
            >
              {t('skills')}
            </Link>
            <Link 
              href={`/${locale}/contact`} 
              className={isActive('/contact') ? 'text-red-500' : 'hover:text-red-500'}
            >
              {t('contact')}
            </Link>

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
        </div>
      </div>
    </nav>
  )
}