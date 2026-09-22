import type { Metadata } from 'next';
import SiteApp from '../site-app';

export const metadata: Metadata = {
  title: 'Software Development Portfolio',
  description: 'See selected web, mobile, SaaS, AI and cloud products designed and built by the NexGenCode software engineering team.',
  alternates: { canonical: '/portfolio' },
};

export default function PortfolioPage() {
  return <SiteApp />;
}
