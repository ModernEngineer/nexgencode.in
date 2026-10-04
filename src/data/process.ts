import type { ProcessStep, StatItem } from '../types';

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Discovery & Requirement Analysis',
    description: 'Understand business goals, users, workflows, challenges and project requirements.',
  },
  {
    step: '02',
    title: 'Planning & Architecture',
    description: 'Define features, user roles, technical architecture, integrations and project roadmap.',
  },
  {
    step: '03',
    title: 'UI/UX Design',
    description: 'Create wireframes, user flows and responsive interfaces focused on usability and conversion.',
  },
  {
    step: '04',
    title: 'Development',
    description:
      'Build frontend, backend, database, APIs and required integrations using a structured development approach.',
  },
  {
    step: '05',
    title: 'Testing & Quality Assurance',
    description: 'Test functionality, responsiveness, security, performance and user workflows.',
  },
  {
    step: '06',
    title: 'Deployment',
    description: 'Configure hosting/cloud infrastructure and launch the approved product in the production environment.',
  },
  {
    step: '07',
    title: 'Support & Optimization',
    description: 'Provide maintenance, updates, monitoring, improvements and technical support after launch.',
  },
];

// Note: these figures are illustrative placeholders — replace with your company's real numbers.
export const stats: StatItem[] = [
  { label: 'Projects delivered', value: 20, suffix: '+' },
  { label: 'Services offered', value: 21, suffix: '' },
  { label: 'Engineers on team', value: 10, suffix: '+' },
  { label: 'Years in operation', value: 1, suffix: '+' },
];
