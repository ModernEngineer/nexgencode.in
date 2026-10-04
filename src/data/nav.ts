import type { NavLink } from '../types';

export const navLinks: NavLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Team', path: '/team' },
  { label: 'Contact', path: '/contact' },
];

export const footerCompanyLinks: NavLink[] = [
  { label: 'About Us', path: '/about' },
  { label: 'Our Services', path: '/services' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Our Core Team', path: '/team' },
  { label: 'Client Reviews', path: '/reviews' },
  { label: 'Contact', path: '/contact' },
];

export const legalLinks: NavLink[] = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms' },
];
