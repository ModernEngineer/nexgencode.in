import { ArrowUpRight } from 'lucide-react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import ProjectCard from '../ui/ProjectCard';
import { LinkButton } from '../ui/Button';
import { StaggerGroup, StaggerItem } from '../motion/Stagger';
import { useApiData } from '../../hooks/useApiData';
import { getProjects } from '../../lib/publicApi';
import { fallbackProjects } from '../../data/projects';

/** Homepage: projects marked "Show on homepage" in Admin → Portfolio. */
export default function FeaturedProjects() {
  const { data, loading } = useApiData(
    (signal) => getProjects(true, signal),
    fallbackProjects.filter((p) => p.isFeatured)
  );

  if (!loading && data!.length === 0) return null;

  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Our work"
          title="Products we've helped bring to life"
          description="Websites and business software we've designed and built — click a project to see it live."
        />

        {loading ? (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
            ))}
          </div>
        ) : (
          <StaggerGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data!.slice(0, 6).map((project) => (
              <StaggerItem key={project.id} whileHover={{ y: -6 }} className="h-full">
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}

        <div className="mt-12 flex justify-center">
          <LinkButton to="/portfolio" variant="secondary" size="md">
            View all projects <ArrowUpRight size={16} />
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
