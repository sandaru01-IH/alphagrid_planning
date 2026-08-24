import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { EASE } from "../lib/motion";
import { useConsult } from "../state/consult";
import LiveMetricPreview from "../components/LiveMetricPreview";
import RotatingHeadline, { type HeadlinePhrase } from "../components/RotatingHeadline";
import HeroVideoBackground from "../components/HeroVideoBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const HEADLINES: HeadlinePhrase[] = [
  {
    id: "legally",
    before: "Know what a parcel can ",
    highlight: "legally become",
    after: " — before you spend a rupee on design.",
  },
  {
    id: "clarity",
    before: "Turn planning rules into ",
    highlight: "buildable clarity",
    after: " — in minutes, not months.",
  },
  {
    id: "confidence",
    before: "Move from speculation to ",
    highlight: "cited confidence",
    after: " — every number labelled, every limit explained.",
  },
  {
    id: "ai",
    before: "AI-enabled planning assistance for ",
    highlight: "every step",
    after: " — from sketch to capacity to brief.",
  },
];

const HOLD_MS = 4800;

const CAPABILITIES = [
  {
    title: "Parcel intelligence",
    body: "Enter a site's area, frontage and road width — or draw the boundary on the map — and get the FAR, coverage, setback and height regime that governs it.",
  },
  {
    title: "Scenario generation",
    body: "Conservative, Balanced and Maximum-Yield scenarios are generated automatically, each independently converging footprint, floor count and height against the same regulatory ceiling — never assumed, always computed.",
  },
  {
    title: "Explainability engine",
    body: "Every figure on screen carries a tag — FACT, ASSUMPTION, ESTIMATE or INTERPRETED — and a citation you can expand. Nothing is presented with more certainty than the source data supports.",
  },
  {
    title: "Animated massing studio",
    body: "An orbit-controllable 3D volume renders the achievable building envelope in real time, smoothly retargeting height, footprint and setbacks as you switch scenarios or edit inputs — not a static render.",
  },
  {
    title: "Compliance flagging",
    body: "Amber and red flags surface jurisdiction caveats, discretionary review triggers, and — critically — parcels that cannot legally support their target floor area, before a single design hour is spent.",
  },
  {
    title: "Investor intelligence layer",
    body: "A yield-oriented view translating achievable GFA into unit mix, indicative absorption and a feasibility-screening readout for acquisition and portfolio decisions — labelled ESTIMATE until you supply real costs.",
  },
  {
    title: "Professional workspace",
    body: "Save parcels, compare scenarios side-by-side, annotate assumptions and export a citation-backed PDF brief your planning consultant or bank can act on directly.",
  },
  {
    title: "Command-driven editing",
    body: "Describe a change in plain language — \"maximum yield\", \"12 apartments\" — and a fixed-grammar parser maps it to real parameters. It can only select what the engine already computed; it can never invent a regulation.",
  },
];

const MODES = [
  {
    id: "Developer",
    headline: "Test buildability before you commission a design",
    points: ["Instant FAR, coverage & setback readout", "3-scenario capacity comparison", "Animated massing for any parcel"],
  },
  {
    id: "Investor",
    headline: "Screen deals on regulation, not gut feel",
    points: ["Achievable GFA → unit count → indicative yield", "Portfolio-ready comparison exports", "Every estimate labelled, nothing hidden"],
  },
  {
    id: "Professional",
    headline: "Give clients a citation-backed answer in minutes",
    points: ["Client-ready PDF briefs", "Full regulation citation trail", "Multi-parcel project workspaces"],
  },
];

