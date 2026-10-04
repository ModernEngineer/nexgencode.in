import type { TeamMember } from '../types';

// Fallback roster shown if the API is unreachable (and in the prerendered HTML).
// The live team is managed from the admin panel (Admin → Team) and served by GET /api/team.
const t = (id: number, name: string, title: string, bio: string): TeamMember => ({
  id,
  name,
  title,
  bio,
  imageUrl: null,
  displayOrder: id,
  isActive: true,
});

export const fallbackTeam: TeamMember[] = [
  t(1, 'Aarav Sharma', 'Founder & CEO', 'Leads strategy and client partnerships, with a decade of experience building business software for Indian SMEs.'),
  t(2, 'Priya Verma', 'Head of UI/UX Design', 'Turns complex workflows into clean, intuitive interfaces for web, mobile and dashboards.'),
  t(3, 'Rohit Mishra', 'Lead Full-Stack Engineer', 'Architects scalable React, Node.js and .NET applications — from ERP systems to e-commerce platforms.'),
  t(4, 'Neha Gupta', 'Project Manager', 'Keeps every project on track with clear milestones, transparent updates and on-time delivery.'),
  t(5, 'Ankit Srivastava', 'Mobile App Lead', 'Builds fast, reliable Android and iOS apps with React Native and modern backend integrations.'),
  t(6, 'Sneha Tripathi', 'Digital Marketing Lead', 'Drives growth through SEO, Meta Ads and Google Ads campaigns focused on measurable results.'),
  t(7, 'Vikas Yadav', 'Cloud & DevOps Engineer', 'Handles hosting, deployment, security and monitoring so client systems stay fast and stable.'),
  t(8, 'Pooja Singh', 'QA Lead', 'Tests every release across devices and workflows so bugs are caught long before users see them.'),
];
