import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import ServiceCard from '../components/ui/ServiceCard';
import { LinkButton } from '../components/ui/Button';
import { StaggerGroup, StaggerItem } from '../components/motion/Stagger';
import TechStackGrid from '../components/sections/TechStackGrid';
import Process from '../components/sections/Process';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import CTASection from '../components/sections/CTASection';
import { services, serviceCategories, getServicesByCategory } from '../data/services';
import { iconMap } from '../lib/icons';
import { useSeo } from '../hooks/useSeo';

export default function Services() {
  useSeo();

  return (
    <>
      {/* 1. Hero */}
      <PageHeader
        eyebrow="Our Services"
        title="Technology Solutions Built for Modern Businesses"
        description="NexGenCode delivers scalable software, web, mobile and digital solutions designed to simplify operations, improve customer experiences and help businesses grow. From industry-specific management systems to custom technology and digital marketing, we build solutions around real business needs."
        actions={
          <>
            <LinkButton to="/contact" size="lg">
              Get a Free Consultation <ArrowRight size={18} />
            </LinkButton>
            <LinkButton to="/services#overview" variant="secondary" size="lg">
              Explore Our Services
            </LinkButton>
          </>
        }
      />

      {/* 2. Overview — category tiles that jump to each group */}
      <section id="overview" className="scroll-mt-24 py-20">
        <Container>
          <SectionHeading
            eyebrow="Services overview"
            title={`${services.length} services, one technology partner`}
            description="Explore our solutions by category — from business software to marketing and long-term support."
          />
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.map((cat) => {
              const Icon = iconMap[cat.icon];
              const count = getServicesByCategory(cat.id).length;
              return (
                <StaggerItem key={cat.id} whileHover={{ y: -6 }} className="h-full">
                  <Link
                    to={`/services#${cat.id}`}
                    className="group flex h-full flex-col rounded-2xl border-gradient p-6 transition-shadow hover:shadow-lg hover:shadow-brand-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 text-ink-950">
                        {Icon && <Icon size={22} />}
                      </span>
                      <span className="font-display text-3xl font-bold text-ink-300">
                        {String(count).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-white">{cat.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-400">{cat.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-300">
                      View {count} services
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </Container>
      </section>

      {/* 3–6. One section per category */}
      {serviceCategories.map((cat, ci) => {
        const items = getServicesByCategory(cat.id);
        // Running index so cards are numbered 01–21 across all categories
        const offset = serviceCategories.slice(0, ci).reduce((n, c) => n + getServicesByCategory(c.id).length, 0);
        return (
          <section
            key={cat.id}
            id={cat.id}
            className={`scroll-mt-24 py-24 ${ci % 2 === 0 ? 'border-y border-white/5 bg-ink-900/40' : ''}`}
          >
            <Container>
              <SectionHeading eyebrow={cat.title} title={cat.heading} description={cat.description} />
              <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((service, i) => (
                  <StaggerItem
                    key={service.slug}
                    id={service.slug}
                    whileHover={{ y: -6 }}
                    className="h-full scroll-mt-28"
                  >
                    <ServiceCard service={service} index={offset + i} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </Container>
          </section>
        );
      })}

      {/* 7. Tech stack */}
      <TechStackGrid />

      {/* 8. Process */}
      <Process />

      {/* 9. Why choose us */}
      <WhyChooseUs />

      {/* 10. Closing CTA */}
      <CTASection />
    </>
  );
}
