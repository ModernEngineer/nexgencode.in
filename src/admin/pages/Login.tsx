import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import logoBlue from '../../assest/nexgencodelogo-blue.png';
import { useAuth } from '../auth';
import { PasswordInput, btn, inputCls } from '../ui';
import { useSeo } from '../../hooks/useSeo';

export default function Login() {
  useSeo({ title: 'Admin Login', noindex: true });
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-navy-950 lg:flex lg:flex-col lg:justify-end lg:p-14">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-accent-400/30 blur-[100px]" />
        <div className="relative max-w-md text-white">
          <p className="font-display text-3xl font-bold leading-tight">Manage your website content in one place.</p>
          <p className="mt-4 text-brand-100">
            Review contact enquiries, approve client reviews and update the core team — changes go live on the website instantly.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-700">
            <ArrowLeft size={15} /> Back to website
          </Link>
          <div className="-ml-14 mt-2 h-24 overflow-hidden">
            <img src={logoBlue} alt="NexGenCode logo" className="-mt-12 h-48 w-80 object-contain" />
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink-900">Admin login</h1>
          <p className="mt-1 text-sm text-ink-500">Sign in to manage the NexGenCode website.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-700">Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-700">Password</span>
              <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" />
            </label>

            {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}

            <button type="submit" className={`${btn.primary} w-full py-3`} disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
