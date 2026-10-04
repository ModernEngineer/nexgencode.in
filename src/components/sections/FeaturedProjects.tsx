import { ArrowUpRight } from 'lucide-react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import { LinkButton } from '../ui/Button';
import { StaggerGroup, StaggerItem } from '../motion/Stagger';
import { projects } from '../../data/projects';

export default function FeaturedProjects() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Our work"
          title="Products we've helped bring to life"
          description="A sample of engagements across web, mobile, cloud and AI — each shipped with the same care as our own product."
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <StaggerItem
              key={project.id}
              whileHover={{ y: -6 }}
              className={`group overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60  transition-colors duration-300 hover:border-brand-400/30 ${project.url ? 'cursor-pointer' : ''}`}
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
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={360}
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
                    <span key={tag} className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-ink-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-12 flex justify-center">
          <LinkButton to="/portfolio" variant="secondary" size="md">
            View all projects <ArrowUpRight size={16} />
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
