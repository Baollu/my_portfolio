'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

type Skill = {
  id: string
  title: string
  category: string
}

export default function SkillsPage() {
  const t = useTranslations('skills')
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

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

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
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-red-500 mb-6">
                  {t(`categories.${category}`)}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-white hover:border-red-500/50 transition"
                    >
                      {skill.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
