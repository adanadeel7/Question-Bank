import { useMemo, useState } from "react";
import { NavRail } from "../components/NavRail";

const TOPICS = ["Quadratics", "Functions", "Coordinate geometry", "Circular measure", "Trigonometry", "Series", "Differentiation", "Integration"];
const SESSIONS = ["May/June", "Oct/Nov", "Feb/Mar"];
const BANDS = [
  { key: "all", label: "All" },
  { key: "full", label: "Full marks" },
  { key: "partial", label: "Partial" },
  { key: "zero", label: "Zero" },
  { key: "skipped", label: "Skipped" },
] as const;

type Band = (typeof BANDS)[number]["key"];

interface Attempt {
  when: string; variant: string; session: string; year: number; qnum: number; topic: string;
  max: number; got: number | null;
}

function buildAttempts(): Attempt[] {
  let seed = 77;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const days = ["Today, 1:14am", "Today, 12:48am", "Yesterday", "Fri 4 Sep", "Thu 3 Sep", "Wed 2 Sep", "Tue 1 Sep", "Mon 31 Aug", "Sun 30 Aug", "Sat 29 Aug", "Fri 28 Aug", "Wed 26 Aug", "Tue 25 Aug", "Sun 23 Aug", "Fri 21 Aug", "Thu 20 Aug", "Mon 17 Aug", "Sat 15 Aug"];
  const out: Attempt[] = [];
  for (let k = 0; k < 34; k++) {
    const max = [4, 5, 6, 7, 8, 9, 10][Math.floor(rnd() * 7)];
    const roll = rnd();
    const got = roll > 0.86 ? null : roll > 0.66 ? max : Math.floor(rnd() * max);
    out.push({
      when: days[Math.min(Math.floor(k / 2), days.length - 1)],
      variant: ["1", "2", "3"][Math.floor(rnd() * 3)],
      session: SESSIONS[Math.floor(rnd() * 3)],
      year: 2016 + Math.floor(rnd() * 9),
      qnum: 1 + Math.floor(rnd() * 11),
      topic: TOPICS[Math.floor(rnd() * TOPICS.length)],
      max, got,
    });
  }
  return out;
}

const ATTEMPTS = buildAttempts();

export function History() {
  const [topic, setTopic] = useState("All topics");
  const [band, setBand] = useState<Band>("all");
  const [retried, setRetried] = useState<Record<number, boolean>>({});

  const rows = useMemo(
    () =>
      ATTEMPTS.filter(
        (a) =>
          (topic === "All topics" || a.topic === topic) &&
          (band === "all" ||
            (band === "full" && a.got === a.max) ||
            (band === "partial" && a.got !== null && a.got > 0 && a.got < a.max) ||
            (band === "zero" && a.got === 0) ||
            (band === "skipped" && a.got === null)),
      ),
    [topic, band],
  );
  const filtered = topic !== "All topics" || band !== "all";
  const marks = rows.filter((r) => r.got !== null);

  function clear() {
    setTopic("All topics");
    setBand("all");
  }

  const emptyLine =
    band === "zero"
      ? `No zeros in ${topic === "All topics" ? "any topic" : topic.toLowerCase()}. That is worth knowing.`
      : `You have no ${band === "all" ? "" : BANDS.find((b) => b.key === band)!.label.toLowerCase() + " "}attempts in ${topic === "All topics" ? "this view" : topic.toLowerCase()} yet.`;

  return (
    <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
      <NavRail />

      <main className="max-w-[1240px] px-10 pb-[70px] pt-[34px] max-[760px]:px-4 max-[760px]:pb-24 max-[760px]:pt-5">
        <div className="mb-1 flex flex-wrap items-baseline gap-x-[22px] gap-y-3">
          <h1 className="font-display text-[28px] font-semibold">History</h1>
          <span className="text-[15px] text-graphite [font-variant-numeric:tabular-nums]">{rows.length} of {ATTEMPTS.length} attempts</span>
        </div>
        <p className="mb-[22px] text-[15px] text-graphite">Every attempt, newest first. Retry anything — the old score stays on the record.</p>

        <div className="mb-[22px] flex flex-wrap items-center gap-2">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-2.5 font-body text-sm font-medium text-ink"
          >
            {["All topics", ...TOPICS].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="inline-flex overflow-hidden rounded-lg border border-line">
            {BANDS.map((b) => (
              <button
                key={b.key}
                type="button"
                onClick={() => setBand(b.key)}
                className="cursor-pointer border-r border-line px-3.5 py-2.5 font-body text-[13px] font-medium last:border-r-0"
                style={{ background: band === b.key ? "var(--color-ink)" : "transparent", color: band === b.key ? "var(--color-paper)" : "var(--color-ink)" }}
              >
                {b.label}
              </button>
            ))}
          </div>
          {filtered && (
            <button type="button" onClick={clear} className="cursor-pointer border-none bg-transparent px-1.5 py-2 font-body text-sm font-medium text-cobalt hover:underline">
              Clear filters
            </button>
          )}
        </div>

        {rows.length > 0 ? (
          <>
            <div className="border-t border-line">
              {rows.map((a, k) => (
                <div key={k} className="grid grid-cols-[118px_minmax(0,1fr)_96px_84px] items-center gap-4 border-b border-line py-3.5">
                  <span className="text-sm text-graphite [font-variant-numeric:tabular-nums]">{a.when}</span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-medium [font-variant-numeric:tabular-nums]">
                      9709 Paper {a.variant} · {a.session} {a.year} · Question {a.qnum}
                    </div>
                    <div className="mt-0.5 text-[13px] text-graphite">{a.topic}</div>
                  </div>
                  <span
                    className="text-right font-display text-base font-semibold [font-variant-numeric:tabular-nums]"
                    style={{ color: a.got === null ? "var(--color-graphite)" : a.got === a.max ? "var(--color-ember)" : "var(--color-ink)" }}
                  >
                    {a.got === null ? "skipped" : `${a.got}/${a.max}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRetried((prev) => ({ ...prev, [k]: true }))}
                    className="cursor-pointer justify-self-end rounded-lg border border-line bg-transparent px-3 py-2 font-body text-[13px] font-medium text-ink hover:border-graphite"
                  >
                    {retried[k] ? "Queued" : "Retry"}
                  </button>
                </div>
              ))}
            </div>
            {marks.length > 0 && (
              <p className="mt-3.5 text-sm text-graphite">
                Across this view you've earned {marks.reduce((a, r) => a + (r.got ?? 0), 0)} of {marks.reduce((a, r) => a + r.max, 0)} marks.
              </p>
            )}
          </>
        ) : (
          <div className="max-w-[46ch] py-10">
            <h3 className="mb-2 font-display text-[19px] font-semibold">Nothing matches those filters</h3>
            <p className="mb-[18px] text-[15px] leading-[1.6] text-graphite">{emptyLine}</p>
            <button type="button" onClick={clear} className="cursor-pointer rounded-lg border border-line bg-transparent px-[18px] py-3 font-body text-[15px] font-medium text-ink hover:border-graphite">
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
