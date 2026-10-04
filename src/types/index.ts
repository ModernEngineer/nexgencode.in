export type ServiceCategoryId = 'business-software' | 'development' | 'design-marketing' | 'infrastructure-support';

export interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  heading: string;
  description: string;
  icon: string;
}

export interface Service {
  slug: string;
  title: string;
  category: ServiceCategoryId;
  summary: string;
  description: string;
  icon: string;
  features: string[];
  featured?: boolean;
}

export interface TechGroup {
  title: string;
  icon: string;
  items: string[];
}

export interface Highlight {
  title: string;
  description: string;
  icon: string;
}

/** Portfolio project as returned by GET /api/projects (managed in Admin → Portfolio). */
export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  tags: string[];
  /** Live link (Vercel deploy, website…). Cards with a URL open it in a new tab. */
  url?: string | null;
  /** Gradient key from src/data/accents.ts, shown when there is no image */
  accent: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
}

/** Public review as returned by GET /api/reviews (only admin-approved reviews). */
export interface Review {
  id: number;
  clientName: string;
  designation?: string | null;
  company?: string | null;
  city?: string | null;
  rating: number;
  comment: string;
  imageUrl?: string | null;
  createdAt: string;
}

export interface ReviewsResponse {
  items: Review[];
  count: number;
  average: number;
}

/** Team member as returned by GET /api/team. */
export interface TeamMember {
  id: number;
  name: string;
  title: string;
  bio: string;
  imageUrl?: string | null;
  linkedInUrl?: string | null;
  email?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export interface NavLink {
  label: string;
  path: string;
}

/** Footer social icon as returned by GET /api/social-links (managed in Admin → Social Links). */
export interface SocialLink {
  id: number;
  platform: SocialPlatform;
  label?: string | null;
  url: string;
  displayOrder: number;
  isActive: boolean;
}

export type SocialPlatform =
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'youtube'
  | 'github'
  | 'whatsapp'
  | 'telegram'
  | 'email'
  | 'website';
