import type { Metadata } from 'next';
import SiteApp from '../site-app';

export const metadata: Metadata = {
  title: 'Contact Our Prayagraj Software Team',
  description: 'Contact NexGenCode in Prayagraj, India to discuss web development, mobile apps, cloud platforms, AI solutions or your next digital product.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <SiteApp />;
}
