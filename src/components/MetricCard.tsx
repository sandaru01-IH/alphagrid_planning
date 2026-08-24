import { useState } from "react";
import type { Confidence } from "../lib/engine";

const TAG_STYLE: Record<Confidence, { bg: string; fg: string }> = {
  FACT: { bg: "var(--ok-soft)", fg: "var(--ok)" },
  ASSUMPTION: { bg: "var(--deep-soft)", fg: "var(--deep)" },
  ESTIMATE: { bg: "var(--gold-soft)", fg: "var(--gold-strong)" },
  INTERPRETED: { bg: "var(--brand-soft)", fg: "var(--brand-ink)" },
};

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  confidence: Confidence;
  citation: string;
  note?: string;
}

export default function MetricCard({ label, value, unit, confidence, citation, note }: Props) {
  const [open, setOpen] = useState(false);
  const tag = TAG_STYLE[confidence];

  return (
    <div
      className="rounded-2xl border p-5 transition"
      style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium" style={{ color: "var(--ink-3)" }}>
          {label}
        </span>
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
          style={{ background: tag.bg, color: tag.fg }}
        >
          {confidence}
        </span>
      </div>
      <p className="mt-2 break-words font-mono-data text-2xl font-bold leading-tight" style={{ color: "var(--ink-1)" }}>
        {value}
        {unit && (
          <span className="ml-1 text-sm font-medium" style={{ color: "var(--ink-3)" }}>
            {unit}
          </span>
        )}
      </p>
      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-3 text-[11px] font-semibold underline decoration-dotted"
        style={{ color: "var(--ink-3)" }}
      >
        {open ? "Hide source" : "Show source"}
      </button>
      {open && (
        <div className="mt-2 border-t pt-2 text-[11px] leading-relaxed" style={{ borderColor: "var(--surface-2-border)", color: "var(--ink-3)" }}>
          <p>{citation}</p>
          {note && <p className="mt-1 italic">{note}</p>}
        </div>
      )}
    </div>
  );
}
