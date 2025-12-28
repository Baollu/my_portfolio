'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

type Contact = {
  id: string
  lastName: string
  firstName: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  read: boolean
  createdAt: string
}

type Project = {
  id: string
  title: string
  description: string
  shortDesc: string | null
  tags: string[]
  category: string
  githubUrl: string | null
  liveUrl: string | null
  featured: boolean
  published: boolean
}

type Skill = {
  id: string
  title: string
  category: string
  rating: number
  published: boolean
}

type AboutSection = {
  id: string
  title: string
  content: string
}

export default function AdminCMS() {
  const t = useTranslations('admin')
  const locale = useLocale()
  const [tab, setTab] = useState<'dashboard' | 'projects' | 'skills' | 'about' | 'contacts'>('dashboard')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [tab])

  async function loadData() {
    setLoading(true)
    try {
      if (tab === 'dashboard' || tab === 'contacts') {
        const res = await fetch('/api/contact')
        const data = await res.json()
        setContacts(data.contacts || [])
      }
      
      if (tab === 'dashboard' || tab === 'projects') {
        const res = await fetch('/api/projects?published=false')
        const data = await res.json()
        setProjects(data.projects || [])
      }
      
      if (tab === 'dashboard' || tab === 'skills') {
        const res = await fetch('/api/skills?published=false')
        const data = await res.json()
        setSkills(data.skills || [])
      }

      if (tab === 'about') {
        const res = await fetch('/api/about')
        const data = await res.json()
        setAboutSections(data.sections || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-red-500">{t('title')}</h1>
            <p className="mt-2 text-zinc-400">{t('subtitle')}</p>
          </div>
          <a href={`/${locale}`} className="rounded-lg bg-zinc-800 px-4 py-2 hover:bg-zinc-700">
            {t('backToSite')}
          </a>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-zinc-800">
          <Tab active={tab === 'dashboard'} onClick={() => setTab('dashboard')}>
            {t('tabs.dashboard')}
          </Tab>
          <Tab active={tab === 'projects'} onClick={() => setTab('projects')}>
            {t('tabs.projects')} ({projects.length})
          </Tab>
          <Tab active={tab === 'skills'} onClick={() => setTab('skills')}>
            {t('tabs.skills')} ({skills.length})
          </Tab>
          <Tab active={tab === 'about'} onClick={() => setTab('about')}>
            {t('tabs.about')}
          </Tab>
          <Tab active={tab === 'contacts'} onClick={() => setTab('contacts')}>
            {t('tabs.contacts')} ({contacts.length})
          </Tab>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {tab === 'dashboard' && <Dashboard contacts={contacts} projects={projects} skills={skills} />}
            {tab === 'projects' && <ProjectsManager projects={projects} onRefresh={loadData} />}
            {tab === 'skills' && <SkillsManager skills={skills} onRefresh={loadData} />}
            {tab === 'about' && <AboutManager sections={aboutSections} onRefresh={loadData} />}
            {tab === 'contacts' && <ContactsViewer contacts={contacts} />}
          </>
        )}
      </div>
    </main>
  )
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium border-b-2 transition ${
        active ? 'border-red-500 text-white' : 'border-transparent text-zinc-400 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function Dashboard({ contacts, projects, skills }: { contacts: Contact[]; projects: Project[]; skills: Skill[] }) {
  const t = useTranslations('admin.dashboard')
  const unreadCount = contacts.filter((c) => !c.read).length
  const publishedProjects = projects.filter((p) => p.published).length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="text-sm text-zinc-400">{t('messages')}</h3>
          <p className="text-3xl font-bold mt-2">{contacts.length}</p>
          <p className="text-sm text-zinc-500 mt-1">{unreadCount} {t('unread')}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="text-sm text-zinc-400">{t('projects')}</h3>
          <p className="text-3xl font-bold mt-2">{projects.length}</p>
          <p className="text-sm text-zinc-500 mt-1">{publishedProjects} {t('published')}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="text-sm text-zinc-400">{t('skills')}</h3>
          <p className="text-3xl font-bold mt-2">{skills.length}</p>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h3 className="text-lg font-semibold mb-4">{t('howToUse')}</h3>
        <ul className="space-y-2 text-zinc-300">
          <li>• <strong>{t('instructions.projects')}</strong></li>
          <li>• <strong>{t('instructions.skills')}</strong></li>
          <li>• <strong>{t('instructions.about')}</strong></li>
          <li>• <strong>{t('instructions.messages')}</strong></li>
        </ul>
        <p className="mt-4 text-sm text-zinc-500">
          💡 {t('tip')} <code className="rounded bg-zinc-800 px-2 py-1">npm run db:studio</code> {t('tipCommand')}
        </p>
      </div>
    </div>
  )
}

