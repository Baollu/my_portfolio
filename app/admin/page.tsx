"use client"

import { useState, useEffect } from 'react'

type Contact = {
  id: string
  nom: string
  prenom: string
  email: string
  tel: string | null
  sujet: string | null
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
      console.error('Erreur:', error)
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
            <h1 className="text-4xl font-bold text-red-500">CMS Admin</h1>
            <p className="mt-2 text-zinc-400">Gérez votre portfolio</p>
          </div>
          <a href="/" className="rounded-lg bg-zinc-800 px-4 py-2 hover:bg-zinc-700">
            ← Retour au site
          </a>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-zinc-800">
          <Tab active={tab === 'dashboard'} onClick={() => setTab('dashboard')}>
            Dashboard
          </Tab>
          <Tab active={tab === 'projects'} onClick={() => setTab('projects')}>
            Projets ({projects.length})
          </Tab>
          <Tab active={tab === 'skills'} onClick={() => setTab('skills')}>
            Compétences ({skills.length})
          </Tab>
          <Tab active={tab === 'about'} onClick={() => setTab('about')}>
            À propos
          </Tab>
          <Tab active={tab === 'contacts'} onClick={() => setTab('contacts')}>
            Messages ({contacts.length})
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

function Tab({ active, onClick, children }: any) {
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

function Dashboard({ contacts, projects, skills }: any) {
  const unreadCount = contacts.filter((c: Contact) => !c.read).length
  const publishedProjects = projects.filter((p: Project) => p.published).length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="text-sm text-zinc-400">Messages</h3>
          <p className="text-3xl font-bold mt-2">{contacts.length}</p>
          <p className="text-sm text-zinc-500 mt-1">{unreadCount} non lus</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="text-sm text-zinc-400">Projets</h3>
          <p className="text-3xl font-bold mt-2">{projects.length}</p>
          <p className="text-sm text-zinc-500 mt-1">{publishedProjects} publiés</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="text-sm text-zinc-400">Compétences</h3>
          <p className="text-3xl font-bold mt-2">{skills.length}</p>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h3 className="text-lg font-semibold mb-4">Comment utiliser le CMS ?</h3>
        <ul className="space-y-2 text-zinc-300">
          <li>• <strong>Projets</strong> : Ajoutez, modifiez ou supprimez vos projets</li>
          <li>• <strong>Compétences</strong> : Gérez vos compétences et leur notation</li>
          <li>• <strong>À propos</strong> : Modifiez le contenu de votre page À propos</li>
          <li>• <strong>Messages</strong> : Consultez les messages reçus via le formulaire</li>
        </ul>
        <p className="mt-4 text-sm text-zinc-500">
          💡 Astuce : Utilisez aussi <code className="rounded bg-zinc-800 px-2 py-1">npm run db:studio</code> pour gérer vos données visuellement
        </p>
      </div>
    </div>
  )
}

function ProjectsManager({ projects, onRefresh }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des projets</h2>
        <p className="text-sm text-zinc-500">
          Utilisez <code className="rounded bg-zinc-800 px-2 py-1">npm run db:studio</code> pour ajouter/modifier
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: Project) => (
          <div key={project.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            {project.featured && (
              <span className="inline-block rounded bg-yellow-500/20 px-2 py-1 text-xs text-yellow-500 mb-2">
                En vedette
              </span>
            )}
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
              {project.shortDesc || project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="rounded bg-zinc-800 px-2 py-0.5 text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2 text-xs">
              <span className="rounded bg-red-500/20 px-2 py-1 text-red-400">{project.category}</span>
              {!project.published && (
                <span className="rounded bg-orange-500/20 px-2 py-1 text-orange-400">Brouillon</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillsManager({ skills, onRefresh }: any) {
  const grouped = skills.reduce((acc: any, skill: Skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des compétences</h2>
        <p className="text-sm text-zinc-500">
          Utilisez <code className="rounded bg-zinc-800 px-2 py-1">npm run db:studio</code> pour ajouter/modifier
        </p>
      </div>

      {Object.entries(grouped).map(([category, categorySkills]: [string, any]) => (
        <div key={category}>
          <h3 className="text-xl font-semibold mb-3 capitalize">{category}</h3>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categorySkills.map((skill: Skill) => (
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

function AboutManager({ sections, onRefresh }: any) {
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
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contenu de la page "À propos"</h2>

      {sections.map((section: AboutSection) => (
        <div key={section.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          {editing === section.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2"
                placeholder="Titre"
              />
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2"
                placeholder="Contenu"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(section.id)}
                  className="rounded bg-red-600 px-4 py-2 hover:bg-red-500"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
                >
                  Annuler
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
                  Modifier
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

function ContactsViewer({ contacts }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Messages reçus</h2>

      {contacts.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">Aucun message</p>
      ) : (
        contacts.map((contact: Contact) => (
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
                    {contact.nom} {contact.prenom}
                  </h3>
                  {!contact.read && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      Nouveau
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
                  <span>{contact.email}</span>
                  {contact.tel && <span>📞 {contact.tel}</span>}
                  {contact.sujet && <span>{contact.sujet}</span>}
                </div>
              </div>
              <time className="text-sm text-zinc-500">
                {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
              </time>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-zinc-300">{contact.message}</p>
          </div>
        ))
      )}
    </div>
  )
}
