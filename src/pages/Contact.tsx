import { Mail, MapPin, Phone } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Container from '../components/ui/Container';
import ContactForm from '../components/sections/ContactForm';
import FAQ from '../components/sections/FAQ';
import Reveal from '../components/motion/Reveal';
import { StaggerGroup, StaggerItem } from '../components/motion/Stagger';
import { contactInfo } from '../data/contact';
import { useSeo } from '../hooks/useSeo';

const details = [
  { icon: Mail, label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
  { icon: Phone, label: 'Phone', value: contactInfo.phoneDisplay, href: contactInfo.phoneHref },
  { icon: MapPin, label: 'Office', value: contactInfo.office, href: contactInfo.officeMapUrl },
];

export default function Contact() {
  useSeo();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Start your project with NexGenCode"
        description="Have a business idea, an existing system that needs improvement, or a process to automate? Share a few details and we'll get back to you within one business day."
      />

      <section className="py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="font-display text-2xl font-semibold text-white">Get in touch</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">
                  Prefer email or a call? Reach us directly using the details below, or fill out the form and we'll
                  follow up.
                </p>
              </Reveal>

              <StaggerGroup className="mt-8 space-y-5">
                {details.map((item) => (
                  <StaggerItem key={item.label} whileHover={{ x: 4 }} className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                      <item.icon size={18} />
                    </span>
                    <div>
                      <p className="text-xs text-ink-400">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="text-sm font-medium text-white hover:text-brand-200"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-white">{item.value}</p>
                      )}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>

            <Reveal delay={0.15} className="lg:col-span-3">
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>

      <FAQ />
    </>
  );
}
