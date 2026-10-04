# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **NexGenCode** (nexgencode.in), an Indian software & digital-marketing company (office: Prayagraj), built as a Vite + React + TypeScript SPA, backed by an ASP.NET Core (.NET 10) Web API + SQL Server in [backend/NexGenCode.Api](backend/NexGenCode.Api) that powers the admin panel, team, reviews and contact enquiries. Contact channels (WhatsApp, email, phone, office) are real; team members and reviews are seeded with Indian dummy names (editable in the admin panel); portfolio and stats are still sample content — see "Before going live" in [README.md](README.md).

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server (Vite, default port 5173)
npm run build     # tsc -b → vite build (client) → vite build --ssr src/entry-server.tsx → node scripts/prerender.mjs
npm run preview   # preview the production build locally
npm run lint      # oxlint

# Backend (from backend/NexGenCode.Api) — needs appsettings.Development.json (copy the .example) and SQL Server
dotnet run --launch-profile http                 # API on http://localhost:5080; migrates + seeds on startup
dotnet ef migrations add <Name> -o Data/Migrations # after changing Models/ or AppDbContext
dotnet ef migrations script --idempotent -o ../database/NexGenCodeDb.sql  # refresh the manual SQL script
```

There is no test suite configured. When type-checking a single file, prefer `npx tsc --noEmit -p tsconfig.app.json` over the full `build` script if a full production build isn't needed.

## Architecture

**Routing**: `react-router-dom` with a `BrowserRouter` in [src/main.tsx](src/main.tsx). All routes are declared in [src/App.tsx](src/App.tsx) and wrapped in a single `Layout` (Navbar + page content + Footer + BackToTopButton + WhatsAppButton). There is no code-splitting/lazy-loading — every page is a plain top-level import.

**Services & detail pages**: 21 services live in [src/data/services.ts](src/data/services.ts), each assigned to one of four `serviceCategories` (business-software, development, design-marketing, infrastructure-support). [src/pages/Services.tsx](src/pages/Services.tsx) renders one section per category (`id={category.id}`) with a card per service (`id={service.slug}`); each card links to the detail template at `/services/:slug` ([src/pages/ServiceDetail.tsx](src/pages/ServiceDetail.tsx)), which renders `NotFound` for unknown slugs. Adding a service = adding an entry to `services` (plus its icon in `src/lib/icons.ts`); nav mega-menu, footer, home teaser (`featured: true`), contact-form dropdown and detail page all derive from it. Service CTAs link to `/contact?service=<slug>`, which pre-selects the service in the contact form.

**Hash-anchored navigation**: Category links point to `/services#<category-id>`. [ScrollToTop.tsx](src/components/layout/ScrollToTop.tsx) handles both plain route changes (scroll to top) and hash changes — it polls briefly for the anchor because the page-transition `AnimatePresence mode="wait"` mounts the new page only after the old one exits. Don't reintroduce a plain `window.scrollTo(0,0)`-only version or hash deep-links will break.

**SEO**: all route metadata (title, description, keywords, sitemap priority) and JSON-LD builders live in [src/data/seo.ts](src/data/seo.ts) — `SITE_URL` there is the canonical domain. Two consumers keep them in sync:
- Runtime: every page calls `useSeo()` ([src/hooks/useSeo.ts](src/hooks/useSeo.ts)), which updates `<title>`, description, robots, canonical, OG/Twitter tags and the page's `data-seo="page"` JSON-LD on client-side navigation. Routes missing from `allRoutes` get `noindex`.
- Build: [seo.plugin.ts](seo.plugin.ts) (registered in `vite.config.ts`) fills the `<!-- seo:start --><!-- seo:end -->` block in `index.html`, then after the build writes `dist/<route>/index.html` for every route (route-specific head + visually hidden crawlable h1/description/links inside `#root`, replaced when React mounts), plus `404.html`, `sitemap.xml` and `robots.txt`. A new page needs an entry in `staticRoutes` (services are added automatically) or it won't be prerendered/indexed. `src/data/seo.ts` and anything it imports must stay free of asset imports so Node can load it at build time. `public/og-image.png` (1200×630) is the share image.

