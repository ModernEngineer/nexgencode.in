import { ArrowRight } from 'lucide-react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import ServiceCard from '../ui/ServiceCard';
import { LinkButton } from '../ui/Button';
import { StaggerGroup, StaggerItem } from '../motion/Stagger';
import { services } from '../../data/services';

/** Homepage teaser: featured services + link to the full Services page */
export default function ServicesGrid() {
  const featured = services.filter((s) => s.featured);

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Technology solutions built for modern businesses"
          description="From industry-specific management systems to custom software, apps and digital marketing — we build solutions around real business needs."
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service) => (
            <StaggerItem key={service.slug} whileHover={{ y: -6 }} className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-12 flex justify-center">
          <LinkButton to="/services" variant="secondary" size="md">
            Explore all {services.length} services <ArrowRight size={16} />
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
