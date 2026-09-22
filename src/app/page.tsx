import type { Metadata } from 'next';
import SiteApp from './site-app';

export const metadata: Metadata = {
  title: 'Software Development Company in Prayagraj',
  description: 'NexGenCode is a Prayagraj-based software development company delivering custom web development, mobile apps, cloud solutions and AI-powered products.',
  alternates: { canonical: '/' },
};

export default function Page() {
  return <SiteApp />;
}
