import type { SocialLink, SocialPlatform } from '../types';

/** Platforms the admin can choose from. Keep in sync with SocialLinkInput.Platform in the API. */
export const socialPlatforms: { value: SocialPlatform; label: string; placeholder: string }[] = [
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'https://www.linkedin.com/company/your-page' },
  { value: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/your-handle' },
  { value: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/your-page' },
  { value: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/your-handle' },
  { value: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@your-channel' },
  { value: 'github', label: 'GitHub', placeholder: 'https://github.com/your-org' },
  { value: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/919999999999' },
  { value: 'telegram', label: 'Telegram', placeholder: 'https://t.me/your-channel' },
  { value: 'email', label: 'Email', placeholder: 'mailto:info@nexgencode.in' },
  { value: 'website', label: 'Website', placeholder: 'https://example.com' },
];

export const platformLabel = (p: SocialPlatform) => socialPlatforms.find((x) => x.value === p)?.label ?? p;

// Fallback (same dummy links as the database seed) if the API is unreachable
const s = (id: number, platform: SocialPlatform, url: string): SocialLink => ({
  id,
  platform,
  url,
  label: `NexGenCode on ${platformLabel(platform)}`,
  displayOrder: id,
  isActive: true,
});

export const fallbackSocialLinks: SocialLink[] = [
  s(1, 'linkedin', 'https://www.linkedin.com/company/your-company-page'),
  s(2, 'instagram', 'https://www.instagram.com/your-instagram-handle'),
  s(3, 'facebook', 'https://www.facebook.com/your-facebook-page'),
  s(4, 'twitter', 'https://x.com/your-x-handle'),
  s(5, 'youtube', 'https://www.youtube.com/@your-channel'),
];
