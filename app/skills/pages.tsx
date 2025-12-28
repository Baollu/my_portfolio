"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Skill = {
  id: string
  title: string
  category: string
  rating: number
}

const categoryLabels: Record<string, string> = {
  web: 'Développement Web',
  devops: 'DevOps',
  bases: 'Langages & Outils',
  soft: 'Soft Skills',
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(data.skills || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  // Grouper par catégorie
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

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
              <Link href="/projects" className="hover:text-red-500">Projets</Link>
              <Link href="/skills" className="text-red-500">Compétences</Link>
              <Link href="/contact" className="hover:text-red-500">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-4">Mes Compétences</h1>
        <p className="text-zinc-400 text-lg mb-12">
          Technologies et compétences que je maîtrise
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-red-500 mb-6">
                  {categoryLabels[category] || category}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-white">{skill.title}</span>
                        <span className="text-sm text-zinc-500">{skill.rating}/5</span>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 flex-1 rounded-full ${
                              i < skill.rating ? 'bg-red-500' : 'bg-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
