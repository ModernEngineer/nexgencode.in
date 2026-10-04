import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { StarInput } from '../ui/StarRating';
import { easeOut } from '../../lib/motion';
import { submitReview, type ReviewSubmission } from '../../lib/publicApi';

const empty: ReviewSubmission = {
  clientName: '',
  designation: '',
  company: '',
  city: '',
  rating: 0,
  comment: '',
  website: '',
};

const inputClass =
  'w-full rounded-lg border border-white/10 bg-ink-950/60 px-4 py-2.5 text-sm text-white placeholder:text-ink-500 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15';

/** Public "write a review" form. Submissions stay hidden until enabled in Admin → Reviews. */
export default function ReviewForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [serverError, setServerError] = useState('');

  const set = (field: keyof ReviewSubmission) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!values.clientName.trim()) errs.clientName = 'Please enter your name.';
    if (values.rating < 1) errs.rating = 'Please choose a star rating.';
    if (values.comment.trim().length < 10) errs.comment = 'Please write at least a sentence about your experience.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('submitting');
    setServerError('');
    try {
      await submitReview(values);
      setStatus('success');
      setValues(empty);
    } catch (err) {
      setServerError((err as Error).message);
      setStatus('idle');
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'success' ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="flex flex-col items-center rounded-2xl border border-white/10 bg-ink-900/60 px-8 py-14 text-center"
        >
          <CheckCircle2 className="text-emerald-500" size={44} />
          <h3 className="mt-4 font-display text-xl font-semibold text-white">Thank you for your review!</h3>
          <p className="mt-2 max-w-sm text-sm text-ink-400">
            It will appear on our website once our team has reviewed it.
          </p>
          <Button variant="secondary" className="mt-6" onClick={() => setStatus('idle')}>
            Write another review
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          noValidate
          className="relative rounded-2xl border border-white/10 bg-ink-900/60 p-6  sm:p-8"
        >
          <div>
            <span className="mb-2 block text-sm font-medium text-ink-200">Your rating *</span>
            <StarInput value={values.rating} onChange={(rating) => setValues((v) => ({ ...v, rating }))} />
            {errors.rating && <span className="mt-1.5 block text-xs text-red-600">{errors.rating}</span>}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Your name *" error={errors.clientName}>
              <input
                value={values.clientName}
                onChange={set('clientName')}
                maxLength={120}
                placeholder="Ramesh Kumar"
                className={inputClass}
              />
            </Field>
            <Field label="Designation">
              <input
                value={values.designation}
                onChange={set('designation')}
                maxLength={120}
                placeholder="Owner / Director"
                className={inputClass}
              />
            </Field>
            <Field label="Company / Organisation">
              <input
                value={values.company}
                onChange={set('company')}
                maxLength={160}
                placeholder="Kumar Traders"
                className={inputClass}
              />
            </Field>
            <Field label="City">
              <input
                value={values.city}
                onChange={set('city')}
                maxLength={80}
                placeholder="Prayagraj"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="Your review *" error={errors.comment}>
              <textarea
                value={values.comment}
                onChange={set('comment')}
                rows={5}
                maxLength={1500}
                placeholder="How was your experience working with NexGenCode?"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Honeypot: hidden from people, bots fill it in */}
          <input
            type="text"
            name="website"
            value={values.website}
            onChange={set('website')}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          {serverError && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>}

          <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={status === 'submitting'}>
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                Submit review <Send size={16} />
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-200">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
