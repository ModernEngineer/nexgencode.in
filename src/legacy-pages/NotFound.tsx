import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import { LinkButton } from '../components/ui/Button';
import { easeOut } from '../lib/motion';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center py-24">
      <Container className="text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="font-display text-7xl font-bold text-brand-500/30"
        >
          404
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
        >
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">Page not found</h1>
          <p className="mt-2 text-ink-400">The page you're looking for doesn't exist or has moved.</p>
          <LinkButton to="/" size="md" className="mt-8">
            Back to home
          </LinkButton>
        </motion.div>
      </Container>
    </section>
  );
}
