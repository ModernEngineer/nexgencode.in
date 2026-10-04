import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, ExternalLink, FolderKanban, Home, Pencil, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { adminApi, type ProjectInput } from '../adminApi';
import {
  Badge,
  Card,
  EmptyState,
  Field,
  ImageUpload,
  Modal,
  PageTitle,
  Spinner,
  TagInput,
  Toggle,
  btn,
  inputCls,
  useConfirm,
  useToast,
} from '../ui';
import ProjectCard from '../../components/ui/ProjectCard';
import { assetUrl } from '../../lib/api';
import { accentClass, projectAccents } from '../../data/accents';
import type { Project } from '../../types';

const emptyInput: ProjectInput = {
  title: '',
  category: 'Web App',
  description: '',
  imageUrl: null,
  tags: [],
  url: '',
  accent: projectAccents[0]!.value,
  isActive: true,
  isFeatured: false,
};

const suggestedCategories = ['Web App', 'Website', 'Mobile App', 'ERP / Software', 'E-Commerce', 'Cloud', 'AI / ML', 'Design'];

export default function Projects() {
  const toast = useToast();
  const confirm = useConfirm();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [editing, setEditing] = useState<Project | 'new' | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    adminApi
      .projects()
      .then(setProjects)
      .catch((err: Error) => toast('error', err.message));
  }, [reloadKey, toast]);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);
  const categories = Array.from(new Set([...(projects ?? []).map((p) => p.category), ...suggestedCategories]));

  const move = async (index: number, dir: -1 | 1) => {
    if (!projects) return;
    const next = [...projects];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    setProjects(next);
    try {
      await adminApi.reorderProjects(next.map((p) => p.id));
    } catch (err) {
      toast('error', (err as Error).message);
      refresh();
    }
  };

  const toggle = async (p: Project, field: 'isActive' | 'isFeatured', value: boolean) => {
    setProjects((list) => list?.map((x) => (x.id === p.id ? { ...x, [field]: value } : x)) ?? null);
    try {
      if (field === 'isActive') await adminApi.setProjectActive(p.id, value);
      else await adminApi.setProjectFeatured(p.id, value);
      toast(
        'success',
        field === 'isActive'
          ? value ? 'Project is now shown on the Portfolio page' : 'Project hidden from the website'
          : value ? 'Project added to the homepage' : 'Project removed from the homepage'
      );
    } catch (err) {
      toast('error', (err as Error).message);
      refresh();
    }
  };

  const remove = async (p: Project) => {
    const ok = await confirm({
      title: 'Delete project?',
      message: `"${p.title}" and its screenshot will be permanently deleted. To remove it from the website temporarily, switch "Show" off instead.`,
    });
    if (!ok) return;
    try {
      await adminApi.deleteProject(p.id);
      toast('success', 'Project deleted');
      refresh();
    } catch (err) {
      toast('error', (err as Error).message);
    }
  };

  return (
    <>
      <PageTitle
        title="Portfolio"
        description="Projects on the Portfolio page, in this order. Cards with a link open the live project in a new tab."
        actions={
          <button type="button" className={btn.primary} onClick={() => setEditing('new')}>
            <Plus size={16} /> Add project
          </button>
        }
      />

      {!projects ? (
        <Spinner />
      ) : projects.length === 0 ? (
        <Card>
          <EmptyState icon={<FolderKanban size={20} />} title="No projects yet" text="Add your first project to show it on the website." />
        </Card>
      ) : (
        <Card className="divide-y divide-ink-100">
          {projects.map((p, i) => {
            const image = assetUrl(p.imageUrl);
            return (
              <div key={p.id} className={clsx('flex flex-col gap-4 p-4 lg:flex-row lg:items-center', !p.isActive && 'bg-ink-50/70')}>
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="w-6 shrink-0 text-center font-display text-sm font-semibold text-ink-400">{i + 1}</span>
                  <div
                    className={clsx(
                      'h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br',
                      accentClass(p.accent),
                      !p.isActive && 'opacity-50'
                    )}
                  >
                    {image && <img src={image} alt="" className="h-full w-full object-cover object-top" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-ink-900">{p.title}</p>
                      <Badge tone="blue">{p.category}</Badge>
                      {p.isFeatured && <Badge tone="green">Homepage</Badge>}
                      {!p.isActive && <Badge>Hidden</Badge>}
                    </div>
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs text-brand-700 hover:underline"
                      >
                        <ExternalLink size={12} className="shrink-0" /> <span className="truncate">{p.url}</span>
                      </a>
                    ) : (
                      <p className="mt-0.5 text-xs text-ink-400">No link — card is not clickable</p>
                    )}
                    {p.tags.length > 0 && <p className="mt-0.5 truncate text-xs text-ink-500">{p.tags.join(' · ')}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1 pl-10 lg:pl-0">
                  <label className="mr-3 flex items-center gap-2 text-sm font-medium text-ink-700" title="Show on the Portfolio page">
                    Show
                    <Toggle checked={p.isActive} onChange={(v) => toggle(p, 'isActive', v)} label={`Show ${p.title}`} />
                  </label>
                  <label className="mr-3 flex items-center gap-2 text-sm font-medium text-ink-700" title="Also show on the homepage">
                    <Home size={15} />
                    <Toggle checked={p.isFeatured} onChange={(v) => toggle(p, 'isFeatured', v)} label={`Show ${p.title} on homepage`} />
                  </label>
                  <button type="button" className={btn.icon} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                    <ArrowUp size={17} />
                  </button>
                  <button type="button" className={btn.icon} disabled={i === projects.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                    <ArrowDown size={17} />
                  </button>
                  <button type="button" className={btn.icon} onClick={() => setEditing(p)} aria-label={`Edit ${p.title}`}>
                    <Pencil size={17} />
                  </button>
                  <button type="button" className={`${btn.icon} hover:text-red-600`} onClick={() => remove(p)} aria-label={`Delete ${p.title}`}>
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </Card>
      )}

      <ProjectModal
        project={editing}
        categories={categories}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          refresh();
        }}
      />
    </>
  );
}

function ProjectModal({
  project,
  categories,
  onClose,
  onSaved,
}: {
  project: Project | 'new' | null;
  categories: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [values, setValues] = useState<ProjectInput>(emptyInput);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Load the selected project into the form when the modal opens
  const [loadedFor, setLoadedFor] = useState<Project | 'new' | null>(null);
  if (project !== loadedFor) {
    setLoadedFor(project);
    setErrors({});
    if (project === 'new') setValues(emptyInput);
    else if (project) {
      const { id, displayOrder, ...rest } = project;
      void id;
      void displayOrder;
      setValues({ ...rest, url: rest.url ?? '', imageUrl: rest.imageUrl ?? null, accent: accentClass(rest.accent) });
    }
  }

  const set = (field: keyof ProjectInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const save = async (e?: FormEvent) => {
    e?.preventDefault();
    const errs: Record<string, string> = {};
    if (!values.title.trim()) errs.title = 'Title is required.';
    if (!values.category.trim()) errs.category = 'Category is required.';
    const url = (values.url ?? '').trim();
    if (url && !/^https?:\/\/[^\s]+\.[^\s]+/i.test(url)) errs.url = 'Enter a full link starting with https:// (e.g. https://my-app.vercel.app)';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const body: ProjectInput = { ...values, url: url || null };
    setSaving(true);
    try {
      if (project === 'new') await adminApi.createProject(body);
      else if (project) await adminApi.updateProject(project.id, body);
      toast('success', project === 'new' ? 'Project added' : 'Project saved');
      onSaved();
    } catch (err) {
      toast('error', (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const preview: Project = { ...values, id: 0, displayOrder: 0, title: values.title || 'Project title', category: values.category || 'Category' };

  return (
    <Modal
      open={project !== null}
      onClose={onClose}
      title={project === 'new' ? 'Add project' : 'Edit project'}
      size="lg"
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={btn.primary} onClick={() => save()} disabled={saving}>
            {saving ? 'Saving...' : 'Save project'}
          </button>
        </>
      }
    >
      <form onSubmit={save} className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <Field label="Screenshot / image">
            <ImageUpload value={values.imageUrl} onChange={(imageUrl) => setValues((v) => ({ ...v, imageUrl }))} shape="wide" />
          </Field>
          <Field label="Title *" error={errors.title}>
            <input value={values.title} onChange={set('title')} maxLength={160} placeholder="IronPulse — Strength Studio" className={inputCls} />
          </Field>
          <Field label="Category *" hint="Used for the filter buttons on the Portfolio page" error={errors.category}>
            <input value={values.category} onChange={set('category')} maxLength={60} list="project-categories" className={inputCls} />
            <datalist id="project-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Description" hint={`${values.description.length}/600`}>
            <textarea value={values.description} onChange={set('description')} rows={3} maxLength={600} className={inputCls} />
          </Field>
          <Field label="Tags (chips)" hint="Press Enter or comma after each tag — max 12">
            <TagInput value={values.tags} onChange={(tags) => setValues((v) => ({ ...v, tags }))} placeholder="React, ERP, Billing…" />
          </Field>
          <Field
            label="Live link"
            hint="Vercel deploy or any website — clicking the card opens it in a new tab"
            error={errors.url}
          >
            <input value={values.url ?? ''} onChange={set('url')} type="url" placeholder="https://my-project.vercel.app" className={inputCls} />
          </Field>
          <Field label="Card colour (used when there is no image)">
            <div className="flex flex-wrap gap-2">
              {projectAccents.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  title={a.label}
                  aria-label={a.label}
                  onClick={() => setValues((v) => ({ ...v, accent: a.value }))}
                  className={clsx(
                    'h-8 w-8 rounded-full bg-gradient-to-br ring-offset-2 transition',
                    a.value,
                    values.accent === a.value ? 'ring-2 ring-brand-600' : 'hover:scale-110'
                  )}
                />
              ))}
            </div>
          </Field>
          <div className="flex flex-col gap-3 rounded-lg bg-ink-50 p-4 sm:flex-row sm:gap-8">
            <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
              <Toggle checked={values.isActive} onChange={(isActive) => setValues((v) => ({ ...v, isActive }))} />
              Show on Portfolio page
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
              <Toggle checked={values.isFeatured} onChange={(isFeatured) => setValues((v) => ({ ...v, isFeatured }))} />
              Also show on homepage
            </label>
          </div>
        </div>

        {/* Live preview of the website card (dark site theme) */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Preview</p>
          <div className="pointer-events-none rounded-2xl bg-ink-950 p-3">
            <ProjectCard project={preview} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
