import { ArrowRight, Link2, Mail } from 'lucide-react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Avatar from '../ui/Avatar';
import { LinkButton } from '../ui/Button';
import { StaggerGroup, StaggerItem } from '../motion/Stagger';
import { useApiData } from '../../hooks/useApiData';
import { getTeam } from '../../lib/publicApi';
import { fallbackTeam } from '../../data/team';
import type { TeamMember } from '../../types';

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60  transition-colors hover:border-brand-400/40">
      <div className="relative aspect-[4/4.2] overflow-hidden bg-gradient-to-br from-brand-500/15 to-accent-600/10">
        <Avatar
          name={member.name}
          imageUrl={member.imageUrl}
          textClassName="text-5xl"
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        {(member.linkedInUrl || member.email) && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-ink-950/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
            {member.linkedInUrl && (
              <a
                href={member.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/60 text-brand-300 hover:bg-white/5"
              >
                <Link2 size={16} />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                aria-label={`Email ${member.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/60 text-brand-300 hover:bg-white/5"
              >
                <Mail size={16} />
              </a>
            )}
          </div>
        )}
      </div>
      <div className="p-5 text-center">
        <h3 className="font-display text-lg font-semibold text-white">{member.name}</h3>
        <p className="mt-1 text-sm font-medium text-brand-300">{member.title}</p>
        {member.bio && <p className="mt-3 text-sm leading-relaxed text-ink-400">{member.bio}</p>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60">
      <div className="aspect-[4/4.2] animate-pulse bg-white/10" />
      <div className="space-y-2 p-5">
        <div className="mx-auto h-4 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="mx-auto h-3 w-1/2 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

/** "Meet Our Core Team" grid. Members, photos, titles and order are managed in Admin → Team. */
export default function TeamGrid({ limit, showHeading = true }: { limit?: number; showHeading?: boolean }) {
  const { data, loading } = useApiData((signal) => getTeam(signal), fallbackTeam);
  const members = limit ? data?.slice(0, limit) : data;

  return (
    <section className={showHeading ? 'py-24' : 'pb-24 pt-12'}>
      <Container>
        {showHeading && (
          <SectionHeading
            eyebrow="Our people"
            title="Meet Our Core Team"
            description="Designers, engineers and marketers who stay closely involved in every project — from the first discussion to long after launch."
          />
        )}

        {loading ? (
          <div className={`${showHeading ? 'mt-16' : ''} grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
            {Array.from({ length: limit ?? 8 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <StaggerGroup
            className={`${showHeading ? 'mt-16' : ''} grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4`}
          >
            {members!.map((member) => (
              <StaggerItem key={member.id} whileHover={{ y: -6 }} className="h-full">
                <MemberCard member={member} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}

        {limit && data && data.length > limit && (
          <div className="mt-12 flex justify-center">
            <LinkButton to="/team" variant="secondary" size="md">
              Meet the full team <ArrowRight size={16} />
            </LinkButton>
          </div>
        )}
      </Container>
    </section>
  );
}
