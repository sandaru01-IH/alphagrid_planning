export default function Logo({ tone = "auto" }: { tone?: "auto" | "light" }) {
  const ink = tone === "light" ? "#fff" : "var(--ink-1)";
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <rect x="1" y="13" width="7" height="12" rx="1" fill="var(--brand)" />
        <rect x="9.5" y="7" width="7" height="18" rx="1" fill="var(--brand)" opacity="0.75" />
        <rect x="18" y="1" width="7" height="24" rx="1" fill="var(--gold)" />
      </svg>
      <span className="font-[Manrope] text-[17px] font-bold tracking-tight" style={{ color: ink }}>
        AlphaGRID
      </span>
    </span>
  );
}
