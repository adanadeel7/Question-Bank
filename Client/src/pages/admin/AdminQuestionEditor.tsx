import { useState } from "react";

const ALL_TOPICS = [
  "Quadratics", "Functions", "Coordinate geometry", "Circular measure", "Trigonometry",
  "Series", "Binomial expansion", "Differentiation", "Integration", "Vectors", "3D geometry",
];

type Target = "question" | "scheme";
interface Box { x: number; y: number; w: number; h: number }

const ORIGIN: Record<Target, Box> = {
  question: { x: 7, y: 24, w: 84, h: 46 },
  scheme: { x: 9, y: 12, w: 80, h: 34 },
};

export function AdminQuestionEditor() {
  const [target, setTarget] = useState<Target>("question");
  const [box, setBox] = useState<Record<Target, Box>>({
    question: { ...ORIGIN.question },
    scheme: { ...ORIGIN.scheme },
  });
  const [variant, setVariant] = useState("Paper 1");
  const [session, setSession] = useState("May/June");
  const [year, setYear] = useState("2023");
  const [qnum, setQnum] = useState("8");
  const [marks, setMarks] = useState("11");
  const [topics, setTopics] = useState<string[]>(["Integration"]);
  const [schemeAttached, setSchemeAttached] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("var(--color-admin-graphite)");

  const b = box[target];
  const origin = ORIGIN[target];
  const moved = b.x !== origin.x || b.y !== origin.y || b.w !== origin.w || b.h !== origin.h;
  const marksNum = parseInt(marks, 10);
  const marksBad = !(marksNum >= 1 && marksNum <= 20);
  const isQ = target === "question";
  const saveOff = !dirty || marksBad || topics.length === 0;

  function patch<T>(setter: (v: T) => void, value: T) {
    setter(value);
    setDirty(true);
    setStatus("");
  }

  function setBoxField(key: keyof Box, value: number) {
    setBox((prev) => ({ ...prev, [target]: { ...prev[target], [key]: value } }));
    setDirty(true);
    setStatus("");
  }

  function resetBox() {
    setBox((prev) => ({ ...prev, [target]: { ...ORIGIN[target] } }));
    setDirty(true);
    setStatus("");
  }

  function discard() {
    setBox({ question: { ...ORIGIN.question }, scheme: { ...ORIGIN.scheme } });
    setVariant("Paper 1"); setSession("May/June"); setYear("2023"); setQnum("8"); setMarks("11");
    setTopics(["Integration"]); setSchemeAttached(true);
    setDirty(false);
    setStatus("Changes discarded.");
    setStatusColor("var(--color-admin-graphite)");
  }

  const sliders: { key: keyof Box; label: string; min: number; max: number }[] = [
    { key: "x", label: "Left", min: 0, max: 90 },
    { key: "y", label: "Top", min: 0, max: 90 },
    { key: "w", label: "Width", min: 10, max: 100 },
    { key: "h", label: "Height", min: 5, max: 100 },
  ];

  return (
    <div className="min-h-screen bg-admin-paper font-body text-[14px] text-admin-ink">
      <header className="flex flex-wrap items-center gap-5 bg-admin-ink px-5 py-2.5 text-[#E8EBEF]">
        <span className="font-display text-sm font-semibold">Questionbank admin</span>
        <span className="text-[13px] text-[#9AA4B0]">Question editor</span>
        <span className="text-[13px] text-[#9AA4B0] [font-variant-numeric:tabular-nums]">
          q_9709_s23_11_{qnum} · opened from the review queue
        </span>
        <span className="ml-auto text-[13px]" style={{ color: dirty ? "#F2A24E" : "#9AA4B0" }}>
          {dirty ? "Unsaved changes" : "No changes since last save"}
        </span>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-100px)] max-w-[1560px] grid-cols-[minmax(0,1.3fr)_minmax(360px,0.8fr)] border border-admin-line bg-surface max-[1040px]:grid-cols-1">
        <section className="min-w-0 p-5">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {(["question", "scheme"] as Target[]).map((k) => {
              const on = k === target;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTarget(k)}
                  className="cursor-pointer px-[15px] py-2.5 font-body text-[13px]"
                  style={{
                    border: `1px solid ${on ? "var(--color-admin-ink)" : "var(--color-admin-line)"}`,
                    background: on ? "var(--color-admin-ink)" : "transparent",
                    color: on ? "#fff" : "var(--color-admin-ink)",
                    fontWeight: on ? 600 : 500,
                  }}
                >
                  {k === "question" ? "Question crop" : "Marking scheme crop"}
                </button>
              );
            })}
            <span className="ml-auto self-center text-[13px] text-admin-graphite [font-variant-numeric:tabular-nums]">
              Crop {Math.round(b.w * 15.9)} × {Math.round(b.h * 22.5)} px at 150 dpi
            </span>
          </div>

          <div className="relative flex justify-center overflow-hidden border border-admin-line bg-[#DDE1E6]">
            <div className="relative min-w-0 max-w-full flex-none" style={{ height: "min(56vh, 760px)", width: "calc(min(56vh, 760px) / 1.414)" }}>
              <div className="flex h-full w-full items-center justify-center bg-white px-4 text-center text-sm text-admin-graphite">
                {isQ ? "Drop the source paper page (9709 s23 qp 11, page 16)" : "Drop the source marking scheme page (9709 s23 ms 11, page 7)"}
              </div>
              <div
                className="pointer-events-none absolute border-2 border-cobalt transition-all duration-100"
                style={{
                  left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`,
                  boxShadow: "0 0 0 9999px rgba(20,24,31,.42)",
                }}
              >
                <span className="absolute -left-px -top-px h-2.5 w-2.5 bg-cobalt" />
                <span className="absolute -right-px -top-px h-2.5 w-2.5 bg-cobalt" />
                <span className="absolute -bottom-px -left-px h-2.5 w-2.5 bg-cobalt" />
                <span className="absolute -bottom-px -right-px h-2.5 w-2.5 bg-cobalt" />
                <span className="absolute -top-6 left-0 whitespace-nowrap bg-cobalt px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {isQ ? `Question ${qnum}` : `Scheme for Q${qnum}`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3.5 max-[640px]:grid-cols-2">
            {sliders.map((s) => (
              <label key={s.key} className="block">
                <span className="mb-1 flex items-baseline justify-between gap-2 text-xs text-admin-graphite">
                  {s.label}
                  <span className="font-display font-semibold text-admin-ink [font-variant-numeric:tabular-nums]">{b[s.key].toFixed(1)}%</span>
                </span>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={0.5}
                  value={b[s.key]}
                  onChange={(e) => setBoxField(s.key, parseFloat(e.target.value))}
                  className="w-full cursor-pointer accent-cobalt"
                />
              </label>
            ))}
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setBoxField("h", Math.min(100 - b.y, b.h + 6))}
              className="cursor-pointer border border-admin-line bg-transparent px-3.5 py-2.5 font-body text-[13px] font-medium text-admin-ink hover:border-admin-graphite"
            >
              Snap to detected text block
            </button>
            <button
              type="button"
              onClick={resetBox}
              disabled={!moved}
              className="border border-admin-line bg-transparent px-3.5 py-2.5 font-body text-[13px] font-medium text-admin-graphite hover:border-admin-graphite hover:text-admin-ink disabled:cursor-not-allowed"
              style={{ opacity: moved ? 1 : 0.45, cursor: moved ? "pointer" : "not-allowed" }}
            >
              Reset to extractor bounds
            </button>
            <span className="text-[13px] text-admin-graphite">
              {moved ? "Moved from the extractor bounds." : "Matching the extractor bounds."}
            </span>
          </div>
        </section>

        <aside className="flex flex-col gap-5 border-l border-admin-line p-5 max-[1040px]:border-l-0 max-[1040px]:border-t">
          <div>
            <h2 className="mb-2.5 font-display text-[15px] font-semibold">Metadata</h2>
            <div className="grid grid-cols-2 gap-2.5">
              <label className="block">
                <span className="mb-1 block text-xs text-admin-graphite">Paper</span>
                <select value={variant} onChange={(e) => patch(setVariant, e.target.value)} className="w-full cursor-pointer border border-admin-line bg-surface px-2.5 py-2.5 font-body text-sm font-medium text-admin-ink">
                  {["Paper 1", "Paper 2", "Paper 3", "Paper 4", "Paper 5"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-admin-graphite">Session</span>
                <select value={session} onChange={(e) => patch(setSession, e.target.value)} className="w-full cursor-pointer border border-admin-line bg-surface px-2.5 py-2.5 font-body text-sm font-medium text-admin-ink">
                  {["May/June", "Oct/Nov", "Feb/Mar"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-admin-graphite">Year</span>
                <select value={year} onChange={(e) => patch(setYear, e.target.value)} className="w-full cursor-pointer border border-admin-line bg-surface px-2.5 py-2.5 font-body text-sm font-medium text-admin-ink">
                  {["2016","2017","2018","2019","2020","2021","2022","2023","2024"].map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-admin-graphite">Question number</span>
                <input type="text" value={qnum} onChange={(e) => patch(setQnum, e.target.value)} className="w-full border border-admin-line bg-surface px-2.5 py-2.5 font-display text-sm font-semibold text-admin-ink [font-variant-numeric:tabular-nums]" />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-admin-graphite">Marks</span>
                <input
                  type="text"
                  value={marks}
                  onChange={(e) => patch(setMarks, e.target.value)}
                  className="w-full border bg-surface px-2.5 py-2.5 font-display text-sm font-semibold text-admin-ink [font-variant-numeric:tabular-nums]"
                  style={{ borderColor: marksBad ? "var(--color-ember)" : "var(--color-admin-line)" }}
                />
              </label>
            </div>
            {marksBad && (
              <p className="mt-2 text-[13px] leading-[1.5] text-ember">
                Marks must be a whole number between 1 and 20. The extractor read 11 at 62% confidence, so check the paper.
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-2 font-display text-[15px] font-semibold">Syllabus topics</h2>
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {topics.map((name) => (
                <span key={name} className="inline-flex items-center gap-1.5 border border-cobalt bg-tint py-1.5 pl-2.5 pr-1.5 text-[13px] font-medium">
                  {name}
                  <button
                    type="button"
                    onClick={() => patch(setTopics, topics.filter((x) => x !== name))}
                    title={`Remove ${name}`}
                    className="cursor-pointer border-none bg-transparent px-0.5 leading-none text-admin-graphite hover:text-ember"
                  >
                    ×
                  </button>
                </span>
              ))}
              {topics.length === 0 && (
                <span className="text-[13px] text-ember">No topic tagged. A question with no topic never reaches a student.</span>
              )}
            </div>
            <div className="flex flex-wrap gap-[5px]">
              {ALL_TOPICS.filter((t) => !topics.includes(t)).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => patch(setTopics, [...topics, name])}
                  className="cursor-pointer border border-dashed border-admin-line bg-transparent px-2.5 py-1.5 font-body text-[13px] font-medium text-admin-graphite hover:border-admin-graphite hover:text-admin-ink"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-display text-[15px] font-semibold">Marking scheme</h2>
            <div className="flex items-baseline justify-between gap-3 border-y border-admin-line py-2">
              <span className="text-[13px] text-admin-graphite">9709_s23_ms_11.pdf, page 7</span>
              <span className="text-[13px] font-semibold" style={{ color: schemeAttached ? "var(--color-admin-ink)" : "var(--color-ember)" }}>
                {schemeAttached ? "Attached" : "Not attached"}
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button type="button" onClick={() => setTarget("scheme")} className="cursor-pointer border border-admin-line bg-transparent px-3.5 py-2.5 font-body text-[13px] font-medium text-admin-ink hover:border-admin-graphite">
                Re-crop the scheme
              </button>
              <button
                type="button"
                onClick={() => patch(setSchemeAttached, false)}
                disabled={!schemeAttached}
                className="border border-admin-line bg-transparent px-3.5 py-2.5 font-body text-[13px] font-medium text-admin-graphite hover:border-ember hover:text-ember disabled:cursor-not-allowed"
                style={{ opacity: schemeAttached ? 1 : 0.45, cursor: schemeAttached ? "pointer" : "not-allowed" }}
              >
                Detach
              </button>
            </div>
          </div>

          <div className="mt-auto text-[13px] leading-[1.6] text-admin-graphite">
            Extracted by job 214 on 6 September. Flagged in review for a marks reading of 62%. Last edited by you, 2 minutes ago.
          </div>
        </aside>
      </main>

      <footer className="sticky bottom-0 mx-auto flex max-w-[1560px] flex-wrap items-center gap-x-2.5 gap-y-2 border-t-2 border-admin-ink bg-surface px-5 py-3">
        <button
          type="button"
          disabled={saveOff}
          onClick={() => { setDirty(false); setStatus("Saved. Live to students now."); setStatusColor("var(--color-admin-ink)"); }}
          className="border-none px-[22px] py-3 font-body text-[15px] font-semibold text-cobalt-ink transition-colors active:translate-y-px disabled:cursor-not-allowed"
          style={{ background: saveOff ? "var(--color-admin-graphite)" : "var(--color-cobalt)", opacity: saveOff ? 0.45 : 1, cursor: saveOff ? "not-allowed" : "pointer" }}
        >
          {marksBad ? "Fix the marks to save" : topics.length === 0 ? "Add a topic to save" : "Save changes"}
        </button>
        <button
          type="button"
          disabled={saveOff}
          onClick={() => { setDirty(false); setStatus(`Saved. Next flagged question is q_9709_s23_11_9.`); setStatusColor("var(--color-admin-ink)"); }}
          className="border border-admin-line bg-transparent px-4 py-[11px] font-body text-sm font-medium text-admin-ink disabled:cursor-not-allowed"
          style={{ opacity: saveOff ? 0.45 : 1, cursor: saveOff ? "not-allowed" : "pointer" }}
        >
          Save and open the next flagged question
        </button>
        <button
          type="button"
          disabled={saveOff}
          onClick={discard}
          className="border-none bg-transparent px-3 py-[11px] font-body text-sm font-medium text-admin-graphite hover:text-ember disabled:cursor-not-allowed"
          style={{ opacity: saveOff ? 0.45 : 1, cursor: saveOff ? "not-allowed" : "pointer" }}
        >
          Discard changes
        </button>
        {status && <span className="ml-2 text-[13px]" style={{ color: statusColor }}>{status}</span>}
      </footer>
    </div>
  );
}
