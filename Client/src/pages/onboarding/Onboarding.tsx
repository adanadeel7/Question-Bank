import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/AuthLayout";

const SUBJECTS = [
  { name: "Mathematics 9709", detail: "1,284 questions, papers 1, 3, 4, 5", count: 1284 },
  { name: "Physics 9702", detail: "967 questions, papers 1, 2, 4", count: 967 },
  { name: "Chemistry 9701", detail: "612 questions, papers 2, 4", count: 612 },
  { name: "Further Maths 9231", detail: "238 questions, papers 1, 2", count: 238 },
];

const SESSIONS = [
  { name: "May/June 2026", detail: "The main session. Most students sit this one." },
  { name: "Oct/Nov 2026", detail: "The November series." },
  { name: "Feb/Mar 2026", detail: "India and a few other centres only." },
  { name: "Not sure yet", detail: "We will drill everything evenly until you decide." },
];

type Step = "subjects" | "session" | "done";

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("subjects");
  const [subjects, setSubjects] = useState<string[]>(["Mathematics 9709"]);
  const [session, setSession] = useState<string | null>(null);

  function toggleSubject(name: string) {
    setSubjects((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]));
  }

  const totalQuestions = subjects.reduce(
    (sum, name) => sum + (SUBJECTS.find((s) => s.name === name)?.count ?? 0),
    0,
  );

  if (step === "subjects") {
    return (
      <AuthLayout
        stepLabel="Step 1 of 2"
        heading="Which subjects are you sitting?"
        subheading="Pick the ones you want to practise. You can change this later in settings."
        footNote="You can change your subjects and exam session at any time in settings."
        asideHeading="Why we ask"
        asideBlurb="Your subjects decide which question bank we draw from, and nothing else. No email about any of it."
      >
        <div className="grid max-w-[620px] grid-cols-2 gap-[10px] max-[940px]:grid-cols-1">
          {SUBJECTS.map((s) => {
            const on = subjects.includes(s.name);
            return (
              <label
                key={s.name}
                className="flex cursor-pointer items-start gap-3 rounded-[10px] border px-4 py-[15px] transition-colors hover:border-graphite"
                style={{
                  borderColor: on ? "var(--color-cobalt)" : "var(--color-line)",
                  background: on ? "var(--color-tint)" : "var(--color-surface)",
                }}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggleSubject(s.name)}
                  className="mt-0.5 h-[17px] w-[17px] cursor-pointer accent-cobalt"
                />
                <span className="min-w-0">
                  <span className="block text-base font-semibold">{s.name}</span>
                  <span className="mt-[3px] block text-sm text-graphite">{s.detail}</span>
                </span>
              </label>
            );
          })}
        </div>
        <p className="mb-[26px] mt-4 text-sm text-graphite">
          {subjects.length
            ? `${subjects.length} ${subjects.length === 1 ? "subject" : "subjects"} selected, ${totalQuestions.toLocaleString(
                "en-GB",
              )} questions to draw from.`
            : "Pick at least one subject to carry on."}
        </p>
        <button
          type="button"
          disabled={!subjects.length}
          onClick={() => setStep("session")}
          className="cursor-pointer rounded-lg border-none px-7 py-4 font-body text-[17px] font-semibold text-cobalt-ink transition-colors duration-150 active:translate-y-px disabled:cursor-not-allowed"
          style={{
            background: subjects.length ? "var(--color-cobalt)" : "var(--color-graphite)",
            opacity: subjects.length ? 1 : 0.45,
          }}
        >
          Next, your exam session
        </button>
      </AuthLayout>
    );
  }

  if (step === "session") {
    return (
      <AuthLayout
        stepLabel="Step 2 of 2"
        heading="When do you sit them?"
        subheading="This sets your pace. Nothing here is locked in — you can move it in settings."
        footNote="You can change your subjects and exam session at any time in settings."
        asideHeading="Why we ask"
        asideBlurb="Your session sets the pace. A May/June candidate gets pushed harder on weak topics in April than in September."
      >
        <div className="grid max-w-[620px] grid-cols-2 gap-[10px] max-[600px]:grid-cols-1">
          {SESSIONS.map((s) => {
            const on = session === s.name;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setSession(s.name)}
                className="cursor-pointer rounded-[10px] border px-4 py-4 text-left font-body transition-colors hover:border-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt"
                style={{
                  borderColor: on ? "var(--color-cobalt)" : "var(--color-line)",
                  background: on ? "var(--color-tint)" : "var(--color-surface)",
                }}
              >
                <span className="block font-display text-lg font-semibold">{s.name}</span>
                <span className="mt-1 block text-sm text-graphite">{s.detail}</span>
              </button>
            );
          })}
        </div>
        <p className="mb-[26px] mt-4 text-sm text-graphite">
          {session
            ? session === "Not sure yet"
              ? "We will spread practice across every topic until you set a session."
              : `About ${session.startsWith("May") ? "34" : session.startsWith("Oct") ? "58" : "24"} weeks of revision time.`
            : "Pick a session to carry on."}
        </p>
        <div className="flex flex-wrap gap-[10px]">
          <button
            type="button"
            disabled={!session}
            onClick={() => setStep("done")}
            className="cursor-pointer rounded-lg border-none px-7 py-4 font-body text-[17px] font-semibold text-cobalt-ink transition-colors duration-150 active:translate-y-px disabled:cursor-not-allowed"
            style={{
              background: session ? "var(--color-cobalt)" : "var(--color-graphite)",
              opacity: session ? 1 : 0.45,
            }}
          >
            Start my first drill
          </button>
          <button
            type="button"
            onClick={() => setStep("subjects")}
            className="cursor-pointer rounded-lg border border-line bg-transparent px-[22px] py-[15px] font-body text-base font-medium text-ink hover:border-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt"
          >
            Back
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heading="That is everything."
      subheading="Your first drill is built from the topics you have not attempted yet."
      footNote="You can change any of this later from settings."
      asideHeading="What we set up"
      asideBlurb="You can change any of this later from settings."
    >
      <div className="max-w-[520px] border-t-2 border-ink pt-4">
        {[
          { label: "Subjects", value: subjects.join(", ") || "None" },
          { label: "Exam session", value: session || "Not set" },
          { label: "Questions available to you", value: totalQuestions.toLocaleString("en-GB") },
          { label: "First drill", value: "8 questions, about 35 minutes" },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-line py-3"
          >
            <span className="text-sm text-graphite">{row.label}</span>
            <span className="text-right text-base font-medium [font-variant-numeric:tabular-nums]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="mt-[26px] cursor-pointer rounded-lg border-none bg-cobalt px-7 py-4 font-body text-[17px] font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt"
      >
        Go to my dashboard
      </button>
    </AuthLayout>
  );
}
