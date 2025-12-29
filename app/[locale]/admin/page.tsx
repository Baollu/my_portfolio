'use client'

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
          <div key={contact.id} className={`rounded-xl border p-6 ${contact.read ? 'border-zinc-800 bg-zinc-900/40' : 'border-red-500/30 bg-red-500/5'}`}>  {/* <- accolades ajoutées */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{contact.firstName} {contact.lastName}</h3>
                  {!contact.read && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">New</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
                  <a href={`mailto:${contact.email}`} className="hover:text-red-500">{contact.email}</a>  {/* <- accolades ajoutées */}
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