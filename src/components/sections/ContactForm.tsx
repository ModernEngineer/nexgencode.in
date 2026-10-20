import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { easeOut } from '../../lib/motion';

interface FormState {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
}

const initialState: FormState = { name: '', email: '', company: '', budget: '', message: '' };

type Errors = Partial<Record<keyof FormState, string>>;

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) {
    errors.email = 'Please enter your email.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.message.trim()) errors.message = 'Tell us a little about your project.';
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('submitting');
    fetch('/api/contacts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(values),
    }).then((response) => {
      if (!response.ok) throw new Error('Unable to send message');
      setStatus('success');
      setValues(initialState);
    }).catch(() => {
      setStatus('idle');
      setErrors({ message: 'Unable to send your message. Please try again.' });
    });
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-16 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
          >
            <CheckCircle2 className="text-emerald-400" size={40} />
          </motion.div>
          <h3 className="mt-4 font-display text-xl font-semibold text-white">Message sent</h3>
          <p className="mt-2 max-w-sm text-sm text-ink-400">
            Thanks for reaching out — our team will get back to you within one business day.
          </p>
          <Button variant="secondary" className="mt-6" onClick={() => setStatus('idle')}>
            Send another message
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: easeOut }}
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Full name" error={errors.name}>
              <input
                value={values.name}
                onChange={handleChange('name')}
                type="text"
                placeholder="Jane Doe"
                className={inputClass}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                value={values.email}
                onChange={handleChange('email')}
                type="email"
                placeholder="jane@company.com"
                className={inputClass}
              />
            </Field>
            <Field label="Company (optional)">
              <input
                value={values.company}
                onChange={handleChange('company')}
                type="text"
                placeholder="Acme Inc."
                className={inputClass}
              />
            </Field>
            <Field label="Budget range (optional)">
              <select value={values.budget} onChange={handleChange('budget')} className={inputClass}>
                <option value="">Select a range</option>
                <option value="<1L">Under ₹1 Lakh</option>
                <option value="1-5L">₹1 – 5 Lakh</option>
                <option value="5-15L">₹5 – 15 Lakh</option>
                <option value="15L+">₹15 Lakh+</option>
              </select>
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Project details" error={errors.message}>
              <textarea
                value={values.message}
                onChange={handleChange('message')}
                rows={5}
                placeholder="Tell us about your project, timeline and goals..."
                className={inputClass}
              />
            </Field>
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={status === 'submitting'}>
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Sending...
              </>
            ) : (
              <>
                Send message <Send size={16} />
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-ink-950/60 px-4 py-2.5 text-sm text-white placeholder:text-ink-500 outline-none transition-colors focus:border-brand-400/50';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-200">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 block overflow-hidden text-xs text-red-400"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
