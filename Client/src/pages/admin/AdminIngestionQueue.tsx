import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QUEUE = [
  {
    page: 14, bounds: "112, 388 to 1488, 1160", variant: "1", session: "May/June", year: "2023", qnum: "7", marks: 8,
    topics: [{ name: "Vectors", conf: 0.97 }, { name: "3D geometry", conf: 0.71 }],
    conf: { qnum: 0.99, marks: 0.98, year: 1, session: 1, variant: 1 },
    schemeStatus: "attached, page 6 of the scheme",
  },
  {
    page: 16, bounds: "96, 210 to 1502, 1345", variant: "1", session: "May/June", year: "2023", qnum: "8", marks: 11,
    topics: [{ name: "Integration", conf: 0.94 }],
    conf: { qnum: 0.97, marks: 0.62, year: 1, session: 1, variant: 1 },
    cropFlag: "bottom edge may clip part (iii)",
    schemeStatus: "attached, page 7 of the scheme",
  },
  {
    page: 18, bounds: "110, 402 to 1480, 990", variant: "1", session: "May/June", year: "2023", qnum: "9", marks: 6,
    topics: [{ name: "Trigonometry", conf: 0.55 }, { name: "Circular measure", conf: 0.52 }],
    conf: { qnum: 0.98, marks: 0.95, year: 1, session: 1, variant: 1 },
    topicWarn: "Two topics under 60% confidence. The extractor could not tell whether this is trig or circular measure — it is probably one, not both.",
    schemeStatus: "attached, page 8 of the scheme",
  },
  {
    page: 20, bounds: "104, 250 to 1494, 1210", variant: "1", session: "May/June", year: "2023", qnum: "10", marks: 9,
    topics: [{ name: "Differentiation", conf: 0.91 }],
    conf: { qnum: 0.99, marks: 0.97, year: 1, session: 1, variant: 1 },
    schemeStatus: "not found — flag before approving",
  },
  {
    page: 22, bounds: "118, 330 to 1476, 1105", variant: "1", session: "May/June", year: "2023", qnum: "11", marks: 12,
    topics: [{ name: "Integration", conf: 0.89 }, { name: "Functions", conf: 0.64 }],
    conf: { qnum: 0.99, marks: 0.99, year: 1, session: 1, variant: 1 },
    schemeStatus: "attached, page 9 of the scheme",
  },
];

const QUEUE_TOTAL = 300;

function pct(v: number) {
  return `${(v * 100).toFixed(0)}%`;
}
function confColor(v: number) {
  return v < 0.7 ? "var(--color-ember)" : "var(--color-admin-graphite)";
}

