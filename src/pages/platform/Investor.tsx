import { useMemo, useState } from "react";
import Engine from "../../lib/engine";
import { useAssessment } from "../../state/assessment";
import MetricCard from "../../components/MetricCard";
import ScenarioTabs from "../../components/ScenarioTabs";
import { useConsult } from "../../state/consult";

export default function Investor() {
  const { siteAreaM2, frontageM, roadWidthM, density, programType, scenarioId, setScenario } = useAssessment();
  const { open } = useConsult();
  const [salePricePerM2, setSalePricePerM2] = useState(340000); // LKR / m² — editable ESTIMATE input
  const [costPerM2, setCostPerM2] = useState(210000); // LKR / m² construction cost — editable ESTIMATE input
  const [landCost, setLandCost] = useState(45000000); // LKR — editable ESTIMATE input

  const scenarios = useMemo(() => {
    try {
      return Engine.generateScenarios({ siteAreaM2, frontageM, roadWidthM, density }, { type: programType });
    } catch {
      return [];
    }
  }, [siteAreaM2, frontageM, roadWidthM, density, programType]);

  const active = scenarios.find((s) => s.scenarioId === scenarioId) ?? scenarios[0];

  if (!active) return null;

  const sellableGFA = active.achievedGFA * 0.86; // ESTIMATE: efficiency ratio, common areas excluded
  const grossRevenue = sellableGFA * salePricePerM2;
  const constructionCost = active.achievedGFA * costPerM2;
  const totalCost = constructionCost + landCost;
  const margin = grossRevenue - totalCost;
  const marginPct = totalCost > 0 ? (margin / totalCost) * 100 : 0;

  const fmt = (n: number) => new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 }).format(n);
  const fmtMoney = (n: number) =>
    new Intl.NumberFormat("en-LK", { notation: "compact", maximumFractionDigits: 1 }).format(n);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--gold-strong)" }}>
            Investor intelligence
          </p>
          <h1 className="mt-1 text-2xl font-bold" style={{ color: "var(--ink-1)" }}>
            Feasibility screen
          </h1>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--ink-2)" }}>
            Built on the same regulated capacity as the developer view. Every figure below depends on the sale
            price and cost assumptions you set — they are yours to challenge, not ours to assert.
          </p>
        </div>
        <button
          onClick={() => open("Investor screen — request underwriting-grade review")}
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--gold-soft)", color: "var(--gold-strong)" }}
        >
          Request underwriting-grade review →
        </button>
      </div>

      <ScenarioTabs active={scenarioId} onChange={setScenario} />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="rounded-2xl border p-5" style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}>
          <h3 className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>
            Your assumptions
          </h3>
          <p className="mt-1 text-xs" style={{ color: "var(--ink-3)" }}>
            LKR — edit to match your own market read
          </p>
          <div className="mt-4 space-y-4">
            <AssumptionField label="Sale price / m²" value={salePricePerM2} onChange={setSalePricePerM2} step={5000} />
            <AssumptionField label="Construction cost / m²" value={costPerM2} onChange={setCostPerM2} step={5000} />
            <AssumptionField label="Land acquisition cost" value={landCost} onChange={setLandCost} step={1000000} />
          </div>
          <p className="mt-4 border-t pt-4 text-[11px] leading-relaxed" style={{ borderColor: "var(--surface-2-border)", color: "var(--ink-3)" }}>
            Sellable GFA assumes an 86% efficiency ratio against achieved GFA — a common-areas allowance, not a
            regulation value. Adjust the scenario, not just the price, to see how buildability itself moves the
            outcome.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Sellable GFA"
              value={fmt(sellableGFA)}
              unit="m²"
              confidence="ESTIMATE"
              citation="86% efficiency ratio applied to achieved GFA"
            />
            <MetricCard
              label="Gross revenue"
              value={`Rs ${fmtMoney(grossRevenue)}`}
              confidence="ESTIMATE"
              citation={`Sellable GFA × your sale-price assumption — Rs ${fmt(grossRevenue)} in full`}
            />
            <MetricCard
              label="Total cost"
              value={`Rs ${fmtMoney(totalCost)}`}
              confidence="ESTIMATE"
              citation={`Construction cost (achieved GFA × your cost/m²) + your land cost assumption — Rs ${fmt(totalCost)} in full`}
            />
            <MetricCard
              label="Indicative margin"
              value={`Rs ${fmtMoney(margin)}`}
              unit={`(${marginPct.toFixed(1)}%)`}
              confidence="ESTIMATE"
              citation={`Gross revenue minus total cost — no financing, tax or professional-fee allowance included. Rs ${fmt(margin)} in full`}
            />
          </div>

          <div
            className="rounded-2xl border p-5 text-sm leading-relaxed"
            style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)", color: "var(--ink-2)" }}
          >
            <strong style={{ color: "var(--ink-1)" }}>Read this as a screen, not an appraisal.</strong> It tells you
            whether a deal is worth a quantity surveyor's time — it does not replace one. Financing cost, taxes,
            professional fees, sales commission and construction contingency are not modelled here. Enterprise
            customers can wire in a full residual-value model with their own cost database.
          </div>
        </div>
      </div>
    </div>
  );
}

function AssumptionField({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--ink-3)" }}>
        {label}
      </span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-lg border px-3 py-2 text-sm font-mono-data outline-none"
        style={{ borderColor: "var(--line)", background: "var(--surface-0)", color: "var(--ink-1)" }}
      />
    </label>
  );
}
