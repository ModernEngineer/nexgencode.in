// SEO metadata shared by the runtime (useSeo) and the build-time prerender/sitemap plugin in vite.config.ts.
// Keep this file free of image/asset imports so Node can load it during the build.
import { services, getCategory } from './services';
import { contactInfo } from './contact';
import { faqs } from './faqs';

export const SITE_URL = 'https://nexgencode.in';
export const SITE_NAME = 'NexGenCode';
export const DEFAULT_OG_IMAGE = '/og-image.png';

export interface RouteSeo {
  path: string;
  /** Short label used in breadcrumbs */
  name: string;
  title: string;
  description: string;
  keywords?: string[];
  /** Sitemap hints */
  priority?: number;
  changefreq?: 'weekly' | 'monthly' | 'yearly';
}

const baseKeywords = ['NexGenCode', 'software company Prayagraj', 'software development company India'];

// Limits enforced at build time by seo.plugin.ts (validateSeo)
export const MAX_TITLE = 65;
export const MAX_DESCRIPTION = 160;

export const staticRoutes: RouteSeo[] = [
  {
    path: '/',
    name: 'Home',
    title: 'NexGenCode – Software Company in Prayagraj | ERP, Apps & Websites',
    description:
      'NexGenCode is a software company in Prayagraj building School ERP, hospital & hotel software, websites, mobile apps and digital marketing. Get a free demo.',
    keywords: [...baseKeywords, 'school ERP', 'hospital management software', 'website development', 'mobile app development', 'digital marketing agency'],
    priority: 1,
    changefreq: 'weekly',
  },
  {
    path: '/services',
    name: 'Services',
    title: 'IT & Software Development Services in Prayagraj',
    description:
      'Explore 21 services: School ERP, hospital, hotel, POS & CRM software, custom software, websites, mobile apps, SEO and Google & Meta Ads — NexGenCode, Prayagraj.',
    keywords: [...baseKeywords, 'IT services Prayagraj', 'business software', 'custom software development'],
    priority: 0.9,
    changefreq: 'monthly',
  },
  {
    path: '/about',
    name: 'About Us',
    title: 'About NexGenCode – Software Company in Prayagraj',
    description:
      'NexGenCode is a Prayagraj-based technology company building business software, websites, mobile apps and digital marketing around real business needs.',
    keywords: baseKeywords,
    priority: 0.7,
    changefreq: 'yearly',
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    title: 'Portfolio – Websites & Software We Have Built',
    description:
      'See websites and business software built by NexGenCode in Prayagraj — healthcare, billing ERP, restaurant, fitness and more. Explore our recent projects.',
    keywords: [...baseKeywords, 'web development portfolio'],
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/team',
    name: 'Our Team',
    title: 'Meet Our Core Team – Software Experts in Prayagraj',
    description:
      'Meet the NexGenCode core team in Prayagraj — the developers, designers, project managers and digital marketers behind every project we deliver.',
    keywords: [...baseKeywords, 'NexGenCode team'],
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/reviews',
    name: 'Client Reviews',
    title: 'Client Reviews – What Our Clients Say',
    description:
      'Read reviews from schools, hospitals, hotels and businesses across India that work with NexGenCode, Prayagraj — or share your own experience.',
    keywords: [...baseKeywords, 'NexGenCode reviews', 'software company reviews'],
    priority: 0.6,
    changefreq: 'weekly',
  },
  {
    path: '/contact',
    name: 'Contact',
    title: 'Contact Us – Free Consultation in Prayagraj',
    description: `Contact NexGenCode, Prayagraj for software, website, app or marketing projects. Call ${contactInfo.phoneDisplay}, email ${contactInfo.email} or WhatsApp us.`,
    keywords: [...baseKeywords, 'contact software company'],
    priority: 0.8,
    changefreq: 'yearly',
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    title: 'Privacy Policy',
    description:
      'How NexGenCode, Prayagraj collects, uses and protects the personal information you share through our website and contact forms.',
    priority: 0.2,
    changefreq: 'yearly',
  },
  {
    path: '/terms',
    name: 'Terms & Conditions',
    title: 'Terms & Conditions',
    description:
      'The terms that apply when you use the NexGenCode website and engage us for software, website and digital marketing services.',
    priority: 0.2,
    changefreq: 'yearly',
  },
];

