import type { Metadata } from 'next';
import SiteApp from '../site-app';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about NexGenCode, a Prayagraj-based software development company building reliable web, mobile, cloud and AI products.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <SiteApp />;
}
