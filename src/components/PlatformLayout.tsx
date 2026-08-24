import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useConsult } from "../state/consult";
import { useAssessment, SAVED_PARCELS, type ViewerMode } from "../state/assessment";

const NAV = [
  { to: "/platform", label: "Overview", icon: IconGrid },
  { to: "/platform/assessment", label: "Assessment", icon: IconLayers },
  { to: "/platform/investor", label: "Investor view", icon: IconChart },
  { to: "/platform/reports", label: "Reports", icon: IconDoc },
];

const MODES: { id: ViewerMode; label: string }[] = [
  { id: "developer", label: "Developer" },
  { id: "investor", label: "Investor" },
  { id: "professional", label: "Professional" },
];

export default function PlatformLayout() {
  const { open } = useConsult();
  const location = useLocation();
  const mode = useAssessment((s) => s.mode);
  const setMode = useAssessment((s) => s.setMode);
  const activeParcelId = useAssessment((s) => s.activeParcelId);
  const loadParcel = useAssessment((s) => s.loadParcel);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--surface-0)", color: "var(--ink-1)" }}>
      <aside
        className="scroll-thin hidden shrink-0 flex-col border-r px-3 py-5 transition-all sm:flex"
        style={{
          width: collapsed ? 76 : 248,
          borderColor: "var(--surface-2-border)",
          background: "var(--surface-1)",
        }}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <Link to="/" className={collapsed ? "opacity-0 w-0 overflow-hidden" : ""}>
            <Logo />
          </Link>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
            style={{ color: "var(--ink-3)", border: "1px solid var(--surface-2-border)" }}
            aria-label="Toggle sidebar"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              style={({ isActive }) => ({
                background: isActive ? "var(--brand-soft)" : "transparent",
                color: isActive ? "var(--brand-ink)" : "var(--ink-2)",
              })}
            >
              <Icon />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <>
            <div className="mt-8 px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--ink-3)" }}>
                Saved parcels
              </p>
              <div className="mt-3 flex flex-col gap-1.5">
                {SAVED_PARCELS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => loadParcel(p)}
                    className="rounded-lg px-3 py-2 text-left text-xs leading-snug transition"
                    style={{
                      background: activeParcelId === p.id ? "var(--surface-2)" : "transparent",
                      border: activeParcelId === p.id ? "1px solid var(--line-strong)" : "1px solid transparent",
                      color: "var(--ink-2)",
                    }}
                  >
                    <span className="block font-semibold" style={{ color: "var(--ink-1)" }}>
                      {p.name.split("—")[0].trim()}
                    </span>
                    <span className="block opacity-80">{p.name.split("—")[1]?.trim()}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto px-2 pt-8">
              <button
                onClick={() => open("Platform enquiry")}
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold"
                style={{ background: "var(--gold-soft)", color: "var(--gold-strong)" }}
              >
                Talk to an analyst →
              </button>
              <Link
                to="/"
                className="mt-2 block rounded-xl px-3 py-2.5 text-sm font-medium"
                style={{ color: "var(--ink-3)" }}
              >
                ← Back to site
              </Link>
            </div>
          </>
        )}
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header
          className="sticky top-0 z-30 flex items-center justify-between border-b px-6 py-3.5"
          style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: "var(--ink-1)" }}>
              Panadura pilot workspace
            </span>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ background: "var(--ok-soft)", color: "var(--ok)" }}
            >
              Live engine
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <div
              className="flex items-center gap-1 rounded-full p-1"
              style={{ background: "var(--surface-sunken)" }}
            >
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition"
                  style={{
                    background: mode === m.id ? "var(--surface-1)" : "transparent",
                    color: mode === m.id ? "var(--ink-1)" : "var(--ink-3)",
                    boxShadow: mode === m.id ? "var(--shadow-sm)" : "none",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="scroll-thin flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="1.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10.5" y="1.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="1.5" y="10.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10.5" y="10.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 1.5 16.5 6 9 10.5 1.5 6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M1.5 10 9 14.5 16.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 15.5V2M2 15.5h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4.5 13 8 9l2.5 2 4-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 1.5h7l3 3v12h-10z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6.5 8h5M6.5 11h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