// Search-optimised title + meta description per service (what people actually type into Google).
// Titles get " | NexGenCode" appended; keep the full title ≤ 65 chars and descriptions ≤ 160 chars.
const serviceSeo: Record<string, { title: string; description: string }> = {
  'school-erp': {
    title: 'School ERP Software in Prayagraj',
    description:
      'School ERP software by NexGenCode, Prayagraj: admissions, attendance, fees, exams, staff payroll and parent communication in one system. Get a free demo.',
  },
  'hospital-management-software': {
    title: 'Hospital Management Software in Prayagraj',
    description:
      'Hospital management software for hospitals and clinics: patients, appointments, billing, pharmacy and lab in one system. NexGenCode, Prayagraj. Free demo.',
  },
  'hotel-management-software': {
    title: 'Hotel Management Software in Prayagraj',
    description:
      'Hotel management software for reservations, check-in/out, billing, housekeeping and occupancy reports. Built by NexGenCode, Prayagraj. Get a free demo.',
  },
  'guest-house-management-software': {
    title: 'Guest House Management Software in Prayagraj',
    description:
      'Simple guest house software for bookings, room availability, guest records and payments. Made for small hospitality businesses by NexGenCode, Prayagraj.',
  },
  'e-commerce-management': {
    title: 'E-Commerce Website & Store Management, Prayagraj',
    description:
      'E-commerce websites and store management: products, orders, inventory, payment gateways and sales reports. Sell online with NexGenCode, Prayagraj.',
  },
  'pos-billing-solutions': {
    title: 'POS & Billing Software in Prayagraj',
    description:
      'Fast POS and billing software for retail shops, restaurants and stores with barcode, inventory and GST-ready reports. NexGenCode, Prayagraj. Free demo.',
  },
  crm: {
    title: 'CRM Software for Leads & Sales in Prayagraj',
    description:
      'CRM software to manage leads, customers, follow-ups and sales pipelines in one place, with team dashboards and reports. By NexGenCode, Prayagraj.',
  },
  'staff-dashboard': {
    title: 'Staff Dashboard & Employee Management Software',
    description:
      'Role-based staff dashboards for attendance, leave, tasks and performance tracking. Custom employee management software by NexGenCode, Prayagraj.',
  },
  'real-estate-management-software': {
    title: 'Real Estate Management Software in Prayagraj',
    description:
      'Real estate software for builders, brokers and agencies: properties, leads, site visits, follow-ups and sales pipeline. NexGenCode, Prayagraj. Free demo.',
  },
  'real-estate-accounting': {
    title: 'Real Estate Accounting Software in Prayagraj',
    description:
      'Accounting software for real estate businesses: income, expenses, receivables, payables and financial reports with role-based access. NexGenCode, Prayagraj.',
  },
  'custom-software-development': {
    title: 'Custom Software Development Company in Prayagraj',
    description:
      'Custom software built around your business: web applications, workflow automation, APIs and integrations. NexGenCode, Prayagraj. Get a free consultation.',
  },
  'mobile-app-development': {
    title: 'Mobile App Development Company in Prayagraj',
    description:
      'Android and iOS app development in Prayagraj: secure, fast business and customer apps with backend, payments and push notifications. Talk to NexGenCode.',
  },
  'website-development': {
    title: 'Website Development Company in Prayagraj',
    description:
      'Responsive, fast, SEO-ready websites for businesses: corporate sites, landing pages and CMS websites. Website development by NexGenCode, Prayagraj.',
  },
  'graphic-design-ui-ux': {
    title: 'Graphic Design & UI/UX Design Services in Prayagraj',
    description:
      'UI/UX design, brand identity, marketing creatives and social media graphics that communicate clearly. Design services by NexGenCode, Prayagraj.',
  },
  seo: {
    title: 'SEO Services in Prayagraj – Rank Higher on Google',
    description:
      'SEO services in Prayagraj: keyword research, on-page, technical and local SEO with monthly reporting to grow organic traffic. Get a free SEO audit.',
  },
  'meta-ads': {
    title: 'Meta Ads – Facebook & Instagram Ads in Prayagraj',
    description:
      'Facebook and Instagram ad campaigns that generate leads and sales: targeting, creatives, retargeting and conversion tracking. NexGenCode, Prayagraj.',
  },
  'google-ads': {
    title: 'Google Ads Management & PPC Services in Prayagraj',
    description:
      'Google Ads management in Prayagraj: search, display and remarketing campaigns with conversion tracking and ongoing optimisation. Get more leads.',
  },
  'digital-marketing': {
    title: 'Digital Marketing Agency in Prayagraj',
    description:
      'Digital marketing agency in Prayagraj: SEO, social media, Google and Meta Ads, content and lead generation with clear reporting. Talk to NexGenCode.',
  },
  'pr-agency': {
    title: 'PR Agency in Prayagraj – Media & Public Relations',
    description:
      'PR services in Prayagraj: brand communication, media outreach, press releases and online reputation management to build trust in your business.',
  },
  'cloud-hosting-deployment': {
    title: 'Cloud Hosting, Server Setup & Deployment Services',
    description:
      'Cloud hosting, server setup, domains, SSL, database deployment, backups and monitoring for websites and business software. NexGenCode, Prayagraj.',
  },
  'maintenance-technical-support': {
    title: 'Website & Software Maintenance and Support',
    description:
      'Website and software maintenance: bug fixes, security updates, backups, monitoring and performance tuning after launch. Support from NexGenCode, Prayagraj.',
  },
};

