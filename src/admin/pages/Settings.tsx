import { useState, type FormEvent } from 'react';
import { CheckCircle2, KeyRound, XCircle } from 'lucide-react';
import { adminApi } from '../adminApi';
import { Card, CheckItem, Field, PageTitle, PasswordInput, btn, useToast } from '../ui';
import { useAuth } from '../auth';

export default function Settings() {
  const { user } = useAuth();
  const toast = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Live password rules (the API also enforces the 8-character minimum)
  const rules = [
    { label: 'At least 8 characters', ok: next.length >= 8 },
    { label: 'Contains a letter', ok: /[A-Za-z]/.test(next) },
    { label: 'Contains a number', ok: /\d/.test(next) },
    { label: 'Different from current password', ok: next.length > 0 && next !== current },
  ];
  const strongEnough = rules.every((r) => r.ok);
  const matches = repeat.length > 0 && repeat === next;
  const canSubmit = current.length > 0 && strongEnough && matches && !saving;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setSaving(true);
    try {
      await adminApi.changePassword(current, next);
      toast('success', 'Password changed');
      setCurrent('');
      setNext('');
      setRepeat('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageTitle title="Settings" description={`Signed in as ${user?.username}.`} />
      <Card className="max-w-xl p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <KeyRound size={18} />
          </span>
          <div>
            <h2 className="font-semibold text-ink-900">Change password</h2>
            <p className="text-sm text-ink-500">Change the default password after your first login.</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <Field label="Current password">
            <PasswordInput value={current} onChange={setCurrent} autoComplete="current-password" />
          </Field>

          <div>
            <Field label="New password">
              <PasswordInput
                value={next}
                onChange={setNext}
                autoComplete="new-password"
                status={next ? (strongEnough ? 'valid' : 'invalid') : undefined}
              />
            </Field>
            <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2" aria-live="polite">
              {rules.map((r) => (
                <CheckItem key={r.label} ok={r.ok} label={r.label} />
              ))}
            </ul>
          </div>

          <div>
            <Field label="Repeat new password">
              <PasswordInput
                value={repeat}
                onChange={setRepeat}
                autoComplete="new-password"
                status={repeat ? (matches ? 'valid' : 'invalid') : undefined}
              />
            </Field>
            {repeat && (
              <p
                className={`mt-2 flex items-center gap-1.5 text-xs ${matches ? 'text-emerald-600' : 'text-red-600'}`}
                aria-live="polite"
              >
                {matches ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {matches ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}

          <button type="submit" className={btn.primary} disabled={!canSubmit}>
            {saving ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </Card>
    </>
  );
}