export function AdminIngestionQueue() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [approved, setApproved] = useState(88);
  const [sentBack, setSentBack] = useState(13);
  const [note, setNote] = useState("");
  const [noteColor, setNoteColor] = useState("var(--color-admin-graphite)");
  const [startedAt] = useState(() => Date.now() - 31 * 60000);

  const done = approved + sentBack;
  const q = QUEUE[i % QUEUE.length];
  const left = QUEUE_TOTAL - done;
  const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
  const rate = (done / mins).toFixed(1);
  const lowest = Math.min(q.conf.marks, q.conf.qnum, ...q.topics.map((t) => t.conf));

  function move(d: number) {
    setI((prev) => (prev + d + QUEUE.length) % QUEUE.length);
    setNote("");
    setNoteColor("var(--color-admin-graphite)");
  }

  function act(kind: "approve" | "crop" | "tags" | "skip") {
    const next = (i + 1) % QUEUE.length;
    if (kind === "approve") {
      setApproved((v) => v + 1);
      setNote(`Approved Q${q.qnum}, live to students.`);
      setNoteColor("var(--color-admin-ink)");
      setI(next);
    } else if (kind === "crop") {
      navigate("/admin/questions/editor");
    } else if (kind === "tags") {
      setSentBack((v) => v + 1);
      setNote(`Q${q.qnum} sent to re-tagging.`);
      setNoteColor("var(--color-ember)");
      setI(next);
    } else {
      setNote(`Skipped Q${q.qnum}, stays in the queue.`);
      setNoteColor("var(--color-admin-graphite)");
      setI(next);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === "a" || e.key === "Enter") { e.preventDefault(); act("approve"); }
      else if (k === "c") { e.preventDefault(); act("crop"); }
      else if (k === "t") { e.preventDefault(); act("tags"); }
      else if (k === "s") { e.preventDefault(); act("skip"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const fields = [
    { label: "Subject", value: "Mathematics 9709", c: 1 },
    { label: "Paper", value: "Paper 1", c: 1 },
    { label: "Variant", value: q.variant, c: q.conf.variant },
    { label: "Session", value: q.session, c: q.conf.session },
    { label: "Year", value: q.year, c: q.conf.year },
    { label: "Question", value: q.qnum, c: q.conf.qnum },
    { label: "Marks", value: q.marks, c: q.conf.marks },
  ];

  return (
    <div className="min-h-screen bg-admin-paper font-body text-[14px] text-admin-ink">
      <header className="flex flex-wrap items-center gap-x-[22px] gap-y-2.5 bg-admin-ink px-5 py-2.5 text-[#E8EBEF]">
        <span className="font-display text-sm font-semibold">Questionbank admin</span>
        <span className="text-[13px] text-[#9AA4B0]">Ingestion review</span>
        <span className="text-[13px] text-[#9AA4B0] [font-variant-numeric:tabular-nums]">9709_s23_qp_11.pdf, job 214</span>
        <div className="ml-auto flex items-center gap-3.5">
          <span className="text-[13px] text-[#9AA4B0] [font-variant-numeric:tabular-nums]">
            {done} reviewed, {rate} a minute
          </span>
          <div className="flex items-baseline gap-1.5 [font-variant-numeric:tabular-nums]">
            <span className="font-display text-lg font-semibold">{left}</span>
            <span className="text-[13px] text-[#9AA4B0]">left of {QUEUE_TOTAL}</span>
          </div>
        </div>
      </header>
      <div className="h-[3px] bg-[#2A3140]">
        <div className="h-full bg-cobalt transition-[width] duration-200" style={{ width: `${((done / QUEUE_TOTAL) * 100).toFixed(1)}%` }} />
      </div>

      <main className="mx-auto grid max-w-[1500px] min-h-[calc(100vh-116px)] grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)] border border-admin-line bg-surface max-[980px]:grid-cols-1">
        <section className="min-w-0 p-5">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-[18px] gap-y-2">
            <span className="text-[13px] font-semibold [font-variant-numeric:tabular-nums]">Crop {done + 1} of {QUEUE_TOTAL}</span>
            <span className="text-[13px] text-admin-graphite [font-variant-numeric:tabular-nums]">
              9709 Paper {q.variant} · {q.session} {q.year} · page {q.page}
            </span>
            <span className="ml-auto text-[13px]" style={{ color: lowest < 0.7 ? "var(--color-ember)" : "var(--color-admin-graphite)" }}>
              {lowest < 0.7 ? "Low-confidence fields below, check before approving" : "All fields above 70% confidence"}
            </span>
          </div>
          <div className="relative aspect-[16/10] border border-admin-line bg-white">
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-admin-graphite">
              Extracted crop — {q.session} {q.year} Q{q.qnum}
            </div>
            {q.cropFlag && (
              <div className="pointer-events-none absolute bottom-2.5 left-2.5 bg-ember px-2 py-1 text-xs font-semibold text-white">
                Extractor flagged this crop: {q.cropFlag}
              </div>
            )}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-admin-graphite">
            <span className="[font-variant-numeric:tabular-nums]">Page {q.page}, bounds {q.bounds}</span>
            <span>Scheme crop: {q.schemeStatus}</span>
          </div>
        </section>

        <aside className="flex flex-col border-l border-admin-line p-5 max-[980px]:border-l-0 max-[980px]:border-t">
          <h2 className="mb-3 font-display text-[15px] font-semibold">Detected metadata</h2>
          <div className="border-t border-admin-line">
            {fields.map((f) => (
              <div
                key={f.label}
                className="grid grid-cols-[112px_minmax(0,1fr)_auto] items-baseline gap-2.5 border-b border-admin-line py-2"
                style={{ background: f.c < 0.7 ? "rgba(184,87,8,.07)" : "transparent" }}
              >
                <span className="text-[13px] text-admin-graphite">{f.label}</span>
                <span className="text-sm font-semibold [font-variant-numeric:tabular-nums]">{f.value}</span>
                <span className="text-xs [font-variant-numeric:tabular-nums]" style={{ color: confColor(f.c) }}>
                  {f.c === 1 ? "from filename" : pct(f.c)}
                </span>
              </div>
            ))}
          </div>

          <div className="py-3">
            <span className="text-[13px] text-admin-graphite">Topics</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {q.topics.map((t) => (
                <span
                  key={t.name}
                  className="border px-2.5 py-1.5 text-[13px] font-medium"
                  style={{
                    background: t.conf < 0.7 ? "rgba(184,87,8,.07)" : "var(--color-tint)",
                    borderColor: t.conf < 0.7 ? "var(--color-ember)" : "transparent",
                  }}
                >
                  {t.name} <span className="[font-variant-numeric:tabular-nums]" style={{ color: confColor(t.conf) }}>{pct(t.conf)}</span>
                </span>
              ))}
            </div>
            {q.topicWarn && <p className="mt-2.5 text-[13px] leading-[1.5] text-ember">{q.topicWarn}</p>}
          </div>

          <div className="mt-auto pt-4 text-[13px] leading-[1.6] text-admin-graphite">
            Session so far: {approved} approved, {sentBack} sent back. Everything you approve is live to students
            immediately.
          </div>
        </aside>
      </main>

      <footer className="sticky bottom-0 mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-2.5 gap-y-2 border-t-2 border-admin-ink bg-surface px-5 py-3">
        <button type="button" onClick={() => act("approve")} className="cursor-pointer border-none bg-cobalt px-[22px] py-3 font-body text-[15px] font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press active:translate-y-px">
          Approve <kbd className="ml-1.5 bg-white/20 px-1.5 py-0.5 font-display text-[11px] font-semibold">A</kbd>
        </button>
        <button type="button" onClick={() => act("crop")} className="cursor-pointer border border-admin-line bg-transparent px-4 py-[11px] font-body text-sm font-medium text-admin-ink hover:border-admin-graphite">
          Fix crop <kbd className="ml-1.5 border border-admin-line px-1.5 py-0.5 font-display text-[11px] font-semibold">C</kbd>
        </button>
        <button type="button" onClick={() => act("tags")} className="cursor-pointer border border-admin-line bg-transparent px-4 py-[11px] font-body text-sm font-medium text-admin-ink hover:border-admin-graphite">
          Fix tags <kbd className="ml-1.5 border border-admin-line px-1.5 py-0.5 font-display text-[11px] font-semibold">T</kbd>
        </button>
        <button type="button" onClick={() => act("skip")} className="cursor-pointer border border-admin-line bg-transparent px-4 py-[11px] font-body text-sm font-medium text-admin-graphite hover:border-admin-graphite hover:text-admin-ink">
          Skip <kbd className="ml-1.5 border border-admin-line px-1.5 py-0.5 font-display text-[11px] font-semibold">S</kbd>
        </button>
        {note && <span className="ml-2 text-[13px]" style={{ color: noteColor }}>{note}</span>}
        <span className="ml-auto text-[13px] text-admin-graphite max-[640px]:hidden">Arrow keys move between crops without deciding</span>
      </footer>
    </div>
  );
}
