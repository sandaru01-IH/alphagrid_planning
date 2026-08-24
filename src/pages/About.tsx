import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EASE } from "../lib/motion";
import { useConsult } from "../state/consult";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const PILLARS = [
  {
    title: "Explainable by design",
    body: "Every capacity figure carries a confidence tag and a citation trail. We never present an estimate as a fact — and we never invent a regulation value.",
  },
  {
    title: "Built for decisions",
    body: "Developers, investors and planning professionals get the same engine, shaped into the view each role actually needs before capital is committed.",
  },
  {
    title: "AI that assists, not invents",
    body: "Language guidance helps you move faster through the workflow. The regulation math stays deterministic — the model cannot rewrite FAR, setbacks or height.",
  },
];

export default function About() {
  const { open } = useConsult();

  return (
    <div>
      <section className="px-6 pb-16 pt-16 md:pt-24">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>
            About us
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            Planning intelligence with the confidence of a cited brief
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--ink-2)" }}>
            AlphaGRID is built by AlphaGRID (Pvt) Ltd to help landowners, developers and investors understand what
            a parcel can legally support — before design fees, before acquisition risk, before guesswork becomes
            a cost.
          </p>
        </motion.div>
      </section>

      <section className="px-6 py-16" style={{ background: "var(--surface-1)" }}>
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border p-7"
              style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-0)" }}
            >
              <h2 className="text-lg font-bold" style={{ color: "var(--ink-1)" }}>
                {p.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Our approach</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed" style={{ color: "var(--ink-2)" }}>
            <p>
              Development capacity is usually buried in gazettes, schedules and consultant worksheets. AlphaGRID
              digitises that logic into a live engine: parcel geometry in, regulated envelope out — with 3D
              massing, scenario comparison and map sketching so you can see the answer, not just read it.
            </p>
            <p>
              We started with a focused demonstration geography so every number could be validated against a known
              rule set. The product vision is broader: AI-enabled planning assistance for every step of the
              decision — always grounded in cited regulation.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/platform"
              className="rounded-full px-6 py-3 text-sm font-semibold"
              style={{ background: "var(--brand)", color: "var(--surface-1)" }}
            >
              Launch the platform →
            </Link>
            <button
              type="button"
              onClick={() => open("About page")}
              className="rounded-full px-6 py-3 text-sm font-semibold"
              style={{ border: "1px solid var(--line-strong)", color: "var(--ink-1)" }}
            >
              Talk to our team
            </button>
            <Link to="/contact" className="rounded-full px-6 py-3 text-sm font-semibold" style={{ color: "var(--brand)" }}>
              Contact us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
