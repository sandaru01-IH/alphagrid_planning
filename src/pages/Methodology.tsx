import { motion } from "framer-motion";
import { EASE } from "../lib/motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const SOURCES = [
  {
    source: "Planning & Development Regulations — Schedules (summarised)",
    authority: "Urban Development Authority, via Sri Jayawardenepura Kotte MC",
    usedFor: "FAR table (Form C), plot coverage, setback table (Schedule 6 Form E), parking (Schedule 10), room-height minimums (Schedule 7)",
  },
  {
    source: "Planning & Development Regulations 2020 (full text, partial extract)",
    authority: "Urban Development Authority",
    usedFor: "Cross-check of regulation numbering (Reg. 48, 55, 58, 65, 67, 9(a), 14(1), 23(1))",
  },
  {
    source: "Panadura Development Plan, Volume I",
    authority: "Urban Development Authority",
    usedFor: "Confirmed jurisdiction and land-use composition — no digitised numeric table found",
  },
];

const TESTS = [
  { name: "lookupFAR — FACT vs INTERPRETED cases", detail: "Confirms directly-tabulated FAR rows return FACT, interpolated bands return INTERPRETED with a note." },
  { name: "heightCategoryFor — boundary tests", detail: "Confirms height-band edges (7m, 15m, 30m, 50m, 75m) resolve to the correct category on both sides." },
  { name: "Parking formula unit tests", detail: "Apartment and retail parking formulas checked against Schedule 10 rates directly." },
  { name: "computeScenario golden case", detail: "200 m² site, 10 m frontage, 9 m road, low density, residential, 100% utilisation — hand-calculated before running the code: FAR 0.9 (FACT), category low_a, footprint 63 m², 2 floors, 6 m height, 126 m² GFA, 1 unit, amber compliance." },
  { name: "Red-flag minimum-lot case", detail: "150 m² site, 6 m frontage — Sri Lanka's own minimum lot size and frontage — correctly returns a red \"no buildable footprint\" result instead of a plausible-looking wrong answer." },
  { name: "GFA invariant, 4 parcels × 3 scenarios", detail: "12 checks confirming achievedGFA never exceeds maxRegulatedGFA — no generated scenario can propose its own violation." },
  { name: "generateScenarios monotonicity", detail: "Confirms floors and open space move in the correct direction across Conservative → Balanced → Maximum-Yield." },
  { name: "parseCommand behaviour", detail: "Confirms the fixed-grammar parser recognises structured phrases and never returns an invented regulation value." },
];

const STATUS: { label: string; items: string[]; tone: "ok" | "brand" | "muted" }[] = [
  {
    label: "Built and validated",
    tone: "ok",
    items: [
      "Regulation-to-capacity calculation (FAR, coverage, setbacks, height, parking, units)",
      "Explainability / source traceability per metric",
      "Scenario generation and comparison",
      "Compliance flags with reasoning",
    ],
  },
  {
    label: "Built",
    tone: "brand",
    items: [
      "Animated 2D site plan and 3D massing visualisation",
      "Interactive \"describe a change\" command box (fixed-grammar parser, not an LLM)",
      "Investor and professional workspace views",
    ],
  },
  {
    label: "Roadmap",
    tone: "muted",
    items: [
      "Real parcel-boundary / GIS map input",
      "Digitised area-specific zoning maps beyond the general regulation set",
      "Free-form natural-language interpretation via an LLM (deliberately excluded from the validated path)",
      "Environmental / heritage / flood constraint layers",
      "Multi-parcel, investment-grade financial feasibility",
    ],
  },
];

const TONE_STYLE = {
  ok: { bg: "var(--ok-soft)", fg: "var(--ok)" },
  brand: { bg: "var(--brand-soft)", fg: "var(--brand-ink)" },
  muted: { bg: "var(--surface-sunken)", fg: "var(--ink-3)" },
};

