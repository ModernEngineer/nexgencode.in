import type { ReviewsResponse } from '../types';

// Fallback reviews shown if the API is unreachable. Live reviews are moderated in the admin panel
// (Admin → Reviews); only reviews enabled there are returned by GET /api/reviews.
export const fallbackReviews: ReviewsResponse = {
  count: 6,
  average: 4.7,
  items: [
    { id: 1, clientName: 'Rajesh Agarwal', designation: 'Director', company: 'Agarwal Public School', city: 'Prayagraj', rating: 5, createdAt: '2026-08-25T00:00:00Z',
      comment: 'Our admissions, fees and attendance now run from one system. Parents get updates instantly and our office work has reduced by half. The NexGenCode team understood exactly how a school operates.' },
    { id: 2, clientName: 'Dr. Sunita Pandey', designation: 'Managing Director', company: 'Pandey Multispeciality Hospital', city: 'Varanasi', rating: 5, createdAt: '2026-09-02T00:00:00Z',
      comment: 'Patient registration, billing and pharmacy are finally connected. The software is simple enough for our front desk staff and the support team responds quickly whenever we need help.' },
    { id: 4, clientName: 'Kavita Jaiswal', designation: 'Founder', company: 'Kavya Ethnic Boutique', city: 'Lucknow', rating: 5, createdAt: '2026-09-16T00:00:00Z',
      comment: 'They built our online store and ran our Meta Ads campaigns. Orders from Instagram have grown steadily and managing inventory is no longer a headache.' },
    { id: 3, clientName: 'Manoj Kesarwani', designation: 'Owner', company: 'Hotel Sangam Residency', city: 'Prayagraj', rating: 4, createdAt: '2026-09-09T00:00:00Z',
      comment: 'Room bookings, check-ins and housekeeping are much easier to manage now. Occupancy reports help us plan better during the Magh Mela season.' },
    { id: 5, clientName: 'Amit Chaurasia', designation: 'Partner', company: 'Chaurasia Realty', city: 'Kanpur', rating: 5, createdAt: '2026-09-24T00:00:00Z',
      comment: 'The real estate CRM keeps every lead, site visit and follow-up in one place. Our sales team closes deals faster and nothing slips through the cracks.' },
    { id: 6, clientName: 'Deepak Saxena', designation: 'Proprietor', company: 'Saxena Electronics', city: 'Prayagraj', rating: 4, createdAt: '2026-09-30T00:00:00Z',
      comment: 'Fast POS billing with barcode support and GST reports. Very easy for my staff to learn, and stock tracking is accurate.' },
  ],
};
