import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Share2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { adminApi, type SocialLinkInput } from '../adminApi';
import { Badge, Card, EmptyState, Field, Modal, PageTitle, Spinner, Toggle, btn, inputCls, useConfirm, useToast } from '../ui';
import SocialIcon from '../../components/ui/SocialIcon';
import { platformLabel, socialPlatforms } from '../../data/social';
import type { SocialLink } from '../../types';

const emptyInput: SocialLinkInput = { platform: 'linkedin', label: '', url: '', isActive: true };

export default function SocialLinks() {
  const toast = useToast();
  const confirm = useConfirm();
  const [links, setLinks] = useState<SocialLink[] | null>(null);
  const [editing, setEditing] = useState<SocialLink | 'new' | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    adminApi
      .socialLinks()
      .then(setLinks)
      .catch((err: Error) => toast('error', err.message));
  }, [reloadKey, toast]);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  const move = async (index: number, dir: -1 | 1) => {
    if (!links) return;
    const next = [...links];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    setLinks(next);
    try {
      await adminApi.reorderSocialLinks(next.map((l) => l.id));
    } catch (err) {
      toast('error', (err as Error).message);
      refresh();
    }
  };

  const setActive = async (l: SocialLink, isActive: boolean) => {
    setLinks((list) => list?.map((x) => (x.id === l.id ? { ...x, isActive } : x)) ?? null);
    try {
      await adminApi.setSocialLinkActive(l.id, isActive);
      toast('success', `${platformLabel(l.platform)} icon ${isActive ? 'shown in' : 'hidden from'} the footer`);
    } catch (err) {
      toast('error', (err as Error).message);
      refresh();
    }
  };

  const remove = async (l: SocialLink) => {
    const ok = await confirm({
      title: 'Remove icon?',
      message: `The ${platformLabel(l.platform)} icon will be deleted. To remove it from the website temporarily, switch "Show" off instead.`,
      confirmLabel: 'Remove',
    });
    if (!ok) return;
    try {
      await adminApi.deleteSocialLink(l.id);
      toast('success', 'Icon removed');
      refresh();
    } catch (err) {
      toast('error', (err as Error).message);
    }
  };

  const isDummy = (url: string) => /your-/.test(url);

  return (
    <>
      <PageTitle
        title="Social Links"
        description="Social media icons in the website footer. Switch an icon off to hide it, or edit it to change its link."
        actions={
          <button type="button" className={btn.primary} onClick={() => setEditing('new')}>
            <Plus size={16} /> Add icon
          </button>
        }
      />

      {links && links.length > 0 && (
        <Card className="mb-5 flex flex-wrap items-center gap-3 p-4">
          <span className="text-sm font-medium text-ink-600">Footer preview:</span>
          <div className="flex flex-wrap gap-2.5 rounded-xl bg-navy-950 px-4 py-3">
            {links.filter((l) => l.isActive).length === 0 ? (
              <span className="text-xs text-ink-400">No icons shown</span>
            ) : (
              links
                .filter((l) => l.isActive)
                .map((l) => (
                  <span
                    key={l.id}
                    title={platformLabel(l.platform)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-ink-300"
                  >
                    <SocialIcon platform={l.platform} size={17} />
                  </span>
                ))
            )}
          </div>
        </Card>
      )}

      {!links ? (
        <Spinner />
      ) : links.length === 0 ? (
        <Card>
          <EmptyState icon={<Share2 size={20} />} title="No social icons yet" text="Add LinkedIn, Instagram, Facebook and more." />
        </Card>
      ) : (
        <Card className="divide-y divide-ink-100">
          {links.map((l, i) => (
            <div key={l.id} className={clsx('flex flex-col gap-3 p-4 sm:flex-row sm:items-center', !l.isActive && 'bg-ink-50/70')}>
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="w-6 shrink-0 text-center font-display text-sm font-semibold text-ink-400">{i + 1}</span>
                <span
                  className={clsx(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700',
                    !l.isActive && 'opacity-50'
                  )}
                >
                  <SocialIcon platform={l.platform} size={20} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink-900">{platformLabel(l.platform)}</p>
                    {!l.isActive && <Badge>Hidden</Badge>}
                    {isDummy(l.url) && <Badge tone="amber">Dummy link — edit me</Badge>}
                  </div>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex max-w-full items-center gap-1 text-xs text-brand-700 hover:underline"
                  >
                    <ExternalLink size={12} className="shrink-0" /> <span className="truncate">{l.url}</span>
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-1 pl-10 sm:pl-0">
                <label className="mr-3 flex items-center gap-2 text-sm font-medium text-ink-700">
                  Show
                  <Toggle checked={l.isActive} onChange={(v) => setActive(l, v)} label={`Show ${platformLabel(l.platform)}`} />
                </label>
                <button type="button" className={btn.icon} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                  <ArrowUp size={17} />
                </button>
                <button type="button" className={btn.icon} disabled={i === links.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                  <ArrowDown size={17} />
                </button>
                <button type="button" className={btn.icon} onClick={() => setEditing(l)} aria-label={`Edit ${platformLabel(l.platform)}`}>
                  <Pencil size={17} />
                </button>
                <button type="button" className={`${btn.icon} hover:text-red-600`} onClick={() => remove(l)} aria-label={`Remove ${platformLabel(l.platform)}`}>
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <LinkModal
        link={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />
    </>
  );
}

function LinkModal({ link, onClose, onSaved }: { link: SocialLink | 'new' | null; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [values, setValues] = useState<SocialLinkInput>(emptyInput);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [loadedFor, setLoadedFor] = useState<SocialLink | 'new' | null>(null);
  if (link !== loadedFor) {
    setLoadedFor(link);
    setError('');
    if (link === 'new') setValues(emptyInput);
    else if (link) setValues({ platform: link.platform, label: link.label ?? '', url: link.url, isActive: link.isActive });
  }

  const platform = socialPlatforms.find((p) => p.value === values.platform) ?? socialPlatforms[0]!;

  const save = async (e?: FormEvent) => {
    e?.preventDefault();
    const url = values.url.trim();
    if (!/^(https?:\/\/\S+\.\S+|mailto:\S+@\S+)$/i.test(url)) {
      setError(`Enter a full link, e.g. ${platform.placeholder}`);
      return;
    }
    setError('');
    setSaving(true);
    try {
      const body = { ...values, url, label: values.label?.trim() || null };
      if (link === 'new') await adminApi.createSocialLink(body);
      else if (link) await adminApi.updateSocialLink(link.id, body);
      toast('success', link === 'new' ? 'Icon added to the footer' : 'Icon saved');
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={link !== null}
      onClose={onClose}
      title={link === 'new' ? 'Add social icon' : 'Edit social icon'}
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={btn.primary} onClick={() => save()} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-4">
        <Field label="Platform (icon)">
          <div className="grid grid-cols-5 gap-2">
            {socialPlatforms.map((p) => (
              <button
                key={p.value}
                type="button"
                title={p.label}
                aria-label={p.label}
                aria-pressed={values.platform === p.value}
                onClick={() => setValues((v) => ({ ...v, platform: p.value }))}
                className={clsx(
                  'flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[11px] font-medium transition-colors',
                  values.platform === p.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-ink-200 text-ink-500 hover:border-brand-300 hover:text-ink-800'
                )}
              >
                <SocialIcon platform={p.value} size={20} />
                <span className="truncate">{p.label}</span>
              </button>
            ))}
          </div>
        </Field>
        <Field label="Link *" hint="Opens in a new tab when the icon is clicked" error={error}>
          <input
            value={values.url}
            onChange={(e) => setValues((v) => ({ ...v, url: e.target.value }))}
            placeholder={platform.placeholder}
            className={inputCls}
            autoFocus
          />
        </Field>
        <Field label="Tooltip text (optional)" hint={`Default: "NexGenCode on ${platform.label}"`}>
          <input
            value={values.label ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, label: e.target.value }))}
            maxLength={80}
            className={inputCls}
          />
        </Field>
        <label className="flex items-center gap-3 rounded-lg bg-ink-50 p-4 text-sm font-medium text-ink-700">
          <Toggle checked={values.isActive} onChange={(isActive) => setValues((v) => ({ ...v, isActive }))} />
          Show in the footer
        </label>
      </form>
    </Modal>
  );
}
