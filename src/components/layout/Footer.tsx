import { Link } from 'react-router-dom';
import { Lock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Container from '../ui/Container';
import Logo from '../ui/Logo';
import { footerCompanyLinks, legalLinks } from '../../data/nav';
import { serviceCategories, getServicesByCategory } from '../../data/services';
import { contactInfo, whatsappLink } from '../../data/contact';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-navy-950 text-ink-300">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-500/10 blur-[120px]" />

      <Container className="relative py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Logo imgClassName="h-16" />
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-400">
              Professional technology & digital solutions — software, apps, websites and marketing designed for real
              business growth.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 hover:text-white">
                  <Mail size={16} className="text-brand-400" /> {contactInfo.email}
                </a>
              </li>
              <li>
                <a href={contactInfo.phoneHref} className="flex items-center gap-3 hover:text-white">
                  <Phone size={16} className="text-brand-400" /> {contactInfo.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-white"
                >
                  <MessageCircle size={16} className="text-brand-400" /> Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={contactInfo.officeMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-white"
                >
                  <MapPin size={16} className="shrink-0 text-brand-400" /> {contactInfo.office}
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-5">
            <div>
              <h4 className="text-sm font-semibold text-white">Company</h4>
              <ul className="mt-4 space-y-3">
                {footerCompanyLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm text-ink-400 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {serviceCategories.map((cat) => (
              <div key={cat.id}>
                <h4 className="text-sm font-semibold text-white">
                  <Link to={`/services#${cat.id}`} className="hover:text-brand-300">
                    {cat.title}
                  </Link>
                </h4>
                <ul className="mt-4 space-y-3">
                  {getServicesByCategory(cat.id)
                    .slice(0, 6)
                    .map((s) => (
                      <li key={s.slug}>
                        <Link to={`/services/${s.slug}`} className="text-sm text-ink-400 hover:text-white">
                          {s.title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ink-400 md:flex-row">
          <p suppressHydrationWarning>© {year} NexGenCode.in — All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <Link key={link.path} to={link.path} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              rel="nofollow"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 hover:border-brand-400 hover:text-white"
            >
              <Lock size={12} /> Admin Login
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
