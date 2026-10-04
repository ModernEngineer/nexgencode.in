import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, Mail, MessageCircle, Phone } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import ServiceCard from '../components/ui/ServiceCard';
import { AnchorButton, LinkButton } from '../components/ui/Button';
import Reveal from '../components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '../components/motion/Stagger';
import Process from '../components/sections/Process';
import CTASection from '../components/sections/CTASection';
import NotFound from './NotFound';
import { getCategory, getServiceBySlug, getServicesByCategory } from '../data/services';
import { whyChooseUs } from '../data/whyChooseUs';
import { contactInfo, whatsappLink } from '../data/contact';
import { iconMap } from '../lib/icons';
import { useSeo } from '../hooks/useSeo';

export default function ServiceDetail() {
  const { slug = '' } = useParams();
  const service = getServiceBySlug(slug);
  useSeo();

  if (!service) return <NotFound />;

  const category = getCategory(service.category);
  const related = getServicesByCategory(service.category)
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);
  const Icon = iconMap[service.icon];
  const enquiryPath = `/contact?service=${service.slug}`;

  return (
    <>
      <PageHeader
        eyebrow={category.title}
        title={service.title}
        description={service.description}
        actions={
          <>
            <LinkButton to={enquiryPath} size="lg">
              Discuss Your Project <ArrowRight size={18} />
            </LinkButton>
            <AnchorButton
              href={whatsappLink(`Hi NexGenCode, I'd like to know more about ${service.title}.`)}
              variant="secondary"
              size="lg"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </AnchorButton>
          </>
        }
      >
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-1.5 text-xs text-ink-400">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/services" className="hover:text-white">
            Services
          </Link>
          <ChevronRight size={12} />
          <Link to={`/services#${category.id}`} className="hover:text-white">
            {category.title}
          </Link>
        </nav>
      </PageHeader>

      <section className="py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 text-ink-950">
                {Icon && <Icon size={26} />}
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">Key capabilities</p>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">What's included</h2>
              </div>
            </Reveal>

            <StaggerGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {service.features.map((feature) => (
                <StaggerItem
                  key={feature}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-ink-900/60  p-5 transition-colors hover:border-brand-400/30"
                >
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brand-400" />
                  <span className="text-sm font-medium text-ink-100">{feature}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <Reveal delay={0.1} className="mt-14">
              <h3 className="font-display text-xl font-semibold text-white">Why build it with NexGenCode?</h3>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                {whyChooseUs.slice(0, 6).map((point) => {
                  const PointIcon = iconMap[point.icon];
                  return (
                    <li key={point.title} className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-300">
                        {PointIcon && <PointIcon size={17} />}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{point.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-400">{point.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>

          <aside>
            <Reveal delay={0.15} className="lg:sticky lg:top-28">
              <div className="rounded-2xl border-gradient p-7">
                <h3 className="font-display text-lg font-semibold text-white">Get a free consultation</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  Tell us about your requirements and we'll suggest the right features, timeline and approach for your
                  business.
                </p>
                <LinkButton to={enquiryPath} size="md" className="mt-6 w-full">
                  Discuss Your Project <ArrowRight size={16} />
                </LinkButton>
                <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
                  <a href={contactInfo.phoneHref} className="flex items-center gap-3 text-ink-300 hover:text-white">
                    <Phone size={16} className="text-brand-400" /> {contactInfo.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-3 text-ink-300 hover:text-white"
                  >
                    <Mail size={16} className="text-brand-400" /> {contactInfo.email}
                  </a>
                </div>
              </div>
            </Reveal>
          </aside>
        </Container>
      </section>

      <Process />

      {related.length > 0 && (
        <section className="py-24">
          <Container>
            <SectionHeading eyebrow="Related services" title={`More ${category.title.toLowerCase()} solutions`} />
            <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <StaggerItem key={s.slug} whileHover={{ y: -6 }} className="h-full">
                  <ServiceCard service={s} />
                </StaggerItem>
              ))}
            </StaggerGroup>
            <div className="mt-12 flex justify-center">
              <LinkButton to="/services" variant="secondary" size="md">
                View all services <ArrowRight size={16} />
              </LinkButton>
            </div>
          </Container>
        </section>
      )}

      <CTASection primaryTo={enquiryPath} />
    </>
  );
}