function ProjectsManager({ projects, onRefresh }: { projects: Project[]; onRefresh: () => void }) {
  const t = useTranslations('admin.projectsManager')
  const tProjects = useTranslations('projects')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="text-sm text-zinc-500">
          {t('useStudio')} <code className="rounded bg-zinc-800 px-2 py-1">npm run db:studio</code> {t('toAddEdit')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            {project.featured && (
              <span className="inline-block rounded bg-yellow-500/20 px-2 py-1 text-xs text-yellow-500 mb-2">
                ⭐ {tProjects('featuredBadge')}
              </span>
            )}
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
              {project.shortDesc || project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded bg-zinc-800 px-2 py-0.5 text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2 text-xs">
              <span className="rounded bg-red-500/20 px-2 py-1 text-red-400">
                {tProjects(`categories.${project.category}`)}
              </span>
              {!project.published && (
                <span className="rounded bg-orange-500/20 px-2 py-1 text-orange-400">{t('draft')}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillsManager({ skills, onRefresh }: { skills: Skill[]; onRefresh: () => void }) {
  const t = useTranslations('admin.skillsManager')
  const tProjects = useTranslations('admin.projectsManager')
  const tSkills = useTranslations('skills')
  
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <p className="text-sm text-zinc-500">
          {tProjects('useStudio')} <code className="rounded bg-zinc-800 px-2 py-1">npm run db:studio</code> {tProjects('toAddEdit')}
        </p>
      </div>

      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category}>
          <h3 className="text-xl font-semibold mb-3">{tSkills(`categories.${category}`)}</h3>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categorySkills.map((skill) => (
              <div key={skill.id} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{skill.title}</span>
                  <span className="text-sm text-zinc-500">{skill.rating}/5</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${
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
  )
}

function AboutManager({ sections, onRefresh }: { sections: AboutSection[]; onRefresh: () => void }) {
  const t = useTranslations('admin.aboutManager')
  const [editing, setEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', content: '' })

  async function handleSave(id: string) {
    try {
      const res = await fetch(`/api/about/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setEditing(null)
        onRefresh()
      }
    } catch {
      alert('Error saving')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('title')}</h2>

      {sections.map((section) => (
        <div key={section.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          {editing === section.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2"
                placeholder={t('titlePlaceholder')}
              />
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2"
                placeholder={t('contentPlaceholder')}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(section.id)}
                  className="rounded bg-red-600 px-4 py-2 hover:bg-red-500"
                >
                  {t('save')}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{section.title}</h3>
                <button
                  onClick={() => {
                    setEditing(section.id)
                    setFormData({ title: section.title, content: section.content })
                  }}
                  className="rounded bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700"
                >
                  {t('edit')}
                </button>
              </div>
              <p className="whitespace-pre-wrap text-zinc-300">{section.content}</p>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

function ContactsViewer({ contacts }: { contacts: Contact[] }) {
  const t = useTranslations('admin.contactsViewer')

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('title')}</h2>

      {contacts.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">{t('noMessages')}</p>
      ) : (
        contacts.map((contact) => (
          <div
            key={contact.id}
            className={`rounded-xl border p-6 ${
              contact.read
                ? 'border-zinc-800 bg-zinc-900/40'
                : 'border-red-500/30 bg-red-500/5'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">
                    {contact.lastName} {contact.firstName}
                  </h3>
                  {!contact.read && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      {t('new')}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
                  <span>{contact.email}</span>
                  {contact.phone && <span>📞 {contact.phone}</span>}
                  {contact.subject && <span>{contact.subject}</span>}
                </div>
              </div>
              <time className="text-sm text-zinc-500">
                {new Date(contact.createdAt).toLocaleDateString()}
              </time>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-zinc-300">{contact.message}</p>
          </div>
        ))
      )}
    </div>
  )
}
