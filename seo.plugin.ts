import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  allRoutes,
  formatTitle,
  getRouteJsonLd,
  getRouteSeo,
  organizationJsonLd,
  validateSeo,
  websiteJsonLd,
  type RouteSeo,
} from './src/data/seo';

const START = '<!-- seo:start -->';
const END = '<!-- seo:end -->';
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Prevent "</script>" inside JSON from closing the tag
const jsonLd = (data: unknown, attrs = '') =>
  `<script type="application/ld+json"${attrs}>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

function renderHead(route: RouteSeo | undefined, path: string, noindex = false, fallbackTitle = 'Page not found') {
  const title = formatTitle(route?.title ?? fallbackTitle);
  const description = route?.description ?? '';
  const url = absoluteUrl(path);
  const image = `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  const pageLd = route ? getRouteJsonLd(path) : [];

  return [
    START,
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    route?.keywords ? `<meta name="keywords" content="${esc(route.keywords.join(', '))}" />` : '',
    `<meta name="robots" content="${noindex || !route ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${SITE_NAME} — Technology Solutions Built for Modern Businesses" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    jsonLd(organizationJsonLd),
    jsonLd(websiteJsonLd),
    pageLd.length ? jsonLd(pageLd, ' data-seo="page"') : '',
    END,
  ]
    .filter(Boolean)
    .join('\n    ');
}

function renderSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = allRoutes
    .map(
      (r) =>
        `  <url>\n    <loc>${absoluteUrl(r.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${r.changefreq ?? 'monthly'}</changefreq>\n    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const renderRobots = () => `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

/**
 * SEO plugin (client build only — skipped for the SSR build used by scripts/prerender.mjs):
 * - build start: validates titles (<= 65 chars), descriptions (<= 160 chars) and uniqueness via validateSeo()
 * - dev & build: injects the homepage meta tags + site-wide JSON-LD into index.html
 * - build: writes dist/<route>/index.html for every route with that route's title/description/canonical/
 *   OG/Twitter/JSON-LD, plus 404.html, the admin shell (admin/index.html, noindex), sitemap.xml and robots.txt.
 *   The page body (#root) is filled in afterwards by scripts/prerender.mjs.
 */
export default function seoPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'nexgencode-seo',
    configResolved(resolved) {
      config = resolved;
    },
    buildStart() {
      if (config.build.ssr) return;
      const problems = validateSeo();
      if (problems.length) this.error(`SEO validation failed (src/data/seo.ts):\n  - ${problems.join('\n  - ')}`);
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!html.includes(START)) throw new Error(`index.html is missing the ${START} ${END} markers`);
        return html.replace(SEO_BLOCK, renderHead(getRouteSeo('/'), '/'));
      },
    },
    closeBundle() {
      if (config.command !== 'build' || config.build.ssr) return;
      const outDir = resolve(config.root, config.build.outDir);
      const template = readFileSync(resolve(outDir, 'index.html'), 'utf8');
      const block = SEO_BLOCK;

      const write = (file: string, content: string) => {
        const target = resolve(outDir, file);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, content);
      };

      for (const route of allRoutes) {
        write(route.path === '/' ? 'index.html' : `${route.path.slice(1)}/index.html`, template.replace(block, renderHead(route, route.path)));
      }

      write('404.html', template.replace(block, renderHead(undefined, '/404', true)));
      // Admin panel shell: empty #root (client-rendered), never indexed. Served for /admin/* by Nginx.
      write('admin/index.html', template.replace(block, renderHead(undefined, '/admin', true, 'Admin Panel')));
      write('sitemap.xml', renderSitemap());
      write('robots.txt', renderRobots());

      config.logger.info(`
  seo: wrote ${allRoutes.length} route pages + 404.html, admin shell, sitemap.xml, robots.txt`);
    },
  };
}
