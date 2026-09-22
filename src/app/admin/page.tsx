import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import connectToDatabase from '../../lib/mongodb';
import { ADMIN_COOKIE, isAdminTokenValid } from '../../lib/admin-auth';
import Contact from '../../models/Contact';
import ContentManager from './ContentManager';
import ContactManager from './ContactManager';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  if (!(await isAdminTokenValid(cookieStore.get(ADMIN_COOKIE)?.value))) redirect('/admin/login');
  await connectToDatabase();
  const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
  const serializedContacts = contacts.map((contact) => ({ _id: String(contact._id), name: contact.name, email: contact.email, company: contact.company, message: contact.message, status: contact.status }));
  const newCount = contacts.filter((contact) => contact.status === 'new').length;
  const readCount = contacts.filter((contact) => contact.status === 'read').length;
  const archivedCount = contacts.filter((contact) => contact.status === 'archived').length;

  return <main className="min-h-screen bg-ink-950 px-6 py-12 text-white"><div className="mx-auto max-w-7xl"><div className="flex items-end justify-between gap-4"><div><p className="text-sm text-brand-300">NextGenCode admin</p><h1 className="mt-2 font-display text-4xl font-bold">Dashboard</h1></div><form action="/api/admin/logout" method="post"><button className="rounded-lg border border-white/10 px-4 py-2 text-sm">Log out</button></form></div><div className="mt-10 grid gap-4 sm:grid-cols-4"><Stat label="Total contacts" value={contacts.length} /><Stat label="New" value={newCount} /><Stat label="Read" value={readCount} /><Stat label="Archived" value={archivedCount} /></div><section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-semibold">Contact submissions</h2><span className="text-sm text-ink-400">Manage leads</span></div><ContactManager initialContacts={serializedContacts} /></section><ContentManager /></div></main>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5"><p className="text-sm text-ink-400">{label}</p><p className="mt-2 font-display text-3xl font-bold">{value}</p></div>;
}
