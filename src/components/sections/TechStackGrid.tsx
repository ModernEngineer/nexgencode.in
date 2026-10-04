import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import { StaggerGroup, StaggerItem } from '../motion/Stagger';
import { techGroups, techStackIntro } from '../../data/techStack';
import { iconMap } from '../../lib/icons';

export default function TechStackGrid() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Latest technology stack"
          title="Modern, scalable, maintainable"
          description={techStackIntro}
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {techGroups.map((group, i) => {
            const Icon = iconMap[group.icon];
            return (
              <StaggerItem
                key={group.title}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border border-white/10 bg-ink-900/60  p-6 transition-colors hover:border-brand-400/30 ${
                  i === techGroups.length - 1 ? 'lg:col-span-3 sm:col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300 ring-1 ring-brand-400/20">
                    {Icon && <Icon size={18} />}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-white">{group.title}</h3>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-white/5 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-ink-200"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
