import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavRail } from "../components/NavRail";

const ROWS = [
  { ref: "9709 Paper 1 · Q7 · May/June 2023", topic: "Coordinate geometry", got: 4, max: 5 },
  { ref: "9709 Paper 1 · Q4 · Oct/Nov 2021", topic: "Trigonometry", got: 5, max: 6 },
  { ref: "9709 Paper 1 · Q9 · Oct/Nov 2022", topic: "Integration", got: 3, max: 9 },
  { ref: "9709 Paper 1 · Q4 · Feb/Mar 2021", topic: "Integration, Trigonometry", got: 6, max: 6 },
  { ref: "9709 Paper 1 · Q6 · May/June 2022", topic: "Integration", got: 2, max: 7 },
  { ref: "9709 Paper 1 · Q8 · Oct/Nov 2023", topic: "Circular measure", got: 8, max: 8 },
  { ref: "9709 Paper 1 · Q3 · May/June 2021", topic: "Integration", got: null as number | null, max: 5 },
  { ref: "9709 Paper 1 · Q10 · Feb/Mar 2023", topic: "Series", got: 4, max: 9 },
];

const TOPICS = [
  { name: "Circular measure", mastery: 66, delta: 2, attempted: 12, total: 18 },
  { name: "Trigonometry", mastery: 47, delta: 3, attempted: 17, total: 44 },
  { name: "Integration", mastery: 29, delta: -4, attempted: 15, total: 53 },
];

export function SessionSummary() {
  const navigate = useNavigate();
  const [retried, setRetried] = useState<Record<number, boolean>>({});

  const attempted = ROWS.filter((r) => r.got !== null);
  const totalScore = attempted.reduce((a, r) => a + (r.got ?? 0), 0);
  const totalMarks = ROWS.reduce((a, r) => a + r.max, 0);
  const percent = Math.round((totalScore / totalMarks) * 100);
  const skipped = ROWS.length - attempted.length;
  const weakest = [...TOPICS].sort((a, b) => a.mastery - b.mastery)[0];

  const gradeNote =
    percent >= 80 ? "around a grade A on this paper" :
    percent >= 65 ? "around a grade B on this paper" :
    percent >= 50 ? "around a grade C on this paper" :
    "below a grade C on this paper";

  return (
    <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
      <NavRail />

      <main className="max-w-[1240px] px-10 pb-[70px] pt-[34px] max-[760px]:px-4 max-[760px]:pb-24 max-[760px]:pt-4.5">
        <p className="mb-[26px] text-sm text-graphite">Session finished just now, 1:14am</p>

        <div className="flex flex-wrap items-end gap-x-[54px] gap-y-[38px] border-b border-line pb-[26px]">
          <div>
            <div className="flex items-baseline gap-2 font-display [font-variant-numeric:tabular-nums]">
              <span className="text-[56px] font-semibold leading-none">{totalScore}</span>
              <span className="text-2xl font-medium text-graphite">/ {totalMarks}</span>
            </div>
            <p className="mt-2 text-[15px] text-graphite">marks, self-marked</p>
          </div>
          <div>
            <div className="font-display text-[32px] font-semibold leading-none [font-variant-numeric:tabular-nums]">{percent}%</div>
            <p className="mt-2 text-[15px] text-graphite">{gradeNote}</p>
          </div>
          <div>
            <div className="font-display text-[32px] font-semibold leading-none [font-variant-numeric:tabular-nums]">31:42</div>
            <p className="mt-2 text-[15px] text-graphite">about 4 minutes a question</p>
          </div>
          <div>
            <div className="font-display text-[32px] font-semibold leading-none [font-variant-numeric:tabular-nums]">{attempted.length}</div>
            <p className="mt-2 text-[15px] text-graphite">of {ROWS.length} attempted{skipped ? `, ${skipped} skipped` : ""}</p>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)] items-start gap-11 pt-[34px] max-[1080px]:grid-cols-1">
          <section>
            <h2 className="mb-1 font-display text-[19px] font-semibold">Question by question</h2>
            <p className="mb-3.5 text-sm text-graphite">Retry anything you want to see again tomorrow.</p>
            <div className="border-t border-line">
              {ROWS.map((r, k) => (
                <div key={k} className="grid grid-cols-[26px_minmax(0,1fr)_74px_62px] items-center gap-3.5 border-b border-line py-3.5">
                  <span className="font-display text-sm font-semibold text-graphite [font-variant-numeric:tabular-nums]">{k + 1}</span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-medium [font-variant-numeric:tabular-nums]">{r.ref}</div>
                    <div className="mt-0.5 text-[13px] text-graphite">{r.topic}</div>
                  </div>
                  <span
                    className="text-right font-display text-base font-semibold [font-variant-numeric:tabular-nums]"
                    style={{ color: r.got === null ? "var(--color-graphite)" : r.got === r.max ? "var(--color-ember)" : "var(--color-ink)" }}
                  >
                    {r.got === null ? "skipped" : `${r.got}/${r.max}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRetried((prev) => ({ ...prev, [k]: true }))}
                    className="cursor-pointer justify-self-end rounded-lg border border-line bg-transparent px-2.5 py-1.5 font-body text-[13px] font-medium text-ink hover:border-graphite"
                  >
                    {retried[k] ? "Queued" : "Retry"}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <aside className="flex flex-col gap-[30px]">
            <div>
              <h2 className="mb-1 font-display text-[19px] font-semibold">What this changed</h2>
              <p className="mb-4 text-sm text-graphite">Mastery after this session.</p>
              <div className="flex flex-col gap-4">
                {TOPICS.map((t) => (
                  <div key={t.name}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <span className="text-[15px] font-medium">{t.name}</span>
                      <span
                        className="font-display text-sm font-semibold [font-variant-numeric:tabular-nums]"
                        style={{ color: t.delta > 0 ? "var(--color-ember)" : "var(--color-graphite)" }}
                      >
                        {t.mastery} {t.delta > 0 ? "+" : ""}{t.delta}
                      </span>
                    </div>
                    <div className="h-[7px] overflow-hidden bg-line">
                      <div
                        className="h-full transition-[width] duration-500"
                        style={{ width: `${t.mastery}%`, background: "linear-gradient(90deg, #3B5BDB, #B85708)", backgroundSize: `${(10000 / t.mastery).toFixed(0)}% 100%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[13px] text-graphite">
                      You've attempted {t.attempted} of {t.total} {t.name.toLowerCase()} questions
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface p-[22px] shadow-sh2">
              <h2 className="mb-1.5 font-display text-lg font-semibold">{weakest.name} is still your weakest topic</h2>
              <p className="mb-[18px] text-sm leading-[1.55] text-graphite">
                You scored 39% on the {weakest.name.toLowerCase()} questions in this session. A shorter drill on the
                same topic tomorrow is worth more than a long one now.
              </p>
              <button
                type="button"
                onClick={() => navigate("/practice")}
                className="w-full cursor-pointer rounded-lg border-none bg-cobalt py-[15px] font-body text-base font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt"
              >
                Drill 6 more {weakest.name.toLowerCase()} questions
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="mt-2 w-full cursor-pointer rounded-lg border border-line bg-transparent py-3.5 font-body text-[15px] font-medium text-ink hover:border-graphite"
              >
                Back to dashboard
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-[26px] font-semibold text-ember [font-variant-numeric:tabular-nums]">9 days</span>
              <span className="text-sm leading-[1.5] text-graphite">Practise again before midnight tomorrow to keep it.</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
