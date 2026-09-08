import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavRail } from "../components/NavRail";

const TOPICS = ["Quadratics", "Functions", "Coordinate geometry", "Circular measure", "Trigonometry", "Series", "Differentiation", "Integration"];
const SESSIONS = ["May/June", "Oct/Nov", "Feb/Mar"];
const VARIANTS = ["1", "2", "3"];
const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const MAX_SESSION_LENGTH = 10;

interface Question {
  year: number; session: string; variant: string; qnum: number; marks: number; topics: string[]; attempted: boolean;
}

function buildBank(): Question[] {
  let seed = 20240906;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const out: Question[] = [];
  YEARS.forEach((year) => {
    SESSIONS.forEach((session) => {
      if (session === "Feb/Mar" && year < 2018) return;
      VARIANTS.forEach((variant) => {
        if (session === "Feb/Mar" && variant !== "2") return;
        const n = 3 + Math.floor(rnd() * 4);
        for (let k = 0; k < n; k++) {
          const t = TOPICS[Math.floor(rnd() * TOPICS.length)];
          const second = rnd() > 0.72 ? TOPICS[Math.floor(rnd() * TOPICS.length)] : null;
          out.push({
            year, session, variant,
            qnum: 1 + Math.floor(rnd() * 11),
            marks: [4, 5, 6, 7, 8, 9, 10][Math.floor(rnd() * 7)],
            topics: second && second !== t ? [t, second] : [t],
            attempted: rnd() > 0.78,
          });
        }
      });
    });
  });
  return out;
}

const BANK = buildBank();
const DEFAULT_TOPICS = ["Integration"];

interface Filters {
  topics: string[]; from: number; to: number; sessions: string[]; variants: string[]; unseen: boolean;
}

function match(f: Filters) {
  return BANK.filter(
    (q) =>
      (!f.topics.length || q.topics.some((t) => f.topics.includes(t))) &&
      q.year >= f.from && q.year <= f.to &&
      (!f.sessions.length || f.sessions.includes(q.session)) &&
      (!f.variants.length || f.variants.includes(q.variant)) &&
      (!f.unseen || !q.attempted),
  );
}

