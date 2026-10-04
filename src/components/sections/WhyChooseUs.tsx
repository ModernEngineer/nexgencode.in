import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import { StaggerGroup, StaggerItem } from '../motion/Stagger';
import { whyChooseUs } from '../../data/whyChooseUs';
import { iconMap } from '../../lib/icons';

export default function WhyChooseUs() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Why NexGenCode"
          title="A technology partner that puts your business first"
          description="We pair modern engineering with a clear understanding of how your business works — and stay with you long after launch."
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((point) => {
            const Icon = iconMap[point.icon];
            return (
              <StaggerItem
                key={point.title}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-white/10 bg-ink-900/60  p-6 transition-colors hover:border-brand-400/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300 ring-1 ring-brand-400/20 transition-colors group-hover:bg-brand-500/20">
                  {Icon && <Icon size={20} />}
                </div>
                <h3 className="mt-4 font-display font-semibold text-white">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{point.description}</p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
