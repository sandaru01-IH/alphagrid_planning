import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Engine from "../lib/engine";
import type { ScenarioId } from "../state/assessment";

const SCENARIOS: { id: ScenarioId; label: string }[] = [
  { id: "conservative", label: "Conservative" },
  { id: "balanced", label: "Balanced" },
  { id: "maximum_yield", label: "Max yield" },
];

export default function LiveMetricPreview() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("balanced");

  const scenarios = useMemo(
    () =>
      Engine.generateScenarios(
        { siteAreaM2: 950, frontageM: 22, roadWidthM: 12, density: "medium" },
        { type: "mixed_use" }
      ),
    []
  );
  const active = scenarios.find((s) => s.scenarioId === scenarioId) ?? scenarios[0];
  const maxHeight = Math.max(...scenarios.map((s) => s.heightM), 1);

  return (
    <div
      className="relative rounded-3xl border p-6 shadow-2xl"
      style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--ink-3)" }}>
            Sample coastal frontage
          </p>
          <p className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>
            950 m² · mixed use
          </p>
        </div>
        <div className="flex gap-1 rounded-full p-1" style={{ background: "var(--surface-sunken)" }}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold transition"
              style={{
                background: scenarioId === s.id ? "var(--surface-1)" : "transparent",
                color: scenarioId === s.id ? "var(--ink-1)" : "var(--ink-3)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-end gap-6">
        <div className="flex flex-1 gap-3">
          {scenarios.map((s) => (
            <div key={s.scenarioId} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end">
                <motion.div
                  className="w-full rounded-t-md"
                  style={{
                    background: s.scenarioId === scenarioId ? "var(--brand)" : "var(--surface-2-border)",
                  }}
                  initial={false}
                  animate={{ height: `${Math.max(6, (s.heightM / maxHeight) * 100)}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
              </div>
              <span className="font-mono-data text-[10px]" style={{ color: "var(--ink-3)" }}>
                {s.heightM}m
              </span>
            </div>
          ))}
        </div>
        <div className="w-32 shrink-0 space-y-3">
          <MiniMetric label="Floors" value={active.floors} tag="ESTIMATE" />
          <MiniMetric label="GFA" value={`${active.achievedGFA} m²`} tag="ESTIMATE" />
          <MiniMetric label="FAR applied" value={active.far.value} tag={active.far.confidence} />
        </div>
      </div>

      <p className="mt-5 border-t pt-4 text-[11px] leading-relaxed" style={{ borderColor: "var(--surface-2-border)", color: "var(--ink-3)" }}>
        Live output from the same engine that powers the platform — recomputed on every scenario switch, never
        pre-rendered.
      </p>
    </div>
  );
}

function MiniMetric({ label, value, tag }: { label: string; value: string | number; tag: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>
          {label}
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
          style={{ background: "var(--brand-soft)", color: "var(--brand-ink)" }}
        >
          {tag}
        </span>
      </div>
      <p className="font-mono-data text-sm font-bold" style={{ color: "var(--ink-1)" }}>
        {value}
      </p>
    </div>
  );
}
