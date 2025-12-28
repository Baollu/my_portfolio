'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="border-t border-zinc-800 py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500">
        <p>{t('rights')}</p>
      </div>
    </footer>
  )
}
