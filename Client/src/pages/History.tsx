import { useEffect, useMemo, useState } from "react";
import { NavRail } from "../components/NavRail";
import { getHistoryRequest, type ApiHistoryEntry } from "../lib/api";
import { TOPIC_OPTIONS, topicLabel } from "../lib/topics";

const BANDS = [
  { key: "all", label: "All" },
  { key: "full", label: "Full marks" },
  { key: "partial", label: "Partial" },
  { key: "zero", label: "Zero" },
] as const;

type Band = (typeof BANDS)[number]["key"];

function formatWhen(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);

  if (diffDays === 0) {
    return `Today, ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
}

export function History() {
  const [entries, setEntries] = useState<ApiHistoryEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topic, setTopic] = useState("All topics");
  const [band, setBand] = useState<Band>("all");

  useEffect(() => {
    let cancelled = false;
    getHistoryRequest()
      .then((res) => {
        if (!cancelled) setEntries(res.history);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load your history");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => {
    if (!entries) return [];
    return entries.filter((e) => {
      const max = e.question.marks;
      const got = e.marksScored;
      return (
        (topic === "All topics" || e.question.topic === topic) &&
        (band === "all" ||
          (band === "full" && got === max) ||
          (band === "partial" && got > 0 && got < max) ||
          (band === "zero" && got === 0))
      );
    });
  }, [entries, topic, band]);

  const filtered = topic !== "All topics" || band !== "all";

  function clear() {
    setTopic("All topics");
    setBand("all");
  }

  const emptyLine = `You have no ${band === "all" ? "" : BANDS.find((b) => b.key === band)!.label.toLowerCase() + " "}attempts in ${topic === "All topics" ? "this view" : topic.toLowerCase()} yet.`;

  return (
    <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
      <NavRail />

      <main className="max-w-[1240px] px-10 pb-[70px] pt-[34px] max-[760px]:px-4 max-[760px]:pb-24 max-[760px]:pt-5">
        <div className="mb-1 flex flex-wrap items-baseline gap-x-[22px] gap-y-3">
          <h1 className="font-display text-[28px] font-semibold">History</h1>
          {entries && (
            <span className="text-[15px] text-graphite [font-variant-numeric:tabular-nums]">{rows.length} of {entries.length} attempts</span>
          )}
        </div>
        <p className="mb-[22px] text-[15px] text-graphite">Your last 3 days of attempts, newest first.</p>

        {loading && <p className="text-graphite">Loading…</p>}
        {error && <p className="text-ember">{error}</p>}

        {!loading && !error && entries && (
          <>
            <div className="mb-[22px] flex flex-wrap items-center gap-2">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-2.5 font-body text-sm font-medium text-ink"
              >
                {["All topics", ...TOPIC_OPTIONS.map((t) => t.value)].map((v) => (
                  <option key={v} value={v}>{v === "All topics" ? v : topicLabel(v)}</option>
                ))}
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
                  {rows.map((e) => {
                    const max = e.question.marks;
                    const got = e.marksScored;
                    return (
                      <div key={e._id} className="grid grid-cols-[118px_minmax(0,1fr)_96px] items-center gap-4 border-b border-line py-3.5">
                        <span className="text-sm text-graphite [font-variant-numeric:tabular-nums]">{formatWhen(e.createdAt)}</span>
                        <div className="min-w-0">
                          <div className="text-[15px] font-medium [font-variant-numeric:tabular-nums]">
                            9709 Paper {e.question.variant} · {e.question.session} {e.question.year} · Question {e.question.question_number}
                          </div>
                          <div className="mt-0.5 text-[13px] text-graphite">{topicLabel(e.question.topic)}</div>
                        </div>
                        <span
                          className="text-right font-display text-base font-semibold [font-variant-numeric:tabular-nums]"
                          style={{ color: got === max ? "var(--color-ember)" : "var(--color-ink)" }}
                        >
                          {got}/{max}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3.5 text-sm text-graphite">
                  Across this view you've earned {rows.reduce((a, r) => a + r.marksScored, 0)} of {rows.reduce((a, r) => a + r.question.marks, 0)} marks.
                </p>
              </>
            ) : entries.length === 0 ? (
              <div className="max-w-[46ch] py-10">
                <h3 className="mb-2 font-display text-[19px] font-semibold">No attempts in the last 3 days</h3>
                <p className="text-[15px] leading-[1.6] text-graphite">Practice a topic and it'll show up here.</p>
              </div>
            ) : (
              <div className="max-w-[46ch] py-10">
                <h3 className="mb-2 font-display text-[19px] font-semibold">Nothing matches those filters</h3>
                <p className="mb-[18px] text-[15px] leading-[1.6] text-graphite">{emptyLine}</p>
                <button type="button" onClick={clear} className="cursor-pointer rounded-lg border border-line bg-transparent px-[18px] py-3 font-body text-[15px] font-medium text-ink hover:border-graphite">
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
