"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Project = {
  id: string
  title: string
  slug: string
  description: string
  shortDesc: string | null
  tags: string[]
  category: string
  imageUrl: string | null
  githubUrl: string | null
  liveUrl: string | null
  featured: boolean
}

const categoryLabels: Record<string, string> = {
  '1A': '1re année',
  '2A': '2e année',
  '3A': '3e année',
  'HORS': 'Hors programme',
  'PERSO': 'Personnel',
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filteredProjects = selectedCategory
    ? projects.filter(p => p.category === selectedCategory)
    : projects

  const featuredProjects = projects.filter(p => p.featured)

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
              <Link href="/projects" className="text-red-500">Projets</Link>
              <Link href="/skills" className="hover:text-red-500">Compétences</Link>
              <Link href="/contact" className="hover:text-red-500">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-4">Mes Projets</h1>
        <p className="text-zinc-400 text-lg mb-12">
          Découvrez mes projets réalisés durant mon parcours
        </p>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && !selectedCategory && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-red-500 mb-6">⭐ Projets en vedette</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-lg px-4 py-2 transition ${
              selectedCategory === null
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Tous
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`rounded-lg px-4 py-2 transition ${
                selectedCategory === key
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <p className="text-center text-zinc-500 py-12">
            Aucun projet dans cette catégorie
          </p>
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-red-500/50">
      {project.featured && (
        <span className="inline-block rounded bg-yellow-500/20 px-2 py-1 text-xs text-yellow-500 mb-3">
          ⭐ En vedette
        </span>
      )}
      
      <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
      
      <p className="text-zinc-400 text-sm mb-4 line-clamp-3">
        {project.shortDesc || project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-red-500 hover:underline"
          >
            GitHub →
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-red-500 hover:underline"
          >
            Demo →
          </a>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800">
        <span className="text-xs text-zinc-500">{categoryLabels[project.category]}</span>
      </div>
    </div>
  )
}
