import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_OG_IMAGE, SITE_URL, absoluteUrl, formatTitle, getRouteJsonLd, getRouteSeo } from '../data/seo';

interface SeoOptions {
  /** Overrides the title from src/data/seo.ts */
  title?: string;
  description?: string;
  /** Page JSON-LD; defaults to getRouteJsonLd(pathname). Site-wide schema lives in index.html. */
  jsonLd?: object | object[];
  noindex?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Keeps <title>, description, canonical, Open Graph/Twitter tags and page JSON-LD in sync with the route.
 * Defaults come from src/data/seo.ts so the runtime tags match the prerendered HTML.
 */
export function useSeo({ title, description, jsonLd, noindex }: SeoOptions = {}) {
  const { pathname } = useLocation();
  const route = getRouteSeo(pathname);
  const finalTitle = formatTitle(title ?? route?.title ?? 'Page not found');
  const finalDescription = description ?? route?.description ?? '';
  const robots = noindex || !route ? 'noindex, follow' : 'index, follow, max-image-preview:large';
  const url = absoluteUrl(pathname);
  const blocks = jsonLd ?? getRouteJsonLd(pathname);
  const jsonLdString = (Array.isArray(blocks) ? blocks.length : blocks) ? JSON.stringify(blocks) : '';

  useEffect(() => {
    document.title = finalTitle;
    setMeta('name', 'description', finalDescription);
    setMeta('name', 'robots', robots);
    if (route?.keywords) setMeta('name', 'keywords', route.keywords.join(', '));
    setCanonical(url);

    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', finalDescription);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', `${SITE_URL}${DEFAULT_OG_IMAGE}`);
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', finalDescription);

    // Replace any page JSON-LD left by the prerendered HTML or the previous route
    document.head.querySelectorAll('script[data-seo="page"]').forEach((el) => el.remove());
    const script = document.createElement('script');
    if (jsonLdString) {
      script.type = 'application/ld+json';
      script.dataset.seo = 'page';
      script.textContent = jsonLdString;
      document.head.appendChild(script);
    }
    return () => script.remove();
  }, [finalTitle, finalDescription, robots, url, route, jsonLdString]);
}
