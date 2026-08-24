import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { useConsult } from "../state/consult";

const LINKS = [
  { to: "/product", label: "Platform" },
  { to: "/pricing", label: "Pricing" },
  { to: "/methodology", label: "Methodology" },
];

export default function MarketingLayout() {
  const [scrolled, setScrolled] = useState(false);
  const { open } = useConsult();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "var(--surface-0)", color: "var(--ink-1)" }} className="min-h-screen">
      <header
        className="sticky top-0 z-50 transition-all"
        style={{
          background: scrolled ? "var(--surface-1)" : "transparent",
          borderBottom: scrolled ? "1px solid var(--surface-2-border)" : "1px solid transparent",
          backdropFilter: scrolled ? "saturate(1.2) blur(10px)" : "none",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" aria-label="AlphaGRID home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  "text-sm font-medium transition-colors " + (isActive ? "" : "opacity-70 hover:opacity-100")
                }
                style={({ isActive }) => ({ color: isActive ? "var(--brand)" : "var(--ink-1)" })}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => open("General enquiry")}
              className="hidden rounded-full px-4 py-2 text-sm font-semibold sm:inline-block"
              style={{ color: "var(--ink-1)", border: "1px solid var(--line-strong)" }}
            >
              Free consultancy
            </button>
            <Link
              to="/platform"
              className="rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition hover:brightness-105"
              style={{ background: "var(--brand)", color: "var(--surface-1)" }}
            >
              Launch platform →
            </Link>
          </div>
        </div>
      </header>

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Outlet />
      </motion.main>

      <Footer />
    </div>
  );
}

function Footer() {
  const { open } = useConsult();
  return (
    <footer style={{ borderTop: "1px solid var(--surface-2-border)", background: "var(--surface-1)" }}>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
              Explainable development-capacity intelligence for Sri Lankan parcels — every number cited,
              every assumption labelled.
            </p>
            <button
              onClick={() => open("Footer enquiry")}
              className="mt-5 rounded-full px-4 py-2 text-sm font-semibold"
              style={{ background: "var(--gold-soft)", color: "var(--gold-strong)" }}
            >
              Get free consultancy
            </button>
          </div>
          <FooterCol
            title="Platform"
            links={[
              ["Overview", "/product"],
              ["Pricing", "/pricing"],
              ["Methodology & validation", "/methodology"],
              ["Launch tool", "/platform"],
            ]}
          />
          <FooterCol
            title="Modes"
            links={[
              ["Developer", "/platform/assessment"],
              ["Investor", "/platform/investor"],
              ["Reports", "/platform/reports"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["Panadura pilot", "/methodology"],
              ["Contact", "/pricing"],
            ]}
          />
        </div>
        <div
          className="mt-12 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--surface-2-border)", color: "var(--ink-3)" }}
        >
          <p>© {new Date().getFullYear()} AlphaGRID (Pvt) Ltd. Regulation citations current as of publication; always confirm against the gazetted instrument before a transaction.</p>
          <p>Panadura pilot · UDA Planning &amp; Development Regulations</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-3)" }}>
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-sm" style={{ color: "var(--ink-2)" }}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
