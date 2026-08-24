import { motion } from "framer-motion";
import type { ScenarioId } from "../state/assessment";

const SCENARIOS: { id: ScenarioId; label: string; hint: string }[] = [
  { id: "conservative", label: "Conservative", hint: "62% utilisation" },
  { id: "balanced", label: "Balanced", hint: "85% utilisation" },
  { id: "maximum_yield", label: "Maximum Yield", hint: "100% utilisation" },
];

export default function ScenarioTabs({
  active,
  onChange,
}: {
  active: ScenarioId;
  onChange: (id: ScenarioId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SCENARIOS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className="relative rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition"
            style={{
              color: isActive ? "var(--brand-ink)" : "var(--ink-2)",
              border: `1px solid ${isActive ? "var(--brand)" : "var(--surface-2-border)"}`,
              background: isActive ? "var(--brand-soft)" : "var(--surface-1)",
            }}
          >
            {isActive && (
              <motion.span
                layoutId="scenario-active"
                className="absolute inset-0 rounded-xl"
                style={{ border: "1.5px solid var(--brand)" }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
              />
            )}
            <span className="relative">{s.label}</span>
            <span className="relative block text-[11px] font-normal opacity-70">{s.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
