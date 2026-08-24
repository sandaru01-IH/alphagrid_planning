import { useState } from "react";
import Engine from "../lib/engine";
import { useAssessment } from "../state/assessment";

export default function CommandBox() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const setScenario = useAssessment((s) => s.setScenario);
  const setField = useAssessment((s) => s.setField);

  function apply() {
    if (!text.trim()) return;
    const parsed = Engine.parseCommand(text);
    const bits: string[] = [];

    if (parsed.scenario) {
      setScenario(parsed.scenario);
      bits.push(`switched to ${parsed.scenario.replace("_", " ")} scenario`);
    }
    if (parsed.programType) {
      setField("programType", parsed.programType);
      bits.push(`program set to ${parsed.programType.replace("_", " ")}`);
    }
    if (parsed.note) bits.push(parsed.note);

    setFeedback(
      bits.length
        ? `Understood: ${bits.join("; ")}.`
        : "Recognised no structured instruction in that phrase — this box maps fixed phrases (e.g. \"maximum yield\", \"apartments\") to engine parameters. It never invents a regulation value from free text."
    );
  }

  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: "var(--surface-2-border)", background: "var(--surface-1)" }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold" style={{ color: "var(--ink-1)" }}>
          Describe a change
        </h3>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ background: "var(--surface-sunken)", color: "var(--ink-3)" }}
        >
          fixed-grammar parser · not an LLM
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder='Try "maximum yield" or "switch to apartments"'
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--line)", background: "var(--surface-0)", color: "var(--ink-1)" }}
        />
        <button
          onClick={apply}
          className="rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ background: "var(--brand)", color: "var(--surface-1)" }}
        >
          Apply
        </button>
      </div>
      {feedback && (
        <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--ink-3)" }}>
          {feedback}
        </p>
      )}
    </div>
  );
}
