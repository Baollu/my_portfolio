'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import { useSearchParams } from 'next/navigation'

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

const categoryKeys = ['1A', '2A', '3A', 'EXTRA', 'PERSONAL'] as const

export default function ProjectsPage() {
  const t = useTranslations('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('selected')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

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
      <Navigation />

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-4">{t('title')}</h1>
        <p className="text-zinc-400 text-lg mb-12">
          {t('subtitle')}
        </p>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && !selectedCategory && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-red-500 mb-6">⭐ {t('featured')}</h2>
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
            {t('all')}
          </button>
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`rounded-lg px-4 py-2 transition ${
                selectedCategory === key
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {t(`categories.${key}`)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <Loading />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <p className="text-center text-zinc-500 py-12">
            {t('noProjects')}
          </p>
        )}
      </div>

      <Footer />
    </main>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations('projects')

  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-red-500/50">
      {project.featured && (
        <span className="inline-block rounded bg-yellow-500/20 px-2 py-1 text-xs text-yellow-500 mb-3">
          ⭐ {t('featuredBadge')}
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
        <span className="text-xs text-zinc-500">{t(`categories.${project.category}`)}</span>
      </div>
    </div>
  )
}
