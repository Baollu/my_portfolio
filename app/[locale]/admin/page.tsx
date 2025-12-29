'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'

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
  published: boolean
}

type AboutSection = {
  id: string
  key: string
  title: string
  content: string
  order: number
}

type Category = {
  id: string
  key: string
  label: string
  order: number
}

export default function AdminCMS() {
  const t = useTranslations('admin')
  const locale = useLocale()
  const router = useRouter()
  const [tab, setTab] = useState<'dashboard' | 'projects' | 'skills' | 'about' | 'contacts'>('dashboard')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([])
  const [projectCategories, setProjectCategories] = useState<Category[]>([])
  const [skillCategories, setSkillCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [tab])

  async function loadData() {
    setLoading(true)
    try {
      const [projCatRes, skillCatRes] = await Promise.all([
        fetch('/api/project-categories'),
        fetch('/api/skill-categories')
      ])
      if (projCatRes.ok) {
        const data = await projCatRes.json()
        setProjectCategories(data.categories || [])
      }
      if (skillCatRes.ok) {
        const data = await skillCatRes.json()
        setSkillCategories(data.categories || [])
      }

      if (tab === 'dashboard' || tab === 'contacts') {
        const res = await fetch('/api/contact')
        if (res.ok) {
          const data = await res.json()
          setContacts(data.contacts || [])
        }
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
        const res = await fetch('/api/about?published=false')
        const data = await res.json()
        setAboutSections(data.sections || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push(`/${locale}`)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-black text-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-red-500">{t('title')}</h1>
            <p className="mt-2 text-zinc-400">{t('subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <a href={`/${locale}`} className="rounded-lg bg-zinc-800 px-4 py-2 hover:bg-zinc-700">
              {t('backToSite')}
            </a>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 flex gap-2 border-b border-zinc-800 overflow-x-auto">
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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {tab === 'dashboard' && <Dashboard contacts={contacts} projects={projects} skills={skills} />}
            {tab === 'projects' && <ProjectsManager projects={projects} categories={projectCategories} onRefresh={loadData} />}
            {tab === 'skills' && <SkillsManager skills={skills} categories={skillCategories} onRefresh={loadData} />}
            {tab === 'about' && <AboutManager sections={aboutSections} onRefresh={loadData} />}
            {tab === 'contacts' && <ContactsViewer contacts={contacts} onRefresh={loadData} />}
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
      className={`px-6 py-3 font-medium border-b-2 transition whitespace-nowrap ${
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
    </div>
  )
}

function ProjectsManager({ projects, categories, onRefresh }: { projects: Project[]; categories: Category[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDesc: '',
    tags: '',
    category: categories[0]?.key || '1A',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    published: true,
  })
  const [categoryFormData, setCategoryFormData] = useState({ key: '', label: '', order: 0 })

  function resetForm() {
    setFormData({
      title: '', description: '', shortDesc: '', tags: '',
      category: categories[0]?.key || '1A', githubUrl: '', liveUrl: '',
      featured: false, published: true,
    })
    setEditing(null)
    setShowForm(false)
  }

  function resetCategoryForm() {
    setCategoryFormData({ key: '', label: '', order: 0 })
    setEditingCategory(null)
    setShowCategoryForm(false)
  }

  function startEdit(project: Project) {
    setFormData({
      title: project.title, description: project.description,
      shortDesc: project.shortDesc || '', tags: project.tags.join(', '),
      category: project.category, githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '', featured: project.featured, published: project.published,
    })
    setEditing(project)
    setShowForm(true)
  }

  function startEditCategory(cat: Category) {
    setCategoryFormData({ key: cat.key, label: cat.label, order: cat.order })
    setEditingCategory(cat)
    setShowCategoryForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) }
    try {
      const url = editing ? `/api/projects/${editing.id}` : '/api/projects'
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) { resetForm(); onRefresh() }
    } catch (error) { console.error('Error:', error) }
  }

  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editingCategory ? `/api/project-categories/${editingCategory.id}` : '/api/project-categories'
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryFormData),
      })
      if (res.ok) { resetCategoryForm(); onRefresh() }
    } catch (error) { console.error('Error:', error) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) onRefresh()
    } catch (error) { console.error('Error:', error) }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Delete this category?')) return
    try {
      const res = await fetch(`/api/project-categories/${id}`, { method: 'DELETE' })
      if (res.ok) onRefresh()
    } catch (error) { console.error('Error:', error) }
  }

  const filteredProjects = selectedCategory
    ? projects.filter(p => p.category === selectedCategory)
    : projects

  const categoryLabels = categories.reduce((acc, cat) => { acc[cat.key] = cat.label; return acc }, {} as Record<string, string>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowCategoryForm(true)} className="rounded-lg bg-zinc-700 px-4 py-2 hover:bg-zinc-600">+ Category</button>
          <button onClick={() => setShowForm(true)} className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500">+ Add Project</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-lg px-3 py-1.5 text-sm ${selectedCategory === null ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
        >
          All ({projects.length})
        </button>
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center gap-1">
            <button
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-lg px-3 py-1.5 text-sm ${selectedCategory === cat.key ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
            >
              {cat.label} ({projects.filter(p => p.category === cat.key).length})
            </button>
            <span onClick={() => startEditCategory(cat)} className="hover:text-red-400 cursor-pointer text-zinc-400 text-sm">✎</span>
            <span onClick={() => handleDeleteCategory(cat.id)} className="hover:text-red-400 cursor-pointer text-zinc-400 text-sm">×</span>
          </div>
        ))}
      </div>

      {showCategoryForm && (
        <form onSubmit={handleCategorySubmit} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Key *</label>
              <input type="text" required disabled={!!editingCategory} value={categoryFormData.key} onChange={(e) => setCategoryFormData({ ...categoryFormData, key: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Label *</label>
              <input type="text" required value={categoryFormData.label} onChange={(e) => setCategoryFormData({ ...categoryFormData, label: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Order</label>
              <input type="number" value={categoryFormData.order} onChange={(e) => setCategoryFormData({ ...categoryFormData, order: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-red-600 px-6 py-2 hover:bg-red-500">{editingCategory ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetCategoryForm} className="rounded-lg bg-zinc-800 px-6 py-2 hover:bg-zinc-700">Cancel</button>
          </div>
        </form>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editing ? 'Edit Project' : 'New Project'}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Title *</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2">
                {categories.map(cat => <option key={cat.id} value={cat.key}>{cat.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Short Description</label>
            <input type="text" value={formData.shortDesc} onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Description *</label>
            <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Tags (comma-separated)</label>
            <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" placeholder="React, TypeScript, Node.js" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">GitHub URL</label>
              <input type="url" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Live URL</label>
              <input type="url" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
              <span className="text-sm">Published</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-red-600 px-6 py-2 hover:bg-red-500">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="rounded-lg bg-zinc-800 px-6 py-2 hover:bg-zinc-700">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div key={project.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{project.title}</h3>
              <div className="flex gap-2">
                <button onClick={() => startEdit(project)} className="text-zinc-400 hover:text-white">✎</button>
                <button onClick={() => handleDelete(project.id)} className="text-red-400 hover:text-red-300">×</button>
              </div>
            </div>
            <p className="text-sm text-zinc-400 mb-2 line-clamp-2">{project.shortDesc || project.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs">{categoryLabels[project.category] || project.category}</span>
              {project.featured && <span className="rounded bg-red-500/20 text-red-400 px-2 py-0.5 text-xs">Featured</span>}
              {!project.published && <span className="rounded bg-yellow-500/20 text-yellow-400 px-2 py-0.5 text-xs">Draft</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillsManager({ skills, categories, onRefresh }: { skills: Skill[]; categories: Category[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ title: '', category: categories[0]?.key || 'web', published: true })
  const [categoryFormData, setCategoryFormData] = useState({ key: '', label: '', order: 0 })

  function resetForm() { setFormData({ title: '', category: categories[0]?.key || 'web', published: true }); setEditing(null); setShowForm(false) }
  function resetCategoryForm() { setCategoryFormData({ key: '', label: '', order: 0 }); setEditingCategory(null); setShowCategoryForm(false) }
  function startEdit(skill: Skill) { setFormData({ title: skill.title, category: skill.category, published: skill.published }); setEditing(skill); setShowForm(true) }
  function startEditCategory(cat: Category) { setCategoryFormData({ key: cat.key, label: cat.label, order: cat.order }); setEditingCategory(cat); setShowCategoryForm(true) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editing ? `/api/skills/${editing.id}` : '/api/skills'
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { resetForm(); onRefresh() }
    } catch (error) { console.error('Error:', error) }
  }

  async function handleCategorySubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editingCategory ? `/api/skill-categories/${editingCategory.id}` : '/api/skill-categories'
      const res = await fetch(url, { method: editingCategory ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(categoryFormData) })
      if (res.ok) { resetCategoryForm(); onRefresh() }
    } catch (error) { console.error('Error:', error) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this skill?')) return
    try { const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' }); if (res.ok) onRefresh() } catch (error) { console.error('Error:', error) }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Delete this category?')) return
    try { const res = await fetch(`/api/skill-categories/${id}`, { method: 'DELETE' }); if (res.ok) onRefresh() } catch (error) { console.error('Error:', error) }
  }

  const grouped = skills.reduce((acc, skill) => { if (!acc[skill.category]) acc[skill.category] = []; acc[skill.category].push(skill); return acc }, {} as Record<string, Skill[]>)
  const categoryLabels = categories.reduce((acc, cat) => { acc[cat.key] = cat.label; return acc }, {} as Record<string, string>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills Management</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowCategoryForm(true)} className="rounded-lg bg-zinc-700 px-4 py-2 hover:bg-zinc-600">+ Category</button>
          <button onClick={() => setShowForm(true)} className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500">+ Add Skill</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <div key={cat.id} className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm flex items-center gap-2">
            <span className="text-zinc-300">{cat.label}</span>
            <span className="text-zinc-500">({cat.key})</span>
            <span onClick={() => startEditCategory(cat)} className="hover:text-red-400 cursor-pointer text-zinc-400">✎</span>
            <span onClick={() => handleDeleteCategory(cat.id)} className="hover:text-red-400 cursor-pointer text-zinc-400">×</span>
          </div>
        ))}
      </div>

      {showCategoryForm && (
        <form onSubmit={handleCategorySubmit} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <h3 className="text-lg font-semibold">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div><label className="block text-sm text-zinc-400 mb-1">Key *</label><input type="text" required disabled={!!editingCategory} value={categoryFormData.key} onChange={(e) => setCategoryFormData({ ...categoryFormData, key: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 disabled:opacity-50" /></div>
            <div><label className="block text-sm text-zinc-400 mb-1">Label *</label><input type="text" required value={categoryFormData.label} onChange={(e) => setCategoryFormData({ ...categoryFormData, label: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" /></div>
            <div><label className="block text-sm text-zinc-400 mb-1">Order</label><input type="number" value={categoryFormData.order} onChange={(e) => setCategoryFormData({ ...categoryFormData, order: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" /></div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-red-600 px-6 py-2 hover:bg-red-500">{editingCategory ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetCategoryForm} className="rounded-lg bg-zinc-800 px-6 py-2 hover:bg-zinc-700">Cancel</button>
          </div>
        </form>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="block text-sm text-zinc-400 mb-1">Title *</label><input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" /></div>
            <div><label className="block text-sm text-zinc-400 mb-1">Category *</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2">{categories.map(cat => <option key={cat.id} value={cat.key}>{cat.label}</option>)}</select></div>
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} /><span className="text-sm">Published</span></label>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-red-600 px-6 py-2 hover:bg-red-500">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="rounded-lg bg-zinc-800 px-6 py-2 hover:bg-zinc-700">Cancel</button>
          </div>
        </form>
      )}

      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category}>
          <h3 className="text-xl font-semibold mb-3">{categoryLabels[category] || category}</h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <div key={skill.id} className="group flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2">
                <span>{skill.title}</span>
                <button onClick={() => startEdit(skill)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white transition">✎</button>
                <button onClick={() => handleDelete(skill.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition">×</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AboutManager({ sections, onRefresh }: { sections: AboutSection[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AboutSection | null>(null)
  const [formData, setFormData] = useState({ key: '', title: '', content: '', order: 0 })

  function resetForm() { setFormData({ key: '', title: '', content: '', order: 0 }); setEditing(null); setShowForm(false) }
  function startEdit(section: AboutSection) { setFormData({ key: section.key, title: section.title, content: section.content, order: section.order }); setEditing(section); setShowForm(true) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editing ? `/api/about/${editing.id}` : '/api/about'
      const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      if (res.ok) { resetForm(); onRefresh() }
    } catch (error) { console.error('Error:', error) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this section?')) return
    try { const res = await fetch(`/api/about/${id}`, { method: 'DELETE' }); if (res.ok) onRefresh() } catch (error) { console.error('Error:', error) }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">About Page Content</h2>
        <button onClick={() => setShowForm(true)} className="rounded-lg bg-red-600 px-4 py-2 hover:bg-red-500">+ Add Section</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="block text-sm text-zinc-400 mb-1">Key *</label><input type="text" required disabled={!!editing} value={formData.key} onChange={(e) => setFormData({ ...formData, key: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 disabled:opacity-50" /></div>
            <div><label className="block text-sm text-zinc-400 mb-1">Order</label><input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" /></div>
          </div>
          <div><label className="block text-sm text-zinc-400 mb-1">Title *</label><input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" /></div>
          <div><label className="block text-sm text-zinc-400 mb-1">Content *</label><textarea required rows={8} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2" /></div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-red-600 px-6 py-2 hover:bg-red-500">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="rounded-lg bg-zinc-800 px-6 py-2 hover:bg-zinc-700">Cancel</button>
          </div>
        </form>
      )}

      {sections.map((section) => (
        <div key={section.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex justify-between items-start mb-4">
            <div><h3 className="text-xl font-semibold">{section.title}</h3><span className="text-xs text-zinc-500">Key: {section.key} | Order: {section.order}</span></div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(section)} className="rounded bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700">Edit</button>
              <button onClick={() => handleDelete(section.id)} className="rounded bg-red-500/20 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/30">Delete</button>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-zinc-300">{section.content}</p>
        </div>
      ))}
    </div>
  )
}

function ContactsViewer({ contacts, onRefresh }: { contacts: Contact[]; onRefresh: () => void }) {
  async function markAsRead(id: string) {
    try {
      await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      onRefresh()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' })
      if (res.ok) onRefresh()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Received Messages</h2>
      {contacts.length === 0 ? (
        <p className="text-center text-zinc-500 py-12">No messages</p>
      ) : (
        contacts.map((contact) => (
          <div key={contact.id} className={`rounded-xl border p-6 ${contact.read ? 'border-zinc-800 bg-zinc-900/40' : 'border-red-500/30 bg-red-500/5'}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{contact.firstName} {contact.lastName}</h3>
                  {!contact.read && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">New</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
                  <a href={`mailto:${contact.email}`} className="hover:text-red-500">{contact.email}</a>
                  {contact.phone && <span>{contact.phone}</span>}
                  {contact.subject && <span>{contact.subject}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <time className="text-sm text-zinc-500">{new Date(contact.createdAt).toLocaleDateString()}</time>
                {!contact.read && (
                  <button
                    onClick={() => markAsRead(contact.id)}
                    className="rounded bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="rounded bg-red-500/20 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-zinc-300">{contact.message}</p>
          </div>
        ))
      )}
    </div>
  )
}
