import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import PageHeader from '../components/ui/PageHeader';
import Container from '../components/ui/Container';
import ProjectCard from '../components/ui/ProjectCard';
import CTASection from '../components/sections/CTASection';
import { useApiData } from '../hooks/useApiData';
import { getProjects } from '../lib/publicApi';
import { fallbackProjects } from '../data/projects';
import { easeOut } from '../lib/motion';
import { useSeo } from '../hooks/useSeo';

export default function Portfolio() {
  useSeo();
  // Projects, categories, images, tags and links are managed in Admin → Portfolio
  const { data: projects, loading } = useApiData((signal) => getProjects(false, signal), fallbackProjects);
  const [active, setActive] = useState('All');

  const categories = ['All', ...Array.from(new Set((projects ?? []).map((p) => p.category)))];
  const filtered = !projects ? [] : active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Selected work"
        description="A sample of products we've designed and built across industries. Click any project to open the live site."
      />

      <section className="py-24">
        <Container>
          {!loading && categories.length > 2 && (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => {
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
                        className="absolute inset-0 rounded-full bg-brand-500"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="mt-12 text-center text-ink-400">No projects to show yet.</p>
          ) : (
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
                    className="h-full"
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </Container>
      </section>

      <CTASection />
    </>
  );
}
