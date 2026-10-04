import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, FolderKanban, Inbox, Share2, LayoutDashboard, LogOut, Menu, MessageSquareQuote, Settings, Users, X } from 'lucide-react';
import clsx from 'clsx';
import logoWhite from '../assest/nexgencodelogo.png';
import { useAuth } from './auth';
import { useSeo } from '../hooks/useSeo';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/reviews', label: 'Client Reviews', icon: MessageSquareQuote },
  { to: '/admin/team', label: 'Core Team', icon: Users },
  { to: '/admin/portfolio', label: 'Portfolio', icon: FolderKanban },
  { to: '/admin/social-links', label: 'Social Links', icon: Share2 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex h-full flex-col bg-navy-950 text-ink-300">
      <div className="flex h-20 items-center overflow-hidden border-b border-white/10 px-3">
        <img src={logoWhite} alt="NexGenCode logo" className="h-40 w-56 object-contain" />
      </div>
      <p className="px-6 pt-6 text-[11px] font-semibold uppercase tracking-wider text-ink-500">Admin panel</p>
      <nav className="mt-3 flex-1 space-y-1 px-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40' : 'hover:bg-white/5 hover:text-white'
              )
            }
          >
            <l.icon size={18} /> {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={18} /> View website
        </a>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} /> Log out
        </button>
        <p className="truncate px-3 pt-2 text-xs text-ink-500">Signed in as {user?.username}</p>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  useSeo({ title: 'Admin Panel', noindex: true });
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const current = links.find((l) => (l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)));

  return (
    <div className="min-h-screen bg-ink-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200 bg-white/90 px-4 backdrop-blur sm:px-8">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <p className="font-semibold text-ink-900">{current?.label ?? 'Admin'}</p>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
