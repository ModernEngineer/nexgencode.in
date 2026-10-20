import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexgencode.in'),
  title: {
    default: 'NexGenCode | Software Development Company in Prayagraj',
    template: '%s | NexGenCode',
  },
  description: 'NexGenCode is a Prayagraj-based software development company building web, mobile, cloud and AI-powered products.',
  applicationName: 'NexGenCode',
  authors: [{ name: 'NexGenCode' }],
  creator: 'NexGenCode',
  publisher: 'NexGenCode',
  keywords: ['software development company', 'web development Prayagraj', 'mobile app development', 'AI development', 'cloud solutions'],
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    siteName: 'NexGenCode',
    locale: 'en_IN',
    url: '/',
    title: 'NexGenCode | Software Development Company in Prayagraj',
    description: 'Custom web, mobile, cloud and AI software development for startups and businesses.',
  },
  twitter: {
    card: 'summary',
    title: 'NexGenCode | Software Development Company in Prayagraj',
    description: 'Custom web, mobile, cloud and AI software development for startups and businesses.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://nexgencode.in/#organization',
    name: 'NexGenCode',
    url: 'https://nexgencode.in/',
    logo: 'https://nexgencode.in/favicon.svg',
    image: 'https://nexgencode.in/nexgencodelogo.png',
    description: 'Software development company building web, mobile, cloud and AI-powered products.',
    email: 'info@nexgencode.in',
    telephone: '+919450190953',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Prayagraj',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    areaServed: [{ '@type': 'City', name: 'Prayagraj' }, { '@type': 'Country', name: 'India' }],
    knowsAbout: ['Web Development', 'Mobile App Development', 'Cloud Computing', 'Artificial Intelligence', 'Software Development'],
  };

  return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} /></body></html>;
}