**Prerendering (SSG)**: `npm run build` produces real HTML for every route. `seo.plugin.ts` writes `dist/<route>/index.html` (route-specific head, empty `#root`), plus `404.html`, the admin shell `admin/index.html`, `sitemap.xml` and `robots.txt`; then the SSR build of [src/entry-server.tsx](src/entry-server.tsx) (`renderToString` + `StaticRouter`) is run by [scripts/prerender.mjs](scripts/prerender.mjs) to fill each `#root` and tag it `data-prerendered="<url>"`. The build **fails** if any page doesn't have exactly one `<h1>`, or if a title exceeds 65 / a description exceeds 160 characters or is duplicated (`validateSeo()` in `src/data/seo.ts`). [src/main.tsx](src/main.tsx) hydrates only when `data-prerendered` equals the current path, otherwise client-renders (404 page, admin shell, `npm run dev`). Consequences for components: **never read `window`/`document`/`localStorage` during render or in `useState` initialisers** (only in effects/handlers), keep the first client render identical to the server render (API data via `useApiData` starts as a skeleton on both sides), and use `suppressHydrationWarning` for unavoidable differences (e.g. the footer year).

**Deployment**: production is a Hostinger VPS — Nginx serves the built `dist/` (copied to `/var/www/nexgencode.in/html` by [deploy/deploy.sh](deploy/deploy.sh)) with `try_files $uri $uri/index.html =404`, and proxies `/api` + `/uploads` to the .NET API on 127.0.0.1:5080 (systemd unit in `deploy/`). Config: [deploy/nginx/nexgencode.in.conf](deploy/nginx/nexgencode.in.conf). Never serve the site with `npm run dev`.

**Contact details**: email/phone/WhatsApp/office live in [src/data/contact.ts](src/data/contact.ts) (`whatsappLink(message?)` builds wa.me URLs) — don't hardcode them in components. Prefer `Link` from `react-router-dom` over `<a href>` for any in-app navigation (footer/nav), reserving plain `<a>` for `mailto:`, `tel:`, and external links.

