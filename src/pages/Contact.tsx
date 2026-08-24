import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { EASE } from "../lib/motion";
import { useConsult } from "../state/consult";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

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
    <div>
      <section className="px-6 pb-10 pt-16 md:pt-24">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>
            Contact us
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Let's talk about your parcel</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed" style={{ color: "var(--ink-2)" }}>
            Whether you need a free consultancy session, a demo walkthrough, or a partnership conversation —
            reach the AlphaGRID team directly.
          </p>
        </motion.div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="space-y-6 rounded-3xl border p-8"
            style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-3)" }}>
                Email
              </p>
              <a href="mailto:hello@alphagrid.lk" className="mt-1 block text-base font-semibold" style={{ color: "var(--brand)" }}>
                hello@alphagrid.lk
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-3)" }}>
                Company
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                AlphaGRID (Pvt) Ltd
                <br />
                Planning intelligence · Sri Lanka
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-3)" }}>
                Prefer a call?
              </p>
              <button
                type="button"
                onClick={() => open("Contact page consultancy")}
                className="mt-3 rounded-full px-5 py-2.5 text-sm font-semibold"
                style={{ background: "var(--gold-soft)", color: "var(--gold-strong)" }}
              >
                Book free consultancy →
              </button>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="rounded-3xl border p-8"
            style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}
          >
            {sent ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <div
                  className="mb-4 grid h-14 w-14 place-items-center rounded-full text-2xl"
                  style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
                >
                  ✓
                </div>
                <h2 className="text-xl font-bold" style={{ color: "var(--ink-1)" }}>
                  Message received
                </h2>
                <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--ink-2)" }}>
                  Thanks{name ? `, ${name}` : ""}. We'll get back to you at {email || "your inbox"} shortly.
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
                <h2 className="text-lg font-bold" style={{ color: "var(--ink-1)" }}>
                  Send a message
                </h2>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium" style={{ color: "var(--ink-1)" }}>
                    Name
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
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
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
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
                    className="w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none"
                    style={{ borderColor: "var(--line)", background: "var(--surface-0)", color: "var(--ink-1)" }}
                    placeholder="Tell us about your parcel, timeline, or partnership interest…"
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
