'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

type Experience = {
  id: string
  title: string
  company: string
  location: string | null
  type: string
  startDate: string
  endDate: string | null
  description: string
  skills: string[]
}

type Education = {
  id: string
  title: string
  school: string
  location: string | null
  startDate: string
  endDate: string | null
  description: string | null
}

export default function ExperiencePage() {
  const t = useTranslations('experience')
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [educations, setEducations] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience')

  useEffect(() => {
    Promise.all([
      fetch('/api/experiences').then(res => res.json()),
      fetch('/api/educations').then(res => res.json())
    ])
      .then(([expData, eduData]) => {
        setExperiences(expData.experiences || [])
        setEducations(eduData.educations || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stage': return t('types.internship')
      case 'cdi': return t('types.fulltime')
      case 'freelance': return t('types.freelance')
      default: return type
    }
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-4">{t('title')}</h1>
        <p className="text-zinc-400 text-lg mb-8">
          {t('subtitle')}
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-12 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('experience')}
            className={`pb-4 px-2 font-medium border-b-2 transition ${
              activeTab === 'experience'
                ? 'border-red-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            💼 {t('tabs.experience')}
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`pb-4 px-2 font-medium border-b-2 transition ${
              activeTab === 'education'
                ? 'border-red-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            🎓 {t('tabs.education')}
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Experiences */}
            {activeTab === 'experience' && (
              <div className="space-y-8">
                {experiences.length === 0 ? (
                  <p className="text-center text-zinc-500 py-12">{t('noExperience')}</p>
                ) : (
                  experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="relative pl-8 border-l-2 border-zinc-800 hover:border-red-500/50 transition"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-red-500 border-4 border-black"></div>

                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                            <p className="text-red-500 font-medium">{exp.company}</p>
                            {exp.location && (
                              <p className="text-zinc-500 text-sm">📍 {exp.location}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="inline-block rounded-full bg-red-500/20 text-red-400 px-3 py-1 text-sm mb-2">
                              {getTypeLabel(exp.type)}
                            </span>
                            <p className="text-zinc-400 text-sm">
                              {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : t('present')}
                            </p>
                          </div>
                        </div>

                        <p className="text-zinc-300 whitespace-pre-line mb-4">
                          {exp.description}
                        </p>

                        {exp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Education */}
            {activeTab === 'education' && (
              <div className="space-y-8">
                {educations.length === 0 ? (
                  <p className="text-center text-zinc-500 py-12">{t('noEducation')}</p>
                ) : (
                  educations.map((edu) => (
                    <div
                      key={edu.id}
                      className="relative pl-8 border-l-2 border-zinc-800 hover:border-red-500/50 transition"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-red-500 border-4 border-black"></div>

                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{edu.title}</h3>
                            <p className="text-red-500 font-medium">{edu.school}</p>
                            {edu.location && (
                              <p className="text-zinc-500 text-sm">📍 {edu.location}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-zinc-400 text-sm">
                              {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : t('present')}
                            </p>
                          </div>
                        </div>

                        {edu.description && (
                          <p className="text-zinc-300">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
