import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavRail } from "../components/NavRail";
import { useTopicStats, type TopicRow } from "../hooks/useTopicStats";
import { buildDrillQuestions } from "../lib/drill";

export function Progress() {
  const navigate = useNavigate();
  const { rows, totalAttempted, totalMarksScored, totalMarksPossible, loading, error } = useTopicStats();
  const [sort, setSort] = useState<"weakest" | "strongest">("weakest");
  const [startingDrill, setStartingDrill] = useState(false);

  async function startDrill(weakestValues: string[]) {
    setStartingDrill(true);
    try {
      const questions = await buildDrillQuestions(weakestValues, 8);
      if (questions.length === 0) {
        navigate("/topics");
        return;
      }
      navigate("/practice", { state: { questions } });
    } catch {
      navigate("/topics");
    } finally {
      setStartingDrill(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
      <NavRail />

      <main className="max-w-[1400px] px-10 pb-[70px] pt-[34px] max-[760px]:px-4 max-[760px]:pb-24 max-[760px]:pt-5">
        <h1 className="mb-1.5 font-display text-[28px] font-semibold">Progress</h1>

        {loading && <p className="text-graphite">Loading your stats…</p>}
        {error && <p className="text-ember">{error}</p>}

        {!loading && !error && rows && (
          <ProgressContent
            rows={rows}
            totalAttempted={totalAttempted}
            totalMarksScored={totalMarksScored}
            totalMarksPossible={totalMarksPossible}
            sort={sort}
            onSort={setSort}
            onStartDrill={startDrill}
            startingDrill={startingDrill}
          />
        )}
      </main>
    </div>
  );
}

function ProgressContent({
  rows, totalAttempted, totalMarksScored, totalMarksPossible, sort, onSort, onStartDrill, startingDrill,
}: {
  rows: TopicRow[];
  totalAttempted: number;
  totalMarksScored: number;
  totalMarksPossible: number;
  sort: "weakest" | "strongest";
  onSort: (s: "weakest" | "strongest") => void;
  onStartDrill: (values: string[]) => void;
  startingDrill: boolean;
}) {
  const sorted = [...rows].sort((a, b) => (sort === "weakest" ? a.mastery - b.mastery : b.mastery - a.mastery));
  const weakest = [...rows].sort((a, b) => a.mastery - b.mastery).slice(0, 3);
  const totalQ = rows.reduce((a, t) => a + t.total, 0);
  const doneQ = rows.reduce((a, t) => a + t.attempted, 0);
  const marksPercent = totalMarksPossible > 0 ? Math.round((totalMarksScored / totalMarksPossible) * 100) : 0;

  return (
    <>
      <p className="mb-[30px] text-[15px] text-graphite">
        You've attempted {doneQ} of the {totalQ} mathematics questions in the bank.
      </p>

      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)] items-start gap-[46px] max-[1120px]:grid-cols-1">
        <div className="min-w-0">
          <section>
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2.5">
              <h2 className="font-display text-[19px] font-semibold">Mastery by topic</h2>
              <div className="flex gap-1">
                {(["weakest", "strongest"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onSort(s)}
                    className="cursor-pointer rounded-md border-none px-2.5 py-1.5 font-body text-[13px] font-medium hover:bg-tint"
                    style={{ background: sort === s ? "var(--color-tint)" : "transparent", color: sort === s ? "var(--color-cobalt)" : "var(--color-graphite)" }}
                  >
                    {s === "weakest" ? "Weakest first" : "Strongest first"}
                  </button>
                ))}
              </div>
            </div>
            <p className="mb-3.5 text-sm text-graphite">
              Mastery is marks earned as a share of marks possible on what you've attempted. The count is questions
              attempted of what exists in the bank.
            </p>
            <div className="border-t border-line">
              {sorted.map((m) => (
                <div key={m.value} className="grid grid-cols-[172px_minmax(0,1fr)_118px] items-center gap-4 border-b border-line py-3 max-[760px]:grid-cols-[minmax(0,1fr)_auto]">
                  <span className="min-w-0 text-sm font-medium">{m.name}</span>
                  <div className="flex min-w-0 items-center gap-2.5 max-[760px]:hidden">
                    <div className="h-[7px] flex-1 overflow-hidden bg-line">
                      <div className="h-full" style={{ width: `${m.mastery}%`, background: "linear-gradient(90deg, #3B5BDB, #B85708)", backgroundSize: `${(10000 / Math.max(m.mastery, 1)).toFixed(0)}% 100%` }} />
                    </div>
                    <span className="w-[26px] text-right font-display text-[13px] font-semibold [font-variant-numeric:tabular-nums]">{m.mastery}</span>
                  </div>
                  <span className="text-right text-[13px] text-graphite [font-variant-numeric:tabular-nums]">{m.attempted} of {m.total}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-[30px]">
          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-surface">
            <div className="border-b border-r border-line px-5 py-[18px]">
              <div className="font-display text-2xl font-semibold leading-none [font-variant-numeric:tabular-nums]">{totalAttempted}</div>
              <div className="mt-1.5 text-[13px] leading-[1.4] text-graphite">questions attempted</div>
            </div>
            <div className="border-b border-line px-5 py-[18px]">
              <div className="font-display text-2xl font-semibold leading-none [font-variant-numeric:tabular-nums]">{marksPercent}%</div>
              <div className="mt-1.5 text-[13px] leading-[1.4] text-graphite">marks earned overall</div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-[22px] shadow-sh2">
            <h2 className="mb-1.5 font-display text-lg font-semibold">Three topics need work</h2>
            <p className="mb-4 text-sm leading-[1.55] text-graphite">
              Together they hold {weakest.reduce((a, t) => a + (t.total - t.attempted), 0)} questions you haven't
              seen. That is where the quickest marks are.
            </p>
            <div className="mb-[18px] flex flex-col gap-2.5">
              {weakest.map((w) => (
                <div key={w.value} className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium">{w.name}</span>
                  <span className="font-display text-[13px] font-semibold text-graphite [font-variant-numeric:tabular-nums]">
                    {w.mastery}%, {w.attempted} of {w.total}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              disabled={startingDrill}
              onClick={() => onStartDrill(weakest.map((t) => t.value))}
              className="w-full cursor-pointer rounded-lg border-none bg-cobalt py-[15px] font-body text-base font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt disabled:cursor-not-allowed disabled:opacity-60"
            >
              {startingDrill ? "Building drill…" : "Drill these three topics"}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
