import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoBlue from '../../assest/nexgencodelogo-blue-trim.png';
import logoWhite from '../../assest/nexgencodelogo-trim.png';

/**
 * Logo cropped to its visible artwork (no transparent padding), so it sits flush wherever it's placed.
 * `white` for the dark site (default), `blue` for light backgrounds (e.g. admin login).
 * Size it with `imgClassName` (defaults to the navbar size).
 */
export default function Logo({
  className,
  imgClassName = 'h-12 sm:h-14',
  tone = 'white',
}: {
  className?: string;
  imgClassName?: string;
  tone?: 'blue' | 'white';
}) {
  return (
    <Link to="/" aria-label="NexGenCode home" className={`group flex shrink-0 items-center ${className ?? ''}`}>
      <motion.img
        src={tone === 'white' ? logoWhite : logoBlue}
        alt="NexGenCode logo"
        width={285}
        height={196}
        initial={{ opacity: 0, scale: 0.9, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
        whileHover={{ scale: 1.04 }}
        className={`w-auto object-contain transition-[filter] duration-300 group-hover:brightness-110 ${imgClassName}`}
      />
    </Link>
  );
}
