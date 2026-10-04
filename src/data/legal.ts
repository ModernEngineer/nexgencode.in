import type { LegalSection } from '../components/sections/LegalPage';
import { contactInfo } from './contact';

// Template legal copy — have it reviewed by your legal advisor before launch.
export const legalUpdated = '4 October 2026';

export const privacySections: LegalSection[] = [
  {
    heading: 'Information we collect',
    body: [
      'When you fill in our contact form or request a consultation, we collect the details you provide: your name, email address, phone number, company name, the service you are interested in, your budget range and your message.',
      'When you submit a review, we collect your name, designation, company, city, rating and review text. Reviews are published only after our team approves them.',
      'Like most websites, our servers may automatically log technical information such as your IP address, browser type and the pages you visit, which helps us keep the website secure and working well.',
    ],
  },
  {
    heading: 'How we use your information',
    body: [
      'We use your information to respond to your enquiry, prepare proposals, deliver and support our services, and to publish reviews you have chosen to share.',
      'We do not sell, rent or trade your personal information to anyone.',
    ],
  },
  {
    heading: 'Sharing of information',
    body: [
      'We share information only with trusted service providers who help us operate our business (for example, hosting and email providers), and only to the extent necessary. We may also disclose information where required by law.',
    ],
  },
  {
    heading: 'Data security and retention',
    body: [
      'We use reasonable technical and organisational measures to protect your information, including access controls and secure hosting. We keep enquiry information only for as long as needed for the purposes described here or as required by law.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'In line with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023, you may ask us to access, correct or delete your personal information, or withdraw consent, by writing to us.',
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'Our website uses only the storage needed for it to work properly. If we add analytics or advertising tools (such as Google Analytics or Meta Pixel), we will update this policy.',
    ],
  },
  {
    heading: 'Contact us',
    body: [
      `For any privacy questions or requests, email ${contactInfo.email} or call ${contactInfo.phoneDisplay}. NexGenCode, ${contactInfo.office}.`,
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    heading: 'About these terms',
    body: [
      'These terms govern your use of the nexgencode.in website. By using the website you agree to them. Specific projects are governed by the proposal, quotation or agreement signed for that project, which takes precedence over these terms.',
    ],
  },
  {
    heading: 'Services and proposals',
    body: [
      'Information on this website describes our services in general terms. Scope, timelines, deliverables and pricing for any project are confirmed in writing before work begins. All prices are in Indian Rupees (INR) and exclusive of applicable taxes unless stated otherwise.',
    ],
  },
  {
    heading: 'Payments',
    body: [
      'Payment schedules (such as advance and milestone payments) are agreed in the project proposal. Work may be paused if payments are overdue.',
    ],
  },
  {
    heading: 'Intellectual property',
    body: [
      'Unless agreed otherwise in writing, ownership of the custom deliverables built for you transfers to you once the project is paid in full. We retain ownership of our pre-existing tools, libraries and know-how, and may showcase completed work in our portfolio unless you ask us not to.',
    ],
  },
  {
    heading: 'Reviews and content you submit',
    body: [
      'By submitting a review you confirm it reflects your genuine experience and grant us permission to publish it on our website and marketing material. We may decline or remove reviews at our discretion.',
    ],
  },
  {
    heading: 'Limitation of liability',
    body: [
      'Our website content is provided for general information. To the extent permitted by law, NexGenCode is not liable for indirect or consequential losses arising from the use of this website. Liability for project work is set out in the relevant project agreement.',
    ],
  },
  {
    heading: 'Governing law',
    body: [
      'These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the courts at Prayagraj, Uttar Pradesh.',
    ],
  },
  {
    heading: 'Contact',
    body: [`Questions about these terms? Email ${contactInfo.email} or call ${contactInfo.phoneDisplay}.`],
  },
];
