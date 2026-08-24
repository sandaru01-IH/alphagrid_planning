import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Engine from "../../lib/engine";
import { useAssessment } from "../../state/assessment";
import { useTheme } from "../../state/theme";
import InputPanel from "../../components/InputPanel";
import ScenarioTabs from "../../components/ScenarioTabs";
import MetricCard from "../../components/MetricCard";
import ComplianceFlags from "../../components/ComplianceFlags";
import CommandBox from "../../components/CommandBox";
import ComparisonTable from "../../components/ComparisonTable";
import SitePlan2D from "../../components/SitePlan2D";
import Massing3D, { type MassingTarget } from "../../three/Massing3D";
import ParcelMap from "../../components/ParcelMap";
import { useConsult } from "../../state/consult";

function cssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export default function Assessment() {
  const {
    siteAreaM2,
    frontageM,
    roadWidthM,
    density,
    programType,
    scenarioId,
    setScenario,
    parcelRing,
    applyDrawnParcel,
    clearDrawnParcel,
  } = useAssessment();
  const { open } = useConsult();
  const { resolved } = useTheme();
  const [autoRotate, setAutoRotate] = useState(true);

  const scenarios = useMemo(() => {
    try {
      return Engine.generateScenarios(
        { siteAreaM2, frontageM, roadWidthM, density },
        { type: programType }
      );
    } catch {
      return [];
    }
  }, [siteAreaM2, frontageM, roadWidthM, density, programType]);

  const active = scenarios.find((s) => s.scenarioId === scenarioId) ?? scenarios[0];

  if (!active) {
    return (
      <div className="rounded-2xl border p-8 text-sm" style={{ borderColor: "var(--surface-2-border)", color: "var(--ink-2)" }}>
        Enter valid parcel dimensions to run an assessment.
      </div>
    );
  }

  const massingTarget: MassingTarget = {
    key: `${scenarioId}-${siteAreaM2}-${frontageM}-${roadWidthM}-${density}-${programType}-${resolved}`,
    siteWidthM: active.inputs.frontage,
    siteDepthM: active.inputs.depth,
    footprintWidthM: active.footprintWidthM || 0.01,
    footprintDepthM: active.footprintDepthM || 0.01,
    floors: active.floors,
    floorHeightM: Engine.ASSUMED_FLOOR_TO_FLOOR_M,
    governingConstraint: active.governingConstraint,
    color:
      active.governingConstraint === "setback"
        ? cssVar("--massing-warn", "#9a7428")
        : cssVar("--massing-accent", "#0f6f66"),
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--brand)" }}>
            Development capacity assessment
          </p>
          <h1 className="mt-1 text-2xl font-bold" style={{ color: "var(--ink-1)" }}>
            {siteAreaM2} m² · {programType.replace("_", " ")} · {density} density
          </h1>
          {parcelRing && parcelRing.length >= 3 && (
            <p className="mt-1 text-xs font-medium" style={{ color: "var(--brand)" }}>
              Geometry from map sketch · {parcelRing.length} vertices
            </p>
          )}
        </div>
        <button
          onClick={() => open("Assessment review")}
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--gold-soft)", color: "var(--gold-strong)" }}
        >
          Have an analyst review this →
        </button>
      </div>

      <ParcelMap
        ring={parcelRing}
        onApply={applyDrawnParcel}
        onClear={clearDrawnParcel}
        height={380}
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <InputPanel />
          <CommandBox />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border p-5" style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <ScenarioTabs active={scenarioId} onChange={setScenario} />
              <label className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--ink-3)" }}>
                <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
                Auto-rotate
              </label>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
              <motion.div
                key={massingTarget.key}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="h-[420px] overflow-hidden rounded-xl border"
                style={{ borderColor: "var(--surface-2-border)" }}
              >
                <Massing3D target={massingTarget} autoRotate={autoRotate} />
              </motion.div>
              <div className="h-[420px] overflow-hidden rounded-xl border" style={{ borderColor: "var(--surface-2-border)" }}>
                <SitePlan2D
                  siteWidthM={massingTarget.siteWidthM}
                  siteDepthM={massingTarget.siteDepthM}
                  footprintWidthM={massingTarget.footprintWidthM}
                  footprintDepthM={massingTarget.footprintDepthM}
                  governingConstraint={massingTarget.governingConstraint}
                />
              </div>
            </div>
            <p className="mt-3 text-[11px]" style={{ color: "var(--ink-3)" }}>
              Governing constraint:{" "}
              <strong style={{ color: massingTarget.governingConstraint === "setback" ? "var(--gold-strong)" : "var(--brand-ink)" }}>
                {massingTarget.governingConstraint === "setback" ? "Setback envelope" : "Plot coverage"}
              </strong>{" "}
              — the tighter of the two limits determined this footprint.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label="FAR applied"
              value={active.far.value}
              confidence={active.far.confidence}
              citation={`Form C, FAR table — ${active.far.bandLabel ?? "band lookup"}`}
              note={active.far.note}
            />
            <MetricCard
              label="Height category"
              value={active.heightCategory.label}
              confidence="FACT"
              citation="Height-category band table, Schedule 6"
            />
            <MetricCard
              label="Floors"
              value={active.floors}
              confidence="ESTIMATE"
              citation="Derived: target GFA ÷ converged footprint, assumed floor-to-floor height"
              note={`${Engine.ASSUMED_FLOOR_TO_FLOOR_M} m floor-to-floor assumption`}
            />
            <MetricCard
              label="Achieved GFA"
              value={active.achievedGFA}
              unit="m²"
              confidence="ESTIMATE"
              citation={`Footprint × floors, capped to stay within the regulated ceiling of ${active.maxRegulatedGFA} m²`}
            />
            <MetricCard
              label="Open space"
              value={`${active.openSpaceM2} m²`}
              unit={`(${active.openSpacePct}%)`}
              confidence="ESTIMATE"
              citation="Site area minus converged footprint"
            />
            <MetricCard
              label="Parking required"
              value={active.parking.total}
              unit="spaces"
              confidence="ESTIMATE"
              citation="Schedule 10 parking rate applied to estimated unit / retail GFA"
              note="Rate itself is FACT; the unit and GFA it's applied to are ESTIMATE — so the result inherits that uncertainty."
            />
          </div>

          <ComplianceFlags flags={active.flags} level={active.complianceLevel} />

          <div>
            <h3 className="mb-3 text-sm font-bold" style={{ color: "var(--ink-1)" }}>
              Scenario comparison
            </h3>
            <ComparisonTable scenarios={scenarios} activeId={scenarioId} />
          </div>
        </div>
      </div>
    </div>
  );
}
