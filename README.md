# nexgencode.in — Company Website

Marketing website for **LogicMitra**, a software engineering company. Built with React, TypeScript, Vite and Tailwind CSS.

## Pages

- `/` — Home (hero, stats, services, process, tech stack, featured projects, testimonials, CTA)
- `/about` — Company story, mission/vision/values, team
- `/services` — Detailed service breakdown + FAQ
- `/portfolio` — Filterable project showcase
- `/careers` — Perks and open job listings
- `/contact` — Contact form with client-side validation

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
npm run lint      # run oxlint
```

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for tooling
- [React Router](https://reactrouter.com/) for client-side routing
- [Tailwind CSS v4](https://tailwindcss.com/) for styling (config lives in `src/index.css` via `@theme`)
- [Framer Motion](https://www.framer.com/motion/) for entrance animations
- [Lucide](https://lucide.dev/) for icons

## Contact channels

- **WhatsApp** — a floating "click to chat" button ([WhatsAppButton.tsx](src/components/layout/WhatsAppButton.tsx)) opens a chat to `+91 95540 58799` with a pre-filled message. Update `WHATSAPP_NUMBER` there if the number changes.
- **Email / phone** — clickable `mailto:`/`tel:` links in the footer and on `/contact`, currently `info@nexgencode.com` and `+91 94501 90953`.
- **Office** — Prayagraj, India.
- **Budget ranges** on the contact form are in INR (₹ Lakh).

## Backend API & admin panel

The website reads team members and client reviews from, and saves contact-form enquiries to, an ASP.NET Core (.NET 10) Web API with a SQL Server database. The API lives in [backend/NexGenCode.Api](backend/NexGenCode.Api).

### Run locally

1. **Database:** SQL Server 2022 or newer (Express is fine). The default connection string in `backend/NexGenCode.Api/appsettings.json` points to `localhost\SQLEXPRESS` with Windows authentication and a database named `NexGenCodeDb`. Change it if your instance is different.
2. **Local settings:** copy `backend/NexGenCode.Api/appsettings.Development.example.json` to `appsettings.Development.json`, and set `Jwt:Key` to a random string of 32+ characters.
3. **Start the API** (creates the database, applies migrations and seeds sample data on first run):
   ```bash
   cd backend/NexGenCode.Api
   dotnet run --launch-profile http     # http://localhost:5080
   ```
4. **Start the website** in another terminal: `npm run dev`. Vite proxies `/api` and `/uploads` to the API.

To create the database by hand instead, run [backend/database/NexGenCodeDb.sql](backend/database/NexGenCodeDb.sql) in SSMS. It is an idempotent script generated from the EF Core migrations.

### Admin panel

Open **http://localhost:5173/admin/login**, or use the **Admin Login** link in the footer.

- Default login: `admin` / `Admin@12345`. **Change it right away** in Admin → Settings.
- **Enquiries** — every contact-form submission, with status (New / In progress / Closed), internal notes, reply links and CSV export.
- **Client Reviews** — reviews submitted on the website arrive as *Pending*. Only reviews switched to **Show on website** appear on the site, with their star rating. You can also add, edit, feature or delete reviews.
- **Core Team** — full control of the "Meet Our Core Team" page: add, edit, photo upload, title, bio, order, show/hide and delete.
- **Portfolio** — add/edit/delete projects: screenshot, title, category (drives the filter buttons), description, tag chips, live link (opens in a new tab), card colour, order, show/hide and "show on homepage".

### Production

- Set `ConnectionStrings__Default`, `Jwt__Key` (32+ random characters) and `Admin__DefaultPassword` (used only to create the first admin) as environment variables on the API server, and list your site's URL in `Cors:AllowedOrigins`.
- Build the website with `VITE_API_URL=https://<your-api-domain>` (see `.env.example`).
- Uploaded images are stored in `backend/NexGenCode.Api/wwwroot/uploads` — keep that folder on persistent storage and back it up with the database.

## Before going live

Some content is still sample/placeholder and should be replaced:

- **Team members & client reviews** — sample Indian names seeded into the database. Edit or replace them from the admin panel.
- **Portfolio** — sample projects seeded into the database; replace them from Admin → Portfolio
- **Stats** — sample numbers in `src/data/process.ts`
- **Legal pages** — the Privacy Policy and Terms (`src/data/legal.ts`) are templates; have them reviewed

See [CLAUDE.md](CLAUDE.md) for a fuller architecture overview.
