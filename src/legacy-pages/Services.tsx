import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Container from '../components/ui/Container';
import { LinkButton } from '../components/ui/Button';
import FAQ from '../components/sections/FAQ';
import CTASection from '../components/sections/CTASection';
import { services } from '../data/services';
import { iconMap } from '../lib/icons';
import { easeOut, viewportOnce } from '../lib/motion';

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Full-lifecycle software engineering"
        description="Whichever stage your product is at, we plug in where you need us most — from a single feature to the full build."
      />

      <section className="py-24">
        <Container className="space-y-16">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon];
            const reversed = i % 2 === 1;
            return (
              <div
                key={service.slug}
                id={service.slug}
                className={`grid scroll-mt-24 grid-cols-1 items-center gap-10 lg:grid-cols-2 ${
                  reversed ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: reversed ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, ease: easeOut }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                    {Icon && <Icon size={26} />}
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-bold text-white sm:text-3xl">{service.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-ink-300">{service.description}</p>
                  <LinkButton to="/contact" variant="secondary" size="md" className="mt-6">
                    Discuss this service
                  </LinkButton>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: reversed ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
                >
                  <p className="text-sm font-semibold uppercase tracking-wider text-ink-400">What's included</p>
                  <ul className="mt-4 space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-ink-200">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </Container>
      </section>

      <FAQ />
      <CTASection />
    </>
  );
}
