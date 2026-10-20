import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import PageHeader from '../components/ui/PageHeader';
import Container from '../components/ui/Container';
import CTASection from '../components/sections/CTASection';
import { projects, projectCategories } from '../data/projects';
import { easeOut } from '../lib/motion';

export default function Portfolio() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Selected work"
        description="A sample of products we've designed and built across industries. Case studies available on request."
      />

      <section className="py-24">
        <Container>
          <div className="flex flex-wrap justify-center gap-2">
            {projectCategories.map((category) => {
              const isActive = active === category;
              return (
                <button
                  key={category}
                  onClick={() => setActive(category)}
                  className={clsx(
                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive ? 'text-white' : 'border border-white/10 text-ink-300 hover:text-white'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="portfolio-filter-pill"
                      className="absolute inset-0 rounded-full bg-brand-600"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>

          <motion.div layout className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                  whileHover={{ y: -6 }}
                  className={`group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-brand-400/30 ${project.url ? 'cursor-pointer' : ''}`}
                  onClick={() => project.url && window.open(project.url, '_blank', 'noopener,noreferrer')}
                  onKeyDown={(event) => {
                    if (project.url && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault();
                      window.open(project.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  role={project.url ? 'link' : undefined}
                  tabIndex={project.url ? 0 : undefined}
                >
                  <div className={`h-36 overflow-hidden bg-gradient-to-br ${project.accent} opacity-80`}>
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} preview`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full transition-transform duration-500 group-hover:scale-110" />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                      {project.category}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold text-white">{project.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-400">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-ink-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