export default function Home() {
  const { open } = useConsult();
  const [headlineIdx, setHeadlineIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeadlineIdx((i) => (i + 1) % HEADLINES.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden px-6 pt-16 pb-24 md:pt-24">
        <HeroVideoBackground />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-[0.10] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--brand), transparent 65%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 left-[-15%] h-[420px] w-[420px] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 65%)" }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="min-w-0">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "var(--brand-soft)", color: "var(--brand-ink)" }}
            >
              AI-enabled planning assistance
            </span>

            <RotatingHeadline
              phrases={HEADLINES}
              activeIndex={headlineIdx}
              className="text-[1.75rem] font-extrabold leading-[1.18] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.14]"
            />

            <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--ink-2)" }}>
              AlphaGRID converts planning regulations, your parcel's geometry, and your intent into a
              cited, explainable development-capacity assessment — with map sketching, animated 3D massing,
              and guidance at every step.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/platform"
                className="rounded-full px-6 py-3.5 text-sm font-semibold shadow-lg transition hover:brightness-105"
                style={{ background: "var(--brand)", color: "var(--surface-1)" }}
              >
                Launch the platform →
              </Link>
              <button
                onClick={() => open("Homepage hero")}
                className="rounded-full px-6 py-3.5 text-sm font-semibold"
                style={{ border: "1px solid var(--line-strong)", color: "var(--ink-1)" }}
              >
                Get free consultancy
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm" style={{ color: "var(--ink-2)" }}>
              <HeroPoint>AI guidance from first sketch to final brief</HeroPoint>
              <HeroPoint>Draw your land on a live map</HeroPoint>
              <HeroPoint>Cited capacity — never a black box</HeroPoint>
            </div>
            <div className="mt-5 flex gap-1.5" role="tablist" aria-label="Headline phrases">
              {HEADLINES.map((h, i) => (
                <button
                  key={h.id}
                  type="button"
                  role="tab"
                  aria-selected={i === headlineIdx}
                  onClick={() => setHeadlineIdx(i)}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === headlineIdx ? 22 : 8,
                    background: i === headlineIdx ? "var(--brand)" : "var(--line-strong)",
                  }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="min-w-0 lg:max-w-[520px] lg:justify-self-end"
          >
            <LiveMetricPreview />
          </motion.div>
        </div>
      </section>

      <section className="border-y px-6 py-10" style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <p className="text-sm font-medium" style={{ color: "var(--ink-3)" }}>
            Grounded in cited, gazetted regulation — not invented rules
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm font-semibold" style={{ color: "var(--ink-2)" }}>
            <span>UDA Planning &amp; Development Regulations</span>
            <span>Schedule 6 — Setbacks</span>
            <span>Schedule 10 — Parking</span>
            <span>Form C — FAR Table</span>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>
              What the platform does
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">One engine. Three ways to use it.</h2>
            <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--ink-2)" }}>
              Everything below runs on the same deterministic engine — no step lets a language model invent a
              regulation value.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ delay: (i % 4) * 0.06 }}
                className="rounded-2xl border p-6"
                style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
              >
                <div
                  className="mb-4 grid h-9 w-9 place-items-center rounded-lg text-sm font-bold"
                  style={{ background: "var(--brand-soft)", color: "var(--brand-ink)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-bold" style={{ color: "var(--ink-1)" }}>
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  {c.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24" style={{ background: "var(--surface-1)" }}>
        <div className="mx-auto max-w-7xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>
              Built for how you actually work
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Three modes, one source of truth</h2>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {MODES.map((m, i) => (
              <motion.div
                key={m.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col rounded-2xl border p-7"
                style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-0)" }}
              >
                <span
                  className="w-fit rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: "var(--deep-soft)", color: "var(--deep)" }}
                >
                  {m.id}
                </span>
                <h3 className="mt-4 text-lg font-bold leading-snug" style={{ color: "var(--ink-1)" }}>
                  {m.headline}
                </h3>
                <ul className="mt-4 flex-1 space-y-2.5 text-sm" style={{ color: "var(--ink-2)" }}>
                  {m.points.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <span style={{ color: "var(--brand)" }}>—</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link to="/platform" className="mt-6 text-sm font-semibold" style={{ color: "var(--brand)" }}>
                  Open in {m.id.toLowerCase()} mode →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl border px-8 py-16 text-center"
          style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
        >
          <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
            Bring us your parcel. We'll show you what the regulations actually allow.
          </h2>
          <p className="max-w-lg text-base" style={{ color: "var(--ink-2)" }}>
            Free, no-commitment 30-minute session with an AlphaGRID planning analyst.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => open("CTA section")}
              className="rounded-full px-7 py-3.5 text-sm font-semibold shadow-lg"
              style={{ background: "var(--gold)", color: "#221604" }}
            >
              Get free consultancy
            </button>
            <Link
              to="/platform"
              className="rounded-full px-7 py-3.5 text-sm font-semibold"
              style={{ border: "1px solid var(--line-strong)", color: "var(--ink-1)" }}
            >
              Explore the platform
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

function HeroPoint({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold"
        style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
      >
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}