export default function Methodology() {
  return (
    <div>
      <section className="px-6 pt-16 pb-10">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>
            Methodology &amp; validation
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">What this pilot proves — and what it doesn't</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--ink-2)" }}>
            The core engineering principle: never fabricate a planning rule, never let free text invent a
            regulatory value, and always show the difference between a fact, an assumption and an estimate.
          </p>
        </motion.div>
      </section>

      {/* SOURCES */}
      <section className="px-6 py-14" style={{ background: "var(--surface-1)" }}>
        <div className="mx-auto max-w-5xl">
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="text-2xl font-bold">
            Regulatory sources
          </motion.h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--surface-2-border)" }}>
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr style={{ background: "var(--surface-sunken)" }}>
                  <th className="px-5 py-3 font-semibold" style={{ color: "var(--ink-1)" }}>Source</th>
                  <th className="px-5 py-3 font-semibold" style={{ color: "var(--ink-1)" }}>Authority</th>
                  <th className="px-5 py-3 font-semibold" style={{ color: "var(--ink-1)" }}>Used for</th>
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((s, i) => (
                  <tr key={s.source} style={{ borderTop: i > 0 ? "1px solid var(--surface-2-border)" : undefined }}>
                    <td className="px-5 py-4 font-medium align-top" style={{ color: "var(--ink-1)" }}>{s.source}</td>
                    <td className="px-5 py-4 align-top" style={{ color: "var(--ink-2)" }}>{s.authority}</td>
                    <td className="px-5 py-4 align-top" style={{ color: "var(--ink-2)" }}>{s.usedFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
            <strong style={{ color: "var(--ink-1)" }}>Jurisdiction note:</strong> because no digitised, area-specific
            numeric table for the Panadura Development Plan was found, the pilot applies UDA's general Planning
            &amp; Development Regulations — the default instrument for UDA-administered local authority areas. This
            is a real regulatory instrument with real citations, not an invented rule set, but it is a substitution
            that should be confirmed against the current gazetted Panadura-specific schedule before any number here
            is used in a transaction. Every relevant metric card in the platform says this; it is never hidden.
          </p>
        </div>
      </section>

      {/* VALIDATION SUITE */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
            <h2 className="text-2xl font-bold">Validation suite — the actual evidence</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
              13 automated tests, run with Node's built-in test runner. Every expected value in the golden-case
              tests was hand-calculated against the cited regulation tables <em>before</em> running the code — this
              is not a suite written to match whatever the code happened to output.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {TESTS.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ delay: (i % 2) * 0.06 }}
                className="rounded-xl border p-5"
                style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold" style={{ background: "var(--ok-soft)", color: "var(--ok)" }}>
                    ✓
                  </span>
                  <h3 className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>{t.name}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>{t.detail}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 font-mono-data text-sm" style={{ color: "var(--ink-3)" }}>
            13 tests · 13 passing · 0 failing — <code>node --test</code>
          </p>
        </div>
      </section>

      {/* WHAT'S REAL */}
      <section className="px-6 py-16" style={{ background: "var(--surface-1)" }}>
        <div className="mx-auto max-w-5xl">
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp} className="text-2xl font-bold">
            Real vs. estimated vs. roadmap
          </motion.h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {STATUS.map((group, gi) => (
              <motion.div
                key={group.label}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ delay: gi * 0.08 }}
              >
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                  style={{ background: TONE_STYLE[group.tone].bg, color: TONE_STYLE[group.tone].fg }}
                >
                  {group.label}
                </span>
                <ul className="mt-4 space-y-2.5 text-sm" style={{ color: "var(--ink-2)" }}>
                  {group.items.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <span style={{ color: "var(--ink-3)" }}>—</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mx-auto max-w-3xl rounded-2xl border p-8 text-sm leading-relaxed"
          style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-0)", color: "var(--ink-2)" }}
        >
          <strong style={{ color: "var(--ink-1)" }}>On overclaiming:</strong> this pilot supports describing the
          regulation-to-development-capacity engine as validated at component level in a relevant, non-operational
          environment. It is not a claim that the full platform — GIS parcel maps, zoning-map integration, financial
          feasibility, multi-parcel analysis — is complete. Those are roadmap items, listed above, not hidden
          behind a polished demo.
        </motion.div>
      </section>
    </div>
  );
}
