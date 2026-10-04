import { ArrowRight, PenLine } from 'lucide-react';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import ReviewCard from '../ui/ReviewCard';
import { StarRating } from '../ui/StarRating';
import { LinkButton } from '../ui/Button';
import { StaggerGroup, StaggerItem } from '../motion/Stagger';
import Reveal from '../motion/Reveal';
import { useApiData } from '../../hooks/useApiData';
import { getReviews } from '../../lib/publicApi';
import { fallbackReviews } from '../../data/reviews';

/** Client reviews — only reviews enabled in Admin → Reviews are returned by the API. */
export default function Testimonials({ limit = 6 }: { limit?: number }) {
  const { data, loading } = useApiData((signal) => getReviews(limit, signal), fallbackReviews);

  if (!loading && data!.items.length === 0) return null;

  return (
    <section className="border-y border-white/5 bg-gradient-to-b from-ink-900/60 to-ink-950 py-24">
      <Container>
        <SectionHeading
          eyebrow="Client reviews"
          title="What our clients say"
          description="Schools, hospitals, hotels, retailers and growing businesses across India trust NexGenCode."
        />

        {data && data.count > 0 && (
          <Reveal className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
            <span className="font-display text-4xl font-bold text-white">{data.average.toFixed(1)}</span>
            <div className="flex flex-col items-center sm:items-start">
              <StarRating value={data.average} size={20} />
              <span className="mt-1 text-sm text-ink-400">Based on {data.count} client reviews</span>
            </div>
          </Reveal>
        )}

        {loading ? (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-ink-900/60" />
            ))}
          </div>
        ) : (
          <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data!.items.map((review) => (
              <StaggerItem key={review.id} whileHover={{ y: -4 }} className="h-full">
                <ReviewCard review={review} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}

        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton to="/reviews" variant="secondary" size="md">
            Read all reviews <ArrowRight size={16} />
          </LinkButton>
          <LinkButton to="/reviews#write-review" variant="ghost" size="md">
            <PenLine size={16} /> Write a review
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
