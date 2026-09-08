import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavRail } from "../components/NavRail";

const DATA = {
  "Mathematics 9709": {
    mastery: [
      { name: "Quadratics", mastery: 88, attempted: 31, total: 34 },
      { name: "Coordinate geometry", mastery: 74, attempted: 22, total: 38 },
      { name: "Functions", mastery: 70, attempted: 19, total: 29 },
      { name: "Circular measure", mastery: 66, attempted: 12, total: 18 },
      { name: "Differentiation", mastery: 58, attempted: 24, total: 56 },
      { name: "Trigonometry", mastery: 47, attempted: 17, total: 44 },
      { name: "Integration", mastery: 29, attempted: 15, total: 53 },
      { name: "Series", mastery: 12, attempted: 4, total: 31 },
    ],
    weeks: [4, 9, 0, 12, 18, 11, 23, 16, 28, 31],
    stats: [
      { value: "177", label: "questions attempted" },
      { value: "62%", label: "marks earned overall" },
      { value: "11h 40m", label: "time on paper" },
      { value: "9", label: "day streak" },
    ],
    lost: [
      { reason: "Integration by parts, sign errors", marks: "11 marks" },
      { reason: "Series, no attempt made", marks: "9 marks" },
      { reason: "Trig identities, wrong form", marks: "6 marks" },
    ],
  },
};

const WEEK_LABELS = ["30 Jun", "7 Jul", "14 Jul", "21 Jul", "28 Jul", "4 Aug", "11 Aug", "18 Aug", "25 Aug", "1 Sep"];

export function Progress() {
  const navigate = useNavigate();
  const [subject] = useState<keyof typeof DATA>("Mathematics 9709");
  const [sort, setSort] = useState<"weakest" | "strongest">("weakest");

  const d = DATA[subject];
  const max = Math.max(...d.weeks);
  const totalAttempts = d.weeks.reduce((a, b) => a + b, 0);
  const best = d.weeks.indexOf(max);
  const sorted = [...d.mastery].sort((a, b) => (sort === "weakest" ? a.mastery - b.mastery : b.mastery - a.mastery));
  const weakest = [...d.mastery].sort((a, b) => a.mastery - b.mastery).slice(0, 3);
  const totalQ = d.mastery.reduce((a, t) => a + t.total, 0);
  const doneQ = d.mastery.reduce((a, t) => a + t.attempted, 0);

  return (
    <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
      <NavRail />

      <main className="max-w-[1400px] px-10 pb-[70px] pt-[34px] max-[760px]:px-4 max-[760px]:pb-24 max-[760px]:pt-5">
        <div className="mb-1.5 flex flex-wrap items-baseline gap-x-[26px] gap-y-3.5">
          <h1 className="font-display text-[28px] font-semibold">Progress</h1>
          <div className="flex gap-1.5">
            <button type="button" className="cursor-pointer rounded-lg border border-ink bg-ink px-3.5 py-2.5 font-body text-sm font-semibold text-paper">
              {subject}
            </button>
          </div>
        </div>
        <p className="mb-[30px] text-[15px] text-graphite">
          You've attempted {doneQ} of the {totalQ} {subject.split(" ")[0].toLowerCase()} questions in the bank.
        </p>

        <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)] items-start gap-[46px] max-[1120px]:grid-cols-1">
          <div className="min-w-0">
            <section className="mb-[38px]">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2.5">
                <h2 className="font-display text-[19px] font-semibold">Attempts over time</h2>
                <span className="text-[13px] text-graphite">Last 10 weeks</span>
              </div>
              <p className="mb-[18px] text-sm text-graphite">Questions attempted per week. The bank rewards steady weeks over binges.</p>

              <div className="flex h-[150px] items-end gap-1.5 border-b border-ink px-0.5">
                {d.weeks.map((n, k) => (
                  <div key={k} title={`${n} questions in the week of ${WEEK_LABELS[k]}`} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                    <span className="mb-1 text-center font-display text-xs font-semibold text-graphite [font-variant-numeric:tabular-nums]">{n || ""}</span>
                    <div
                      className="transition-[height] duration-[400ms]"
                      style={{
                        height: max ? `${Math.max(2, Math.round((n / max) * 118))}px` : "2px",
                        background: n === 0 ? "var(--color-line)" : k === d.weeks.length - 1 ? "var(--color-cobalt)" : "#9CAEF0",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 pt-1.5">
                {WEEK_LABELS.map((label) => (
                  <span key={label} className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-center text-[11px] text-graphite">
                    {label}
                  </span>
                ))}
              </div>
              <p className="mt-3.5 text-sm text-graphite">
                {totalAttempts} attempts in 10 weeks. Your biggest week was {max} questions, the week of {WEEK_LABELS[best]}.
              </p>
            </section>

            <section>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2.5">
                <h2 className="font-display text-[19px] font-semibold">Mastery by topic</h2>
                <div className="flex gap-1">
                  {(["weakest", "strongest"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSort(s)}
                      className="cursor-pointer rounded-md border-none px-2.5 py-1.5 font-body text-[13px] font-medium hover:bg-tint"
                      style={{ background: sort === s ? "var(--color-tint)" : "transparent", color: sort === s ? "var(--color-cobalt)" : "var(--color-graphite)" }}
                    >
                      {s === "weakest" ? "Weakest first" : "Strongest first"}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mb-3.5 text-sm text-graphite">
                Mastery weighs recent attempts more than old ones. The count is questions attempted of what exists.
              </p>
              <div className="border-t border-line">
                {sorted.map((m) => (
                  <div key={m.name} className="grid grid-cols-[172px_minmax(0,1fr)_118px] items-center gap-4 border-b border-line py-3 max-[760px]:grid-cols-[minmax(0,1fr)_auto]">
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
              {d.stats.map((s) => (
                <div key={s.label} className="border-b border-r border-line px-5 py-[18px]">
                  <div className="font-display text-2xl font-semibold leading-none [font-variant-numeric:tabular-nums]">{s.value}</div>
                  <div className="mt-1.5 text-[13px] leading-[1.4] text-graphite">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-line bg-surface p-[22px] shadow-sh2">
              <h2 className="mb-1.5 font-display text-lg font-semibold">Three topics need work</h2>
              <p className="mb-4 text-sm leading-[1.55] text-graphite">
                Together they hold {weakest.reduce((a, t) => a + (t.total - t.attempted), 0)} questions you haven't
                seen. That is where the quickest marks are.
              </p>
              <div className="mb-[18px] flex flex-col gap-2.5">
                {weakest.map((w) => (
                  <div key={w.name} className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium">{w.name}</span>
                    <span className="font-display text-[13px] font-semibold text-graphite [font-variant-numeric:tabular-nums]">
                      {w.mastery}%, {w.attempted} of {w.total}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate("/practice")}
                className="w-full cursor-pointer rounded-lg border-none bg-cobalt py-[15px] font-body text-base font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt"
              >
                Drill these three topics
              </button>
            </div>

            <div>
              <h3 className="mb-2.5 font-display text-[15px] font-semibold">Where the marks went last week</h3>
              <div className="border-t border-line">
                {d.lost.map((l) => (
                  <div key={l.reason} className="flex items-baseline justify-between gap-3 border-b border-line py-2.5">
                    <span className="min-w-0 text-sm">{l.reason}</span>
                    <span className="whitespace-nowrap font-display text-sm font-semibold [font-variant-numeric:tabular-nums]">{l.marks}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-[13px] leading-[1.5] text-graphite">From the scheme lines you marked yourself down on.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
