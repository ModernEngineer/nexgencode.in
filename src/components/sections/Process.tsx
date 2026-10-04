import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import { StaggerGroup, StaggerItem } from '../motion/Stagger';
import { processSteps } from '../../data/process';

export default function Process() {
  return (
    <section className="border-y border-white/5 bg-ink-900/40 py-24">
      <Container>
        <SectionHeading
          eyebrow="Our development process"
          title="A structured process from idea to launch"
          description="Clear milestones and communication at every step — so you always know where your project stands."
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <StaggerItem
              key={step.step}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60  p-6 transition-colors hover:border-brand-400/30"
            >
              <span className="absolute -right-2 -top-4 font-display text-7xl font-bold text-white/[0.04] transition-colors group-hover:text-brand-400/10">
                {step.step}
              </span>
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 font-display text-sm font-bold text-ink-950">
                {step.step}
              </span>
              <h3 className="relative mt-4 font-display text-lg font-semibold text-white">{step.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-ink-400">{step.description}</p>
            </StaggerItem>
          ))}

          <StaggerItem whileHover={{ y: -4 }} className="h-full">
            <Link to="/contact" className="group flex h-full flex-col justify-between rounded-2xl border-gradient p-6">
              <div>
                <p className="font-display text-lg font-semibold text-white">Ready to start?</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  Share your requirements and we'll plan the right approach together.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
                Get a free consultation
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </StaggerItem>
        </StaggerGroup>
      </Container>
    </section>
  );
}
