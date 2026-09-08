import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQuestionsRequest, type ApiQuestion } from "../../lib/api";

export function AdminDashboard() {
  const [questions, setQuestions] = useState<ApiQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getQuestionsRequest({})
      .then((res) => {
        if (!cancelled) setQuestions(res.questions);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load questions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = questions?.length ?? 0;
  const reviewed = questions?.filter((q) => q.state === "reviewed").length ?? 0;
  const inReview = total - reviewed;
  const reviewPct = total > 0 ? Math.round((reviewed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-admin-paper font-body text-[14px] text-admin-ink">
      <header className="flex flex-wrap items-center gap-5 bg-admin-ink px-5 py-2.5 text-[#E8EBEF]">
        <span className="font-display text-sm font-semibold">Questionbank admin</span>
        <nav className="flex gap-4">
          <span className="text-[13px] font-semibold text-white">Overview</span>
          <Link to="/admin/queue" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Ingestion review</Link>
          <Link to="/admin/questions/new" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Add question</Link>
          <Link to="/admin/questions/all" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">All questions</Link>
        </nav>
      </header>

      <div className="mx-auto max-w-[1000px] p-5">
        {loading && <p className="text-admin-graphite">Loading…</p>}
        {error && <p className="text-ember">{error}</p>}

        {!loading && !error && (
          <>
            <div className="mb-5 grid grid-cols-3 border border-admin-line bg-surface max-[600px]:grid-cols-1">
              <div className="border-r border-admin-line px-[18px] py-4 last:border-r-0 max-[600px]:border-b max-[600px]:border-r-0">
                <div className="font-display text-[26px] font-semibold leading-none [font-variant-numeric:tabular-nums]">
                  {total}
                </div>
                <div className="mt-[5px] text-[13px] leading-[1.4] text-admin-graphite">questions in the bank</div>
              </div>
              <div className="border-r border-admin-line px-[18px] py-4 last:border-r-0 max-[600px]:border-b max-[600px]:border-r-0">
                <div
                  className="font-display text-[26px] font-semibold leading-none [font-variant-numeric:tabular-nums]"
                  style={{ color: inReview > 0 ? "var(--color-ember)" : "var(--color-admin-ink)" }}
                >
                  {inReview}
                </div>
                <div className="mt-[5px] text-[13px] leading-[1.4] text-admin-graphite">not yet reviewed</div>
              </div>
              <div className="px-[18px] py-4">
                <div className="font-display text-[26px] font-semibold leading-none [font-variant-numeric:tabular-nums]">
                  {reviewPct}%
                </div>
                <div className="mt-[5px] text-[13px] leading-[1.4] text-admin-graphite">reviewed coverage</div>
              </div>
            </div>

            <section className="border border-admin-line bg-surface px-5 pb-5 pt-[18px]">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2.5">
                <h2 className="font-display text-[15px] font-semibold">Mathematics 9709</h2>
                <Link to="/admin/questions/all" className="text-[13px] font-medium text-cobalt hover:underline">
                  View all questions
                </Link>
              </div>
              <div className="border-t border-admin-line">
                <div className="grid grid-cols-[minmax(0,1fr)_96px_96px] gap-3.5 border-b border-admin-line py-2">
                  <span className="text-xs text-admin-graphite">Coverage reviewed</span>
                  <span className="text-right text-xs text-admin-graphite">Live</span>
                  <span className="text-right text-xs text-admin-graphite">In review</span>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_96px_96px] items-center gap-3.5 py-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="h-[7px] flex-1 overflow-hidden bg-admin-line">
                      <div
                        className="h-full"
                        style={{
                          width: `${reviewPct}%`,
                          background: "linear-gradient(90deg, #3B5BDB, #B85708)",
                          backgroundSize: `${(10000 / Math.max(reviewPct, 1)).toFixed(0)}% 100%`,
                        }}
                      />
                    </div>
                    <span className="w-[34px] text-right text-xs text-admin-graphite [font-variant-numeric:tabular-nums]">
                      {reviewPct}%
                    </span>
                  </div>
                  <span className="text-right font-display text-[15px] font-semibold [font-variant-numeric:tabular-nums]">{total}</span>
                  <span
                    className="text-right text-sm [font-variant-numeric:tabular-nums]"
                    style={{ color: inReview > 0 ? "var(--color-ember)" : "var(--color-admin-graphite)" }}
                  >
                    {inReview || "—"}
                  </span>
                </div>
              </div>
              <p className="mt-2.5 text-[13px] text-admin-graphite">
                Every question here is already live to students regardless of review state — "reviewed" is a
                quality-check flag, not a publish gate yet.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
