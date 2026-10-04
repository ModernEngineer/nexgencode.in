import { useEffect, useState } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import Container from '../ui/Container';
import Logo from '../ui/Logo';
import { LinkButton } from '../ui/Button';
import { navLinks } from '../../data/nav';
import { services, serviceCategories, getServicesByCategory } from '../../data/services';
import { iconMap } from '../../lib/icons';

function ServicesMegaMenu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-full hidden pt-2 lg:block"
    >
      <Container>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="grid grid-cols-4 gap-6 p-7">
            {serviceCategories.map((cat) => {
              const CatIcon = iconMap[cat.icon];
              return (
                <div key={cat.id}>
                  <Link
                    to={`/services#${cat.id}`}
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300 hover:text-brand-200"
                  >
                    {CatIcon && <CatIcon size={14} />}
                    {cat.title}
                  </Link>
                  <ul className="mt-3 space-y-0.5">
                    {getServicesByCategory(cat.id).map((s) => (
                      <li key={s.slug}>
                        <Link
                          to={`/services/${s.slug}`}
                          className="block rounded-md px-2 py-1.5 text-[13px] leading-snug text-ink-300 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.04] px-7 py-4">
            <p className="text-sm text-ink-400">Not sure what you need? We'll help you choose the right solution.</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-brand-200"
            >
              View all {services.length} services <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false); // no window during prerender; updated on first scroll;
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation (state reset during render instead of in an effect)
  const [lastLocationKey, setLastLocationKey] = useState(location.key);
  if (lastLocationKey !== location.key) {
    setLastLocationKey(location.key);
    setOpen(false);
    setMegaOpen(false);
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseLeave={() => setMegaOpen(false)}
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open || megaOpen
          ? 'border-b border-white/5 bg-ink-950/85 shadow-sm shadow-black/20 backdrop-blur-lg'
          : 'bg-transparent'
      )}
    >
      {/* Same width as the page content: logo aligns with the content's left edge, CTA with its right edge */}
      <Container className="flex h-20 items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isServices = link.path === '/services';
            return (
              <div
                key={link.path}
                onMouseEnter={() => setMegaOpen(isServices)}
                onFocus={() => isServices && setMegaOpen(true)}
              >
                <RouterNavLink
                  to={link.path}
                  end={link.path === '/'}
                  aria-haspopup={isServices ? 'true' : undefined}
                  aria-expanded={isServices ? megaOpen : undefined}
                  className={({ isActive }) =>
                    clsx(
                      'relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-brand-300' : 'text-ink-300 hover:text-white'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-full bg-brand-500/10 ring-1 ring-brand-400/30"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                      {isServices && (
                        <ChevronDown
                          size={14}
                          className={clsx('relative z-10 transition-transform', megaOpen && 'rotate-180')}
                        />
                      )}
                    </>
                  )}
                </RouterNavLink>
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:block" onMouseEnter={() => setMegaOpen(false)}>
          <LinkButton to="/contact" size="md">
            Get a Free Consultation
          </LinkButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-100 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      <AnimatePresence>{megaOpen && <ServicesMegaMenu />}</AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-white/5 bg-ink-900/95 backdrop-blur-lg lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <RouterNavLink
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      clsx(
                        'block rounded-lg px-4 py-3 text-sm font-medium',
                        isActive ? 'bg-brand-500/10 text-brand-300' : 'text-ink-300'
                      )
                    }
                  >
                    {link.label}
                  </RouterNavLink>
                </motion.div>
              ))}
              <LinkButton to="/contact" size="md" className="mt-2 w-full">
                Get a Free Consultation
              </LinkButton>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
