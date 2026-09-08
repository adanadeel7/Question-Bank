import { useNavigate, useLocation } from "react-router-dom";
import { NavRail } from "../components/NavRail";
import type { ApiQuestion } from "../lib/api";

interface Result {
  question: ApiQuestion;
  score: number | null;
}

interface LocationState {
  results?: Result[];
  durationSeconds?: number;
}

export function SessionSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const results = state?.results ?? [];
  const durationSeconds = state?.durationSeconds ?? 0;

  if (results.length === 0) {
    return (
      <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
        <NavRail />
        <main className="flex flex-col items-center justify-center gap-4 px-10 text-center">
          <h1 className="font-display text-2xl font-semibold">No session to summarise</h1>
          <p className="text-graphite">Finish (or end) a practice session and you'll see real results here.</p>
          <button
            type="button"
            onClick={() => navigate("/topics")}
            className="cursor-pointer rounded-lg border-none bg-cobalt px-6 py-3 font-body text-base font-semibold text-cobalt-ink hover:bg-cobalt-press"
          >
            Go to Topic Picker
          </button>
        </main>
      </div>
    );
  }

  const attempted = results.filter((r) => r.score !== null);
  const totalScore = attempted.reduce((a, r) => a + (r.score ?? 0), 0);
  const totalMarks = results.reduce((a, r) => a + r.question.marks, 0);
  const percent = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0;
  const skipped = results.length - attempted.length;
  const mins = Math.floor(durationSeconds / 60);
  const secs = durationSeconds % 60;
  const perQuestionMins = results.length > 0 ? Math.round((durationSeconds / results.length / 60) * 10) / 10 : 0;

  const gradeNote =
    percent >= 80 ? "around a grade A on this paper" :
    percent >= 65 ? "around a grade B on this paper" :
    percent >= 50 ? "around a grade C on this paper" :
    "below a grade C on this paper";

  return (
    <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
      <NavRail />

      <main className="max-w-[1240px] px-10 pb-[70px] pt-[34px] max-[760px]:px-4 max-[760px]:pb-24 max-[760px]:pt-4.5">
        <p className="mb-[26px] text-sm text-graphite">Session finished just now.</p>

        <div className="flex flex-wrap items-end gap-x-[54px] gap-y-[38px] border-b border-line pb-[26px]">
          <div>
            <div className="flex items-baseline gap-2 font-display [font-variant-numeric:tabular-nums]">
              <span className="text-[56px] font-semibold leading-none">{totalScore}</span>
              <span className="text-2xl font-medium text-graphite">/ {totalMarks}</span>
            </div>
            <p className="mt-2 text-[15px] text-graphite">marks, self-marked</p>
          </div>
          <div>
            <div className="font-display text-[32px] font-semibold leading-none [font-variant-numeric:tabular-nums]">{percent}%</div>
            <p className="mt-2 text-[15px] text-graphite">{gradeNote}</p>
          </div>
          <div>
            <div className="font-display text-[32px] font-semibold leading-none [font-variant-numeric:tabular-nums]">
              {mins}:{String(secs).padStart(2, "0")}
            </div>
            <p className="mt-2 text-[15px] text-graphite">about {perQuestionMins} minutes a question</p>
          </div>
          <div>
            <div className="font-display text-[32px] font-semibold leading-none [font-variant-numeric:tabular-nums]">{attempted.length}</div>
            <p className="mt-2 text-[15px] text-graphite">of {results.length} attempted{skipped ? `, ${skipped} skipped` : ""}</p>
          </div>
        </div>

        <section className="pt-[34px]">
          <h2 className="mb-1 font-display text-[19px] font-semibold">Question by question</h2>
          <p className="mb-3.5 text-sm text-graphite">Retry anything you want to see again.</p>
          <div className="border-t border-line">
            {results.map((r, k) => (
              <div key={`${r.question._id}-${k}`} className="grid grid-cols-[26px_minmax(0,1fr)_74px_62px] items-center gap-3.5 border-b border-line py-3.5">
                <span className="font-display text-sm font-semibold text-graphite [font-variant-numeric:tabular-nums]">{k + 1}</span>
                <div className="min-w-0">
                  <div className="text-[15px] font-medium [font-variant-numeric:tabular-nums]">
                    {r.question.code} Paper {r.question.variant} · {r.question.session} {r.question.year} · Q{r.question.question_number}
                  </div>
                  <div className="mt-0.5 text-[13px] text-graphite">{r.question.topic}</div>
                </div>
                <span
                  className="text-right font-display text-base font-semibold [font-variant-numeric:tabular-nums]"
                  style={{ color: r.score === null ? "var(--color-graphite)" : r.score === r.question.marks ? "var(--color-ember)" : "var(--color-ink)" }}
                >
                  {r.score === null ? "skipped" : `${r.score}/${r.question.marks}`}
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/practice", { state: { questions: [r.question] } })}
                  className="cursor-pointer justify-self-end rounded-lg border border-line bg-transparent px-2.5 py-1.5 font-body text-[13px] font-medium text-ink hover:border-graphite"
                >
                  Retry
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-[34px] flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/topics")}
            className="cursor-pointer rounded-lg border-none bg-cobalt px-7 py-4 font-body text-base font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt"
          >
            Practise more
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer rounded-lg border border-line bg-transparent px-7 py-4 font-body text-[15px] font-medium text-ink hover:border-graphite"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
