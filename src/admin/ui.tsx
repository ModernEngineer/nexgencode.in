/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Eye, EyeOff, ImagePlus, Loader2, Trash2, X, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { assetUrl } from '../lib/api';
import { adminApi } from './adminApi';

export const inputCls =
  'w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 disabled:bg-ink-50';

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-60',
  danger:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60',
  icon: 'inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 disabled:opacity-40',
};

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('rounded-xl border border-ink-200 bg-white shadow-sm', className)}>{children}</div>;
}

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx('block', className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>
      )}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50',
        checked ? 'bg-brand-600' : 'bg-ink-300'
      )}
    >
      <span
        className={clsx(
          'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}

const badgeTones = {
  blue: 'bg-brand-50 text-brand-700 ring-brand-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  gray: 'bg-ink-50 text-ink-600 ring-ink-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
};

export function Badge({ tone = 'gray', children }: { tone?: keyof typeof badgeTones; children: ReactNode }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', badgeTones[tone])}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">{icon}</span>
      <p className="mt-4 font-semibold text-ink-900">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-ink-500">{text}</p>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={clsx('flex justify-center py-16', className)}>
      <Loader2 className="animate-spin text-brand-600" size={28} />
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'md' | 'lg';
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-950/50 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              'flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl',
              size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-lg'
            )}
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
              <h2 className="font-display text-lg font-semibold text-ink-900">{title}</h2>
              <button type="button" onClick={onClose} className={btn.icon} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-ink-100 bg-ink-50 px-6 py-4">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- Toasts ----------

type Toast = { id: number; type: 'success' | 'error'; message: string };
const ToastContext = createContext<(type: Toast['type'], message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const push = useCallback((type: Toast['type'], message: string) => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, type, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className={clsx(
                'pointer-events-auto flex max-w-sm items-start gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ring-1',
                t.type === 'success' ? 'bg-white text-ink-800 ring-emerald-200' : 'bg-white text-ink-800 ring-red-200'
              )}
            >
              {t.type === 'success' ? (
                <CheckCircle2 size={18} className="mt-px shrink-0 text-emerald-500" />
              ) : (
                <XCircle size={18} className="mt-px shrink-0 text-red-500" />
              )}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// ---------- Confirm dialog ----------

type ConfirmOptions = { title: string; message: string; confirmLabel?: string };
const ConfirmContext = createContext<(opts: ConfirmOptions) => Promise<boolean>>(async () => false);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);

  const confirm = useCallback(
    (opts: ConfirmOptions) => new Promise<boolean>((resolve) => setState({ ...opts, resolve })),
    []
  );
  const close = (result: boolean) => {
    state?.resolve(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={state !== null}
        onClose={() => close(false)}
        title={state?.title ?? ''}
        footer={
          <>
            <button type="button" className={btn.secondary} onClick={() => close(false)}>
              Cancel
            </button>
            <button type="button" className={btn.danger} onClick={() => close(true)}>
              <Trash2 size={16} /> {state?.confirmLabel ?? 'Delete'}
            </button>
          </>
        }
      >
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-red-500" size={20} />
          <p className="text-sm text-ink-600">{state?.message}</p>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);

// ---------- Image upload ----------

/** Uploads a photo to the API and returns its URL via onChange. Shows a preview with a remove option. */
export function ImageUpload({
  value,
  onChange,
  shape = 'square',
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  shape?: 'square' | 'circle' | 'wide';
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError('');
    if (file.size > 3 * 1024 * 1024) {
      setError('Image must be 3 MB or smaller.');
      return;
    }
    setUploading(true);
    try {
      const { url } = await adminApi.uploadImage(file);
      onChange(url);
      toast('success', 'Image uploaded');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const src = assetUrl(value);
  return (
    <div className="flex items-center gap-4">
      <div
        className={clsx(
          'flex shrink-0 items-center justify-center overflow-hidden border border-dashed border-ink-300 bg-ink-50',
          shape === 'wide' ? 'h-24 w-40 rounded-xl' : 'h-24 w-24',
          shape === 'circle' ? 'rounded-full' : 'rounded-xl'
        )}
      >
        {uploading ? (
          <Loader2 className="animate-spin text-brand-600" size={22} />
        ) : src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="text-ink-400" size={26} />
        )}
      </div>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn.secondary} onClick={() => inputRef.current?.click()} disabled={uploading}>
            <ImagePlus size={16} /> {src ? 'Change photo' : 'Upload photo'}
          </button>
          {src && (
            <button type="button" className={btn.secondary} onClick={() => onChange(null)} disabled={uploading}>
              <Trash2 size={16} /> Remove
            </button>
          )}
        </div>
        <p className="text-xs text-ink-400">
          JPG, PNG or WebP · max 3 MB · {shape === 'wide' ? 'landscape screenshots (16:9) look best' : 'square photos look best'}
        </p>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

// ---------- Password input ----------

/** Password field with a show/hide (eye) toggle. `status` adds a green tick or red border. */
export function PasswordInput({
  value,
  onChange,
  autoComplete,
  autoFocus,
  status,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  autoFocus?: boolean;
  status?: 'valid' | 'invalid';
  id?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        aria-invalid={status === 'invalid' || undefined}
        className={clsx(
          inputCls,
          status === 'valid' ? 'pr-20' : 'pr-11',
          status === 'invalid' && 'border-red-300 focus:border-red-500 focus:ring-red-500/15',
          status === 'valid' && 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/15'
        )}
      />
      {status === 'valid' && (
        <CheckCircle2 size={18} className="pointer-events-none absolute right-11 top-1/2 -translate-y-1/2 text-emerald-500" />
      )}
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-ink-400 transition-colors hover:text-ink-700"
        aria-label={show ? 'Hide password' : 'Show password'}
        title={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

/** One line of a live password checklist. */
export function CheckItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={clsx('flex items-center gap-2 text-xs transition-colors', ok ? 'text-emerald-600' : 'text-ink-400')}>
      {ok ? <CheckCircle2 size={14} /> : <span className="inline-block h-3.5 w-3.5 rounded-full border border-current" />}
      {label}
    </li>
  );
}

// ---------- Tag (chip) input ----------

/** Type a tag and press Enter or comma to add it; click × to remove. */
export function TagInput({
  value,
  onChange,
  max = 12,
  placeholder = 'Type and press Enter',
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');

  const add = (raw: string) => {
    const parts = raw.split(',').map((t) => t.trim()).filter(Boolean);
    const next = [...value];
    for (const t of parts) {
      if (next.length >= max) break;
      if (t.length <= 40 && !next.some((x) => x.toLowerCase() === t.toLowerCase())) next.push(t);
    }
    onChange(next);
    setDraft('');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-ink-200 bg-white px-2.5 py-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pl-3 pr-1.5 text-xs font-medium text-brand-800">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded-full p-0.5 hover:bg-brand-100"
            aria-label={`Remove ${tag}`}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      {value.length < max && (
        <input
          value={draft}
          onChange={(e) => (e.target.value.endsWith(',') ? add(e.target.value) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (draft.trim()) add(draft);
            } else if (e.key === 'Backspace' && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={value.length ? '' : placeholder}
          className="min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-1 text-sm text-ink-900 outline-none placeholder:text-ink-400"
        />
      )}
    </div>
  );
}
