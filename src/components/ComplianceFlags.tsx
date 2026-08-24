import type { ComplianceFlag } from "../lib/engine";

export default function ComplianceFlags({ flags, level }: { flags: ComplianceFlag[]; level: "amber" | "red" }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>
          Compliance flags
        </h3>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase"
          style={{
            background: level === "red" ? "var(--crit-soft)" : "var(--warn-soft)",
            color: level === "red" ? "var(--crit)" : "var(--warn)",
          }}
        >
          {level === "red" ? "Not buildable as specified" : "Buildable with caveats"}
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {flags.map((f, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
            <span
              className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
              style={{ background: f.level === "red" ? "var(--crit)" : "var(--warn)" }}
            />
            {f.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
