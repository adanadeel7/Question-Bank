import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavRail } from "../components/NavRail";

const QUESTIONS = [
  {
    code: "9709", paper: "Paper 1", session: "May/June", year: "2023", qnum: "7", marks: 5, ratio: "16 / 10",
    topics: ["Coordinate geometry"], attempted: 12, totalInTopic: 38,
    schemeNote: "Accept any correct equivalent form of the circle equation. Radius may be left as √100 before simplifying — full marks awarded either way.",
    cropText: "The points A(−2, 1) and B(6, 7) are the endpoints of a diameter of a circle C.\n(a) Find the coordinates of the centre of C and the length of its radius. [3]\n(b) Find the equation of C in the form (x − a)² + (y − b)² = r². [2]",
    scheme: [
      { part: "(a)", answer: "Centre = midpoint of AB = (2, 4)", mark: "B1" },
      { part: "", answer: "Radius = ½√(8² + 6²) = 5", mark: "M1 A1" },
      { part: "(b)", answer: "(x − 2)² + (y − 4)² = 25", mark: "B1" },
    ],
  },
  {
    code: "9709", paper: "Paper 1", session: "Oct/Nov", year: "2022", qnum: "9", marks: 9, ratio: "16 / 10",
    topics: ["Integration"], attempted: 15, totalInTopic: 53,
    schemeNote: "Exact form required in (b) — a decimal answer scores A0 for the final mark. Omission of π loses B1 only.",
    cropText: "The diagram shows the curve y = 4/(2x + 1) and the lines x = 0 and x = 3.\n(a) Find the area of the region bounded by the curve, the lines x = 0 and x = 3, and the x-axis. [4]\n(b) The region is rotated through 360° about the x-axis. Find the exact volume of the solid formed. [5]",
    scheme: [
      { part: "(a)", answer: "∫ 4/(2x + 1) dx = 2 ln(2x + 1)", mark: "M1 A1" },
      { part: "", answer: "[2 ln(2x + 1)] from 0 to 3 = 2 ln 7", mark: "M1 A1" },
      { part: "(b)", answer: "V = π ∫ 16/(2x + 1)² dx", mark: "B1" },
      { part: "", answer: "= π[−8/(2x+1)] = π(8 − 8/7)", mark: "M1 A1" },
      { part: "", answer: "V = 48π/7", mark: "A1" },
    ],
  },
  {
    code: "9709", paper: "Paper 1", session: "Feb/Mar", year: "2021", qnum: "4", marks: 6, ratio: "16 / 9",
    topics: ["Integration", "Trigonometry"], attempted: 17, totalInTopic: 44,
    schemeNote: "In (b) the double-angle substitution must be seen or clearly implied. Answer must be exact.",
    cropText: "(a) Show that sin 2θ cot θ may be written in the form 2 cos²θ. [2]\n(b) Hence find the exact value of the integral of sin 2θ cot θ with respect to θ, from 0 to π/4. [4]",
    scheme: [
      { part: "(a)", answer: "sin 2θ = 2 sin θ cos θ, cot θ = cos θ / sin θ", mark: "M1" },
      { part: "", answer: "Product = 2 cos²θ", mark: "A1" },
      { part: "(b)", answer: "2 cos²θ = 1 + cos 2θ", mark: "B1" },
      { part: "", answer: "∫(1 + cos 2θ) dθ = θ + ½ sin 2θ", mark: "M1 A1" },
      { part: "", answer: "= π/4 + ½", mark: "A1" },
    ],
  },
];

const KEYS = [
  { key: "Enter", does: "Show marking scheme" },
  { key: "0–9", does: "Enter your marks" },
  { key: "→", does: "Next question" },
  { key: "S", does: "Skip" },
  { key: "Z", does: "Zoom the question" },
];

const TOTAL = 8;

