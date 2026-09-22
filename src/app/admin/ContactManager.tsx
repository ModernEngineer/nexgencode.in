'use client';

import { useState } from 'react';

type Contact = {
  _id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: 'new' | 'read' | 'archived';
};

export default function ContactManager({ initialContacts }: { initialContacts: Contact[] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateStatus(id: string, status: Contact['status']) {
    setBusyId(id);
    const response = await fetch(`/api/admin/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      const updated = await response.json();
      setContacts((current) => current.map((contact) => contact._id === id ? { ...contact, status: updated.status } : contact));
    }
    setBusyId(null);
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this contact submission?')) return;
    setBusyId(id);
    const response = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
    if (response.ok) setContacts((current) => current.filter((contact) => contact._id !== id));
    setBusyId(null);
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-white/10 text-ink-300"><tr><th className="px-3 py-3">Name</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Company</th><th className="px-3 py-3">Message</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Actions</th></tr></thead>
        <tbody>{contacts.map((contact) => <tr key={contact._id} className="border-b border-white/5 align-top"><td className="px-3 py-4 font-medium">{contact.name}</td><td className="px-3 py-4">{contact.email}</td><td className="px-3 py-4">{contact.company || '-'}</td><td className="max-w-md px-3 py-4 text-ink-300">{contact.message}</td><td className="px-3 py-4"><select value={contact.status} disabled={busyId === contact._id} onChange={(event) => void updateStatus(contact._id, event.target.value as Contact['status'])} className="rounded-md border border-white/10 bg-ink-950 px-2 py-1 text-xs"><option value="new">New</option><option value="read">Read</option><option value="archived">Archived</option></select></td><td className="px-3 py-4"><button type="button" disabled={busyId === contact._id} onClick={() => void remove(contact._id)} className="text-xs text-red-300 disabled:opacity-50">Delete</button></td></tr>)}</tbody>
      </table>
      {contacts.length === 0 && <p className="py-10 text-center text-ink-400">No submissions yet.</p>}
    </div>
  );
}
