import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createQuestionRequest } from "../../lib/api";

const TOPIC_OPTIONS = [
  { label: "Quadratics", value: "quadratics" },
  { label: "Functions", value: "functions" },
  { label: "Coordinate geometry", value: "coordinate-geometry" },
  { label: "Circular measure", value: "circular-measure" },
  { label: "Trigonometry", value: "trigonometry" },
  { label: "Series", value: "series" },
  { label: "Differentiation", value: "differentiation" },
  { label: "Integration", value: "integration" },
];
const SESSIONS = ["May/June", "Oct/Nov", "Feb/Mar"];
const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

function ImageField({
  label, file, onChange,
}: { label: string; file: File | null; onChange: (f: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div className="block">
      <span className="mb-1 block text-xs font-semibold text-admin-graphite">{label}</span>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer items-center justify-center overflow-hidden border border-dashed border-admin-line bg-white"
        style={{ aspectRatio: label.toLowerCase().includes("scheme") ? "4/3" : "16/10" }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} className="h-full w-full object-contain" />
        ) : (
          <span className="px-4 text-center text-sm text-admin-graphite">Click to choose an image</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {file && (
        <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-admin-graphite">
          <span className="truncate">{file.name}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="cursor-pointer border-none bg-transparent p-0 font-medium text-ember hover:underline"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export function AdminAddQuestion() {
  const [session, setSession] = useState(SESSIONS[0]);
  const [year, setYear] = useState(YEARS[YEARS.length - 1]);
  const [questionNumber, setQuestionNumber] = useState("");
  const [marks, setMarks] = useState("");
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0].value);
  const [text, setText] = useState("");
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [schemeFile, setSchemeFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState<{ questionNumber: string; topic: string } | null>(null);

  const valid = questionNumber.trim() !== "" && marks.trim() !== "" && text.trim() !== "" && contentFile && schemeFile;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;

    setSubmitting(true);
    setError("");
    setJustAdded(null);

    const formData = new FormData();
    formData.set("subject", "Mathematics");
    formData.set("code", "9709");
    formData.set("variant", "1");
    formData.set("session", session);
    formData.set("year", String(year));
    formData.set("question_number", questionNumber);
    formData.set("marks", marks);
    formData.set("topic", topic);
    formData.set("text", text);
    formData.set("content", contentFile!);
    formData.set("marking_scheme", schemeFile!);

    try {
      await createQuestionRequest(formData);
      setJustAdded({ questionNumber, topic: TOPIC_OPTIONS.find((t) => t.value === topic)?.label ?? topic });
      // Keep session/year — the next question is usually from the same paper.
      setQuestionNumber("");
      setMarks("");
      setText("");
      setContentFile(null);
      setSchemeFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the question");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-admin-paper font-body text-[14px] text-admin-ink">
      <header className="flex flex-wrap items-center gap-5 bg-admin-ink px-5 py-2.5 text-[#E8EBEF]">
        <span className="font-display text-sm font-semibold">Questionbank admin</span>
        <nav className="flex gap-4">
          <Link to="/admin" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Overview</Link>
          <Link to="/admin/queue" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Ingestion review</Link>
          <span className="text-[13px] font-semibold text-white">Add question</span>
        </nav>
      </header>

      <main className="mx-auto max-w-[760px] px-5 py-8">
        <h1 className="mb-1 font-display text-2xl font-semibold">Add a question</h1>
        <p className="mb-6 text-[13px] text-admin-graphite">
          Mathematics 9709, Paper 1. This is the real create-question endpoint — every submission here is a live
          question students can practise.
        </p>

        {justAdded && (
          <div className="mb-5 border border-admin-line bg-surface px-4 py-3 text-sm">
            <span className="font-semibold text-admin-ink">Added</span> — Question {justAdded.questionNumber} ({justAdded.topic}). Form is reset, ready for the next one.
          </div>
        )}
        {error && (
          <div className="mb-5 border border-ember bg-[rgba(184,87,8,.07)] px-4 py-3 text-sm text-ember">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 border border-admin-line bg-surface p-5">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-admin-graphite">Session</span>
              <select value={session} onChange={(e) => setSession(e.target.value)} className="w-full cursor-pointer border border-admin-line bg-white px-2.5 py-2 text-sm font-medium">
                {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
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
              placeholder="Type out the question text — used for search and tagging."
              className="w-full border border-admin-line bg-white px-2.5 py-2 text-sm"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <ImageField label="Question crop" file={contentFile} onChange={setContentFile} />
            <ImageField label="Marking scheme crop" file={schemeFile} onChange={setSchemeFile} />
          </div>

          <button
            type="submit"
            disabled={!valid || submitting}
            className="cursor-pointer self-start border-none px-6 py-3 font-body text-sm font-semibold text-cobalt-ink transition-colors disabled:cursor-not-allowed"
            style={{ background: valid && !submitting ? "var(--color-cobalt)" : "var(--color-admin-graphite)", opacity: valid && !submitting ? 1 : 0.5 }}
          >
            {submitting ? "Uploading…" : "Add question"}
          </button>
        </form>
      </main>
    </div>
  );
}
