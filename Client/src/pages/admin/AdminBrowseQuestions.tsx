import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getQuestionsRequest, deleteQuestionRequest, reviewQuestionRequest, type ApiQuestion } from "../../lib/api";
import { TOPIC_OPTIONS, topicLabel } from "../../lib/topics";

const STATE_COLOR: Record<string, string> = {
  cropped: "var(--color-admin-graphite)",
  tagged: "var(--color-ember)",
  reviewed: "var(--color-admin-ink)",
};

export function AdminBrowseQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<ApiQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topicFilter, setTopicFilter] = useState("All topics");
  const [stateFilter, setStateFilter] = useState("All states");
  const [rowError, setRowError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

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

  const filtered = useMemo(() => {
    if (!questions) return [];
    return questions
      .filter((q) => topicFilter === "All topics" || q.topic === topicFilter)
      .filter((q) => stateFilter === "All states" || q.state === stateFilter)
      .sort((a, b) => a.year - b.year || a.question_number - b.question_number);
  }, [questions, topicFilter, stateFilter]);

  const states = questions ? Array.from(new Set(questions.map((q) => q.state))) : [];

  function handleEdit(q: ApiQuestion) {
    navigate(`/admin/questions/${q._id}/edit`, { state: { question: q } });
  }

  async function handleReview(q: ApiQuestion) {
    setRowError("");
    setBusyId(q._id);
    try {
      await reviewQuestionRequest(q._id);
      setQuestions((prev) => prev && prev.map((x) => (x._id === q._id ? { ...x, state: "reviewed" } : x)));
    } catch (err) {
      setRowError(err instanceof Error ? err.message : "Could not mark this question reviewed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(q: ApiQuestion) {
    const label = `${q.code} P${q.variant} · ${q.session} ${q.year} · Q${q.question_number}`;
    if (!window.confirm(`Delete ${label}? This removes it and its images permanently.`)) return;

    setRowError("");
    setBusyId(q._id);
    try {
      await deleteQuestionRequest(q._id);
      setQuestions((prev) => prev && prev.filter((x) => x._id !== q._id));
    } catch (err) {
      setRowError(err instanceof Error ? err.message : "Could not delete this question");
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-admin-paper font-body text-[14px] text-admin-ink">
      <header className="flex flex-wrap items-center gap-5 bg-admin-ink px-5 py-2.5 text-[#E8EBEF]">
        <span className="font-display text-sm font-semibold">Questionbank admin</span>
        <nav className="flex gap-4">
          <Link to="/admin" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Overview</Link>
          <Link to="/admin/queue" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Ingestion review</Link>
          <Link to="/admin/questions/new" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Add question</Link>
          <span className="text-[13px] font-semibold text-white">All questions</span>
        </nav>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-8">
        <div className="mb-1 flex flex-wrap items-baseline gap-3">
          <h1 className="font-display text-2xl font-semibold">All questions</h1>
          {questions && (
            <span className="text-[13px] text-admin-graphite [font-variant-numeric:tabular-nums]">
              {filtered.length} of {questions.length}
            </span>
          )}
        </div>
        <p className="mb-5 text-[13px] text-admin-graphite">Mathematics 9709, Paper 1 — every question currently in the bank.</p>

        {loading && <p className="text-admin-graphite">Loading…</p>}
        {error && <p className="text-ember">{error}</p>}
        {rowError && <p className="mb-3 text-sm text-ember">{rowError}</p>}

        {!loading && !error && questions && (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="cursor-pointer border border-admin-line bg-surface px-2.5 py-2 text-sm font-medium"
              >
                {["All topics", ...TOPIC_OPTIONS.map((t) => t.value)].map((v) => (
                  <option key={v} value={v}>{v === "All topics" ? v : topicLabel(v)}</option>
                ))}
              </select>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="cursor-pointer border border-admin-line bg-surface px-2.5 py-2 text-sm font-medium"
              >
                {["All states", ...states].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="py-8 text-sm text-admin-graphite">No questions match these filters.</p>
            ) : (
              <div className="border-t border-admin-line">
                <div className="grid grid-cols-[64px_1fr_140px_70px_90px_auto] gap-3 border-b border-admin-line py-2 text-xs font-semibold text-admin-graphite">
                  <span>Crop</span>
                  <span>Reference</span>
                  <span>Topic</span>
                  <span className="text-right">Marks</span>
                  <span className="text-right">State</span>
                  <span></span>
                </div>
                {filtered.map((q) => (
                  <div key={q._id} className="grid grid-cols-[64px_1fr_140px_70px_90px_auto] items-center gap-3 border-b border-admin-line py-2.5">
                    <img src={q.content.url} alt="" className="h-10 w-14 border border-admin-line object-cover" />
                    <span className="text-sm font-medium [font-variant-numeric:tabular-nums]">
                      {q.code} P{q.variant} · {q.session} {q.year} · Q{q.question_number}
                    </span>
                    <span className="text-sm">{topicLabel(q.topic)}</span>
                    <span className="text-right text-sm [font-variant-numeric:tabular-nums]">{q.marks}</span>
                    <span className="text-right text-[13px] font-semibold" style={{ color: STATE_COLOR[q.state] ?? "var(--color-admin-graphite)" }}>
                      {q.state}
                    </span>
                    <div className="flex items-center gap-2.5 whitespace-nowrap text-[13px] font-medium">
                      <button
                        type="button"
                        onClick={() => handleEdit(q)}
                        disabled={busyId === q._id}
                        className="cursor-pointer border-none bg-transparent p-0 text-cobalt hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Edit
                      </button>
                      {q.state !== "reviewed" && (
                        <button
                          type="button"
                          onClick={() => handleReview(q)}
                          disabled={busyId === q._id}
                          className="cursor-pointer border-none bg-transparent p-0 text-admin-ink hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Mark reviewed
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(q)}
                        disabled={busyId === q._id}
                        className="cursor-pointer border-none bg-transparent p-0 text-ember hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
