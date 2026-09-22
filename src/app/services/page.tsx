import type { Metadata } from 'next';
import SiteApp from '../site-app';

export const metadata: Metadata = {
  title: 'Software Development Services',
  description: 'Explore NexGenCode web app development, mobile app development, cloud, DevOps, UI/UX, AI automation and QA services in Prayagraj, India.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return <SiteApp />;
}
