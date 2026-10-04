import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, Users } from 'lucide-react';
import clsx from 'clsx';
import { adminApi, type TeamMemberInput } from '../adminApi';
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
import type { TeamMember } from '../../types';

const emptyInput: TeamMemberInput = {
  name: '',
  title: '',
  bio: '',
  imageUrl: null,
  linkedInUrl: '',
  email: '',
  isActive: true,
};

export default function Team() {
  const toast = useToast();
  const confirm = useConfirm();
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [editing, setEditing] = useState<TeamMember | 'new' | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    adminApi
      .team()
      .then(setMembers)
      .catch((err: Error) => toast('error', err.message));
  }, [reloadKey, toast]);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  const move = async (index: number, dir: -1 | 1) => {
    if (!members) return;
    const next = [...members];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    setMembers(next); // optimistic
    try {
      await adminApi.reorderTeam(next.map((m) => m.id));
    } catch (err) {
      toast('error', (err as Error).message);
      refresh();
    }
  };

  const setActive = async (m: TeamMember, isActive: boolean) => {
    setMembers((list) => list?.map((x) => (x.id === m.id ? { ...x, isActive } : x)) ?? null);
    try {
      await adminApi.setMemberActive(m.id, isActive);
      toast('success', isActive ? `${m.name} is now shown on the website` : `${m.name} hidden from the website`);
    } catch (err) {
      toast('error', (err as Error).message);
      refresh();
    }
  };

  const remove = async (m: TeamMember) => {
    const ok = await confirm({
      title: 'Delete team member?',
      message: `${m.name} and their photo will be permanently deleted. To remove them from the website temporarily, switch "Show" off instead.`,
    });
    if (!ok) return;
    try {
      await adminApi.deleteMember(m.id);
      toast('success', 'Team member deleted');
      refresh();
    } catch (err) {
      toast('error', (err as Error).message);
    }
  };

  return (
    <>
      <PageTitle
        title="Core Team"
        description='Members shown on the "Meet Our Core Team" page, in this order. Use the arrows to reorder.'
        actions={
          <button type="button" className={btn.primary} onClick={() => setEditing('new')}>
            <Plus size={16} /> Add member
          </button>
        }
      />

      {!members ? (
        <Spinner />
      ) : members.length === 0 ? (
        <Card>
          <EmptyState icon={<Users size={20} />} title="No team members yet" text="Add your first team member to show them on the website." />
        </Card>
      ) : (
        <Card className="divide-y divide-ink-100">
          {members.map((m, i) => (
            <div key={m.id} className={clsx('flex flex-col gap-4 p-4 sm:flex-row sm:items-center', !m.isActive && 'bg-ink-50/70')}>
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="w-6 shrink-0 text-center font-display text-sm font-semibold text-ink-400">{i + 1}</span>
                <Avatar
                  name={m.name}
                  imageUrl={m.imageUrl}
                  className={clsx('h-14 w-14 shrink-0 rounded-xl', !m.isActive && 'opacity-50')}
                  textClassName="text-base"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-ink-900">{m.name}</p>
                    {!m.isActive && <Badge>Hidden</Badge>}
                  </div>
                  <p className="truncate text-sm text-brand-700">{m.title}</p>
                  {m.bio && <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">{m.bio}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 pl-10 sm:pl-0">
                <label className="mr-3 flex items-center gap-2 text-sm font-medium text-ink-700">
                  Show
                  <Toggle checked={m.isActive} onChange={(v) => setActive(m, v)} label={`Show ${m.name}`} />
                </label>
                <button type="button" className={btn.icon} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                  <ArrowUp size={17} />
                </button>
                <button type="button" className={btn.icon} disabled={i === members.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                  <ArrowDown size={17} />
                </button>
                <button type="button" className={btn.icon} onClick={() => setEditing(m)} aria-label={`Edit ${m.name}`}>
                  <Pencil size={17} />
                </button>
                <button type="button" className={`${btn.icon} hover:text-red-600`} onClick={() => remove(m)} aria-label={`Delete ${m.name}`}>
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <MemberModal
        member={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />
    </>
  );
}

function MemberModal({
  member,
  onClose,
  onSaved,
}: {
  member: TeamMember | 'new' | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [values, setValues] = useState<TeamMemberInput>(emptyInput);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [loadedFor, setLoadedFor] = useState<TeamMember | 'new' | null>(null);
  if (member !== loadedFor) {
    setLoadedFor(member);
    setErrors({});
    if (member === 'new') setValues(emptyInput);
    else if (member) {
      setValues({
        name: member.name,
        title: member.title,
        bio: member.bio,
        imageUrl: member.imageUrl ?? null,
        linkedInUrl: member.linkedInUrl ?? '',
        email: member.email ?? '',
        isActive: member.isActive,
        displayOrder: member.displayOrder,
      });
    }
  }

  const set = (field: keyof TeamMemberInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const save = async (e?: FormEvent) => {
    e?.preventDefault();
    const errs: Record<string, string> = {};
    if (!values.name.trim()) errs.name = 'Name is required.';
    if (!values.title.trim()) errs.title = 'Title is required.';
    if (values.linkedInUrl && !/^https?:\/\/\S+$/.test(values.linkedInUrl)) errs.linkedInUrl = 'Enter a full URL starting with https://';
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = 'Enter a valid email address.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const body = { ...values, linkedInUrl: values.linkedInUrl || null, email: values.email || null };
    setSaving(true);
    try {
      if (member === 'new') await adminApi.createMember(body);
      else if (member) await adminApi.updateMember(member.id, body);
      toast('success', member === 'new' ? 'Team member added' : 'Team member saved');
      onSaved();
    } catch (err) {
      toast('error', (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={member !== null}
      onClose={onClose}
      title={member === 'new' ? 'Add team member' : 'Edit team member'}
      size="lg"
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={btn.primary} onClick={() => save()} disabled={saving}>
            {saving ? 'Saving...' : 'Save member'}
          </button>
        </>
      }
    >
      <form onSubmit={save} className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <Field label="Photo">
            <ImageUpload value={values.imageUrl} onChange={(imageUrl) => setValues((v) => ({ ...v, imageUrl }))} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name *" error={errors.name}>
              <input value={values.name} onChange={set('name')} maxLength={120} className={inputCls} />
            </Field>
            <Field label="Title / designation *" error={errors.title}>
              <input value={values.title} onChange={set('title')} maxLength={120} placeholder="Lead Developer" className={inputCls} />
            </Field>
          </div>
          <Field label="Short bio" hint={`${values.bio?.length ?? 0}/600`}>
            <textarea value={values.bio} onChange={set('bio')} rows={3} maxLength={600} className={inputCls} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="LinkedIn URL" error={errors.linkedInUrl}>
              <input value={values.linkedInUrl ?? ''} onChange={set('linkedInUrl')} placeholder="https://linkedin.com/in/..." className={inputCls} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input value={values.email ?? ''} onChange={set('email')} type="email" className={inputCls} />
            </Field>
          </div>
          <label className="flex items-center gap-3 rounded-lg bg-ink-50 p-4 text-sm font-medium text-ink-700">
            <Toggle checked={values.isActive} onChange={(isActive) => setValues((v) => ({ ...v, isActive }))} />
            Show on the website
          </label>
        </div>

        {/* Live preview of the website card */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Preview</p>
          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
            <div className="aspect-[4/4.2] bg-gradient-to-br from-brand-50 to-brand-100">
              <Avatar name={values.name || '?'} imageUrl={values.imageUrl} className="h-full w-full" textClassName="text-4xl" />
            </div>
            <div className="p-4 text-center">
              <p className="font-display font-semibold text-ink-900">{values.name || 'Name'}</p>
              <p className="mt-0.5 text-xs font-medium text-brand-700">{values.title || 'Title'}</p>
              {values.bio && <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-ink-500">{values.bio}</p>}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
