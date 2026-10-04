import type { Service, ServiceCategory } from '../types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'business-software',
    title: 'Business Software',
    heading: 'Business Software Solutions',
    description:
      'Industry-specific management systems for schools, hospitals, hotels, retail, real estate and growing teams — built around how your business actually runs.',
    icon: 'Building2',
  },
  {
    id: 'development',
    title: 'Development',
    heading: 'Development & Technology Services',
    description:
      'Custom software, websites and mobile apps engineered for performance, usability and long-term growth.',
    icon: 'CodeXml',
  },
  {
    id: 'design-marketing',
    title: 'Design & Marketing',
    heading: 'Design, SEO & Digital Marketing',
    description:
      'Design, search, paid campaigns and PR that build visibility, generate leads and strengthen your brand.',
    icon: 'Megaphone',
  },
  {
    id: 'infrastructure-support',
    title: 'Infrastructure & Support',
    heading: 'Cloud, Deployment & Support',
    description:
      'Secure hosting, reliable deployments and ongoing technical support that keep your products running smoothly.',
    icon: 'CloudCog',
  },
];

export const services: Service[] = [
  // Business Software
  {
    slug: 'school-erp',
    title: 'School ERP & Complete School Management',
    category: 'business-software',
    summary: 'Admissions, attendance, fees, exams and staff — one centralized platform for your institution.',
    description:
      'Complete digital management solutions for schools, colleges and educational institutions. Manage admissions, students, attendance, fees, examinations, staff, communication, reports and daily operations from one centralized platform.',
    icon: 'GraduationCap',
    features: [
      'Student & parent management',
      'Admissions and enquiry management',
      'Attendance and timetable',
      'Fees, invoices and receipts',
      'Examination and report cards',
      'Staff and payroll management',
      'Parent/student communication',
      'Reports and dashboards',
    ],
    featured: true,
  },
  {
    slug: 'hospital-management-software',
    title: 'Hospital Management Software',
    category: 'business-software',
    summary: 'Patients, doctors, appointments, billing, pharmacy and lab workflows in one integrated system.',
    description:
      'Streamline hospital and clinic operations with an integrated management system covering patients, doctors, appointments, billing, pharmacy, laboratory and administrative workflows.',
    icon: 'Hospital',
    features: [
      'Patient registration and records',
      'Doctor and appointment management',
      'Billing and invoices',
      'Pharmacy management',
      'Laboratory workflow',
      'Staff and department management',
      'Reports and dashboards',
    ],
    featured: true,
  },
  {
    slug: 'hotel-management-software',
    title: 'Hotel Management Software',
    category: 'business-software',
    summary: 'Reservations, rooms, guests, billing and housekeeping managed from a single platform.',
    description:
      'A centralized hotel management platform to simplify reservations, rooms, guests, billing, housekeeping and daily hotel operations while improving service efficiency.',
    icon: 'Hotel',
    features: [
      'Room and reservation management',
      'Guest profiles',
      'Check-in/check-out',
      'Billing and invoices',
      'Housekeeping management',
      'Staff dashboard',
      'Reports and occupancy insights',
    ],
  },
  {
    slug: 'guest-house-management-software',
    title: 'Guest House Management Software',
    category: 'business-software',
    summary: 'Bookings, rooms, guests and payments for guest houses and smaller hospitality businesses.',
    description:
      'Purpose-built management software for guest houses and smaller hospitality businesses to manage bookings, rooms, guests, payments and operations efficiently.',
    icon: 'BedDouble',
    features: [
      'Booking management',
      'Room availability',
      'Guest records',
      'Check-in/check-out',
      'Billing and payment tracking',
      'Reports and operational dashboard',
    ],
  },
  {
    slug: 'e-commerce-management',
    title: 'E-Commerce Management',
    category: 'business-software',
    summary: 'Products, orders, customers, inventory and payments — run your online store end to end.',
    description:
      'End-to-end e-commerce solutions that help businesses manage products, orders, customers, inventory, payments and online sales from one platform.',
    icon: 'ShoppingCart',
    features: [
      'Product and category management',
      'Order management',
      'Customer management',
      'Inventory tracking',
      'Payment gateway integration',
      'Coupons and promotions',
      'Sales reports',
    ],
    featured: true,
  },
  {
    slug: 'pos-billing-solutions',
    title: 'POS & Billing Solutions',
    category: 'business-software',
    summary: 'Fast, reliable POS and billing for retail, restaurants, stores and service businesses.',
    description:
      'Fast, reliable and easy-to-use POS and billing systems for retail, restaurants, stores and service businesses. Manage sales, inventory, customers and reports in real time.',
    icon: 'ReceiptText',
    features: [
      'POS billing',
      'Invoice generation',
      'Inventory management',
      'Barcode support',
      'Customer management',
      'Sales and tax reports',
      'User roles and permissions',
    ],
  },
  {
    slug: 'crm',
    title: 'CRM',
    category: 'business-software',
    summary: 'Organize leads, customers, follow-ups and sales pipelines in one place.',
    description:
      'Customer Relationship Management solutions that help businesses organize leads, customers, follow-ups, sales pipelines and communication in one place.',
    icon: 'Contact',
    features: [
      'Lead management',
      'Customer profiles',
      'Sales pipeline',
      'Follow-up reminders',
      'Task management',
      'Team dashboards',
      'Reports and analytics',
    ],
    featured: true,
  },
  {
    slug: 'staff-dashboard',
    title: 'Staff Dashboard',
    category: 'business-software',
    summary: 'Role-based dashboards for tasks, attendance, performance and team workflows.',
    description:
      'Centralized staff and employee dashboards that provide role-based access to tasks, attendance, performance, reports, communication and business workflows.',
    icon: 'LayoutDashboard',
    features: [
      'Role-based dashboards',
      'Employee profiles',
      'Attendance and leave',
      'Task management',
      'Performance tracking',
      'Notifications',
      'Reports',
    ],
  },
  {
    slug: 'real-estate-management-software',
    title: 'Real Estate Management Software',
    category: 'business-software',
    summary: 'Properties, leads, clients, site visits and follow-ups for brokers, developers and agencies.',
    description:
      'Complete real estate management software for property businesses, brokers, developers and agencies. Manage properties, leads, clients, visits, follow-ups and transactions through a centralized platform.',
    icon: 'Building2',
    features: [
      'Property and project management',
      'Lead and enquiry management',
      'Client management',
      'Site visit scheduling',
      'Follow-up management',
      'Sales pipeline',
      'Reports and dashboards',
    ],
  },
  {
    slug: 'real-estate-accounting',
    title: 'Real Estate Accounting & Complete Account Management',
    category: 'business-software',
    summary: 'Income, expenses, receivables, payables and financial reports for real estate businesses.',
    description:
      'Integrated accounting and financial management solutions for real estate businesses. Track income, expenses, receivables, payables, transactions and business accounts with greater visibility and control.',
    icon: 'Calculator',
    features: [
      'Income and expense management',
      'Receivables and payables',
      'Customer/vendor accounts',
      'Payment tracking',
      'Transaction records',
      'Financial reports',
      'Role-based access and dashboards',
    ],
  },

  // Development
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    category: 'development',
    summary: 'Tailor-made software, internal tools and automation built around your unique processes.',
    description:
      'We build tailor-made software around your unique business processes. Whether you need a complete business platform, internal tool, workflow automation or a specialized application, we turn requirements into scalable software.',
    icon: 'Workflow',
    features: [
      'Requirement analysis',
      'Custom web applications',
      'Business workflow automation',
      'API development',
      'Third-party integrations',
      'Role-based systems',
      'Scalable architecture',
    ],
    featured: true,
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    category: 'development',
    summary: 'Secure, scalable Android and iOS apps built for performance and usability.',
    description:
      'We design and develop modern, secure and scalable mobile applications for Android and iOS. From business apps to customer-facing platforms, our apps are built for performance, usability and long-term growth.',
    icon: 'Smartphone',
    features: [
      'Android & iOS applications',
      'Cross-platform app development',
      'API and backend integration',
      'Push notifications',
      'Authentication and user roles',
      'Payment and third-party integrations',
    ],
    featured: true,
  },
  {
    slug: 'website-development',
    title: 'Website Development',
    category: 'development',
    summary: 'Responsive, high-performance websites that represent your brand and generate leads.',
    description:
      'Professional, responsive and high-performance websites designed to represent your brand, generate leads and provide a strong digital presence across devices.',
    icon: 'Globe',
    features: [
      'Corporate websites',
      'Business websites',
      'Landing pages',
      'Dynamic websites',
      'CMS-based websites',
      'Responsive design',
      'Performance and SEO-ready development',
    ],
    featured: true,
  },

  // Design & Marketing
  {
    slug: 'graphic-design-ui-ux',
    title: 'Graphic Design & UI/UX',
    category: 'design-marketing',
    summary: 'Branding, creatives and intuitive interfaces for websites, apps and digital platforms.',
    description:
      'Creative design solutions focused on clear communication, strong branding and intuitive user experiences across websites, applications and digital platforms.',
    icon: 'Palette',
    features: [
      'UI/UX design',
      'Website and app interfaces',
      'Brand identity',
      'Marketing creatives',
      'Social media graphics',
      'Design systems and prototypes',
    ],
  },
  {
    slug: 'seo',
    title: 'SEO',
    category: 'design-marketing',
    summary: 'Improve organic visibility and attract relevant traffic through better search presence.',
    description:
      'Search Engine Optimization strategies designed to improve organic visibility, attract relevant traffic and create sustainable growth through better search presence.',
    icon: 'SearchCheck',
    features: [
      'Keyword research',
      'On-page SEO',
      'Technical SEO',
      'Content optimization',
      'Local SEO',
      'Performance monitoring',
      'SEO reporting',
    ],
  },
  {
    slug: 'meta-ads',
    title: 'Meta Ads',
    category: 'design-marketing',
    summary: 'Result-oriented Facebook & Instagram campaigns that generate leads and engagement.',
    description:
      'Result-oriented advertising campaigns on Meta platforms to reach relevant audiences, generate leads, increase engagement and support business growth.',
    icon: 'Megaphone',
    features: [
      'Campaign strategy',
      'Audience targeting',
      'Lead generation campaigns',
      'Creative testing',
      'Retargeting',
      'Conversion tracking',
      'Performance reporting',
    ],
  },
  {
    slug: 'google-ads',
    title: 'Google Ads',
    category: 'design-marketing',
    summary: 'Data-driven campaigns that reach customers actively searching for what you offer.',
    description:
      'Data-driven Google Ads campaigns designed to connect your business with customers actively searching for your products or services.',
    icon: 'MousePointerClick',
    features: [
      'Search campaigns',
      'Display campaigns',
      'Remarketing',
      'Keyword strategy',
      'Conversion tracking',
      'Campaign optimization',
      'Performance reporting',
    ],
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    category: 'design-marketing',
    summary: 'Strategy, content, SEO, ads and social media combined for measurable growth.',
    description:
      'Integrated digital marketing solutions combining strategy, content, SEO, paid advertising, social media and analytics to build visibility and generate measurable business results.',
    icon: 'TrendingUp',
    features: [
      'Digital strategy',
      'Social media marketing',
      'SEO',
      'Paid advertising',
      'Content marketing',
      'Lead generation',
      'Analytics and reporting',
    ],
    featured: true,
  },
  {
    slug: 'pr-agency',
    title: 'PR Agency',
    category: 'design-marketing',
    summary: 'Strategic media and communication that strengthens your brand reputation.',
    description:
      'Professional public relations support to strengthen brand reputation, improve visibility and communicate your business story through strategic media and communication activities.',
    icon: 'Newspaper',
    features: [
      'Brand communication',
      'Media outreach',
      'Press release support',
      'Online reputation',
      'Campaign communication',
      'PR strategy',
    ],
  },

  // Infrastructure & Support
  {
    slug: 'cloud-hosting-deployment',
    title: 'Cloud, Hosting & Deployment',
    category: 'infrastructure-support',
    summary: 'Secure cloud setup, hosting and production deployments for your apps and software.',
    description:
      'Reliable cloud, hosting and deployment services for websites, applications and business software. We help businesses launch securely and maintain stable production environments.',
    icon: 'Cloud',
    features: [
      'Cloud deployment',
      'Server configuration',
      'Domain and hosting setup',
      'SSL and security',
      'Database deployment',
      'Backup strategy',
      'Monitoring and maintenance',
    ],
  },
  {
    slug: 'maintenance-technical-support',
    title: 'Maintenance & Technical Support',
    category: 'infrastructure-support',
    summary: 'Ongoing updates, fixes and monitoring that keep your software secure after launch.',
    description:
      'Ongoing technical support to keep your website, application and software secure, updated and running smoothly after launch.',
    icon: 'LifeBuoy',
    features: [
      'Bug fixing',
      'Security updates',
      'Performance optimization',
      'Content and technical updates',
      'Backup support',
      'Monitoring',
      'Ongoing maintenance',
    ],
  },
];

export const getServiceBySlug = (slug: string) => services.find((s) => s.slug === slug);

export const getServicesByCategory = (id: ServiceCategory['id']) => services.filter((s) => s.category === id);

export const getCategory = (id: ServiceCategory['id']) => serviceCategories.find((c) => c.id === id)!;