export function PracticeSession() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [seconds, setSeconds] = useState(0);

  const q = QUESTIONS[i % QUESTIONS.length];

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  function doReveal() {
    setRevealed(true);
  }

  function doNext() {
    if (i + 1 >= TOTAL) {
      navigate("/session/summary");
      return;
    }
    setI((prev) => (prev + 1) % TOTAL);
    setRevealed(false);
    setScore(null);
    setZoom(1);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target && /input|textarea/i.test(target.tagName)) return;
      if (e.key === "Enter" && !revealed) { e.preventDefault(); doReveal(); return; }
      if (/^[0-9]$/.test(e.key) && revealed) {
        const n = parseInt(e.key, 10);
        if (n <= q.marks) { e.preventDefault(); setScore(n); }
        return;
      }
      if (e.key === "ArrowRight" && score !== null) { e.preventDefault(); doNext(); return; }
      if (e.key.toLowerCase() === "s" && !revealed) { e.preventDefault(); doNext(); return; }
      if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        setZoom((z) => (z >= 1.75 ? 1 : Math.round((z + 0.25) * 100) / 100));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const segments = Array.from({ length: TOTAL }, (_, k) => ({
    bg: k < i ? "var(--color-cobalt)" : k === i ? "var(--color-cobalt-mid)" : "var(--color-line)",
  }));

  const pad = Array.from({ length: q.marks + 1 }, (_, n) => n);
  const frac = score === null ? 0 : score / q.marks;
  const scoreNote =
    score === null ? "" :
    frac === 1 ? "Full marks. This one moves out of your drill rotation." :
    frac >= 0.6 ? "Most of the method marks. Mastery moves up a little." :
    frac > 0 ? "Partial credit. This topic stays in tomorrow's drill." :
    "Nothing yet. You'll see this question again in three days.";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
      <NavRail />

      <main className="max-w-[1520px] px-[34px] pb-[60px] pt-[26px] max-[760px]:px-4 max-[760px]:pb-24 max-[760px]:pt-3.5">
        <div className="flex items-center gap-[22px] pb-[22px]">
          <button
            type="button"
            onClick={() => navigate("/session/summary")}
            className="flex cursor-pointer items-center gap-[7px] rounded-lg border-none bg-transparent py-1.5 pr-2 font-body text-sm font-medium text-graphite hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m7-7-7 7 7 7" />
            </svg>
            End session
          </button>
          <div className="flex items-baseline gap-2 font-display [font-variant-numeric:tabular-nums]">
            <span className="text-[19px] font-semibold">{i + 1}</span>
            <span className="text-sm font-medium text-graphite">of {TOTAL}</span>
          </div>
          <div className="flex max-w-[420px] flex-1 gap-1">
            {segments.map((s, k) => (
              <span key={k} className="h-[5px] flex-1 rounded-sm transition-colors duration-200" style={{ background: s.bg }} />
            ))}
          </div>
          <span className="text-sm text-graphite [font-variant-numeric:tabular-nums]">
            {mins}:{String(secs).padStart(2, "0")}
          </span>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] items-start gap-[26px]">
          <section className="flex min-w-0 flex-col gap-4">
            <figure
              className="relative m-0 overflow-hidden border border-line bg-surface shadow-sh2 transition-transform duration-[340ms]"
              style={{ transform: revealed ? "translateY(-6px)" : "none", transitionTimingFunction: "cubic-bezier(.2,.8,.2,1)" }}
            >
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: q.ratio }}>
                <div
                  className="absolute inset-0 origin-top-left whitespace-pre-line p-6 text-[15px] leading-[1.7] text-ink transition-transform duration-200"
                  style={{ transform: `scale(${zoom})`, width: `${(100 / zoom).toFixed(2)}%`, height: `${(100 / zoom).toFixed(2)}%` }}
                >
                  {q.cropText}
                </div>
              </div>
              <div className="absolute right-2.5 top-2.5 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, Math.round((z - 0.25) * 100) / 100))}
                  disabled={zoom <= 1}
                  title="Zoom out"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink hover:border-graphite disabled:cursor-not-allowed"
                  style={{ opacity: zoom <= 1 ? 0.45 : 1 }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M8 11h6M20 20l-4.3-4.3" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2, Math.round((z + 0.25) * 100) / 100))}
                  disabled={zoom >= 2}
                  title="Zoom in (Z)"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-ink hover:border-graphite disabled:cursor-not-allowed"
                  style={{ opacity: zoom >= 2 ? 0.45 : 1 }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M11 8v6M8 11h6M20 20l-4.3-4.3" /></svg>
                </button>
              </div>
            </figure>

            <div className="flex flex-wrap items-center gap-2">
              {q.topics.map((t) => (
                <span key={t} className="rounded bg-tint px-2.5 py-1.5 text-[13px] font-medium text-ink">{t}</span>
              ))}
              <span className="ml-auto text-[13px] text-graphite">
                You've attempted {q.attempted} of {q.totalInTopic} {q.topics[0].toLowerCase()} questions
              </span>
            </div>

            {!revealed && (
              <div className="flex flex-wrap items-center gap-3 pt-1.5">
                <button
                  type="button"
                  onClick={doReveal}
                  className="cursor-pointer rounded-lg border-none bg-cobalt px-[26px] py-[15px] font-body text-base font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt"
                >
                  Show marking scheme
                </button>
                <button
                  type="button"
                  onClick={doNext}
                  className="cursor-pointer rounded-lg border border-line bg-transparent px-5 py-3.5 font-body text-[15px] font-medium text-ink hover:border-graphite"
                >
                  Skip this question
                </button>
                <span className="text-[13px] text-graphite">Press Enter to reveal, Z to zoom</span>
              </div>
            )}
          </section>

          {revealed && (
            <section className="min-w-0 animate-rise-in overflow-hidden rounded-xl border border-line bg-surface shadow-sh3">
              <header className="flex items-baseline justify-between gap-4 border-b border-line px-6 pb-4 pt-5">
                <h2 className="font-display text-[19px] font-semibold">Marking scheme</h2>
                <span className="text-[13px] text-graphite [font-variant-numeric:tabular-nums]">
                  {q.code} {q.paper} · {q.session} {q.year}
                </span>
              </header>

              <div className="animate-line-in px-6 py-5 [animation-delay:60ms]">
                <div className="flex flex-col gap-1.5 border border-line bg-paper p-4 text-sm">
                  {q.scheme.map((row, k) => (
                    <div key={k} className="flex items-baseline gap-2.5">
                      <span className="w-7 shrink-0 font-medium text-graphite">{row.part}</span>
                      <span className="flex-1">{row.answer}</span>
                      <span className="font-display text-xs font-semibold text-graphite">{row.mark}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3.5 text-[13px] leading-[1.6] text-graphite">{q.schemeNote}</p>
              </div>

              <div className="animate-pad-in border-t border-line bg-paper px-6 pb-6 pt-5 [animation-delay:120ms]">
                <h3 className="mb-1 font-display text-[17px] font-semibold">How many marks did you get?</h3>
                <p className="mb-3.5 text-sm text-graphite">
                  Out of {q.marks}. Be honest — this is what decides tomorrow's drill.
                </p>
                <div className="grid max-w-[520px] grid-cols-[repeat(auto-fill,minmax(52px,1fr))] gap-2">
                  {pad.map((n) => {
                    const on = score === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setScore(n)}
                        className="h-[52px] cursor-pointer rounded font-display text-lg font-semibold transition-colors [font-variant-numeric:tabular-nums] hover:border-ember"
                        style={{
                          border: `1px solid ${on ? "var(--color-ember)" : "var(--color-line)"}`,
                          background: on ? "var(--color-ember)" : "var(--color-surface)",
                          color: on ? "var(--color-on-ember)" : "var(--color-ink)",
                        }}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>

                {score !== null && (
                  <div className="animate-total-in mt-[22px] flex flex-wrap items-center gap-[18px]">
                    <div className="flex items-baseline gap-1.5 font-display [font-variant-numeric:tabular-nums]">
                      <span className="text-[44px] font-semibold leading-none text-ember">{score}</span>
                      <span className="text-xl font-medium text-graphite">/ {q.marks}</span>
                    </div>
                    <span className="max-w-[240px] text-sm leading-[1.5] text-graphite">{scoreNote}</span>
                    <button
                      type="button"
                      onClick={doNext}
                      className="ml-auto cursor-pointer rounded-lg border-none bg-cobalt px-[26px] py-[15px] font-body text-base font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt"
                    >
                      {i + 1 >= TOTAL ? "Finish session" : "Next question"}
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          <aside className="sticky top-[26px] flex w-[264px] flex-col overflow-hidden rounded-xl border border-line bg-surface max-[1180px]:hidden">
            <div className="border-b border-line px-5 pb-4 pt-[18px]">
              <div className="mb-1 text-xs text-graphite">Paper</div>
              <div className="font-display text-base font-semibold [font-variant-numeric:tabular-nums]">{q.code} {q.paper}</div>
            </div>
            <div className="border-b border-line px-5 py-4">
              <div className="mb-1 text-xs text-graphite">Session</div>
              <div className="font-display text-base font-semibold">{q.session} {q.year}</div>
            </div>
            <div className="grid grid-cols-2 border-b border-line">
              <div className="border-r border-line px-5 py-4">
                <div className="mb-1 text-xs text-graphite">Question</div>
                <div className="font-display text-base font-semibold">{q.qnum}</div>
              </div>
              <div className="px-5 py-4">
                <div className="mb-1 text-xs text-graphite">Marks</div>
                <div className="font-display text-base font-semibold [font-variant-numeric:tabular-nums]">{q.marks}</div>
              </div>
            </div>
            <div className="border-b border-line px-5 py-4">
              <div className="mb-[7px] text-xs text-graphite">Syllabus topics</div>
              <div className="flex flex-col gap-[5px]">
                {q.topics.map((t) => <span key={t} className="text-sm font-medium">{t}</span>)}
              </div>
            </div>
            <div className="flex flex-col gap-0.5 px-5 py-4">
              <button type="button" className="cursor-pointer rounded-md border-none bg-transparent py-2 text-left font-body text-sm font-medium text-graphite hover:text-ink">
                Report a problem with this question
              </button>
              <span className="pt-1.5 text-[13px] leading-[1.5] text-graphite">
                Wrong crop, missing scheme, or wrong topic tag. We re-check it within a day.
              </span>
            </div>
          </aside>
        </div>

        <div className="mt-[34px] flex flex-wrap gap-x-[22px] gap-y-2 border-t border-line pt-[18px]">
          {KEYS.map((k) => (
            <span key={k.key} className="flex items-center gap-[7px] text-[13px] text-graphite">
              <kbd className="min-w-5 rounded border border-b-2 border-line px-1.5 py-0.5 text-center font-display text-xs font-semibold text-ink">
                {k.key}
              </kbd>
              {k.does}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
