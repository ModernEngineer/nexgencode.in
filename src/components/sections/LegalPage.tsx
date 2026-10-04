import PageHeader from '../ui/PageHeader';
import Container from '../ui/Container';
import Reveal from '../motion/Reveal';

export interface LegalSection {
  heading: string;
  body: string[];
}

/** Shared layout for Privacy Policy / Terms pages: table of contents + numbered sections. */
export default function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={intro} />
      <section className="py-20">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <nav
              aria-label="On this page"
              className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">On this page</p>
              <ol className="mt-3 space-y-2 text-sm">
                {sections.map((s, i) => (
                  <li key={s.heading}>
                    <a href={`#${slug(s.heading)}`} className="text-ink-300 hover:text-white">
                      {i + 1}. {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <Reveal className="max-w-3xl">
            <p className="text-sm text-ink-400">Last updated: {updated}</p>
            {sections.map((s, i) => (
              <div
                key={s.heading}
                id={slug(s.heading)}
                className="scroll-mt-28 border-b border-white/5 py-8 last:border-0"
              >
                <h2 className="font-display text-xl font-semibold text-white">
                  {i + 1}. {s.heading}
                </h2>
                {s.body.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-3 leading-relaxed text-ink-300">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </Reveal>
        </Container>
      </section>
    </>
  );
}
