import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavRail } from "../components/NavRail";
import {
  createAttemptRequest,
  getMarkingSchemeRequest,
  type ApiQuestion,
} from "../lib/api";

const KEYS = [
  { key: "Enter", does: "Show marking scheme" },
  { key: "0–9", does: "Enter your marks" },
  { key: "→", does: "Next question" },
  { key: "S", does: "Skip" },
];

interface LocationState {
  questions?: ApiQuestion[];
}

export function PracticeSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const questions = (location.state as LocationState | null)?.questions ?? [];
  const total = questions.length;

  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [markingScheme, setMarkingScheme] = useState<{ url: string } | null>(null);
  const [markingSchemeError, setMarkingSchemeError] = useState("");
  const [revealing, setRevealing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(() => Date.now());
  const [results, setResults] = useState<{ question: ApiQuestion; score: number | null }[]>([]);

  const q = questions[i];

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  async function doReveal() {
    if (!q || revealed || revealing) return;
    setRevealing(true);
    setMarkingSchemeError("");
    try {
      const data = await getMarkingSchemeRequest(q._id);
      setMarkingScheme(data.marking_scheme);
      setRevealed(true);
    } catch (err) {
      setMarkingSchemeError(err instanceof Error ? err.message : "Could not load the marking scheme");
    } finally {
      setRevealing(false);
    }
  }

  async function doNext() {
    if (!q) return;

    if (score !== null) {
      setSubmitting(true);
      setSubmitError("");
      try {
        await createAttemptRequest({
          question: q._id,
          marksScored: score,
          timeTaken: Math.round((Date.now() - questionStartedAt) / 1000),
        });
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "Could not save this attempt");
      } finally {
        setSubmitting(false);
      }
    }

    const updatedResults = [...results, { question: q, score }];
    setResults(updatedResults);

    if (i + 1 >= total) {
      navigate("/session/summary", { state: { results: updatedResults, durationSeconds: seconds } });
      return;
    }
    setI((prev) => prev + 1);
    setRevealed(false);
    setMarkingScheme(null);
    setScore(null);
    setQuestionStartedAt(Date.now());
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target && /input|textarea/i.test(target.tagName)) return;
      if (e.key === "Enter" && !revealed) { e.preventDefault(); doReveal(); return; }
      if (/^[0-9]$/.test(e.key) && revealed && q) {
        const n = parseInt(e.key, 10);
        if (n <= q.marks) { e.preventDefault(); setScore(n); }
        return;
      }
      if (e.key === "ArrowRight" && score !== null) { e.preventDefault(); doNext(); return; }
      if (e.key.toLowerCase() === "s" && !revealed) { e.preventDefault(); doNext(); return; }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (total === 0) {
    return (
      <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
        <NavRail />
        <main className="flex flex-col items-center justify-center gap-4 px-10 text-center">
          <h1 className="font-display text-2xl font-semibold">No session loaded</h1>
          <p className="text-graphite">Pick some topics first and this screen will have real questions to show.</p>
          <button
            type="button"
            onClick={() => navigate("/topics")}
            className="cursor-pointer rounded-lg border-none bg-cobalt px-6 py-3 font-body text-base font-semibold text-cobalt-ink hover:bg-cobalt-press"
          >
            Go to Topic Picker
          </button>
        </main>
      </div>
    );
  }

  const segments = Array.from({ length: total }, (_, k) => ({
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
            onClick={() => navigate("/session/summary", { state: { results, durationSeconds: seconds } })}
            className="flex cursor-pointer items-center gap-[7px] rounded-lg border-none bg-transparent py-1.5 pr-2 font-body text-sm font-medium text-graphite hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m7-7-7 7 7 7" />
            </svg>
            End session
          </button>
          <div className="flex items-baseline gap-2 font-display [font-variant-numeric:tabular-nums]">
            <span className="text-[19px] font-semibold">{i + 1}</span>
            <span className="text-sm font-medium text-graphite">of {total}</span>
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
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
                <img src={q.content.url} alt={`Question ${q.question_number}`} className="h-full w-full object-contain" />
              </div>
            </figure>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-tint px-2.5 py-1.5 text-[13px] font-medium text-ink">{q.topic}</span>
            </div>

            {!revealed && (
              <div className="flex flex-wrap items-center gap-3 pt-1.5">
                <button
                  type="button"
                  onClick={doReveal}
                  disabled={revealing}
                  className="cursor-pointer rounded-lg border-none bg-cobalt px-[26px] py-[15px] font-body text-base font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {revealing ? "Loading…" : "Show marking scheme"}
                </button>
                <button
                  type="button"
                  onClick={doNext}
                  className="cursor-pointer rounded-lg border border-line bg-transparent px-5 py-3.5 font-body text-[15px] font-medium text-ink hover:border-graphite"
                >
                  Skip this question
                </button>
                <span className="text-[13px] text-graphite">Press Enter to reveal</span>
                {markingSchemeError && <span className="text-[13px] text-ember">{markingSchemeError}</span>}
              </div>
            )}
          </section>

          {revealed && markingScheme && (
            <section className="min-w-0 animate-rise-in overflow-hidden rounded-xl border border-line bg-surface shadow-sh3">
              <header className="flex items-baseline justify-between gap-4 border-b border-line px-6 pb-4 pt-5">
                <h2 className="font-display text-[19px] font-semibold">Marking scheme</h2>
                <span className="text-[13px] text-graphite [font-variant-numeric:tabular-nums]">
                  {q.code} Paper {q.variant} · {q.session} {q.year}
                </span>
              </header>

              <div className="animate-line-in px-6 py-5 [animation-delay:60ms]">
                <div className="flex aspect-[4/3] items-center justify-center border border-line bg-paper">
                  <img src={markingScheme.url} alt="Marking scheme" className="h-full w-full object-contain" />
                </div>
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
                      disabled={submitting}
                      className="ml-auto cursor-pointer rounded-lg border-none bg-cobalt px-[26px] py-[15px] font-body text-base font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Saving…" : i + 1 >= total ? "Finish session" : "Next question"}
                    </button>
                  </div>
                )}
                {submitError && <p className="mt-2.5 text-[13px] text-ember">{submitError} — you can still continue.</p>}
              </div>
            </section>
          )}
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
