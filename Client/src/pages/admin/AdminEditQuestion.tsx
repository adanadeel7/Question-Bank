import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { getMarkingSchemeRequest, updateQuestionRequest, type ApiQuestion } from "../../lib/api";
import { TOPIC_OPTIONS } from "../../lib/topics";
import { ImageField } from "../../components/admin/ImageCropField";

const SESSIONS = ["May/June", "Oct/Nov", "Feb/Mar"];
const VARIANTS = ["1", "2", "3"];
const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export function AdminEditQuestion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const question = (location.state as { question?: ApiQuestion } | null)?.question ?? null;

  const [session, setSession] = useState(question?.session ?? SESSIONS[0]);
  const [variant, setVariant] = useState(String(question?.variant ?? VARIANTS[0]));
  const [year, setYear] = useState(question?.year ?? YEARS[YEARS.length - 1]);
  const [questionNumber, setQuestionNumber] = useState(String(question?.question_number ?? ""));
  const [marks, setMarks] = useState(String(question?.marks ?? ""));
  const [topic, setTopic] = useState(question?.topic ?? TOPIC_OPTIONS[0].value);
  const [text, setText] = useState(question?.text ?? "");
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [schemeFile, setSchemeFile] = useState<File | null>(null);
  const [schemeUrl, setSchemeUrl] = useState<string | undefined>(undefined);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getMarkingSchemeRequest(id)
      .then((res) => {
        if (!cancelled) setSchemeUrl(res.marking_scheme.url);
      })
      .catch(() => {
        // Preview is a nice-to-have — leave it blank if this fails.
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const valid = questionNumber.trim() !== "" && marks.trim() !== "" && text.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !valid || submitting) return;

    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.set("subject", "Mathematics");
    formData.set("code", "9709");
    formData.set("variant", variant);
    formData.set("session", session);
    formData.set("year", String(year));
    formData.set("question_number", questionNumber);
    formData.set("marks", marks);
    formData.set("topic", topic);
    formData.set("text", text);
    if (contentFile) formData.set("content", contentFile);
    if (schemeFile) formData.set("marking_scheme", schemeFile);

    try {
      await updateQuestionRequest(id, formData);
      navigate("/admin/questions/all");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the question");
      setSubmitting(false);
    }
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-admin-paper px-5 py-8 font-body text-[14px] text-admin-ink">
        <p className="mb-3 text-sm text-ember">No question loaded — open this page from the "All questions" list.</p>
        <Link to="/admin/questions/all" className="text-sm font-medium text-cobalt hover:underline">Back to all questions</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-admin-paper font-body text-[14px] text-admin-ink">
      <header className="flex flex-wrap items-center gap-5 bg-admin-ink px-5 py-2.5 text-[#E8EBEF]">
        <span className="font-display text-sm font-semibold">Questionbank admin</span>
        <nav className="flex gap-4">
          <Link to="/admin" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Overview</Link>
          <Link to="/admin/queue" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Ingestion review</Link>
          <Link to="/admin/questions/new" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Add question</Link>
          <Link to="/admin/questions/all" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">All questions</Link>
        </nav>
      </header>

      <main className="mx-auto max-w-[760px] px-5 py-8">
        <h1 className="mb-1 font-display text-2xl font-semibold">
          Edit question {question.code} P{question.variant} · {question.session} {question.year} · Q{question.question_number}
        </h1>
        <p className="mb-6 text-[13px] text-admin-graphite">
          Leave an image field untouched to keep the current crop — only choose a new image to replace it.
        </p>

        {error && (
          <div className="mb-5 border border-ember bg-[rgba(184,87,8,.07)] px-4 py-3 text-sm text-ember">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-admin-line bg-surface p-5">
          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-admin-graphite">Session</span>
              <select value={session} onChange={(e) => setSession(e.target.value)} className="w-full cursor-pointer border border-admin-line bg-white px-2.5 py-2 text-sm font-medium">
                {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-admin-graphite">Variant</span>
              <select value={variant} onChange={(e) => setVariant(e.target.value)} className="w-full cursor-pointer border border-admin-line bg-white px-2.5 py-2 text-sm font-medium">
                {VARIANTS.map((v) => <option key={v} value={v}>Paper {v}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-admin-graphite">Year</span>
              <select value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))} className="w-full cursor-pointer border border-admin-line bg-white px-2.5 py-2 text-sm font-medium">
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-admin-graphite">Question number</span>
              <input
                type="number" min={1} value={questionNumber}
                onChange={(e) => setQuestionNumber(e.target.value)}
                className="w-full border border-admin-line bg-white px-2.5 py-2 text-sm font-medium [font-variant-numeric:tabular-nums]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-admin-graphite">Marks</span>
              <input
                type="number" min={1}
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full border border-admin-line bg-white px-2.5 py-2 text-sm font-medium [font-variant-numeric:tabular-nums]"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-admin-graphite">Topic</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full cursor-pointer border border-admin-line bg-white px-2.5 py-2 text-sm font-medium">
              {TOPIC_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-admin-graphite">Extracted text</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full border border-admin-line bg-white px-2.5 py-2 text-sm"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <ImageField label="Question crop" file={contentFile} onChange={setContentFile} initialUrl={question.content.url} />
            <ImageField label="Marking scheme crop" file={schemeFile} onChange={setSchemeFile} initialUrl={schemeUrl} />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!valid || submitting}
              className="cursor-pointer self-start border-none px-6 py-3 font-body text-sm font-semibold text-cobalt-ink transition-colors disabled:cursor-not-allowed"
              style={{ background: valid && !submitting ? "var(--color-cobalt)" : "var(--color-admin-graphite)", opacity: valid && !submitting ? 1 : 0.5 }}
            >
              {submitting ? "Saving…" : "Save changes"}
            </button>
            <Link to="/admin/questions/all" className="text-sm font-medium text-admin-graphite hover:text-admin-ink hover:underline">
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
