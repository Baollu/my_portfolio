import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
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
              <Link href="/contact" className="hover:text-red-500">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-6xl font-bold">
            <span className="text-white">Bonjour, je suis </span>
            <span className="text-red-500">Boris</span>
          </h2>
          <p className="mt-6 text-2xl text-zinc-400">
            Développeur Full-Stack passionné
          </p>
          <p className="mt-4 text-lg text-zinc-500">
            Cuisine · Sport · Code · Jeux Vidéo
          </p>

          <div className="mt-12 flex justify-center gap-4">
            <Link
              href="/projects"
              className="rounded-lg bg-red-600 px-8 py-3 font-medium transition hover:bg-red-500"
            >
              Voir mes projets
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-zinc-700 px-8 py-3 font-medium transition hover:border-zinc-500"
            >
              Me contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500">
          <p>© 2024 Boris CHENG - Tous droits réservés</p>
        </div>
      </footer>
    </main>
  )
}
