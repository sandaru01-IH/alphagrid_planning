import { useTheme, type ThemePreference } from "../state/theme";

const LABELS: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "Auto",
};

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { preference, setPreference, resolved } = useTheme();

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setPreference(resolved === "light" ? "dark" : "light")}
        className="grid h-9 w-9 place-items-center rounded-full transition"
        style={{
          border: "1px solid var(--line-strong)",
          background: "var(--surface-1)",
          color: "var(--ink-2)",
        }}
        aria-label={resolved === "light" ? "Switch to dark theme" : "Switch to light theme"}
        title={resolved === "light" ? "Dark" : "Light"}
      >
        {resolved === "light" ? <IconMoon /> : <IconSun />}
      </button>
    );
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full p-1"
      style={{ background: "var(--surface-sunken)", border: "1px solid var(--line)" }}
      role="group"
      aria-label="Color theme"
    >
      {(["light", "dark", "system"] as ThemePreference[]).map((mode) => {
        const active = preference === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => setPreference(mode)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition"
            style={{
              background: active ? "var(--surface-1)" : "transparent",
              color: active ? "var(--ink-1)" : "var(--ink-3)",
              boxShadow: active ? "var(--shadow-sm)" : "none",
            }}
            aria-pressed={active}
          >
            {mode === "light" ? <IconSun /> : mode === "dark" ? <IconMoon /> : <IconSystem />}
            <span className="hidden sm:inline">{LABELS[mode]}</span>
          </button>
        );
      })}
    </div>
  );
}

function IconSun() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.05 5.05l1.56 1.56M17.39 17.39l1.56 1.56M5.05 18.95l1.56-1.56M17.39 6.61l1.56-1.56"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.5 13.4A8.2 8.2 0 0 1 10.6 3.5 8.5 8.5 0 1 0 20.5 13.4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSystem() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4.5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 19.5h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
