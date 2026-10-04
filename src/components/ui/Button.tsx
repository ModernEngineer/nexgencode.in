import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/** `light` and `outlineLight` are for use on dark (navy/blue) backgrounds. */
type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outlineLight';
type Size = 'md' | 'lg';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
>;

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-brand-400 to-accent-500 text-ink-950 shadow-lg shadow-brand-500/25 hover:shadow-brand-400/40 hover:brightness-110',
  secondary: 'bg-white/5 text-ink-50 border border-white/10 hover:bg-white/10 hover:border-brand-400/40',
  ghost: 'text-ink-200 hover:text-white hover:bg-white/5',
  light: 'bg-white text-brand-700 shadow-lg shadow-black/10 hover:bg-brand-50',
  outlineLight: 'border border-white/40 text-white hover:bg-white/10 hover:border-white/70',
};

const sizeClasses: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[color,background-color,border-color,box-shadow,filter] duration-200 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60';

const hover = { whileHover: { scale: 1.04 }, whileTap: { scale: 0.96 }, transition: { duration: 0.15 } };

const MotionLink = motion.create(Link);

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: BaseProps & NativeButtonProps) {
  return (
    <motion.button {...hover} className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)} {...rest}>
      {children}
    </motion.button>
  );
}

export function LinkButton({
  children,
  to,
  variant = 'primary',
  size = 'md',
  className,
}: BaseProps & { to: string }) {
  return (
    <MotionLink to={to} {...hover} className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}>
      {children}
    </MotionLink>
  );
}

/** For external, mailto: and tel: targets. External http(s) links open in a new tab. */
export function AnchorButton({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
}: BaseProps & { href: string }) {
  const external = /^https?:/.test(href);
  return (
    <motion.a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...hover}
      className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </motion.a>
  );
}
