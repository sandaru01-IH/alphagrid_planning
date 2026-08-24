import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "../lib/motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}

const NEEDS = [
  "Development capacity for a specific parcel",
  "Portfolio-wide feasibility screening",
  "Regulatory due diligence before acquisition",
  "Integrating AlphaGRID into our own workflow",
  "Something else",
];

export default function ConsultModal({ isOpen, onClose, context }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [need, setNeed] = useState(NEEDS[0]);

  function handleClose() {
    onClose();
    setTimeout(() => setSubmitted(false), 300);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "var(--scrim)" }}
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg rounded-2xl border p-8 shadow-2xl"
            style={{ background: "var(--surface-1)", borderColor: "var(--surface-2-border)" }}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-lg"
              style={{ color: "var(--ink-3)" }}
            >
              ×
            </button>

            {!submitted ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>
                  Free consultancy
                </p>
                <h3 className="mt-2 text-2xl font-bold" style={{ color: "var(--ink-1)" }}>
                  Talk to a planning analyst
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  {context
                    ? `Starting from: ${context}. `
                    : ""}
                  A 30-minute session with an AlphaGRID analyst — free, no commitment. We'll look at your parcel
                  or portfolio together and tell you plainly what the regulations allow.
                </p>
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm">
                      <span className="mb-1 block font-medium" style={{ color: "var(--ink-1)" }}>
                        Name
                      </span>
                      <input
                        required
                        type="text"
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                        style={{ borderColor: "var(--line)", background: "var(--surface-0)", color: "var(--ink-1)" }}
                        placeholder="Your name"
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="mb-1 block font-medium" style={{ color: "var(--ink-1)" }}>
                        Company
                      </span>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                        style={{ borderColor: "var(--line)", background: "var(--surface-0)", color: "var(--ink-1)" }}
                        placeholder="Optional"
                      />
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium" style={{ color: "var(--ink-1)" }}>
                      Email or WhatsApp
                    </span>
                    <input
                      required
                      type="text"
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                      style={{ borderColor: "var(--line)", background: "var(--surface-0)", color: "var(--ink-1)" }}
                      placeholder="you@company.com"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium" style={{ color: "var(--ink-1)" }}>
                      What do you need?
                    </span>
                    <select
                      value={need}
                      onChange={(e) => setNeed(e.target.value)}
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                      style={{ borderColor: "var(--line)", background: "var(--surface-0)", color: "var(--ink-1)" }}
                    >
                      {NEEDS.map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-lg py-2.5 text-sm font-semibold transition hover:brightness-95"
                    style={{ background: "var(--brand)", color: "var(--surface-1)" }}
                  >
                    Request my free session
                  </button>
                  <p className="text-center text-xs" style={{ color: "var(--ink-3)" }}>
                    We reply within one business day. No spam, ever.
                  </p>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center"
              >
                <div
                  className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full text-2xl"
                  style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
                >
                  ✓
                </div>
                <h3 className="text-xl font-bold" style={{ color: "var(--ink-1)" }}>
                  Request received
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  An AlphaGRID analyst will reach out within one business day to schedule your free session.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 rounded-lg border px-5 py-2 text-sm font-semibold"
                  style={{ borderColor: "var(--line)", color: "var(--ink-1)" }}
                >
                  Close
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
