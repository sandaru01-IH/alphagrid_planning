import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EASE } from "../lib/motion";
import { useConsult } from "../state/consult";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const PIPELINE = [
  {
    step: "01",
    title: "Describe the parcel",
    body: "Site area, frontage, road width and density tier — the minimum geometry the regulations key off. A full GIS parcel-boundary import is on the platform roadmap; numeric entry is the validated path today.",
  },
  {
    step: "02",
    title: "Engine resolves the regime",
    body: "The deterministic engine looks up FAR, plot coverage, setbacks, height category and parking against tabulated UDA schedules — interpolating only where the source table requires it, and flagging every interpolation.",
  },
  {
    step: "03",
    title: "Scenarios converge",
    body: "Footprint, height category and setbacks are mutually dependent, so the engine iterates to a consistent answer for Conservative, Balanced and Maximum-Yield utilisation, rather than assuming one governs the others.",
  },
  {
    step: "04",
    title: "Explainable output renders",
    body: "Metrics, an animated 3D massing model, a 2D site plan, compliance flags and a scenario comparison table — every value tagged FACT / ASSUMPTION / ESTIMATE / INTERPRETED with its citation one click away.",
  },
];

const MODULES = [
  {
    name: "Regulation Engine",
    status: "Built & validated",
    desc: "FAR lookup with linear interpolation across plot-size bands, height-category resolution, coverage and setback tables, and parking formulas — 13 automated tests, including an invariant check that no generated scenario ever exceeds its own regulatory ceiling.",
  },
  {
    name: "Scenario Studio",
    status: "Built & validated",
    desc: "Conservative / Balanced / Maximum-Yield, independently converged. Switch scenarios and every dependent number — floors, GFA, units, parking, open space, compliance — recomputes from the same engine call.",
  },
  {
    name: "Animated Massing",
    status: "Built",
    desc: "An orbit-controllable 3D volume with real lighting and ground context, smoothly retargeting height and footprint on every input change or scenario switch — built for the parcel, not a generic placeholder box.",
  },
  {
    name: "Explainability Layer",
    status: "Built & validated",
    desc: "Confidence tagging on every figure, expandable citations back to the specific regulation schedule and clause, and two standing compliance caveats surfaced by default rather than buried in a footnote.",
  },
  {
    name: "Command Parser",
    status: "Built",
    desc: "A fixed-grammar parser — never a language model — maps phrases like \"maximum yield\" or \"12 apartments\" to real engine parameters. It can select what the engine already computed; it cannot invent a value.",
  },
  {
    name: "Investor Intelligence",
    status: "Built (estimates layer)",
    desc: "Translates achievable GFA into unit economics — indicative unit count, absorption assumptions and a feasibility-screening readout. Every figure here is labelled ESTIMATE until real cost and pricing data is supplied.",
  },
  {
    name: "Professional Workspace",
    status: "Built",
    desc: "Save parcels, run multiple assessments side-by-side, and export a citation-backed brief. Built for a planning consultant or in-house team fielding the same question across many sites.",
  },
  {
    name: "GIS Parcel Import",
    status: "Roadmap",
    desc: "Draw or upload a real parcel boundary and pull area, frontage and road classification automatically from cadastral and OSM layers, instead of numeric entry.",
  },
  {
    name: "Digitised Zoning Overlay",
    status: "Roadmap",
    desc: "Area-specific development-plan schedules (starting with a confirmed Panadura-specific table) layered over the general UDA regulation set the engine uses today.",
  },
  {
    name: "Financial Feasibility",
    status: "Roadmap",
    desc: "Full residual land value and IRR modelling once construction-cost and sale-price inputs are wired in, extending today's labelled-ESTIMATE investor readout into underwriting-grade output.",
  },
  {
    name: "Multi-parcel Portfolio",
    status: "Roadmap",
    desc: "Batch-assess an entire land bank or acquisition shortlist and rank by achievable yield, risk flags and time-to-approval likelihood.",
  },
  {
    name: "API & Integrations",
    status: "Roadmap",
    desc: "Programmatic access to the same engine for GIS platforms, CRM and underwriting tools — the engine's determinism is exactly what makes it safe to call from another system.",
  },
];

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  "Built & validated": { bg: "var(--ok-soft)", fg: "var(--ok)" },
  "Built": { bg: "var(--brand-soft)", fg: "var(--brand-ink)" },
  "Built (estimates layer)": { bg: "var(--gold-soft)", fg: "var(--gold-strong)" },
  "Roadmap": { bg: "var(--surface-sunken)", fg: "var(--ink-3)" },
};

export default function Product() {
  const { open } = useConsult();
  return (
    <div>
      <section className="px-6 pt-16 pb-14">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>
            The platform
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">From parcel to buildable answer</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--ink-2)" }}>
            AlphaGRID is a full development-intelligence system, not a single calculator — a regulation engine,
            a scenario studio, an animated visualiser, an investor layer and a professional workspace, all reading
            from the same validated source of truth.
          </p>
        </motion.div>
      </section>

      {/* PIPELINE */}
      <section className="px-6 py-16" style={{ background: "var(--surface-1)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            {PIPELINE.map((p, i) => (
              <motion.div
                key={p.step}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <span className="font-mono-data text-4xl font-bold" style={{ color: "var(--surface-2-border)" }}>
                  {p.step}
                </span>
                <h3 className="mt-3 text-base font-bold" style={{ color: "var(--ink-1)" }}>
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE MATRIX */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>
              System capability matrix
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">What's built, what's estimated, what's next</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed" style={{ color: "var(--ink-2)" }}>
              We say this plainly rather than let a demo blur the line: the regulation engine and scenario studio
              are validated and tested today; the investor layer is real but built on labelled estimates; the
              rest is an honest roadmap.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m, i) => {
              const s = STATUS_STYLE[m.status];
              return (
                <motion.div
                  key={m.name}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={{ delay: (i % 3) * 0.06 }}
                  className="rounded-2xl border p-6"
                  style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>
                      {m.name}
                    </h3>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{ background: s.bg, color: s.fg }}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                    {m.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-3xl border px-8 py-14 text-center"
          style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
        >
          <h2 className="text-2xl font-bold sm:text-3xl">See it work on your own parcel</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/platform"
              className="rounded-full px-6 py-3 text-sm font-semibold"
              style={{ background: "var(--brand)", color: "var(--surface-1)" }}
            >
              Launch the platform →
            </Link>
            <button
              onClick={() => open("Product page")}
              className="rounded-full px-6 py-3 text-sm font-semibold"
              style={{ border: "1px solid var(--line-strong)", color: "var(--ink-1)" }}
            >
              Get free consultancy
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
