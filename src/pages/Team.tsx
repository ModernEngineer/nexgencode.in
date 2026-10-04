import { ArrowRight, Award, HeartHandshake, Lightbulb, Users } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Container from '../components/ui/Container';
import { LinkButton } from '../components/ui/Button';
import { StaggerGroup, StaggerItem } from '../components/motion/Stagger';
import TeamGrid from '../components/sections/TeamGrid';
import CTASection from '../components/sections/CTASection';
import { useSeo } from '../hooks/useSeo';

const culture = [
  {
    icon: Users,
    title: 'Small, senior team',
    description: 'You work directly with the people building your product — no hand-offs.',
  },
  {
    icon: Lightbulb,
    title: 'Business-first thinking',
    description: 'We understand your workflows before we write a single line of code.',
  },
  {
    icon: Award,
    title: 'Craft & quality',
    description: 'Clean code, careful testing and attention to detail in every release.',
  },
  {
    icon: HeartHandshake,
    title: 'Long-term partners',
    description: 'We stay with you after launch with support, updates and improvements.',
  },
];

export default function Team() {
  useSeo();

  return (
    <>
      <PageHeader
        eyebrow="Our team"
        title="Meet Our Core Team"
        description="The designers, engineers, project managers and marketers behind every NexGenCode project — based in Prayagraj and working with businesses across India."
        actions={
          <LinkButton to="/contact" size="lg">
            Work with us <ArrowRight size={18} />
          </LinkButton>
        }
      />

      <TeamGrid showHeading={false} />

      <section className="border-y border-white/5 bg-ink-900/40 py-20">
        <Container>
          <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {culture.map((item) => (
              <StaggerItem
                key={item.title}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-ink-900/60 p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white">
                  <item.icon size={20} />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{item.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <CTASection
        title="Want this team on your project?"
        description="Tell us what you're building — we'll put together the right people, plan and timeline for your business."
      />
    </>
  );
}
