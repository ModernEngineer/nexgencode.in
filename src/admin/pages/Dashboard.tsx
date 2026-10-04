import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Inbox, MessageSquareQuote, Star, Users } from 'lucide-react';
import { adminApi, formatDate, type DashboardStats } from '../adminApi';
import { Badge, Card, EmptyState, PageTitle, Spinner, btn, useToast } from '../ui';
import { StarRating } from '../../components/ui/StarRating';
import { useAuth } from '../auth';

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    adminApi
      .dashboard()
      .then(setStats)
      .catch((err: Error) => setError(err.message));
  }, [reloadKey]);

  const approve = async (id: number) => {
    try {
      await adminApi.setReviewApproval(id, true);
      toast('success', 'Review is now visible on the website');
      setReloadKey((k) => k + 1);
    } catch (err) {
      toast('error', (err as Error).message);
    }
  };

  if (error) return <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>;
  if (!stats) return <Spinner />;

  const cards = [
    { label: 'New enquiries', value: stats.newEnquiries, sub: `${stats.totalEnquiries} total`, icon: Inbox, to: '/admin/enquiries', tone: 'bg-brand-600' },
    { label: 'Pending reviews', value: stats.pendingReviews, sub: 'Waiting for approval', icon: MessageSquareQuote, to: '/admin/reviews', tone: 'bg-amber-500' },
    { label: 'Live reviews', value: stats.approvedReviews, sub: `${stats.averageRating.toFixed(1)} ★ average`, icon: Star, to: '/admin/reviews', tone: 'bg-emerald-500' },
    { label: 'Team members', value: stats.activeTeamMembers, sub: 'Shown on website', icon: Users, to: '/admin/team', tone: 'bg-accent-500' },
  ];

  return (
    <>
      <PageTitle title={`Welcome back${user ? `, ${user.displayName}` : ''}`} description="Here's what's happening on your website." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="group">
            <Card className="flex items-center gap-4 p-5 transition-colors group-hover:border-brand-300">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${c.tone}`}>
                <c.icon size={22} />
              </span>
              <div>
                <p className="font-display text-2xl font-bold text-ink-900">{c.value}</p>
                <p className="text-sm font-medium text-ink-700">{c.label}</p>
                <p className="text-xs text-ink-400">{c.sub}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="font-semibold text-ink-900">Latest enquiries</h2>
            <Link to="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {stats.latestEnquiries.length === 0 ? (
            <EmptyState icon={<Inbox size={20} />} title="No enquiries yet" text="Contact form submissions will appear here." />
          ) : (
            <ul className="divide-y divide-ink-100">
              {stats.latestEnquiries.map((e) => (
                <li key={e.id}>
                  <Link to={`/admin/enquiries?open=${e.id}`} className="block px-5 py-3.5 hover:bg-ink-50">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-medium text-ink-900">{e.name}</p>
                      {e.status === 'New' && <Badge tone="blue">New</Badge>}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-ink-500">
                      {e.service ? `${e.service} · ` : ''}
                      {e.message}
                    </p>
                    <p className="mt-1 text-xs text-ink-400">{formatDate(e.createdAt)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="font-semibold text-ink-900">Reviews waiting for approval</h2>
            <Link to="/admin/reviews" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          {stats.latestPendingReviews.length === 0 ? (
            <EmptyState icon={<Check size={20} />} title="All caught up" text="New reviews submitted on the website will appear here." />
          ) : (
            <ul className="divide-y divide-ink-100">
              {stats.latestPendingReviews.map((r) => (
                <li key={r.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-ink-900">{r.clientName}</p>
                      <StarRating value={r.rating} size={13} />
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-sm text-ink-500">{r.comment}</p>
                  </div>
                  <button type="button" className={`${btn.secondary} shrink-0 px-3 py-1.5`} onClick={() => approve(r.id)}>
                    <Check size={15} /> Approve
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
