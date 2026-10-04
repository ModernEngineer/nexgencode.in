import { Quote } from 'lucide-react';
import Avatar from './Avatar';
import { StarRating } from './StarRating';
import type { Review } from '../../types';

export default function ReviewCard({ review }: { review: Review }) {
  const subtitle = [review.designation, review.company].filter(Boolean).join(', ');
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-ink-900/60 p-7  transition-colors hover:border-brand-400/40">
      <div className="flex items-center justify-between">
        <StarRating value={review.rating} size={18} />
        <Quote className="text-brand-500/40" size={28} />
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-200">“{review.comment}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
        <Avatar
          name={review.clientName}
          imageUrl={review.imageUrl}
          className="h-11 w-11 shrink-0 rounded-full"
          textClassName="text-sm"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{review.clientName}</p>
          <p className="truncate text-xs text-ink-400">
            {subtitle}
            {review.city ? ` · ${review.city}` : ''}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
