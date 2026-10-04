import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Container from '../ui/Container';
import { LinkButton } from '../ui/Button';
import { StaggerGroup, StaggerItem } from '../motion/Stagger';
import { easeOut } from '../../lib/motion';
import { services, serviceCategories, getServicesByCategory } from '../../data/services';
import { iconMap } from '../../lib/icons';

const MotionLink = motion.create(Link);

const highlights = ['Custom-built for your workflows', 'Scalable & secure', 'Support after launch'];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid pb-24 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[10%] top-[-10%] h-[480px] w-[620px] rounded-full bg-brand-500/20 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-[-8%] top-[25%] h-[380px] w-[380px] rounded-full bg-accent-600/20 blur-[110px]"
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <Container className="relative grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <StaggerGroup className="text-center lg:text-left">
          <StaggerItem>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/25 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-300">
              <Sparkles size={14} className="text-brand-300" />
              Software · Apps · Digital Marketing
            </span>
          </StaggerItem>

          <StaggerItem className="mt-6">
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl xl:text-6xl">
              Technology solutions <span className="text-gradient">built for modern businesses</span>
            </h1>
          </StaggerItem>

          <StaggerItem className="mt-6">
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-ink-300 lg:mx-0">
              NexGenCode delivers scalable software, web, mobile and digital solutions that simplify operations, improve
              customer experiences and help your business grow.
            </p>
          </StaggerItem>

          <StaggerItem className="mt-6">
            <ul className="flex flex-col items-center gap-2 text-sm text-ink-300 sm:flex-row sm:justify-center sm:gap-5 lg:justify-start">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-brand-400" /> {h}
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem className="mt-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <LinkButton to="/contact" size="lg">
              Get a Free Consultation <ArrowRight size={18} />
            </LinkButton>
            <LinkButton to="/services" variant="secondary" size="lg">
              Explore Our Services
            </LinkButton>
          </StaggerItem>
        </StaggerGroup>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: easeOut }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="rounded-3xl border border-white/10 bg-ink-900/60  p-2 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="rounded-[1.25rem] border border-white/5 bg-ink-900/60 p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/70" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                  <span className="h-3 w-3 rounded-full bg-green-400/70" />
                </div>
                <span className="rounded-full bg-brand-500/10 px-3 py-1 text-[11px] font-medium text-brand-300">
                  nexgencode.in
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {serviceCategories.map((cat, i) => {
                  const Icon = iconMap[cat.icon];
                  return (
                    <MotionLink
                      key={cat.id}
                      to={`/services#${cat.id}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: easeOut }}
                      whileHover={{ y: -4 }}
                      className="rounded-xl border border-white/5 bg-ink-900/60  p-4 transition-colors hover:border-brand-400/40"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                        {Icon && <Icon size={18} />}
                      </span>
                      <p className="mt-3 text-sm font-semibold text-white">{cat.title}</p>
                      <p className="mt-0.5 text-xs text-ink-400">{getServicesByCategory(cat.id).length} services</p>
                    </MotionLink>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between text-xs text-ink-400">
                  <span>Project progress</span>
                  <span className="font-semibold text-brand-300">Launch ready</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.04]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '86%' }}
                    transition={{ duration: 1.4, delay: 0.9, ease: easeOut }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-accent-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 hidden animate-float rounded-2xl border border-white/10 bg-ink-900/95 px-4 py-3 shadow-xl backdrop-blur sm:block">
            <p className="font-display text-2xl font-bold text-white">{services.length}</p>
            <p className="text-xs text-ink-400">Services under one roof</p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
