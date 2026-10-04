import { useState } from 'react';
import { Star } from 'lucide-react';
import clsx from 'clsx';

/** Read-only stars. Supports half values (e.g. 4.5) for averages. */
export function StarRating({ value, size = 16, className }: { value: number; size?: number; className?: string }) {
  return (
    <span
      className={clsx('inline-flex items-center gap-0.5', className)}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-ink-700" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star size={size} className="text-amber-400" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

const labels = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

/** Clickable 1–5 star picker for forms. */
export function StarInput({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} star${i > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(i)}
            onClick={() => onChange(i)}
            className="rounded transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            <Star
              size={size}
              strokeWidth={1.5}
              className={i <= shown ? 'text-amber-400' : 'text-ink-600'}
              fill={i <= shown ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
      {shown > 0 && <span className="text-sm font-medium text-ink-300">{labels[shown]}</span>}
    </div>
  );
}
