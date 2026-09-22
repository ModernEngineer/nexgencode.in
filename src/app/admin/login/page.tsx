'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!response.ok) { setError('Invalid admin credentials.'); setLoading(false); return; }
    router.push('/admin');
    router.refresh();
  }

  return <main className="min-h-screen bg-ink-950 px-6 py-24 text-white"><form onSubmit={submit} className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8"><p className="text-sm text-brand-300">NextGenCode admin</p><h1 className="mt-3 font-display text-3xl font-bold">Sign in</h1><div className="mt-8 space-y-5"><label className="block text-sm">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-ink-950 px-4 py-3" /></label><label className="block text-sm">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-ink-950 px-4 py-3" /></label></div>{error && <p className="mt-4 text-sm text-red-300">{error}</p>}<button disabled={loading} className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'}</button></form></main>;
}
