import type { CSSProperties, ReactNode } from "react";
import { useAssessment } from "../state/assessment";
import type { DensityTier, ProgramType } from "../lib/engine";

const DENSITY_OPTIONS: { id: DensityTier; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

const PROGRAM_OPTIONS: { id: ProgramType; label: string }[] = [
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "mixed_use", label: "Mixed use" },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--ink-3)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: CSSProperties = {
  borderColor: "var(--line)",
  background: "var(--surface-0)",
  color: "var(--ink-1)",
};

export default function InputPanel() {
  const { siteAreaM2, frontageM, roadWidthM, density, programType, setField } = useAssessment();

  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}>
      <h3 className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>
        Parcel &amp; program
      </h3>
      <p className="mt-1 text-[11px] leading-snug" style={{ color: "var(--ink-3)" }}>
        Draw on the map above, or edit the numbers directly.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field label="Site area (m²)">
          <input
            type="number"
            min={1}
            value={siteAreaM2}
            onChange={(e) => setField("siteAreaM2", Number(e.target.value) || 0)}
            className="w-full rounded-lg border px-3 py-2 text-sm font-mono-data outline-none"
            style={inputStyle}
          />
        </Field>
        <Field label="Frontage (m)">
          <input
            type="number"
            min={1}
            value={frontageM}
            onChange={(e) => setField("frontageM", Number(e.target.value) || 0)}
            className="w-full rounded-lg border px-3 py-2 text-sm font-mono-data outline-none"
            style={inputStyle}
          />
        </Field>
        <Field label="Road width (m)">
          <select
            value={roadWidthM}
            onChange={(e) => setField("roadWidthM", Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          >
            {[6, 9, 12, 15, 20].map((w) => (
              <option key={w} value={w}>
                {w} m
              </option>
            ))}
          </select>
        </Field>
        <Field label="Density tier">
          <select
            value={density}
            onChange={(e) => setField("density", e.target.value as DensityTier)}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          >
            {DENSITY_OPTIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>
        <div className="col-span-2">
          <Field label="Program type">
            <div className="grid grid-cols-3 gap-2">
              {PROGRAM_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setField("programType", p.id)}
                  className="rounded-lg border py-2 text-xs font-semibold transition"
                  style={{
                    borderColor: programType === p.id ? "var(--brand)" : "var(--line)",
                    background: programType === p.id ? "var(--brand-soft)" : "var(--surface-0)",
                    color: programType === p.id ? "var(--brand-ink)" : "var(--ink-2)",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </div>
    </div>
  );
}
