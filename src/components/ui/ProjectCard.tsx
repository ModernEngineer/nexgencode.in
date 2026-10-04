import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import clsx from 'clsx';
import type { Project } from '../../types';
import { assetUrl } from '../../lib/api';
import { accentClass } from '../../data/accents';

const cardClass =
  'group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 transition-colors duration-300 hover:border-brand-400/30';

/**
 * Portfolio card. When the project has a live URL the whole card is a real link that opens it in a
 * new browser tab (target="_blank", rel="noopener noreferrer").
 */
export default function ProjectCard({ project }: { project: Project }) {
  const image = assetUrl(project.imageUrl);

  const body: ReactNode = (
    <>
      <div className={clsx('relative h-44 overflow-hidden bg-gradient-to-br', accentClass(project.accent))}>
        {image ? (
          <img
            src={image}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
            width={640}
            height={360}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full opacity-80 transition-transform duration-500 group-hover:scale-110" />
        )}
        {project.url && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink-950/80 px-3 py-1 text-xs font-semibold text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            Visit live site <ArrowUpRight size={13} />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">{project.category}</span>
        <h3 className="mt-2 font-display text-lg font-semibold text-white">{project.title}</h3>
        {project.description && <p className="mt-2 text-sm leading-relaxed text-ink-400">{project.description}</p>}
        {project.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-ink-300">
                {tag}
              </span>
            ))}
          </div>
        )}
        {project.url && (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-300">
            View project
            <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </>
  );

  return project.url ? (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} — open live project in a new tab`}
      className={cardClass}
    >
      {body}
    </a>
  ) : (
    <div className={cardClass}>{body}</div>
  );
}
