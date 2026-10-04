import { useState } from 'react';
import clsx from 'clsx';
import { assetUrl } from '../../lib/api';

const initialsOf = (name: string) =>
  name
    .replace(/^(dr|mr|mrs|ms)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');

/** Shows the uploaded photo, or gradient initials when there is none (or it fails to load). */
export default function Avatar({
  name,
  imageUrl,
  className,
  textClassName = 'text-lg',
}: {
  name: string;
  imageUrl?: string | null;
  className?: string;
  textClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = assetUrl(imageUrl);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={clsx('object-cover', className)}
      />
    );
  }
  return (
    <span
      aria-label={name}
      className={clsx(
        'flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-800 font-display font-bold text-white',
        textClassName,
        className
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
