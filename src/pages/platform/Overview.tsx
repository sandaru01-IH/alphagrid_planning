import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Engine from "../../lib/engine";
import { SAVED_PARCELS, useAssessment } from "../../state/assessment";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Overview() {
  const loadParcel = useAssessment((s) => s.loadParcel);

  return (
    <div className="space-y-8 pb-16">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--brand)" }}>
          Workspace
        </p>
        <h1 className="mt-1 text-2xl font-bold" style={{ color: "var(--ink-1)" }}>
          Good to see you back
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--ink-2)" }}>
          Three saved parcels in the Panadura pilot zone. Pick one up where you left off, or start a fresh
          assessment.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SAVED_PARCELS.map((p, i) => {
          const balanced = Engine.computeScenario(
            { siteAreaM2: p.siteAreaM2, frontageM: p.frontageM, roadWidthM: p.roadWidthM, density: p.density },
            { type: p.programType },
            0.85
          );
          return (
            <motion.div
              key={p.id}
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col rounded-2xl border p-6"
              style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
            >
              <p className="text-xs font-semibold" style={{ color: "var(--ink-3)" }}>
                {p.name.split("—")[0].trim()}
              </p>
              <h3 className="mt-0.5 text-base font-bold" style={{ color: "var(--ink-1)" }}>
                {p.name.split("—")[1]?.trim()}
              </h3>
              <div className="mt-4 flex gap-4 text-xs" style={{ color: "var(--ink-2)" }}>
                <span>{p.siteAreaM2} m²</span>
                <span>{p.frontageM}m frontage</span>
                <span className="capitalize">{p.density} density</span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4 text-center" style={{ borderColor: "var(--surface-2-border)" }}>
                <div>
                  <p className="font-mono-data text-lg font-bold" style={{ color: "var(--ink-1)" }}>
                    {balanced.floors}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--ink-3)" }}>
                    floors
                  </p>
                </div>
                <div>
                  <p className="font-mono-data text-lg font-bold" style={{ color: "var(--ink-1)" }}>
                    {balanced.achievedGFA}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--ink-3)" }}>
                    m² GFA
                  </p>
                </div>
                <div>
                  <p
                    className="font-mono-data text-lg font-bold"
                    style={{ color: balanced.complianceLevel === "red" ? "var(--crit)" : "var(--ok)" }}
                  >
                    {balanced.complianceLevel === "red" ? "✕" : "✓"}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--ink-3)" }}>
                    compliant
                  </p>
                </div>
              </div>

              <Link
                to="/platform/assessment"
                onClick={() => loadParcel(p)}
                className="mt-5 rounded-lg py-2 text-center text-sm font-semibold"
                style={{ background: "var(--brand-soft)", color: "var(--brand-ink)" }}
              >
                Open assessment →
              </Link>
            </motion.div>
          );
        })}

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.18 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center"
          style={{ borderColor: "var(--line-strong)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>
            New parcel
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--ink-3)" }}>
            Enter your own site geometry
          </p>
          <Link
            to="/platform/assessment"
            className="mt-4 rounded-full px-4 py-2 text-sm font-semibold"
            style={{ background: "var(--brand)", color: "var(--surface-1)" }}
          >
            Start assessment →
          </Link>
        </motion.div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <ModeCard
          to="/platform/assessment"
          title="Developer mode"
          body="Regulation-to-capacity assessment with animated massing and a scenario comparison table."
        />
        <ModeCard
          to="/platform/investor"
          title="Investor mode"
          body="Turn achievable GFA into indicative unit economics — every number labelled ESTIMATE until you supply real costs."
        />
        <ModeCard
          to="/platform/reports"
          title="Reports"
          body="Export a citation-backed brief you can hand to a client, lender or planning consultant."
        />
      </div>
    </div>
  );
}

function ModeCard({ to, title, body }: { to: string; title: string; body: string }) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border p-6 transition hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
    >
      <h3 className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
        {body}
      </p>
    </Link>
  );
}
