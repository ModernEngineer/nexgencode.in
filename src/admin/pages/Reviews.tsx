import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Globe, MessageSquareQuote, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { adminApi, formatDate, type AdminReview, type ReviewInput } from '../adminApi';
import {
  Badge,
  Card,
  EmptyState,
  Field,
  ImageUpload,
  Modal,
  PageTitle,
  Spinner,
  Toggle,
  btn,
  inputCls,
  useConfirm,
  useToast,
} from '../ui';
import Avatar from '../../components/ui/Avatar';
import { StarInput, StarRating } from '../../components/ui/StarRating';

type Filter = 'all' | 'pending' | 'approved';

const emptyInput: ReviewInput = {
  clientName: '',
  designation: '',
  company: '',
  city: '',
  rating: 5,
  comment: '',
  imageUrl: null,
  isApproved: true,
  isFeatured: false,
};

export default function Reviews() {
  const toast = useToast();
  const confirm = useConfirm();
  const [filter, setFilter] = useState<Filter>('all');
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);
  const [editing, setEditing] = useState<AdminReview | 'new' | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    adminApi
      .reviews('all')
      .then(setReviews)
      .catch((err: Error) => toast('error', err.message));
  }, [reloadKey, toast]);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  const counts = {
    all: reviews?.length ?? 0,
    pending: reviews?.filter((r) => !r.isApproved).length ?? 0,
    approved: reviews?.filter((r) => r.isApproved).length ?? 0,
  };
  const shown =
    reviews?.filter((r) => (filter === 'all' ? true : filter === 'pending' ? !r.isApproved : r.isApproved)) ?? [];

  const toggleApproval = async (r: AdminReview, isApproved: boolean) => {
    // Optimistic update so the switch responds instantly
    setReviews((list) => list?.map((x) => (x.id === r.id ? { ...x, isApproved } : x)) ?? null);
    try {
      await adminApi.setReviewApproval(r.id, isApproved);
      toast('success', isApproved ? 'Review is now visible on the website' : 'Review hidden from the website');
    } catch (err) {
      toast('error', (err as Error).message);
      refresh();
    }
  };

  const toggleFeatured = async (r: AdminReview) => {
    const { id, source, createdAt, ...input } = r;
    void source;
    void createdAt;
    try {
      await adminApi.updateReview(id, { ...input, isFeatured: !r.isFeatured });
      toast('success', r.isFeatured ? 'Removed from featured' : 'Marked as featured — shown first on the website');
      refresh();
    } catch (err) {
      toast('error', (err as Error).message);
    }
  };

  const remove = async (r: AdminReview) => {
    const ok = await confirm({ title: 'Delete review?', message: `The review by ${r.clientName} will be permanently deleted.` });
    if (!ok) return;
    try {
      await adminApi.deleteReview(r.id);
      toast('success', 'Review deleted');
      refresh();
    } catch (err) {
      toast('error', (err as Error).message);
    }
  };

  const tabs: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Live on website' },
  ];

  return (
    <>
      <PageTitle
        title="Client Reviews"
        description="Only reviews switched on here are shown on the website, with their star rating."
        actions={
          <button type="button" className={btn.primary} onClick={() => setEditing('new')}>
            <Plus size={16} /> Add review
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-1">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setFilter(t.value)}
            className={clsx(
              'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              filter === t.value ? 'bg-brand-600 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-100'
            )}
          >
            {t.label}
            <span
              className={clsx(
                'rounded-full px-1.5 text-xs',
                filter === t.value ? 'bg-white/20' : t.value === 'pending' && counts.pending ? 'bg-amber-100 text-amber-700' : 'bg-ink-100'
              )}
            >
              {counts[t.value]}
            </span>
          </button>
        ))}
      </div>

      {!reviews ? (
        <Spinner />
      ) : shown.length === 0 ? (
        <Card>
          <EmptyState
            icon={<MessageSquareQuote size={20} />}
            title={filter === 'pending' ? 'No reviews waiting for approval' : 'No reviews yet'}
            text="Reviews submitted on the website's Reviews page appear here for approval."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {shown.map((r) => (
            <Card key={r.id} className={clsx('p-5', !r.isApproved && 'border-amber-200 bg-amber-50/30')}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <Avatar name={r.clientName} imageUrl={r.imageUrl} className="h-12 w-12 shrink-0 rounded-full" textClassName="text-sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink-900">{r.clientName}</p>
                    <StarRating value={r.rating} size={15} />
                    {r.isApproved ? <Badge tone="green">Live</Badge> : <Badge tone="amber">Pending</Badge>}
                    {r.isFeatured && <Badge tone="blue">Featured</Badge>}
                    {r.source === 'website' && (
                      <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                        <Globe size={12} /> Submitted on website
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-ink-500">
                    {[r.designation, r.company, r.city].filter(Boolean).join(' · ') || '—'}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">{r.comment}</p>
                  <p className="mt-2 text-xs text-ink-400">{formatDate(r.createdAt)}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1 md:flex-col md:items-end md:gap-3">
                  <label className="mr-2 flex items-center gap-2 text-sm font-medium text-ink-700 md:mr-0">
                    Show on website
                    <Toggle checked={r.isApproved} onChange={(v) => toggleApproval(r, v)} label="Show on website" />
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className={clsx(btn.icon, r.isFeatured && 'text-amber-500 hover:text-amber-600')}
                      onClick={() => toggleFeatured(r)}
                      title={r.isFeatured ? 'Unfeature' : 'Feature (show first)'}
                      aria-label="Toggle featured"
                    >
                      <Star size={17} fill={r.isFeatured ? 'currentColor' : 'none'} />
                    </button>
                    <button type="button" className={btn.icon} onClick={() => setEditing(r)} aria-label="Edit review">
                      <Pencil size={17} />
                    </button>
                    <button type="button" className={`${btn.icon} hover:text-red-600`} onClick={() => remove(r)} aria-label="Delete review">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ReviewModal
        review={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />
    </>
  );
}

function ReviewModal({
  review,
  onClose,
  onSaved,
}: {
  review: AdminReview | 'new' | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [values, setValues] = useState<ReviewInput>(emptyInput);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Load the selected review into the form when the modal opens
  const [loadedFor, setLoadedFor] = useState<AdminReview | 'new' | null>(null);
  if (review !== loadedFor) {
    setLoadedFor(review);
    setErrors({});
    if (review === 'new') setValues(emptyInput);
    else if (review) {
      setValues({
        clientName: review.clientName,
        designation: review.designation ?? '',
        company: review.company ?? '',
        city: review.city ?? '',
        rating: review.rating,
        comment: review.comment,
        imageUrl: review.imageUrl ?? null,
        isApproved: review.isApproved,
        isFeatured: review.isFeatured,
      });
    }
  }

  const set = (field: keyof ReviewInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const save = async (e?: FormEvent) => {
    e?.preventDefault();
    const errs: Record<string, string> = {};
    if (!values.clientName.trim()) errs.clientName = 'Client name is required.';
    if (!values.comment.trim()) errs.comment = 'Review text is required.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      if (review === 'new') await adminApi.createReview(values);
      else if (review) await adminApi.updateReview(review.id, values);
      toast('success', review === 'new' ? 'Review added' : 'Review saved');
      onSaved();
    } catch (err) {
      toast('error', (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={review !== null}
      onClose={onClose}
      title={review === 'new' ? 'Add review' : 'Edit review'}
      size="lg"
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={btn.primary} onClick={() => save()} disabled={saving}>
            {saving ? 'Saving...' : 'Save review'}
          </button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5">
        <Field label="Rating">
          <StarInput value={values.rating} onChange={(rating) => setValues((v) => ({ ...v, rating }))} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Client name *" error={errors.clientName}>
            <input value={values.clientName} onChange={set('clientName')} maxLength={120} className={inputCls} />
          </Field>
          <Field label="Designation">
            <input value={values.designation ?? ''} onChange={set('designation')} maxLength={120} placeholder="Director" className={inputCls} />
          </Field>
          <Field label="Company">
            <input value={values.company ?? ''} onChange={set('company')} maxLength={160} className={inputCls} />
          </Field>
          <Field label="City">
            <input value={values.city ?? ''} onChange={set('city')} maxLength={80} placeholder="Prayagraj" className={inputCls} />
          </Field>
        </div>
        <Field label="Review *" error={errors.comment}>
          <textarea value={values.comment} onChange={set('comment')} rows={5} maxLength={1500} className={inputCls} />
        </Field>
        <Field label="Client photo (optional)">
          <ImageUpload value={values.imageUrl} onChange={(imageUrl) => setValues((v) => ({ ...v, imageUrl }))} shape="circle" />
        </Field>
        <div className="flex flex-col gap-3 rounded-lg bg-ink-50 p-4 sm:flex-row sm:gap-8">
          <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
            <Toggle checked={values.isApproved} onChange={(isApproved) => setValues((v) => ({ ...v, isApproved }))} />
            Show on website
          </label>
          <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
            <Toggle checked={values.isFeatured} onChange={(isFeatured) => setValues((v) => ({ ...v, isFeatured }))} />
            Featured (shown first)
          </label>
        </div>
      </form>
    </Modal>
  );
}
