import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Service } from '../../types';
import { iconMap } from '../../lib/icons';

export default function ServiceCard({ service, index }: { service: Service; index?: number }) {
  const Icon = iconMap[service.icon];

  return (
    <Link
      to={`/services/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60  p-7 transition-colors duration-300 hover:border-brand-400/40"
    >
      {/* Hover glow */}
      <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/0 blur-3xl transition-colors duration-500 group-hover:bg-brand-500/20" />

      <div className="relative flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400/20 to-accent-500/10 text-brand-300 ring-1 ring-brand-400/20 transition-transform duration-300 group-hover:scale-110">
          {Icon && <Icon size={22} />}
        </div>
        {index !== undefined && (
          <span className="font-display text-sm font-semibold text-ink-600">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>

      <h3 className="relative mt-5 font-display text-lg font-semibold leading-snug text-white">{service.title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-ink-400">{service.summary}</p>

      <ul className="relative mt-5 flex flex-wrap gap-2">
        {service.features.slice(0, 3).map((f) => (
          <li key={f} className="rounded-full border border-white/5 bg-white/[0.04] px-3 py-1 text-xs text-ink-300">
            {f}
          </li>
        ))}
      </ul>

      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-300">
        Learn more
        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
