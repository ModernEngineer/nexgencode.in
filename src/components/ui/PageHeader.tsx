import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Container from './Container';
import { easeOut } from '../../lib/motion';

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  /** CTA buttons rendered under the description */
  actions?: ReactNode;
  /** Extra content (e.g. breadcrumbs) rendered above the eyebrow */
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-grid py-20 sm:py-24">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[640px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-[110px]"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="pointer-events-none absolute -right-20 bottom-0 h-[240px] w-[240px] rounded-full bg-accent-600/15 blur-[90px]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950 to-transparent" />

      <Container className="relative text-center">
        {children}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="inline-block rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand-300"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: easeOut }}
          className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: easeOut }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg"
          >
            {description}
          </motion.p>
        )}
        {actions && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24, ease: easeOut }}
            className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
          >
            {actions}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
