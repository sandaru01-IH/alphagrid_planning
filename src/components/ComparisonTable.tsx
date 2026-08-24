import type { ScenarioResult } from "../lib/engine";

const ROWS: { label: string; get: (s: ScenarioResult) => string | number }[] = [
  { label: "Floors", get: (s) => s.floors },
  { label: "Height", get: (s) => `${s.heightM} m` },
  { label: "Footprint", get: (s) => `${s.footprintM2} m²` },
  { label: "Achieved GFA", get: (s) => `${s.achievedGFA} m²` },
  { label: "Regulated ceiling used", get: (s) => `${s.regulationUtilisationPct}%` },
  { label: "Units", get: (s) => s.units || "—" },
  { label: "Parking spaces", get: (s) => s.parking.total },
  { label: "Open space", get: (s) => `${s.openSpaceM2} m² (${s.openSpacePct}%)` },
  { label: "Compliance", get: (s) => (s.complianceLevel === "red" ? "Not buildable" : "Buildable, caveats apply") },
];

export default function ComparisonTable({ scenarios, activeId }: { scenarios: ScenarioResult[]; activeId: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--surface-2-border)" }}>
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr style={{ background: "var(--surface-sunken)" }}>
            <th className="px-4 py-3 text-left font-semibold" style={{ color: "var(--ink-3)" }}>
              Metric
            </th>
            {scenarios.map((s) => (
              <th
                key={s.scenarioId}
                className="px-4 py-3 text-left font-semibold"
                style={{
                  color: s.scenarioId === activeId ? "var(--brand-ink)" : "var(--ink-1)",
                  background: s.scenarioId === activeId ? "var(--brand-soft)" : undefined,
                }}
              >
                {s.scenarioLabel}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={row.label} style={{ borderTop: i > 0 ? "1px solid var(--surface-2-border)" : undefined, background: "var(--surface-1)" }}>
              <td className="px-4 py-3 font-medium" style={{ color: "var(--ink-2)" }}>
                {row.label}
              </td>
              {scenarios.map((s) => (
                <td
                  key={s.scenarioId}
                  className="px-4 py-3 font-mono-data"
                  style={{
                    color: "var(--ink-1)",
                    background: s.scenarioId === activeId ? "var(--brand-soft)" : undefined,
                  }}
                >
                  {row.get(s)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
