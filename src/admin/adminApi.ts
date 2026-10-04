import { api } from '../lib/api';
import type { TeamMember } from '../types';

export type EnquiryStatus = 'New' | 'InProgress' | 'Closed';

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  message: string;
  status: EnquiryStatus;
  adminNotes?: string | null;
  createdAt: string;
}

export interface AdminReview {
  id: number;
  clientName: string;
  designation?: string | null;
  company?: string | null;
  city?: string | null;
  rating: number;
  comment: string;
  imageUrl?: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  source: 'website' | 'admin';
  createdAt: string;
}

export type ReviewInput = Omit<AdminReview, 'id' | 'source' | 'createdAt'>;
export type TeamMemberInput = Omit<TeamMember, 'id' | 'displayOrder'> & { displayOrder?: number | null };

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardStats {
  newEnquiries: number;
  totalEnquiries: number;
  pendingReviews: number;
  approvedReviews: number;
  activeTeamMembers: number;
  averageRating: number;
  latestEnquiries: Enquiry[];
  latestPendingReviews: AdminReview[];
}

const auth = { auth: true } as const;

export const adminApi = {
  dashboard: () => api<DashboardStats>('/api/admin/dashboard', auth),

  // Enquiries (contact form)
  enquiries: (q: { status?: EnquiryStatus | ''; search?: string; page?: number; pageSize?: number }) => {
    const p = new URLSearchParams();
    if (q.status) p.set('status', q.status);
    if (q.search) p.set('search', q.search);
    p.set('page', String(q.page ?? 1));
    p.set('pageSize', String(q.pageSize ?? 20));
    return api<Paged<Enquiry>>(`/api/admin/enquiries?${p}`, auth);
  },
  enquiry: (id: number) => api<Enquiry>(`/api/admin/enquiries/${id}`, auth),
  updateEnquiry: (id: number, body: { status: EnquiryStatus; adminNotes?: string | null }) =>
    api<Enquiry>(`/api/admin/enquiries/${id}`, { ...auth, method: 'PATCH', body }),
  deleteEnquiry: (id: number) => api<void>(`/api/admin/enquiries/${id}`, { ...auth, method: 'DELETE' }),

  // Reviews
  reviews: (status: 'all' | 'pending' | 'approved' = 'all') =>
    api<AdminReview[]>(`/api/admin/reviews?status=${status}`, auth),
  createReview: (body: ReviewInput) => api<AdminReview>('/api/admin/reviews', { ...auth, method: 'POST', body }),
  updateReview: (id: number, body: ReviewInput) =>
    api<AdminReview>(`/api/admin/reviews/${id}`, { ...auth, method: 'PUT', body }),
  setReviewApproval: (id: number, isApproved: boolean) =>
    api<void>(`/api/admin/reviews/${id}/approval`, { ...auth, method: 'PATCH', body: { isApproved } }),
  deleteReview: (id: number) => api<void>(`/api/admin/reviews/${id}`, { ...auth, method: 'DELETE' }),

  // Team
  team: () => api<TeamMember[]>('/api/admin/team', auth),
  createMember: (body: TeamMemberInput) => api<TeamMember>('/api/admin/team', { ...auth, method: 'POST', body }),
  updateMember: (id: number, body: TeamMemberInput) =>
    api<TeamMember>(`/api/admin/team/${id}`, { ...auth, method: 'PUT', body }),
  setMemberActive: (id: number, isActive: boolean) =>
    api<void>(`/api/admin/team/${id}/active`, { ...auth, method: 'PATCH', body: isActive }),
  reorderTeam: (ids: number[]) => api<void>('/api/admin/team/reorder', { ...auth, method: 'PUT', body: { ids } }),
  deleteMember: (id: number) => api<void>(`/api/admin/team/${id}`, { ...auth, method: 'DELETE' }),

  // Uploads & account
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api<{ url: string }>('/api/admin/uploads', { ...auth, method: 'POST', body: form });
  },
  changePassword: (currentPassword: string, newPassword: string) =>
    api<void>('/api/auth/change-password', { ...auth, method: 'POST', body: { currentPassword, newPassword } }),
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
