import { Link } from 'react-router-dom';
import { ArrowRight, Eye, HeartHandshake, Target } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import { LinkButton } from '../components/ui/Button';
import Reveal from '../components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '../components/motion/Stagger';
import Stats from '../components/sections/Stats';
import TeamGrid from '../components/sections/TeamGrid';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import CTASection from '../components/sections/CTASection';
import { serviceCategories, getServicesByCategory } from '../data/services';
import { iconMap } from '../lib/icons';
import { useSeo } from '../hooks/useSeo';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To help businesses simplify operations and grow through reliable, well-engineered software and digital solutions.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'To be the technology partner businesses across India trust for their most important digital initiatives.',
  },
  {
    icon: HeartHandshake,
    title: 'Our Values',
    description: 'A business-first mindset, transparency at every step, and long-term relationships beyond launch.',
  },
];

export default function About() {
  useSeo();

  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="We build technology around real business needs"
        description="NexGenCode is a Prayagraj-based technology company delivering software, web, mobile and digital marketing solutions for growing businesses."
      />

      <section className="py-24">
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our story" title="Agile like a startup, accountable like a partner" align="left" />
            <Reveal delay={0.1} className="mt-6 space-y-4 text-base leading-relaxed text-ink-300">
              <p>
                NexGenCode was founded with a clear vision: to make high-quality software development more agile,
                transparent and reliable. We combine the speed and flexibility of a startup with the engineering
                standards and accountability expected from an experienced technology partner.
              </p>
              <p>
                Today we work with schools, hospitals, hotels, retailers, real estate businesses and growing companies —
                building management systems, custom software, websites and apps, and helping them reach customers
                through SEO and digital marketing.
              </p>
              <p>
                Our goal is simple — build technology that solves real business problems, creates lasting value and is
                ready to scale with your ambitions.
              </p>
            </Reveal>
          </div>

          <StaggerGroup className="grid grid-cols-1 gap-5">
            {values.map((value) => (
              <StaggerItem
                key={value.title}
                whileHover={{ x: 4 }}
                className="flex gap-5 rounded-2xl border border-white/10 bg-ink-900/60  p-6 transition-colors hover:border-brand-400/30"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 text-ink-950">
                  <value.icon size={22} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{value.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>

      <Stats />

      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="What we deliver"
            title="Everything your business needs to go digital"
            description="Four practice areas, one accountable team."
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((cat) => {
              const Icon = iconMap[cat.icon];
              return (
                <StaggerItem key={cat.id} whileHover={{ y: -6 }} className="h-full">
                  <Link
                    to={`/services#${cat.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-white/10 bg-ink-900/60  p-6 transition-colors hover:border-brand-400/40"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300 ring-1 ring-brand-400/20">
                      {Icon && <Icon size={20} />}
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-white">{cat.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-400">{cat.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-300">
                      {getServicesByCategory(cat.id).length} services
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
          <div className="mt-12 flex justify-center">
            <LinkButton to="/services" variant="secondary" size="md">
              Explore our services <ArrowRight size={16} />
            </LinkButton>
          </div>
        </Container>
      </section>

      <WhyChooseUs />
      <TeamGrid limit={4} />
      <CTASection />
    </>
  );
}
