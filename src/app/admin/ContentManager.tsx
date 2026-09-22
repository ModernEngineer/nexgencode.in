'use client';

import { useEffect, useState } from 'react';

type Kind = 'project' | 'service' | 'job';
type Item = { _id: string; kind: Kind; title: string; slug: string; summary: string; description?: string; category?: string; url?: string; location?: string; tags: string[]; features: string[]; active: boolean };
type FormState = Omit<Item, '_id'>;

const emptyForm: FormState = { kind: 'project', title: '', slug: '', summary: '', description: '', category: '', url: '', location: '', tags: [], features: [], active: true };

export default function ContentManager() {
  const [kind, setKind] = useState<Kind>('project');
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  async function loadItems(selectedKind = kind) {
    const response = await fetch(`/api/admin/content?kind=${selectedKind}`);
    if (response.ok) setItems(await response.json());
  }

  useEffect(() => { void loadItems(); }, [kind]);

  function update(field: keyof FormState, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function edit(item: Item) {
    setEditingId(item._id);
    setForm({ ...item, tags: item.tags ?? [], features: item.features ?? [] });
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Saving...');
    const payload = { ...form, tags: form.tags, features: form.features };
    const response = await fetch(editingId ? `/api/admin/content/${editingId}` : '/api/admin/content', { method: editingId ? 'PATCH' : 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) { setMessage('Unable to save. Check required fields or duplicate slug.'); return; }
    setMessage('Saved');
    setEditingId(null);
    setForm({ ...emptyForm, kind });
    await loadItems();
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this item?')) return;
    await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
    await loadItems();
  }

  return <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="font-display text-2xl font-semibold">Website content</h2><div className="flex gap-2">{(['project', 'service', 'job'] as Kind[]).map((value) => <button type="button" key={value} onClick={() => { setKind(value); setEditingId(null); setForm({ ...emptyForm, kind: value }); }} className={`rounded-lg px-3 py-2 text-sm capitalize ${kind === value ? 'bg-brand-600' : 'border border-white/10'}`}>{value}s</button>)}</div></div><div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.4fr]"><form onSubmit={save} className="space-y-3"><input required placeholder="Title" value={form.title} onChange={(event) => update('title', event.target.value)} className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2" /><input required placeholder="Slug" value={form.slug} onChange={(event) => update('slug', event.target.value)} className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2" /><input required placeholder="Short summary" value={form.summary} onChange={(event) => update('summary', event.target.value)} className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2" /><textarea placeholder="Description" rows={4} value={form.description} onChange={(event) => update('description', event.target.value)} className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2" /><div className="grid grid-cols-2 gap-3"><input placeholder="Category" value={form.category} onChange={(event) => update('category', event.target.value)} className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2" /><input placeholder="Location" value={form.location} onChange={(event) => update('location', event.target.value)} className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2" /></div><input placeholder="URL" value={form.url} onChange={(event) => update('url', event.target.value)} className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2" /><input placeholder="Tags, comma separated" value={form.tags.join(', ')} onChange={(event) => update('tags', event.target.value.split(',').map((value) => value.trim()).filter(Boolean))} className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2" /><input placeholder="Features, comma separated" value={form.features.join(', ')} onChange={(event) => update('features', event.target.value.split(',').map((value) => value.trim()).filter(Boolean))} className="w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2" /><div className="flex gap-3"><button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold">{editingId ? 'Update' : 'Add'} {kind}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ ...emptyForm, kind }); }} className="rounded-lg border border-white/10 px-4 py-2 text-sm">Cancel</button>}</div>{message && <p className="text-sm text-ink-300">{message}</p>}</form><div className="space-y-3">{items.map((item) => <article key={item._id} className="rounded-xl border border-white/10 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-sm text-ink-300">{item.summary}</p></div><div className="flex gap-2"><button type="button" onClick={() => edit(item)} className="text-sm text-brand-300">Edit</button><button type="button" onClick={() => remove(item._id)} className="text-sm text-red-300">Delete</button></div></div></article>)}{items.length === 0 && <p className="py-8 text-sm text-ink-400">No {kind}s added yet.</p>}</div></div></section>;
}
