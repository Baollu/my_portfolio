import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default async function HomePage() {
  const locale = await getLocale()
  const t = await getTranslations('home')

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-6xl font-bold">
            <span className="text-white">{t('greeting')} </span>
            <span className="text-red-500">Boris</span>
          </h2>
          <p className="mt-6 text-2xl text-zinc-400">
            {t('role')}
          </p>
          <p className="mt-4 text-lg text-zinc-500">
            {t('interests')}
          </p>

          <div className="mt-12 flex justify-center gap-4">
            <Link
              href={`/${locale}/projects`}
              className="rounded-lg bg-red-600 px-8 py-3 font-medium transition hover:bg-red-500"
            >
              {t('viewProjects')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="rounded-lg border border-zinc-700 px-8 py-3 font-medium transition hover:border-zinc-500"
            >
              {t('contactMe')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
