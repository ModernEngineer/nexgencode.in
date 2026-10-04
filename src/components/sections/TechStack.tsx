import Container from '../ui/Container';
import Reveal from '../motion/Reveal';
import { techMarquee } from '../../data/techStack';

/** Compact scrolling marquee used on the homepage. See TechStackGrid for the detailed version. */
export default function TechStack() {
  const loop = [...techMarquee, ...techMarquee];

  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <p className="text-center text-sm font-medium uppercase tracking-wider text-ink-400">
            Technologies we work with
          </p>
        </Reveal>
      </Container>

      <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-4">
          {loop.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="flex items-center rounded-full border border-white/10 bg-ink-900/60  px-6 py-2.5 text-sm font-medium text-ink-300 transition-colors hover:border-brand-400/40 hover:text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