**Currency**: this site targets an Indian audience — money amounts (e.g. the contact form's budget dropdown) are in INR (₹, Lakh notation), not USD.

**Page composition pattern**: Each file in `src/pages/` composes reusable section components from `src/components/sections/` in sequence (see [src/pages/Home.tsx](src/pages/Home.tsx) for the clearest example). Sections are self-contained — they pull their own data from `src/data/*.ts` rather than receiving it as props. To change what appears on a page, edit the composition in the page file; to change a section's content, edit its data source or the section component directly.

**Data layer**: Static content (services, portfolio projects, FAQs, process steps, stats, tech stack, nav links, legal copy) lives in typed data files under `src/data/`, typed against interfaces in [src/types/index.ts](src/types/index.ts). Components never hardcode this content inline. **Dynamic content comes from the API**: team members (`GET /api/team`) and approved reviews (`GET /api/reviews`) are loaded with `useApiData` ([src/hooks/useApiData.ts](src/hooks/useApiData.ts)), which shows a skeleton while loading and falls back to `src/data/team.ts` / `src/data/reviews.ts` if the API is unreachable — keep those fallbacks roughly in sync with the seed in `backend/NexGenCode.Api/Data/DbSeeder.cs`. All HTTP goes through `api()` in [src/lib/api.ts](src/lib/api.ts); use `assetUrl()` for image URLs returned by the API (`/uploads/...`). Dev: Vite proxies `/api` and `/uploads` to :5080; prod: `VITE_API_URL`.

**Styling**: Tailwind CSS v4, configured via CSS-first `@theme` in [src/index.css](src/index.css) (no `tailwind.config.js`). Custom design tokens (`brand` cyan scale, `accent` blue scale used in gradients, `navy` for the footer/admin sidebar, navy-tinted `ink` neutral scale — `ink-950` is the medium-navy page background, font families, marquee/float keyframes) are defined there — extend the theme by adding to that `@theme` block, not by adding a config file. The public site uses a medium-navy theme with cyan/blue accents (no light-mode toggle); the admin panel (`src/admin/`) is intentionally light (white cards on `ink-50`). The logo PNG is white, so `Logo` defaults to `tone="white"`; `tone="blue"` (`nexgencodelogo-blue.png`) is for light backgrounds such as the admin login. Helper classes there: `.text-gradient`, `.bg-grid`, `.bg-dots`, `.border-gradient` (gradient hairline card border). Cards use `border border-white/10 bg-ink-900/60` (hover `border-brand-400/30`); body text is `text-ink-300/400`, headings `text-white`. `Button` variants: `primary` (cyan→blue gradient, dark text), `secondary` (translucent white), `ghost`, and `light`/`outlineLight`.

**Icons**: `lucide-react` v1+, which no longer ships brand/logo icons (Twitter, Github, Linkedin, etc. are unavailable) — use generic icons instead. Where a service's icon is chosen dynamically by name (see [src/data/services.ts](src/data/services.ts) `icon` field), the string must have a corresponding entry in the map in [src/lib/icons.ts](src/lib/icons.ts).

**UI primitives**: `src/components/ui/` holds generic building blocks (`Button`/`LinkButton`/`AnchorButton` for external/tel/mailto, `Container`, `SectionHeading`, `PageHeader` with optional `actions` CTA slot, `ServiceCard`, `Logo`) reused across sections and pages. Prefer composing with these over ad-hoc markup when adding new sections.

**Contact form & reviews**: [ContactForm.tsx](src/components/sections/ContactForm.tsx) POSTs to `/api/contact` (saved as an enquiry, listed in Admin → Enquiries); [ReviewForm.tsx](src/components/sections/ReviewForm.tsx) POSTs to `/api/reviews` and the review stays hidden (`IsApproved=false`) until an admin enables it. Both include a hidden `website` honeypot field and are rate-limited server-side.

**Admin panel**: `src/admin/` (lazy-loaded from [App.tsx](src/App.tsx) for any `/admin*` path, rendered outside the public `Layout`). JWT auth (`auth.tsx`, token in localStorage; a 401 logs out), typed calls in `adminApi.ts`, shared UI (Modal, Toggle, toasts, confirm dialog, `ImageUpload`) in `ui.tsx`. Admin API routes are under `/api/admin/*` and require the `Admin` role. Default login is seeded from `Admin:DefaultUsername/DefaultPassword` only when no admin exists. `/admin` is `noindex` and disallowed in robots.txt.

**Motion/animation**: `framer-motion` is used throughout, not just on the homepage — treat any new page/section as expected to have entrance and interaction animation, consistent with the rest of the site.

- Reusable primitives live in `src/components/motion/`: `Reveal` (scroll-triggered fade-up for a single block — used internally by `SectionHeading`, so most sections get a heading animation for free) and `StaggerGroup`/`StaggerItem` (staggered entrance for grid/list children — pass extra motion props like `whileHover` straight through `StaggerItem`, they're forwarded to the underlying `motion.div`). Shared easing/variants/viewport constants are in [src/lib/motion.ts](src/lib/motion.ts) — reuse `easeOut`/`viewportOnce` rather than inlining new curves.
- Page transitions are handled once in [src/App.tsx](src/App.tsx) (`AnimatePresence` + `motion.div` keyed on `location.pathname`, wrapping `Routes`) — individual pages don't need their own mount transition.
- `PageHeader` and `Navbar` animate on mount (not `whileInView`) since they're always above the fold on first paint; everything below the fold uses `whileInView` with `viewport={{ once: true }}` so animations don't replay on scroll-back.
- The desktop nav active-link indicator and the Portfolio filter pill both use a shared `layoutId` (`motion.span` with `layoutId="nav-active-pill"` / `"portfolio-filter-pill"`) so the highlight slides between items instead of jumping — keep that pattern for any similar tab/pill UI.
- `Button`/`LinkButton` are `motion.button`/`motion.create(Link)` with `whileHover`/`whileTap` baked in — new buttons should go through these rather than raw `<button>`/`<Link>` to stay visually consistent.
- Framer Motion + spreading native HTML props onto a motion component needs the drag/animation event handlers omitted (see `NativeButtonProps` in [src/components/ui/Button.tsx](src/components/ui/Button.tsx)) — copy that `Omit<...>` pattern if you wrap another native element in `motion.*` and spread `...rest` onto it, otherwise `tsc` will fail on conflicting `onDrag*`/`onAnimation*` signatures.
