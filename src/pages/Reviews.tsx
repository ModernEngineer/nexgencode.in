import { PenLine } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Container from '../components/ui/Container';
import SectionHeading from '../components/ui/SectionHeading';
import ReviewCard from '../components/ui/ReviewCard';
import { StarRating } from '../components/ui/StarRating';
import { LinkButton } from '../components/ui/Button';
import Reveal from '../components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '../components/motion/Stagger';
import ReviewForm from '../components/sections/ReviewForm';
import CTASection from '../components/sections/CTASection';
import { useApiData } from '../hooks/useApiData';
import { getReviews } from '../lib/publicApi';
import { fallbackReviews } from '../data/reviews';
import { useSeo } from '../hooks/useSeo';

export default function Reviews() {
  useSeo();
  const { data, loading } = useApiData((signal) => getReviews(undefined, signal), fallbackReviews);

  // Star distribution of the published reviews
  const total = data?.items.length ?? 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: data?.items.filter((r) => r.rating === star).length ?? 0,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Client reviews"
        title="What our clients say about us"
        description="Honest feedback from schools, hospitals, hotels, retailers and businesses we've worked with across India."
        actions={
          <LinkButton to="/reviews#write-review" size="lg">
            <PenLine size={18} /> Write a review
          </LinkButton>
        }
      />

      <section className="py-20">
        <Container>
          {data && data.count > 0 && (
            <Reveal className="mx-auto grid max-w-3xl grid-cols-1 items-center gap-8 rounded-2xl border border-white/10 bg-ink-900/60 p-8  sm:grid-cols-[auto_1fr]">
              <div className="text-center sm:border-r sm:border-white/5 sm:pr-10">
                <p className="font-display text-6xl font-bold text-white">{data.average.toFixed(1)}</p>
                <StarRating value={data.average} size={22} className="mt-2" />
                <p className="mt-2 text-sm text-ink-400">{data.count} reviews</p>
              </div>
              <ul className="space-y-2">
                {distribution.map(({ star, count }) => (
                  <li key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-12 shrink-0 text-ink-300">{star} star</span>
                    <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full bg-amber-400"
                        style={{ width: total ? `${(count / total) * 100}%` : 0 }}
                      />
                    </span>
                    <span className="w-6 shrink-0 text-right text-ink-400">{count}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {loading ? (
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
              ))}
            </div>
          ) : data!.items.length === 0 ? (
            <p className="mt-14 text-center text-ink-400">No reviews yet — be the first to share your experience.</p>
          ) : (
            <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data!.items.map((review) => (
                <StaggerItem key={review.id} whileHover={{ y: -4 }} className="h-full">
                  <ReviewCard review={review} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </Container>
      </section>

      <section id="write-review" className="scroll-mt-24 border-t border-white/5 bg-ink-900/40 py-24">
        <Container className="max-w-3xl">
          <SectionHeading
            eyebrow="Share your experience"
            title="Write a review"
            description="Worked with NexGenCode? We'd love to hear from you. Reviews are published after a quick check by our team."
          />
          <Reveal delay={0.1} className="mt-12">
            <ReviewForm />
          </Reveal>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
