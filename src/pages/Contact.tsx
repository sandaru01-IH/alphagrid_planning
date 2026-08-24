import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { EASE } from "../lib/motion";
import { useConsult } from "../state/consult";
import { COMPANY } from "../lib/company";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const CONTACT_ITEMS = [
  {
    id: "web",
    label: "Website",
    value: COMPANY.website,
    href: COMPANY.websiteUrl,
    hint: "Explore the platform & services",
    icon: IconGlobe,
  },
  {
    id: "email",
    label: "Email",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
    hint: "We reply within one business day",
    icon: IconMail,
  },
  {
    id: "phone",
    label: "Telephone",
    value: COMPANY.phoneDisplay,
    href: `tel:${COMPANY.phone}`,
    hint: "Mon–Fri · 9:00–18:00 (LK)",
    icon: IconPhone,
  },
];

export default function Contact() {
  const { open } = useConsult();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative planning figures */}
      <div aria-hidden className="pointer-events-none absolute -right-16 top-24 opacity-[0.07]">
        <PlanningIllustration />
      </div>
      <div aria-hidden className="pointer-events-none absolute -left-20 bottom-32 opacity-[0.06]">
        <MapIllustration />
      </div>

      <section className="relative px-6 pb-10 pt-16 md:pt-24">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>
            Contact us
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Let's talk about your parcel</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed" style={{ color: "var(--ink-2)" }}>
            Reach {COMPANY.legalName} — {COMPANY.serviceName}. Free consultancy, demo walkthroughs, and
            partnership enquiries welcome.
          </p>
        </motion.div>
      </section>

      <section className="relative px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="space-y-5">
            <div
              className="rounded-3xl border p-7"
              style={{
                borderColor: "var(--surface-2-border)",
                background: "linear-gradient(145deg, var(--surface-1), var(--surface-2))",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
                  style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
                >
                  <IconBuilding />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "var(--ink-1)" }}>
                    {COMPANY.legalName}
                  </h2>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--brand)" }}>
                    {COMPANY.serviceName}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                    {COMPANY.tagline} — Sri Lanka
                  </p>
                </div>
              </div>
            </div>

            {CONTACT_ITEMS.map((item, i) => (
              <motion.a
                key={item.id}
                href={item.href}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ delay: 0.08 + i * 0.06 }}
                className="group flex items-center gap-4 rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
              >
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition group-hover:scale-105"
                  style={{ background: "var(--brand-soft)", color: "var(--brand-ink)" }}
                >
                  <item.icon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--ink-3)" }}>
                    {item.label}
                  </p>
                  <p className="truncate text-base font-semibold" style={{ color: "var(--ink-1)" }}>
                    {item.value}
                  </p>
                  <p className="text-xs" style={{ color: "var(--ink-3)" }}>
                    {item.hint}
                  </p>
                </div>
                <span className="text-lg opacity-40 transition group-hover:opacity-100" style={{ color: "var(--brand)" }}>
                  →
                </span>
              </motion.a>
            ))}

            <button
              type="button"
              onClick={() => open("Contact page consultancy")}
              className="w-full rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-sm transition hover:brightness-105"
              style={{ background: "var(--gold-soft)", color: "var(--gold-strong)" }}
            >
              Book a free 30-minute consultancy →
            </button>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border p-8 shadow-sm"
            style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
          >
            {sent ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <div
                  className="mb-4 grid h-16 w-16 place-items-center rounded-full text-2xl"
                  style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
                >
                  ✓
                </div>
                <h2 className="text-xl font-bold" style={{ color: "var(--ink-1)" }}>
                  Message received
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  Thanks{name ? `, ${name}` : ""}. Our team at {COMPANY.email} will respond shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setMessage("");
                  }}
                  className="mt-6 text-sm font-semibold"
                  style={{ color: "var(--brand)" }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "var(--surface-2-border)" }}>
                  <div
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ background: "var(--deep-soft)", color: "var(--deep)" }}
                  >
                    <IconMessage />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: "var(--ink-1)" }}>
                      Send a message
                    </h2>
                    <p className="text-xs" style={{ color: "var(--ink-3)" }}>
                      Parcel details, timelines, or partnership interest
                    </p>
                  </div>
                </div>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium" style={{ color: "var(--ink-1)" }}>
                    Name
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2"
                    style={{ borderColor: "var(--line)", background: "var(--surface-0)", color: "var(--ink-1)" }}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium" style={{ color: "var(--ink-1)" }}>
                    Email
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                    style={{ borderColor: "var(--line)", background: "var(--surface-0)", color: "var(--ink-1)" }}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium" style={{ color: "var(--ink-1)" }}>
                    Message
                  </span>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full resize-y rounded-xl border px-3 py-2.5 text-sm outline-none"
                    style={{ borderColor: "var(--line)", background: "var(--surface-0)", color: "var(--ink-1)" }}
                    placeholder="Tell us about your land, location, and what you need from AlphaGRID…"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full py-3 text-sm font-semibold transition hover:brightness-105"
                  style={{ background: "var(--brand)", color: "var(--surface-1)" }}
                >
                  Send message →
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function IconGlobe() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 2.8 4 6 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6-4 9s1.5 6.2 4 9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m3 7 9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L17.5 12.5 21.5 14v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 6.7 2 2 0 0 1 6.5 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20V8l8-4 8 4v12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 20v-5h6v5M9 10h.01M15 10h.01M9 14h.01M15 14h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconMessage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4V6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function PlanningIllustration() {
  return (
    <svg width="280" height="280" viewBox="0 0 280 280" fill="none" aria-hidden>
      <rect x="40" y="120" width="80" height="100" rx="4" stroke="currentColor" strokeWidth="2" />
      <rect x="130" y="80" width="60" height="140" rx="4" stroke="currentColor" strokeWidth="2" />
      <rect x="200" y="140" width="50" height="80" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M20 220h240" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="140" cy="60" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
      <path d="M140 90v30M125 105h30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function MapIllustration() {
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" aria-hidden>
      <rect x="20" y="30" width="200" height="180" rx="12" stroke="currentColor" strokeWidth="2" />
      <path d="M20 90h200M20 150h200M90 30v180M150 30v180" stroke="currentColor" strokeWidth="1" opacity=".5" />
      <polygon points="70,110 110,70 150,90 130,140 80,130" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="110" cy="100" r="6" fill="currentColor" />
    </svg>
  );
}
