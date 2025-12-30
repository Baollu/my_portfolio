'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import { useRouter } from 'next/navigation'

type Skill = {
  id: string
  title: string
  category: string
  order: number
}

type Category = {
  id: string
  key: string
  label: string
  order: number
}

type Project = {
  id: string
  title: string
  tags: string[]
  category: string
}

export default function SkillsPage() {
  const t = useTranslations('skills')
  const locale = useLocale()
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/skills').then(res => res.json()),
      fetch('/api/skill-categories').then(res => res.json()),
      fetch('/api/projects').then(res => res.json())
    ])
      .then(([skillsData, categoriesData, projectsData]) => {
        setSkills(skillsData.skills || [])
        setCategories(categoriesData.categories || [])
        setProjects(projectsData.projects || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const getProjectsForSkill = (skillTitle: string): Project[] => {
    return projects.filter(project => 
      project.tags.some(tag => 
        tag.toLowerCase() === skillTitle.toLowerCase() ||
        tag.toLowerCase().includes(skillTitle.toLowerCase()) ||
        skillTitle.toLowerCase().includes(tag.toLowerCase())
      )
    )
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  Object.keys(groupedSkills).forEach(category => {
    groupedSkills[category].sort((a, b) => a.order - b.order)
  })

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  const categoryLabels = categories.reduce((acc, cat) => {
    acc[cat.key] = cat.label
    return acc
  }, {} as Record<string, string>)

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-4">{t('title')}</h1>
        <p className="text-zinc-400 text-lg mb-12">
          {t('subtitle')}
        </p>

        {loading ? (
          <Loading />
        ) : (
          <div className="space-y-12">
            {/* Afficher les catégories dans l'ordre défini */}
            {sortedCategories.map((category) => {
              const categorySkills = groupedSkills[category.key]
              if (!categorySkills || categorySkills.length === 0) return null

              return (
                <div key={category.id}>
                  <h2 className="text-2xl font-bold text-red-500 mb-6">
                    {categoryLabels[category.key] || category.label}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {categorySkills.map((skill) => {
                      const relatedProjects = getProjectsForSkill(skill.title)
                      const hasProjects = relatedProjects.length > 0
                      
                      return (
                        <div
                          key={skill.id}
                          className="relative"
                          onMouseEnter={() => setHoveredSkill(skill.id)}
                          onMouseLeave={() => setHoveredSkill(null)}
                        >
                          <span
                            className={`inline-block rounded-lg border px-4 py-2 text-white transition cursor-pointer ${
                              hasProjects 
                                ? 'border-zinc-700 bg-zinc-900/60 hover:border-red-500/50 hover:bg-zinc-800'
                                : 'border-zinc-800 bg-zinc-900/40'
                            }`}
                          >
                            {skill.title}
                            {hasProjects && (
                              <span className="ml-2 text-xs text-zinc-500">
                                ({relatedProjects.length})
                              </span>
                            )}
                          </span>
                          
                          {/* Tooltip avec la liste des projets */}
                          {hoveredSkill === skill.id && hasProjects && (
                            <div className="absolute z-50 left-0 top-full mt-2 w-64 rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
                              <p className="text-sm font-semibold text-zinc-300 mb-2">
                                {t('usedIn')}
                              </p>
                              <ul className="space-y-2">
                                {relatedProjects.map(project => (
                                  <li 
                                    key={project.id}
                                    onClick={() => router.push(`/${locale}/projects?selected=${project.id}`)}
                                    className="text-sm text-zinc-400 flex items-center gap-2 cursor-pointer hover:text-red-400 transition"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    {project.title}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
