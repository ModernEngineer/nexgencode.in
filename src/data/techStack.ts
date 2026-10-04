import type { TechGroup } from '../types';

export const techStackIntro =
  'NexGenCode uses modern, scalable and maintainable technologies selected according to project requirements. The exact stack may vary by product and business use case.';

export const techGroups: TechGroup[] = [
  {
    title: 'Frontend',
    icon: 'Monitor',
    items: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'Backend',
    icon: 'Server',
    items: ['Node.js', 'Express.js', 'REST APIs', 'Scalable server-side architectures'],
  },
  {
    title: 'Database',
    icon: 'Database',
    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Project-appropriate databases'],
  },
  {
    title: 'Mobile',
    icon: 'Smartphone',
    items: ['React Native', 'Other suitable mobile technologies'],
  },
  {
    title: 'Cloud & Deployment',
    icon: 'Cloud',
    items: ['AWS', 'Cloud hosting', 'Linux servers', 'CI/CD', 'Production deployment'],
  },
  {
    title: 'Design',
    icon: 'PenTool',
    items: ['Figma', 'Modern UI/UX systems', 'Responsive design', 'Component-based design'],
  },
  {
    title: 'Marketing & Analytics',
    icon: 'ChartColumn',
    items: ['Google Analytics', 'Search Console', 'Meta Business tools', 'Advertising platforms'],
  },
];

// Short names used by the homepage marquee
export const techMarquee = [
  'React.js',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'Express.js',
  'React Native',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'AWS',
  'Linux',
  'Figma',
  'Google Analytics',
];
