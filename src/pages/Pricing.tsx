import { useState } from "react";
import { EASE } from "../lib/motion";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useConsult } from "../state/consult";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

type Billing = "monthly" | "annual";

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For a single site you're deciding on right now",
    monthly: 0,
    annual: 0,
    priceNote: "3 free assessments, then $39 per assessment",
    cta: "Start free",
    highlight: false,
    features: [
      "Full scenario studio (Conservative / Balanced / Maximum-Yield)",
      "Animated 3D massing for each assessment",
      "Confidence-tagged metrics with citations",
      "PDF export, watermarked",
      "Panadura pilot zone only",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "For consultants and small development teams",
    monthly: 149,
    annual: 119,
    priceNote: "per seat / month, billed " ,
    cta: "Start 14-day trial",
    highlight: true,
    features: [
      "Everything in Starter",
      "Unlimited assessments",
      "Saved parcels & project workspaces",
      "Side-by-side scenario & parcel comparison",
      "Client-ready PDF export, no watermark",
      "Command-driven editing (\"maximum yield\", \"12 apartments\")",
      "Priority email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For developers, investors and institutions operating at scale",
    monthly: null,
    annual: null,
    priceNote: "custom, based on portfolio size",
    cta: "Talk to sales",
    highlight: false,
    features: [
      "Everything in Professional",
      "Investor intelligence layer with custom cost/pricing inputs",
      "Multi-parcel portfolio screening (roadmap access)",
      "API access for internal tools & GIS platforms (roadmap access)",
      "Dedicated planning analyst",
      "Custom SLA & onboarding",
      "White-label report branding",
    ],
  },
];

const FAQ = [
  {
    q: "Why is Starter free for the first three assessments?",
    a: "We'd rather you see the engine reason through a real regulation table — citations, interpolation flags and all — before you pay for anything. If the output doesn't hold up to your own reading of the regulations, we want to know.",
  },
  {
    q: "What happens outside the Panadura pilot zone?",
    a: "Today the engine applies the general UDA Planning & Development Regulations, which govern any UDA-administered local authority area — so assessments run anywhere that jurisdiction applies, with the same jurisdiction caveat shown for Panadura. Confirmed area-specific schedules for additional zones are added as they're digitised; Professional and Enterprise customers are notified as new zones go live.",
  },
  {
    q: "Is the investor / feasibility output audit-grade?",
    a: "Not yet, and we say so on every card: yield and unit-economics figures are labelled ESTIMATE and derived from your own cost and pricing inputs on the Enterprise tier. Treat it as a fast, transparent screen — not a substitute for a quantity surveyor or a formal appraisal.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Professional is month-to-month with no lock-in; annual billing is a discount, not a commitment trap — we'll prorate a refund for unused months if you cancel.",
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("annual");
  const { open } = useConsult();

  return (
    <div>
      <section className="px-6 pt-16 pb-10 text-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Priced for how you'll actually use it</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg" style={{ color: "var(--ink-2)" }}>
            Screen one parcel for free. Scale to a whole portfolio when you're ready.
          </p>
        </motion.div>

        <div className="mt-8 inline-flex items-center gap-1 rounded-full p-1" style={{ background: "var(--surface-sunken)" }}>
          {(["monthly", "annual"] as Billing[]).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className="rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition"
              style={{
                background: billing === b ? "var(--surface-1)" : "transparent",
                color: billing === b ? "var(--ink-1)" : "var(--ink-3)",
              }}
            >
              {b === "annual" ? "Annual · save 20%" : "Monthly"}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col rounded-3xl border p-8"
              style={{
                borderColor: t.highlight ? "var(--brand)" : "var(--surface-2-border)",
                background: "var(--surface-1)",
                boxShadow: t.highlight ? "0 20px 45px -20px rgba(20,135,123,0.35)" : "none",
              }}
            >
              {t.highlight && (
                <span
                  className="mb-4 w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                  style={{ background: "var(--brand)", color: "var(--surface-1)" }}
                >
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold" style={{ color: "var(--ink-1)" }}>
                {t.name}
              </h3>
              <p className="mt-1 text-sm" style={{ color: "var(--ink-2)" }}>
                {t.tagline}
              </p>

              <div className="mt-6">
                {t.monthly === null ? (
                  <p className="text-3xl font-extrabold" style={{ color: "var(--ink-1)" }}>
                    Custom
                  </p>
                ) : (
                  <p className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold" style={{ color: "var(--ink-1)" }}>
                      ${billing === "annual" ? t.annual : t.monthly}
                    </span>
                    {t.monthly > 0 && (
                      <span className="text-sm" style={{ color: "var(--ink-3)" }}>
                        /mo
                      </span>
                    )}
                  </p>
                )}
                <p className="mt-1 text-xs" style={{ color: "var(--ink-3)" }}>
                  {t.priceNote}
                  {t.monthly !== null && t.monthly > 0 ? (billing === "annual" ? "annually" : "monthly") : ""}
                </p>
              </div>

              <button
                onClick={() => (t.id === "enterprise" ? open("Enterprise pricing") : undefined)}
                className="mt-6 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition hover:brightness-105"
                style={
                  t.highlight
                    ? { background: "var(--brand)", color: "var(--surface-1)" }
                    : { border: "1px solid var(--line-strong)", color: "var(--ink-1)" }
                }
              >
                {t.id === "enterprise" ? (
                  t.cta
                ) : (
                  <Link to="/platform" style={{ color: "inherit" }}>
                    {t.cta}
                  </Link>
                )}
              </button>

              <ul className="mt-7 space-y-3 border-t pt-7 text-sm" style={{ borderColor: "var(--surface-2-border)", color: "var(--ink-2)" }}>
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="mt-0.5 shrink-0" style={{ color: "var(--brand)" }}>
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="text-center text-2xl font-bold sm:text-3xl"
          >
            Questions worth asking before you buy
          </motion.h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((item, i) => (
              <motion.details
                key={item.q}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border p-5"
                style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
              >
                <summary className="cursor-pointer list-none text-sm font-semibold" style={{ color: "var(--ink-1)" }}>
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  {item.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
