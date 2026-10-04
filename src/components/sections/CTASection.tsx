import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Container from '../ui/Container';
import { AnchorButton, LinkButton } from '../ui/Button';
import { easeOut, viewportOnce } from '../../lib/motion';
import { whatsappLink } from '../../data/contact';

export default function CTASection({
  title = 'Let’s Build Technology That Moves Your Business Forward',
  description = 'Have a business idea, an existing system that needs improvement, or a process that should be automated? NexGenCode can help you turn your requirements into reliable digital solutions designed for real business growth.',
  primaryLabel = 'Start Your Project',
  primaryTo = '/contact',
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryTo?: string;
}) {
  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: easeOut }}
          className="relative overflow-hidden rounded-3xl border border-brand-400/20 bg-gradient-to-br from-brand-800/50 via-ink-900 to-accent-700/30 px-6 py-16 text-center sm:px-16"
        >
          <motion.div
            animate={{ opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px]"
          />
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-400/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent-500/20 blur-[100px]" />

          <div className="relative">
            <h2 className="mx-auto max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-ink-300">{description}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton to={primaryTo} size="lg">
                {primaryLabel} <ArrowRight size={18} />
              </LinkButton>
              <AnchorButton href={whatsappLink()} variant="secondary" size="lg">
                <MessageCircle size={18} /> Talk to Our Experts
              </AnchorButton>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
