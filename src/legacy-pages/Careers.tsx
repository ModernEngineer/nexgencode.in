import { MapPin, Briefcase, Clock } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import { LinkButton } from '../components/ui/Button';
import { StaggerGroup, StaggerItem } from '../components/motion/Stagger';
import { jobOpenings, perks } from '../data/careers';

export default function Careers() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build your best work here"
        description="We're a small, senior team that cares about craft. If that sounds like you, we'd love to talk."
      />

      <section className="py-24">
        <Container>
          <SectionHeading eyebrow="Life at LogicMitra" title="What you get as part of the team" />
          <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((perk) => (
              <StaggerItem
                key={perk.title}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-brand-400/20"
              >
                <h3 className="font-semibold text-white">{perk.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{perk.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <section className="border-t border-white/5 bg-ink-900/40 py-24">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Open roles" title="Current openings" />

          <StaggerGroup className="mt-12 space-y-4">
            {jobOpenings.map((job) => (
              <StaggerItem
                key={job.id}
                whileHover={{ x: 4 }}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-brand-400/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{job.title}</h3>
                  <p className="mt-1 text-sm text-ink-400">{job.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-400">
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={14} /> {job.department}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {job.type}
                    </span>
                  </div>
                </div>
                <LinkButton to="/contact" variant="secondary" size="md" className="shrink-0">
                  Apply now
                </LinkButton>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>
    </>
  );
}
