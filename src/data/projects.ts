import type { Project } from '../types';
import hospitalImage from '../images/Hopital.png';
import gymImage from '../images/image.png';
import billingImage from '../images/image copy.png';
import restaurantImage from '../images/image copy 2.png';

// Fallback shown only if the API is unreachable. Live projects are managed in Admin → Portfolio
// (seeded from backend/NexGenCode.Api/Data/DbSeeder.cs) and served by GET /api/projects.
const p = (
  id: number,
  title: string,
  category: string,
  description: string,
  tags: string[],
  accent: string,
  imageUrl: string | null = null,
  url: string | null = null,
  isFeatured = false
): Project => ({ id, title, category, description, tags, accent, imageUrl, url, isFeatured, displayOrder: id, isActive: true });

export const fallbackProjects: Project[] = [
  p(1, 'IronPulse — Strength Studio', 'Web App', 'A bold fitness studio website for memberships, coaching, training plans and gym community engagement.',
    ['React', 'Fitness', 'Responsive UI'], 'from-indigo-500 to-blue-500', gymImage, 'https://gym-wwyd.vercel.app/', true),
  p(2, 'Billing ERP — Business Management Platform', 'Web App', 'A modern billing platform for managing invoices, inventory, sales, payments and business operations.',
    ['React', 'ERP', 'Billing'], 'from-emerald-500 to-teal-500', billingImage, 'https://billing-software-livid-omega.vercel.app/', true),
  p(3, 'Saffron & Ember — Fine Indian Dining', 'Web App', 'An atmospheric restaurant website for showcasing the menu, story, gallery and table reservations.',
    ['React', 'Restaurant', 'Reservations'], 'from-amber-500 to-orange-500', restaurantImage, 'https://restorent-ruddy.vercel.app/', true),
  p(4, 'Hospital — Healthcare Management Platform', 'Web App', 'A modern hospital website for exploring healthcare services, departments, doctors, appointments and patient support in one accessible digital experience.',
    ['React', 'Healthcare', 'Appointments'], 'from-fuchsia-500 to-pink-500', hospitalImage, 'https://hospital-iota-sable.vercel.app/'),
  p(5, 'OpSight — DevOps Observability Suite', 'Cloud', 'Unified logging, metrics and alerting for microservice fleets, deployed across AWS and Kubernetes.',
    ['Kubernetes', 'Grafana', 'Go'], 'from-amber-500 to-orange-500'),
  p(6, 'DocMind — AI Document Assistant', 'AI / ML', 'An LLM-powered assistant that extracts, summarises and answers questions over large document sets.',
    ['LLMs', 'Python', 'Vector Search'], 'from-violet-500 to-indigo-500'),
  p(7, 'RouteWise — Fleet Logistics Dashboard', 'Web App', 'A live fleet-tracking and route optimisation dashboard used by logistics operators to cut fuel costs.',
    ['React', 'Mapbox', 'PostgreSQL'], 'from-sky-500 to-cyan-500'),
];
