import { Container } from "@/components/ui/container";
import type { LegalDoc } from "@/lib/legal-content";

/**
 * Shared layout for the three legal documents. Paper canvas and a narrow
 * measure — these are read, not scanned, so line length is capped around 70
 * characters rather than filling the grid.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div data-canvas="paper">
      <Container className="py-32 lg:py-40">
        <article className="max-w-[68ch]">
          <h1 className="font-expanded text-display-lg font-extrabold text-balance">
            {doc.title}
          </h1>
          <p className="mt-6 text-body-lg text-on-paper-2">{doc.intro}</p>

          <div className="mt-16 space-y-12">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-expanded text-display-md font-extrabold text-balance">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((p, i) => (
                    <p key={i} className="text-body text-on-paper-2">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </Container>
    </div>
  );
}
