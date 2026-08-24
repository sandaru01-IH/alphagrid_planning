import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { EASE } from "../lib/motion";

export interface HeadlinePhrase {
  id: string;
  before: string;
  highlight: string;
  after: string;
}

interface RotatingHeadlineProps {
  phrases: HeadlinePhrase[];
  activeIndex: number;
  className?: string;
}

function PhraseBlock({ phrase, className }: { phrase: HeadlinePhrase; className?: string }) {
  return (
    <h1 className={className}>
      {phrase.before}
      <span style={{ color: "var(--brand)" }}>{phrase.highlight}</span>
      {phrase.after}
    </h1>
  );
}

/** Cross-fades between headline phrases — wraps naturally, no overlap. */
export default function RotatingHeadline({ phrases, activeIndex, className }: RotatingHeadlineProps) {
  const active = phrases[activeIndex] ?? phrases[0]!;

  const longest = useMemo(
    () => phrases.reduce((a, b) => {
      const lenA = a.before.length + a.highlight.length + a.after.length;
      const lenB = b.before.length + b.highlight.length + b.after.length;
      return lenA >= lenB ? a : b;
    }),
    [phrases]
  );

  return (
    <div className="relative mt-5 min-w-0 overflow-hidden">
      {/* Invisible sizer reserves height for the longest phrase */}
      <PhraseBlock
        phrase={longest}
        className={`${className} invisible pointer-events-none select-none`}
        aria-hidden
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="absolute inset-x-0 top-0 min-w-0 pr-1"
        >
          <PhraseBlock phrase={active} className={className} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
