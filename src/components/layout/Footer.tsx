import { Link } from 'react-router-dom';
import { Code2, Link2, Mail, MessageCircle } from 'lucide-react';
import Container from '../ui/Container';
import Logo from '../ui/Logo';
import { navLinks } from '../../data/nav';
import { services } from '../../data/services';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
       Turning Ideas into Powerful Digital Products.

We partner with startups and enterprises to design, build, and scale reliable software that drives real business growth.
            </p>
            <div className="mt-6 flex gap-3">
              {[MessageCircle, Link2, Code2, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ink-400 transition-colors hover:border-brand-400/40 hover:text-brand-300"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <a
              href="/admin/login"
              className="mt-6 inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-brand-400/50 hover:text-brand-300"
            >
              Admin login
            </a>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 lg:col-span-8">
            <div>
              <h4 className="text-sm font-semibold text-white">Company</h4>
              <ul className="mt-4 space-y-3">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-ink-400 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Services</h4>
              <ul className="mt-4 space-y-3">
                {services.slice(0, 5).map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services#${s.slug}`} className="text-sm text-ink-400 hover:text-white">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Contact</h4>
              <ul className="mt-4 space-y-3 text-sm text-ink-400">
                <li>
                  <a href="info@nexgencode.in" className="hover:text-white">
                    info@nexgencode.in
                  </a>
                </li>
                <li>
                  <a href="tel:+919450190953" className="hover:text-white">
                    +91 94501 90953
                  </a>
                </li>
                <li>Prayagraj, India</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-ink-500">© {year} NexGenCode.in All rights reserved.</p>
          {/* <p className="text-xs text-ink-500">Built with React, TypeScript & Tailwind CSS.</p> */}
        </div>
      </Container>
    </footer>
  );
}
