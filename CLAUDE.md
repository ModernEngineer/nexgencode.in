# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **LogicMitra**, an Indian software engineering company (office: Prayagraj), built as a Vite + React + TypeScript SPA. Contact channels (WhatsApp, email, phone, office) are real; team, testimonials, portfolio and stats are still placeholder/sample content — see the "Before going live" section of [README.md](README.md) for what to replace before deployment.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server (Vite, default port 5173)
npm run build     # type-check via `tsc -b`, then production build via `vite build`
npm run preview   # preview the production build locally
npm run lint      # oxlint
```

There is no test suite configured. When type-checking a single file, prefer `npx tsc --noEmit -p tsconfig.app.json` over the full `build` script if a full production build isn't needed.

## Architecture

**Routing**: `react-router-dom` with a `BrowserRouter` in [src/main.tsx](src/main.tsx). All routes are declared in [src/App.tsx](src/App.tsx) and wrapped in a single `Layout` (Navbar + page content + Footer + BackToTopButton + WhatsAppButton). There is no code-splitting/lazy-loading — every page is a plain top-level import.

**Hash-anchored navigation**: Footer service links point to `/services#<slug>` (matching the `id={service.slug}` on each service block in [src/pages/Services.tsx](src/pages/Services.tsx)). [ScrollToTop.tsx](src/components/layout/ScrollToTop.tsx) handles both plain route changes (scroll to top) and hash changes (scroll the matching element into view) — don't reintroduce a plain `window.scrollTo(0,0)`-only version or hash deep-links will break. Prefer `Link` from `react-router-dom` over `<a href>` for any in-app navigation (footer/nav), reserving plain `<a>` for `mailto:`, `tel:`, and external links.

**Currency**: this site targets an Indian audience — money amounts (e.g. the contact form's budget dropdown) are in INR (₹, Lakh notation), not USD.

**Page composition pattern**: Each file in `src/pages/` composes reusable section components from `src/components/sections/` in sequence (see [src/pages/Home.tsx](src/pages/Home.tsx) for the clearest example). Sections are self-contained — they pull their own data from `src/data/*.ts` rather than receiving it as props. To change what appears on a page, edit the composition in the page file; to change a section's content, edit its data source or the section component directly.

**Data layer**: All editable content (services, portfolio projects, testimonials, team bios, FAQs, process steps, stats, job openings, nav links) lives in typed data files under `src/data/`, typed against interfaces in [src/types/index.ts](src/types/index.ts). Components never hardcode this content inline — always add/edit content in the corresponding `src/data/*.ts` file.

**Styling**: Tailwind CSS v4, configured via CSS-first `@theme` in [src/index.css](src/index.css) (no `tailwind.config.js`). Custom design tokens (brand color scale, ink/dark neutral scale, font families, marquee/float keyframes) are defined there — extend the theme by adding to that `@theme` block, not by adding a config file. The site is dark-themed only (no light mode toggle).

**Icons**: `lucide-react` v1+, which no longer ships brand/logo icons (Twitter, Github, Linkedin, etc. are unavailable) — use generic icons instead. Where a service's icon is chosen dynamically by name (see [src/data/services.ts](src/data/services.ts) `icon` field), the string must have a corresponding entry in the map in [src/lib/icons.ts](src/lib/icons.ts).

**UI primitives**: `src/components/ui/` holds generic building blocks (`Button`/`LinkButton`, `Container`, `SectionHeading`, `PageHeader`, `Logo`) reused across sections and pages. Prefer composing with these over ad-hoc markup when adding new sections.

**Contact form**: [src/components/sections/ContactForm.tsx](src/components/sections/ContactForm.tsx) does client-side validation and simulates submission with a `setTimeout` — there is no backend wired up. A real submit handler (API route, serverless function, or form service) needs to replace the simulated one before launch.

**Motion/animation**: `framer-motion` is used throughout, not just on the homepage — treat any new page/section as expected to have entrance and interaction animation, consistent with the rest of the site.

- Reusable primitives live in `src/components/motion/`: `Reveal` (scroll-triggered fade-up for a single block — used internally by `SectionHeading`, so most sections get a heading animation for free) and `StaggerGroup`/`StaggerItem` (staggered entrance for grid/list children — pass extra motion props like `whileHover` straight through `StaggerItem`, they're forwarded to the underlying `motion.div`). Shared easing/variants/viewport constants are in [src/lib/motion.ts](src/lib/motion.ts) — reuse `easeOut`/`viewportOnce` rather than inlining new curves.
- Page transitions are handled once in [src/App.tsx](src/App.tsx) (`AnimatePresence` + `motion.div` keyed on `location.pathname`, wrapping `Routes`) — individual pages don't need their own mount transition.
- `PageHeader` and `Navbar` animate on mount (not `whileInView`) since they're always above the fold on first paint; everything below the fold uses `whileInView` with `viewport={{ once: true }}` so animations don't replay on scroll-back.
- The desktop nav active-link indicator and the Portfolio filter pill both use a shared `layoutId` (`motion.span` with `layoutId="nav-active-pill"` / `"portfolio-filter-pill"`) so the highlight slides between items instead of jumping — keep that pattern for any similar tab/pill UI.
- `Button`/`LinkButton` are `motion.button`/`motion(Link)` with `whileHover`/`whileTap` baked in — new buttons should go through these rather than raw `<button>`/`<Link>` to stay visually consistent.
- Framer Motion + spreading native HTML props onto a motion component needs the drag/animation event handlers omitted (see `NativeButtonProps` in [src/components/ui/Button.tsx](src/components/ui/Button.tsx)) — copy that `Omit<...>` pattern if you wrap another native element in `motion.*` and spread `...rest` onto it, otherwise `tsc` will fail on conflicting `onDrag*`/`onAnimation*` signatures.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