function toggleIn(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function TopicPicker() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<string[]>(DEFAULT_TOPICS);
  const [from, setFrom] = useState(2016);
  const [to, setTo] = useState(2024);
  const [sessions, setSessions] = useState<string[]>([]);
  const [variants, setVariants] = useState<string[]>([]);
  const [unseen, setUnseen] = useState(false);

  const f: Filters = { topics, from, to, sessions, variants, unseen };
  const hits = useMemo(() => match(f), [topics, from, to, sessions, variants, unseen]);
  const count = hits.length;
  const shown = hits.slice(0, MAX_SESSION_LENGTH);
  const take = Math.min(count, MAX_SESSION_LENGTH);
  const touched = topics.length !== 1 || topics[0] !== "Integration" || from !== 2016 || to !== 2024 || sessions.length > 0 || variants.length > 0 || unseen;
  const yearWarn = to < from;

  function reset() {
    setTopics(DEFAULT_TOPICS.slice()); setFrom(2016); setTo(2024); setSessions([]); setVariants([]); setUnseen(false);
  }

  let emptyAdvice = "Try widening the year range.";
  let widenLabel = "Widen to 2016 to 2024";
  let widen = () => { setFrom(2016); setTo(2024); };
  if (to < from) {
    emptyAdvice = "The year range runs backwards, so nothing can match. Swapping the years fixes it.";
    widenLabel = "Swap the years";
    widen = () => { setFrom(to); setTo(from); };
  } else if (variants.length && sessions.includes("Feb/Mar") && !variants.includes("2")) {
    emptyAdvice = "Feb/Mar papers only exist as variant 2, and you have variant 2 excluded. Clear the variant filter to see them.";
    widenLabel = "Clear the variant filter";
    widen = () => setVariants([]);
  } else if (unseen) {
    emptyAdvice = "You have attempted every question that matches. Turn off the attempted filter to retry them, or widen the year range.";
    widenLabel = "Include attempted questions";
    widen = () => setUnseen(false);
  } else if (sessions.length || variants.length) {
    emptyAdvice = "This combination of session and variant has no questions tagged yet. Clearing the session filter usually helps.";
    widenLabel = "Clear session and variant";
    widen = () => { setSessions([]); setVariants([]); };
  }

  return (
    <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
      <NavRail />

      <main className="max-w-[1500px] px-10 pb-[60px] pt-[30px] max-[760px]:px-4 max-[760px]:pb-[150px] max-[760px]:pt-4.5">
        <h1 className="mb-1 font-display text-[28px] font-semibold">Build a session</h1>
        <p className="mb-[22px] text-[15px] text-graphite">9709 Mathematics, Paper 1. Past papers from 2016 to 2024.</p>

        <div className="grid grid-cols-[282px_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-surface max-[1000px]:grid-cols-1">
          <aside className="border-r border-line p-[22px] max-[1000px]:border-b max-[1000px]:border-r-0">
            <div className="mb-5 flex items-baseline justify-between gap-2.5">
              <h2 className="font-display text-[17px] font-semibold">Filters</h2>
              <button
                type="button"
                onClick={reset}
                disabled={!touched}
                className="border-none bg-transparent py-0.5 font-body text-[13px] font-medium hover:underline disabled:cursor-not-allowed"
                style={{ color: touched ? "var(--color-cobalt)" : "var(--color-graphite)" }}
              >
                Reset
              </button>
            </div>

            <fieldset className="mb-6 border-none p-0">
              <legend className="mb-2.5 p-0 text-[13px] font-semibold text-graphite">Syllabus topic</legend>
              <div className="flex flex-col gap-px">
                {TOPICS.map((name) => {
                  const on = topics.includes(name);
                  const c = match({ ...f, topics: [name] }).length;
                  return (
                    <label key={name} className="flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 pr-1.5 hover:bg-tint">
                      <input type="checkbox" checked={on} onChange={() => setTopics((prev) => toggleIn(prev, name))} className="m-0 h-4 w-4 cursor-pointer accent-cobalt" />
                      <span className="flex-1 text-sm">{name}</span>
                      <span className="font-display text-[13px] text-graphite [font-variant-numeric:tabular-nums]">{c}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mb-6 border-none p-0">
              <legend className="mb-2.5 p-0 text-[13px] font-semibold text-graphite">Year range</legend>
              <div className="flex items-center gap-2">
                <select value={from} onChange={(e) => setFrom(parseInt(e.target.value, 10))} className="flex-1 cursor-pointer rounded-lg border border-line bg-surface px-2.5 py-2 font-body text-sm font-medium text-ink">
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <span className="text-sm text-graphite">to</span>
                <select value={to} onChange={(e) => setTo(parseInt(e.target.value, 10))} className="flex-1 cursor-pointer rounded-lg border border-line bg-surface px-2.5 py-2 font-body text-sm font-medium text-ink">
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {yearWarn && <p className="mt-2 text-[13px] text-ember">The range reads backwards, so nothing can match. Swap the years.</p>}
            </fieldset>

            <fieldset className="mb-6 border-none p-0">
              <legend className="mb-2.5 p-0 text-[13px] font-semibold text-graphite">Exam session</legend>
              <div className="flex flex-wrap gap-1.5">
                {SESSIONS.map((name) => {
                  const on = sessions.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setSessions((prev) => toggleIn(prev, name))}
                      className="cursor-pointer rounded px-2.5 py-1.5 font-body text-[13px] font-medium transition-colors"
                      style={{ border: `1px solid ${on ? "var(--color-cobalt)" : "var(--color-line)"}`, background: on ? "var(--color-cobalt)" : "transparent", color: on ? "var(--color-cobalt-ink)" : "var(--color-ink)" }}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="border-none p-0">
              <legend className="mb-2.5 p-0 text-[13px] font-semibold text-graphite">Paper variant</legend>
              <div className="flex flex-wrap gap-1.5">
                {VARIANTS.map((name) => {
                  const on = variants.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setVariants((prev) => toggleIn(prev, name))}
                      className="min-w-[44px] cursor-pointer rounded px-2.5 py-1.5 font-display text-[13px] font-semibold transition-colors [font-variant-numeric:tabular-nums]"
                      style={{ border: `1px solid ${on ? "var(--color-cobalt)" : "var(--color-line)"}`, background: on ? "var(--color-cobalt)" : "transparent", color: on ? "var(--color-cobalt-ink)" : "var(--color-ink)" }}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </aside>

          <section className="min-w-0 px-[26px] pb-[26px] pt-[22px]">
            <div className="flex flex-wrap items-end gap-x-[30px] gap-y-4.5 border-b border-line pb-[18px]">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-[44px] font-semibold leading-none transition-colors [font-variant-numeric:tabular-nums]" style={{ color: count ? "var(--color-ink)" : "var(--color-graphite)" }}>
                  {count}
                </span>
                <span className="text-base text-graphite">{count === 1 ? "question matches" : "questions match"}</span>
              </div>
              <span className="max-w-[38ch] text-sm leading-[1.5] text-graphite">
                {count
                  ? `Across ${new Set(hits.map((q) => q.year)).size} years. ${hits.filter((q) => q.attempted).length} you have attempted before.`
                  : "Nothing to practise with these filters yet."}
              </span>
            </div>

            {count > 0 ? (
              <div className="mt-1.5">
                {shown.map((q, k) => (
                  <div key={k} className="grid grid-cols-[minmax(0,1fr)_96px_84px] items-center gap-3.5 border-b border-line py-3.5">
                    <div className="min-w-0">
                      <div className="text-[15px] font-medium [font-variant-numeric:tabular-nums]">9709 Paper {q.variant} · {q.session} {q.year} · Question {q.qnum}</div>
                      <div className="mt-0.5 text-[13px] text-graphite">{q.topics.join(", ")}</div>
                    </div>
                    <span className="text-sm text-graphite [font-variant-numeric:tabular-nums]">{q.marks} marks</span>
                    <span className="text-right text-[13px]" style={{ color: q.attempted ? "var(--color-graphite)" : "var(--color-ember)" }}>
                      {q.attempted ? "Attempted" : "New to you"}
                    </span>
                  </div>
                ))}
                <p className="mt-3.5 text-sm text-graphite">
                  {count > MAX_SESSION_LENGTH ? `Showing the first ${MAX_SESSION_LENGTH} of ${count}. The session draws from all of them.` : "That is all of them."}
                </p>
              </div>
            ) : (
              <div className="mt-[34px] max-w-[44ch]">
                <h3 className="mb-2 font-display text-[19px] font-semibold">No questions match these filters</h3>
                <p className="mb-[18px] text-[15px] leading-[1.6] text-graphite">{emptyAdvice}</p>
                <button type="button" onClick={widen} className="cursor-pointer rounded-lg border border-line bg-transparent px-[18px] py-3 font-body text-[15px] font-medium text-ink hover:border-graphite">
                  {widenLabel}
                </button>
              </div>
            )}
          </section>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3.5 max-[760px]:fixed max-[760px]:inset-x-0 max-[760px]:bottom-[60px] max-[760px]:z-[25] max-[760px]:m-0 max-[760px]:border-t max-[760px]:border-line max-[760px]:bg-surface max-[760px]:px-4 max-[760px]:py-3">
          <button
            type="button"
            disabled={count === 0}
            onClick={() => navigate("/practice")}
            className="cursor-pointer rounded-lg border-none px-7 py-4 font-body text-base font-semibold text-cobalt-ink transition-colors active:translate-y-px disabled:cursor-not-allowed"
            style={{ background: count === 0 ? "var(--color-graphite)" : "var(--color-cobalt)" }}
          >
            {count === 0 ? "Nothing to practise" : `Practise ${take}${count > take ? " of these" : take === 1 ? " question" : " questions"}`}
          </button>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-graphite">
            <input type="checkbox" checked={unseen} onChange={() => setUnseen((v) => !v)} className="m-0 h-4 w-4 cursor-pointer accent-cobalt" />
            Skip questions I've already attempted
          </label>
          {count > 0 && <span className="text-sm text-graphite">About {Math.round(shown.reduce((a, q) => a + q.marks, 0) * 1.2)} minutes on paper.</span>}
        </div>
      </main>
    </div>
  );
}
