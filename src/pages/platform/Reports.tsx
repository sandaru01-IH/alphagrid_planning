import { useMemo, useState } from "react";
import Engine from "../../lib/engine";
import { useAssessment } from "../../state/assessment";
import { useConsult } from "../../state/consult";

function buildBriefText(scenarios: ReturnType<typeof Engine.generateScenarios>, meta: { siteAreaM2: number; frontageM: number; roadWidthM: number; density: string; programType: string }) {
  const lines: string[] = [];
  lines.push("AlphaGRID Development Intelligence — Assessment Brief");
  lines.push(`Generated ${new Date().toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push(`Parcel: ${meta.siteAreaM2} m², ${meta.frontageM} m frontage, ${meta.roadWidthM} m road, ${meta.density} density, ${meta.programType.replace("_", " ")}`);
  lines.push("");
  scenarios.forEach((s) => {
    lines.push(`--- ${s.scenarioLabel} ---`);
    lines.push(`FAR applied: ${s.far.value} (${s.far.confidence})`);
    lines.push(`Height category: ${s.heightCategory.label}`);
    lines.push(`Floors: ${s.floors}  |  Height: ${s.heightM} m`);
    lines.push(`Footprint: ${s.footprintM2} m²  |  Achieved GFA: ${s.achievedGFA} m² (of ${s.maxRegulatedGFA} m² regulated ceiling)`);
    lines.push(`Units: ${s.units}  |  Parking: ${s.parking.total} spaces  |  Open space: ${s.openSpaceM2} m² (${s.openSpacePct}%)`);
    lines.push(`Compliance: ${s.complianceLevel.toUpperCase()}`);
    s.flags.forEach((f) => lines.push(`  [${f.level.toUpperCase()}] ${f.message}`));
    lines.push("");
  });
  lines.push("This brief reflects a pilot-scope engine applying the general UDA Planning & Development Regulations.");
  lines.push("Confirm all figures against the current gazetted instrument before use in a transaction.");
  return lines.join("\n");
}

export default function Reports() {
  const { siteAreaM2, frontageM, roadWidthM, density, programType } = useAssessment();
  const { open } = useConsult();
  const [generated, setGenerated] = useState<string | null>(null);

  const scenarios = useMemo(() => {
    try {
      return Engine.generateScenarios({ siteAreaM2, frontageM, roadWidthM, density }, { type: programType });
    } catch {
      return [];
    }
  }, [siteAreaM2, frontageM, roadWidthM, density, programType]);

  function handleGenerate() {
    const text = buildBriefText(scenarios, { siteAreaM2, frontageM, roadWidthM, density, programType });
    setGenerated(text);
  }

  function handleDownload() {
    if (!generated) return;
    const blob = new Blob([generated], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alphagrid-brief-panadura-${siteAreaM2}m2.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--brand)" }}>
            Reports
          </p>
          <h1 className="mt-1 text-2xl font-bold" style={{ color: "var(--ink-1)" }}>
            Client-ready brief
          </h1>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--ink-2)" }}>
            Every figure below carries the same citation trail shown in the assessment view. Professional and
            Enterprise plans export a branded PDF; this workspace preview generates the underlying text brief.
          </p>
        </div>
        <button
          onClick={() => open("Reports — custom branded export")}
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--gold-soft)", color: "var(--gold-strong)" }}
        >
          Ask about branded PDF export →
        </button>
      </div>

      <div className="rounded-2xl border p-6" style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>
              Current parcel — {siteAreaM2} m², {programType.replace("_", " ")}
            </h3>
            <p className="text-xs" style={{ color: "var(--ink-3)" }}>
              All three scenarios included
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              className="rounded-lg px-4 py-2 text-sm font-semibold"
              style={{ background: "var(--brand)", color: "var(--surface-1)" }}
            >
              Generate brief
            </button>
            <button
              onClick={handleDownload}
              disabled={!generated}
              className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
              style={{ borderColor: "var(--line-strong)", color: "var(--ink-1)" }}
            >
              Download .txt
            </button>
          </div>
        </div>

        {generated && (
          <pre
            className="scroll-thin mt-5 max-h-[420px] overflow-auto rounded-xl border p-4 text-xs leading-relaxed font-mono-data"
            style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-0)", color: "var(--ink-2)" }}
          >
            {generated}
          </pre>
        )}
      </div>
    </div>
  );
}
