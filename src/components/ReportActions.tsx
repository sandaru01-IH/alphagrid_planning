import { useMemo, useState } from "react";
import Engine from "../lib/engine";
import type { ReportMeta } from "../lib/report";
import { buildReportText, downloadProfessionalReport, printProfessionalReport } from "../lib/report";

interface ReportActionsProps {
  meta: ReportMeta;
  compact?: boolean;
}

export default function ReportActions({ meta, compact = false }: ReportActionsProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const scenarios = useMemo(() => {
    try {
      return Engine.generateScenarios(
        { siteAreaM2: meta.siteAreaM2, frontageM: meta.frontageM, roadWidthM: meta.roadWidthM, density: meta.density as "low" | "medium" | "high" },
        { type: meta.programType as "residential" | "commercial" | "mixed_use" }
      );
    } catch {
      return [];
    }
  }, [meta]);

  if (!scenarios.length) return null;

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <div className={`flex flex-wrap gap-2 ${compact ? "" : "gap-3"}`}>
        <button
          type="button"
          onClick={() => setPreview(buildReportText(scenarios, meta))}
          className="rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--brand-soft)", color: "var(--brand-ink)" }}
        >
          Preview report
        </button>
        <button
          type="button"
          onClick={() => downloadProfessionalReport(scenarios, meta, "html")}
          className="rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--brand)", color: "var(--surface-1)" }}
        >
          Download HTML report
        </button>
        <button
          type="button"
          onClick={() => downloadProfessionalReport(scenarios, meta, "txt")}
          className="rounded-lg border px-4 py-2 text-sm font-semibold"
          style={{ borderColor: "var(--line-strong)", color: "var(--ink-1)" }}
        >
          Download .txt
        </button>
        <button
          type="button"
          onClick={() => printProfessionalReport(scenarios, meta)}
          className="rounded-lg border px-4 py-2 text-sm font-semibold"
          style={{ borderColor: "var(--line-strong)", color: "var(--ink-1)" }}
        >
          Print / Save as PDF
        </button>
      </div>

      {preview && (
        <div
          className="scroll-thin max-h-64 overflow-auto rounded-xl border p-4 text-xs leading-relaxed font-mono-data"
          style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-0)", color: "var(--ink-2)" }}
        >
          <pre className="whitespace-pre-wrap">{preview}</pre>
        </div>
      )}
    </div>
  );
}
