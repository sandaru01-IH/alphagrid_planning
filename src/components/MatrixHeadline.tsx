import { useEffect, useMemo, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@$%*+=";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;
}

export interface MatrixPhrase {
  id: string;
  text: string;
  highlight: string;
}

interface MatrixHeadlineProps {
  phrases: MatrixPhrase[];
  activeIndex: number;
  className?: string;
}

/**
 * Morphs headline text into the next phrase with a matrix-style decode.
 * Stays in normal document flow — no absolute stacking / overlap.
 */
export default function MatrixHeadline({ phrases, activeIndex, className }: MatrixHeadlineProps) {
  const target = phrases[activeIndex] ?? phrases[0]!;
  const [display, setDisplay] = useState(target.text);
  const [busy, setBusy] = useState(false);
  const runId = useRef(0);
  const timerRef = useRef<number | null>(null);

  const highlightRange = useMemo(() => {
    const start = target.text.indexOf(target.highlight);
    if (start < 0) return null as null | { start: number; end: number };
    return { start, end: start + target.highlight.length };
  }, [target]);

  useEffect(() => {
    const to = (phrases[activeIndex] ?? phrases[0]!).text;
    runId.current += 1;
    const thisRun = runId.current;
    setBusy(true);

    const maxLen = Math.max(display.length, to.length);
    // Each column settles after a staggered delay (matrix decode)
    const settleFrame = Array.from({ length: maxLen }, (_, i) => 6 + Math.floor(i * 0.55) + Math.floor(Math.random() * 6));
    let frame = 0;

    const tick = () => {
      if (thisRun !== runId.current) return;
      frame += 1;
      let complete = true;
      let out = "";

      for (let i = 0; i < maxLen; i++) {
        const targetChar = to[i] ?? "";
        if (frame >= settleFrame[i]!) {
          out += targetChar;
        } else {
          complete = false;
          if (!targetChar) continue;
          if (/\s|[—–.,;:!?]/.test(targetChar)) out += targetChar;
          else out += randomGlyph();
        }
      }

      setDisplay(out);

      if (!complete) {
        timerRef.current = window.setTimeout(tick, 26);
      } else {
        setDisplay(to);
        setBusy(false);
      }
    };

    timerRef.current = window.setTimeout(tick, 26);
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
    // Intentionally only when activeIndex changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <h1
      className={className}
      aria-live="polite"
      style={{ fontFamily: busy ? "var(--font-mono)" : "var(--font-display)" }}
    >
      {display.split("").map((ch, i) => {
        const inHighlight =
          !!highlightRange && i >= highlightRange.start && i < highlightRange.end;
        const resolved = !busy || ch === (target.text[i] ?? "");

        return (
          <span
            key={i}
            style={{
              color: inHighlight && resolved ? "var(--brand)" : resolved ? "var(--ink-1)" : "var(--ink-3)",
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </h1>
  );
}
