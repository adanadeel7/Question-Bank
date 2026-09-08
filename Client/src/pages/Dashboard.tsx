import { Link, useNavigate } from "react-router-dom";
import { NavRail } from "../components/NavRail";

const MASTERY = [
  { name: "Quadratics", mastery: 88, attempted: 31, total: 34 },
  { name: "Coordinate geometry", mastery: 74, attempted: 22, total: 38 },
  { name: "Functions", mastery: 70, attempted: 19, total: 29 },
  { name: "Circular measure", mastery: 66, attempted: 12, total: 18 },
  { name: "Differentiation", mastery: 58, attempted: 24, total: 56 },
  { name: "Trigonometry", mastery: 47, attempted: 17, total: 44 },
  { name: "Integration", mastery: 29, attempted: 15, total: 53 },
  { name: "Series", mastery: 12, attempted: 4, total: 31 },
];

const RECENT = [
  { day: "Sat", topics: "Integration, trigonometry", count: "8 questions", score: "35/58" },
  { day: "Fri", topics: "Integration", count: "6 questions", score: "21/42" },
  { day: "Thu", topics: "Trigonometry, quadratics", count: "10 questions", score: "48/61" },
  { day: "Wed", topics: "Series", count: "5 questions", score: "9/34" },
];

const WEEK = [
  { letter: "M", done: true },
  { letter: "T", done: true },
  { letter: "W", done: true },
  { letter: "T", done: true },
  { letter: "F", done: true },
  { letter: "S", done: true },
  { letter: "S", done: false },
];

const DRILL_LENGTH = 8;

export function Dashboard() {
  const navigate = useNavigate();

  const ranked = [...MASTERY].sort((a, b) => b.mastery - a.mastery);
  const weakest = ranked.slice(-3).reverse();
  const weak = weakest[0];

  return (
    <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
      <NavRail />

      <main className="max-w-[1500px] px-10 pt-[34px] pb-[70px] max-[760px]:px-4 max-[760px]:pt-5 max-[760px]:pb-24">
        <div className="grid grid-cols-[minmax(0,1fr)_296px] items-start gap-[46px] max-[1120px]:grid-cols-1">
          <div className="min-w-0">
            <h1 className="mb-1.5 font-display text-[32px] font-semibold leading-[1.15]">
              {weak.name} is your weakest topic
            </h1>
            <p className="mb-[26px] text-base text-graphite">
              You've attempted {weak.attempted} of {weak.total} {weak.name.toLowerCase()} questions, and
              scored under a third of the marks on your last two.
            </p>

            <section className="rounded-xl border border-line bg-surface px-[30px] py-7 shadow-[0_1px_2px_rgba(16,24,39,.06),0_10px_30px_rgba(16,24,39,.12)] max-[760px]:px-[22px]">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="min-w-0">
                  <h2 className="mb-2.5 font-display text-[22px] font-semibold">Today's drill</h2>
                  <div className="flex flex-wrap items-baseline gap-x-[26px] gap-y-2.5">
                    <div className="flex items-baseline gap-[7px]">
                      <span className="font-display text-[21px] font-semibold [font-variant-numeric:tabular-nums]">
                        {DRILL_LENGTH}
                      </span>
                      <span className="text-[15px] text-graphite">questions</span>
                    </div>
                    <div className="flex items-baseline gap-[7px]">
                      <span className="font-display text-[21px] font-semibold [font-variant-numeric:tabular-nums]">
                        ~{Math.round(DRILL_LENGTH * 4.4)} min
                      </span>
                      <span className="text-[15px] text-graphite">on paper</span>
                    </div>
                    <div className="flex items-baseline gap-[7px]">
                      <span className="font-display text-[21px] font-semibold [font-variant-numeric:tabular-nums]">3</span>
                      <span className="text-[15px] text-graphite">topics</span>
                    </div>
                  </div>
                  <p className="mt-3.5 max-w-[44ch] text-[15px] leading-[1.55] text-graphite">
                    Built from {weakest.map((t) => t.name.toLowerCase()).join(", ")} — the three topics
                    costing you the most marks. Past-paper questions from 2016 to 2024.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/practice")}
                  className="cursor-pointer rounded-lg border-none bg-cobalt px-[30px] py-[17px] font-body text-[17px] font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt"
                >
                  Start today's drill
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

            <div className="mt-[34px] flex flex-wrap items-baseline gap-x-7 gap-y-3 border-y border-line px-0.5 py-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-[30px] font-semibold leading-none text-ember [font-variant-numeric:tabular-nums]">
                  9
                </span>
                <span className="text-base text-graphite">day streak</span>
              </div>
              <span className="text-sm text-graphite">Longest 14 days</span>
              <div className="ml-auto flex gap-[5px]">
                {WEEK.map((d, i) => (
                  <div key={i} title={d.done ? "Practised" : "Not yet today"} className="w-[26px] text-center">
                    <div
                      className="h-[26px] rounded"
                      style={{
                        background: d.done ? "var(--color-ember)" : "transparent",
                        border: `1px solid ${d.done ? "var(--color-ember)" : "var(--color-line)"}`,
                      }}
                    />
                    <div className="mt-1 text-[11px] text-graphite">{d.letter}</div>
                  </div>
                ))}
              </div>
            </div>

            <section className="mt-[30px]">
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-[19px] font-semibold">Recent sessions</h2>
                <Link to="/history" className="text-sm font-medium text-cobalt hover:text-cobalt-press hover:underline">
                  See all history
                </Link>
              </div>
              <div className="border-t border-line">
                {RECENT.map((r, i) => (
                  <Link
                    key={i}
                    to="/history"
                    className="grid grid-cols-[64px_minmax(0,1fr)_92px_72px] items-center gap-[14px] border-b border-line py-3.5 transition-colors hover:bg-tint focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cobalt"
                  >
                    <span className="text-sm text-graphite">{r.day}</span>
                    <span className="min-w-0 text-[15px] font-medium">{r.topics}</span>
                    <span className="text-sm text-graphite [font-variant-numeric:tabular-nums]">{r.count}</span>
                    <span className="text-right font-display text-base font-semibold [font-variant-numeric:tabular-nums]">
                      {r.score}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="sticky top-[34px] w-[296px] max-[1120px]:static max-[1120px]:w-auto">
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <h2 className="font-display text-[19px] font-semibold">Mastery</h2>
              <span className="text-[13px] text-graphite">9709 Paper 1</span>
            </div>
            <p className="mb-4 text-[13px] text-graphite">All {MASTERY.length} syllabus topics, weakest last.</p>

            <div className="border-t border-line">
              {ranked.map((m) => (
                <Link
                  key={m.name}
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
                        backgroundSize: `${(10000 / m.mastery).toFixed(0)}% 100%`,
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
                  <div key={w.name}>
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
      </main>
    </div>
  );
}
