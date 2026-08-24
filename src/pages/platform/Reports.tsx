import { useMemo } from "react";
import Engine from "../../lib/engine";
import { useAssessment } from "../../state/assessment";
import { useConsult } from "../../state/consult";
import { COMPANY } from "../../lib/company";
import ReportActions from "../../components/ReportActions";
import type { ReportMeta } from "../../lib/report";

export default function Reports() {
  const { siteAreaM2, frontageM, roadWidthM, density, programType, parcelRing } = useAssessment();
  const { open } = useConsult();

  const scenarios = useMemo(() => {
    try {
      return Engine.generateScenarios({ siteAreaM2, frontageM, roadWidthM, density }, { type: programType });
    } catch {
      return [];
    }
  }, [siteAreaM2, frontageM, roadWidthM, density, programType]);

  const meta: ReportMeta = {
    siteAreaM2,
    frontageM,
    roadWidthM,
    density,
    programType,
    parcelSource: parcelRing && parcelRing.length >= 3 ? "map sketch" : "manual entry",
    vertexCount: parcelRing?.length,
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--brand)" }}>
            Reports
          </p>
          <h1 className="mt-1 text-2xl font-bold" style={{ color: "var(--ink-1)" }}>
            Professional assessment report
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
            Branded report from {COMPANY.legalName} — {COMPANY.serviceName}. Includes parcel summary,
            all three scenarios, compliance flags, and company contact details.
          </p>
        </div>
        <button
          onClick={() => open("Reports — custom branded export")}
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--gold-soft)", color: "var(--gold-strong)" }}
        >
          Request analyst review →
        </button>
      </div>

      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--surface-2-border)" }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>
              {COMPANY.legalName}
            </h3>
            <p className="text-xs font-medium" style={{ color: "var(--brand)" }}>
              {COMPANY.serviceName}
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--ink-3)" }}>
              Parcel: {siteAreaM2.toLocaleString()} m² · {programType.replace("_", " ")} · {density} density
            </p>
          </div>
          <div className="text-right text-xs" style={{ color: "var(--ink-3)" }}>
            <p>{COMPANY.website}</p>
            <p>{COMPANY.email}</p>
            <p>{COMPANY.phoneDisplay}</p>
          </div>
        </div>

        {scenarios.length > 0 ? (
          <>
            <p className="mt-4 text-xs" style={{ color: "var(--ink-2)" }}>
              Report includes {scenarios.length} scenarios with cited metrics and compliance status.
            </p>
            <div className="mt-5">
              <ReportActions meta={meta} />
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm" style={{ color: "var(--ink-2)" }}>
            Enter valid parcel dimensions in Assessment to generate a report.
          </p>
        )}
      </div>
    </div>
  );
}