export const serviceRoutes: RouteSeo[] = services.map((s) => ({
  path: `/services/${s.slug}`,
  name: s.title,
  title: serviceSeo[s.slug]?.title ?? s.title,
  description: serviceSeo[s.slug]?.description ?? s.summary,
  keywords: [s.title, `${s.title} Prayagraj`, `${s.title} India`, ...s.features.slice(0, 4), SITE_NAME],
  priority: 0.8,
  changefreq: 'monthly',
}));

export const allRoutes: RouteSeo[] = [...staticRoutes, ...serviceRoutes];

export const getRouteSeo = (path: string) => allRoutes.find((r) => r.path === path);

/** Final <title> text — titles that already contain the brand are used as-is. */
export const formatTitle = (title: string) => (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`);

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`;

/** Build-time check: every route's final title/description is within limits and unique. Returns problems. */
export function validateSeo(): string[] {
  const problems: string[] = [];
  const seenTitles = new Map<string, string>();
  const seenDescriptions = new Map<string, string>();
  for (const r of allRoutes) {
    const title = formatTitle(r.title);
    if (title.length > MAX_TITLE) problems.push(`${r.path}: title is ${title.length} chars (max ${MAX_TITLE}): "${title}"`);
    if (r.description.length > MAX_DESCRIPTION)
      problems.push(`${r.path}: description is ${r.description.length} chars (max ${MAX_DESCRIPTION})`);
    if (seenTitles.has(title)) problems.push(`${r.path}: duplicate title (also on ${seenTitles.get(title)})`);
    if (seenDescriptions.has(r.description))
      problems.push(`${r.path}: duplicate description (also on ${seenDescriptions.get(r.description)})`);
    seenTitles.set(title, r.path);
    seenDescriptions.set(r.description, r.path);
  }
  return problems;
}

// ---------- Structured data (JSON-LD) ----------

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/nexgencodelogo.png`,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  description: staticRoutes[0].description,
  email: contactInfo.email,
  telephone: contactInfo.phoneHref.replace('tel:', ''),
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: contactInfo.officeLocality,
    addressLocality: 'Prayagraj',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
  },
  areaServed: { '@type': 'Country', name: 'India' },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: contactInfo.phoneHref.replace('tel:', ''),
    email: contactInfo.email,
    contactType: 'sales',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Technology & Digital Services',
    itemListElement: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, url: absoluteUrl(`/services/${s.slug}`) },
    })),
  },
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
};

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

/** Page-level JSON-LD for a route (site-wide Organization/WebSite schema is static in index.html). */
export function getRouteJsonLd(path: string): object[] {
  const route = getRouteSeo(path);
  if (!route) return [];
  const home = { name: 'Home', path: '/' };

  if (path.startsWith('/services/')) {
    const service = services.find((s) => `/services/${s.slug}` === path)!;
    const category = getCategory(service.category);
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.title,
        serviceType: category.title,
        description: route.description,
        url: absoluteUrl(path),
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: { '@type': 'Country', name: 'India' },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${service.title} — key capabilities`,
          itemListElement: service.features.map((f) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: f } })),
        },
      },
      breadcrumbJsonLd([home, { name: 'Services', path: '/services' }, { name: route.name, path }]),
    ];
  }

  const crumbs = path === '/' ? [] : [breadcrumbJsonLd([home, { name: route.name, path }])];

  if (path === '/services') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'NexGenCode Services',
        itemListElement: services.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.title,
          url: absoluteUrl(`/services/${s.slug}`),
        })),
      },
      ...crumbs,
    ];
  }

  if (path === '/contact') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
      ...crumbs,
    ];
  }

  return crumbs;
}
