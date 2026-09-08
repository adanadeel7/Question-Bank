import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavRail } from "../components/NavRail";
import { useTopicStats, type TopicRow } from "../hooks/useTopicStats";
import { buildDrillQuestions } from "../lib/drill";

const DRILL_LENGTH = 8;

export function Dashboard() {
  const navigate = useNavigate();
  const { rows, loading, error } = useTopicStats();
  const [startingDrill, setStartingDrill] = useState(false);

  async function startDrill(weakestValues: string[]) {
    setStartingDrill(true);
    try {
      const questions = await buildDrillQuestions(weakestValues, DRILL_LENGTH);
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

      <main className="max-w-[1500px] px-10 pt-[34px] pb-[70px] max-[760px]:px-4 max-[760px]:pt-5 max-[760px]:pb-24">
        {loading && <p className="text-graphite">Loading your stats…</p>}
        {error && <p className="text-ember">{error}</p>}

        {!loading && !error && rows && (
          <DashboardContent rows={rows} onStartDrill={startDrill} startingDrill={startingDrill} />
        )}
      </main>
    </div>
  );
}

function DashboardContent({
  rows, onStartDrill, startingDrill,
}: { rows: TopicRow[]; onStartDrill: (values: string[]) => void; startingDrill: boolean }) {
  const ranked = [...rows].sort((a, b) => b.mastery - a.mastery);
  const weakest = ranked.slice(-3).reverse();
  const weak = weakest[0];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_296px] items-start gap-[46px] max-[1120px]:grid-cols-1">
      <div className="min-w-0">
        <h1 className="mb-1.5 font-display text-[32px] font-semibold leading-[1.15]">
          {weak.name} is your weakest topic
        </h1>
        <p className="mb-[26px] text-base text-graphite">
          You've attempted {weak.attempted} of {weak.total} {weak.name.toLowerCase()} questions
          {weak.marksPossible > 0 ? `, current mastery ${weak.mastery}%.` : " — nothing attempted here yet."}
        </p>

        <section className="rounded-xl border border-line bg-surface px-[30px] py-7 shadow-[0_1px_2px_rgba(16,24,39,.06),0_10px_30px_rgba(16,24,39,.12)] max-[760px]:px-[22px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <h2 className="mb-2.5 font-display text-[22px] font-semibold">Today's drill</h2>
              <div className="flex flex-wrap items-baseline gap-x-[26px] gap-y-2.5">
                <div className="flex items-baseline gap-[7px]">
                  <span className="font-display text-[21px] font-semibold [font-variant-numeric:tabular-nums]">
                    8
                  </span>
                  <span className="text-[15px] text-graphite">questions</span>
                </div>
                <div className="flex items-baseline gap-[7px]">
                  <span className="font-display text-[21px] font-semibold [font-variant-numeric:tabular-nums]">
                    ~35 min
                  </span>
                  <span className="text-[15px] text-graphite">on paper</span>
                </div>
                <div className="flex items-baseline gap-[7px]">
                  <span className="font-display text-[21px] font-semibold [font-variant-numeric:tabular-nums]">3</span>
                  <span className="text-[15px] text-graphite">topics</span>
                </div>
              </div>
              <p className="mt-3.5 max-w-[44ch] text-[15px] leading-[1.55] text-graphite">
                Built from {weakest.map((t) => t.name.toLowerCase()).join(", ")} — your three weakest topics.
                Skips anything you've already attempted.
              </p>
            </div>
            <button
              type="button"
              disabled={startingDrill}
              onClick={() => onStartDrill(weakest.map((t) => t.value))}
              className="cursor-pointer rounded-lg border-none bg-cobalt px-[30px] py-[17px] font-body text-[17px] font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt disabled:cursor-not-allowed disabled:opacity-60"
            >
              {startingDrill ? "Building drill…" : "Start today's drill"}
            </button>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 px-0.5 pt-4">
          <Link
            to="/topics"
            className="rounded-lg border border-line px-[18px] py-3 font-body text-[15px] font-medium text-ink hover:border-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt"
          >
            Pick your own topics
          </Link>
          <span className="text-sm text-graphite">Filter by topic, year, session and variant.</span>
        </div>
      </div>

      <aside className="sticky top-[34px] w-[296px] max-[1120px]:static max-[1120px]:w-auto">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h2 className="font-display text-[19px] font-semibold">Mastery</h2>
          <span className="text-[13px] text-graphite">9709 Paper 1</span>
        </div>
        <p className="mb-4 text-[13px] text-graphite">All {rows.length} syllabus topics, weakest last.</p>

        <div className="border-t border-line">
          {ranked.map((m) => (
            <Link
              key={m.value}
              to="/progress"
              className="block border-b border-line py-[11px] transition-colors hover:bg-tint focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cobalt"
            >
              <div className="mb-1.5 flex items-baseline justify-between gap-2.5">
                <span className="text-sm font-medium">{m.name}</span>
                <span className="font-display text-[13px] font-semibold text-graphite [font-variant-numeric:tabular-nums]">
                  {m.mastery}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden bg-line">
                <div
                  className="h-full"
                  style={{
                    width: `${m.mastery}%`,
                    background: "linear-gradient(90deg, #3B5BDB, #B85708)",
                    backgroundSize: `${(10000 / Math.max(m.mastery, 1)).toFixed(0)}% 100%`,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-[22px] border-t border-line pt-4">
          <h3 className="mb-2.5 font-display text-[15px] font-semibold">Needs work first</h3>
          <div className="flex flex-col gap-[9px]">
            {weakest.map((w) => (
              <div key={w.value}>
                <div className="text-sm font-medium">{w.name}</div>
                <div className="mt-px text-[13px] text-graphite">
                  {w.attempted} of {w.total} attempted, {w.mastery}% mastery
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
