import { api } from './api';
import type { Project, ReviewsResponse, TeamMember } from '../types';

export const getTeam = (signal?: AbortSignal) => api<TeamMember[]>('/api/team', { signal });

export const getProjects = (featured = false, signal?: AbortSignal) =>
  api<Project[]>(`/api/projects${featured ? '?featured=true' : ''}`, { signal });

export const getReviews = (limit?: number, signal?: AbortSignal) =>
  api<ReviewsResponse>(`/api/reviews${limit ? `?limit=${limit}` : ''}`, { signal });

export interface ReviewSubmission {
  clientName: string;
  designation?: string;
  company?: string;
  city?: string;
  rating: number;
  comment: string;
  website?: string; // honeypot
}

export const submitReview = (body: ReviewSubmission) =>
  api<{ message: string }>('/api/reviews', { method: 'POST', body });

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  website?: string; // honeypot
}

export const submitContact = (body: ContactPayload) =>
  api<{ message: string }>('/api/contact', { method: 'POST', body });
