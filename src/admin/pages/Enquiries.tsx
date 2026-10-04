import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download, Inbox, Mail, MessageCircle, Phone, Search, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { adminApi, formatDate, type Enquiry, type EnquiryStatus, type Paged } from '../adminApi';
import { Badge, Card, EmptyState, Field, Modal, PageTitle, Spinner, btn, inputCls, useConfirm, useToast } from '../ui';

const statusTabs: { value: EnquiryStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'New', label: 'New' },
  { value: 'InProgress', label: 'In progress' },
  { value: 'Closed', label: 'Closed' },
];

const statusBadge: Record<EnquiryStatus, { tone: 'blue' | 'amber' | 'green'; label: string }> = {
  New: { tone: 'blue', label: 'New' },
  InProgress: { tone: 'amber', label: 'In progress' },
  Closed: { tone: 'green', label: 'Closed' },
};

const PAGE_SIZE = 15;

export default function Enquiries() {
  const toast = useToast();
  const confirm = useConfirm();
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState<EnquiryStatus | ''>('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<Enquiry> | null>(null);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Debounce the search box
  useEffect(() => {
    const t = window.setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .enquiries({ status, search: query, page, pageSize: PAGE_SIZE })
      .then((d) => !cancelled && setData(d))
      .catch((err: Error) => toast('error', err.message));
    return () => {
      cancelled = true;
    };
  }, [status, query, page, reloadKey, toast]);

  // Open an enquiry directly from the dashboard (/admin/enquiries?open=12)
  const openId = params.get('open');
  useEffect(() => {
    if (!openId) return;
    adminApi
      .enquiry(Number(openId))
      .then(setSelected)
      .catch(() => {})
      .finally(() => setParams({}, { replace: true }));
  }, [openId, setParams]);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  const remove = async (e: Enquiry) => {
    const ok = await confirm({ title: 'Delete enquiry?', message: `The enquiry from ${e.name} will be permanently deleted.` });
    if (!ok) return;
    try {
      await adminApi.deleteEnquiry(e.id);
      toast('success', 'Enquiry deleted');
      setSelected(null);
      refresh();
    } catch (err) {
      toast('error', (err as Error).message);
    }
  };

  const exportCsv = async () => {
    try {
      const all: Enquiry[] = [];
      for (let p = 1; ; p++) {
        const res = await adminApi.enquiries({ status, search: query, page: p, pageSize: 200 });
        all.push(...res.items);
        if (all.length >= res.total || res.items.length === 0) break;
      }
      const cols: (keyof Enquiry)[] = ['createdAt', 'name', 'email', 'phone', 'company', 'service', 'budget', 'status', 'message', 'adminNotes'];
      const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const csv = [cols.join(','), ...all.map((e) => cols.map((c) => esc(e[c])).join(','))].join('\r\n');
      const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
      const a = Object.assign(document.createElement('a'), { href: url, download: `nexgencode-enquiries-${new Date().toISOString().slice(0, 10)}.csv` });
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast('error', (err as Error).message);
    }
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <>
      <PageTitle
        title="Enquiries"
        description="Messages submitted through the contact form on the website."
        actions={
          <button type="button" className={btn.secondary} onClick={exportCsv} disabled={!data?.total}>
            <Download size={16} /> Export CSV
          </button>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1">
            {statusTabs.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => {
                  setStatus(t.value);
                  setPage(1);
                }}
                className={clsx(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  status === t.value ? 'bg-brand-600 text-white' : 'text-ink-600 hover:bg-ink-100'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone..."
              className={`${inputCls} pl-9`}
            />
          </div>
        </div>

        {!data ? (
          <Spinner />
        ) : data.items.length === 0 ? (
          <EmptyState icon={<Inbox size={20} />} title="No enquiries found" text="Try a different filter or search term." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Received</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.items.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => setSelected(e)}
                    className={clsx('cursor-pointer transition-colors hover:bg-brand-50/50', e.status === 'New' && 'font-medium')}
                  >
                    <td className="px-4 py-3">
                      <p className="text-ink-900">{e.name}</p>
                      {e.company && <p className="text-xs font-normal text-ink-500">{e.company}</p>}
                    </td>
                    <td className="px-4 py-3 font-normal text-ink-600">
                      <p>{e.email}</p>
                      {e.phone && <p className="text-xs text-ink-500">{e.phone}</p>}
                    </td>
                    <td className="px-4 py-3 font-normal text-ink-600">
                      <p>{e.service || '—'}</p>
                      {e.budget && <p className="text-xs text-ink-500">{e.budget}</p>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-normal text-ink-500">{formatDate(e.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={statusBadge[e.status].tone}>{statusBadge[e.status].label}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-ink-100 px-4 py-3 text-sm text-ink-500">
            <span>
              Page {page} of {totalPages} · {data.total} enquiries
            </span>
            <div className="flex gap-1">
              <button type="button" className={btn.icon} disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
                <ChevronLeft size={18} />
              </button>
              <button type="button" className={btn.icon} disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </Card>

      <EnquiryModal
        enquiry={selected}
        onClose={() => setSelected(null)}
        onSaved={(e) => {
          setSelected(e);
          refresh();
        }}
        onDelete={remove}
      />
    </>
  );
}

function EnquiryModal({
  enquiry,
  onClose,
  onSaved,
  onDelete,
}: {
  enquiry: Enquiry | null;
  onClose: () => void;
  onSaved: (e: Enquiry) => void;
  onDelete: (e: Enquiry) => void;
}) {
  const toast = useToast();
  const [status, setStatus] = useState<EnquiryStatus>('New');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Reset the form whenever a different enquiry is opened
  const [shownId, setShownId] = useState<number | null>(null);
  if (enquiry && enquiry.id !== shownId) {
    setShownId(enquiry.id);
    setStatus(enquiry.status === 'New' ? 'InProgress' : enquiry.status);
    setNotes(enquiry.adminNotes ?? '');
  }

  const save = async () => {
    if (!enquiry) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateEnquiry(enquiry.id, { status, adminNotes: notes || null });
      toast('success', 'Enquiry updated');
      onSaved(updated);
    } catch (err) {
      toast('error', (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const phoneDigits = enquiry?.phone?.replace(/\D/g, '') ?? '';
  const whatsapp = phoneDigits ? `https://wa.me/${phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits}` : '';

  return (
    <Modal
      open={enquiry !== null}
      onClose={onClose}
      title={enquiry ? `Enquiry from ${enquiry.name}` : ''}
      size="lg"
      footer={
        enquiry && (
          <>
            <button type="button" className={`${btn.secondary} mr-auto text-red-600 hover:text-red-700`} onClick={() => onDelete(enquiry)}>
              <Trash2 size={16} /> Delete
            </button>
            <button type="button" className={btn.secondary} onClick={onClose}>
              Close
            </button>
            <button type="button" className={btn.primary} onClick={save} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </>
        )
      }
    >
      {enquiry && (
        <div className="space-y-6">
          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            {[
              ['Email', enquiry.email],
              ['Phone', enquiry.phone],
              ['Company', enquiry.company],
              ['Service', enquiry.service],
              ['Budget', enquiry.budget],
              ['Received', formatDate(enquiry.createdAt)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-medium uppercase tracking-wider text-ink-400">{k}</dt>
                <dd className="mt-0.5 break-words text-ink-900">{v || '—'}</dd>
              </div>
            ))}
          </dl>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-400">Message</p>
            <p className="mt-1.5 whitespace-pre-wrap rounded-lg bg-ink-50 p-4 text-sm leading-relaxed text-ink-800">{enquiry.message}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${enquiry.email}?subject=${encodeURIComponent('Re: Your enquiry with NexGenCode')}`} className={btn.secondary}>
              <Mail size={16} /> Reply by email
            </a>
            {enquiry.phone && (
              <>
                <a href={`tel:${enquiry.phone}`} className={btn.secondary}>
                  <Phone size={16} /> Call
                </a>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={btn.secondary}>
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value as EnquiryStatus)} className={inputCls}>
                <option value="New">New</option>
                <option value="InProgress">In progress</option>
                <option value="Closed">Closed</option>
              </select>
            </Field>
            <Field label="Internal notes" hint="Only visible to admins" className="sm:col-span-2">
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={2000} className={inputCls} />
            </Field>
          </div>
        </div>
      )}
    </Modal>
  );
}
