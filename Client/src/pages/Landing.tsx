import { useState } from "react";
import { Link } from "react-router-dom";

const TOPICS = [
  { name: "Quadratics", count: 34, from: 2016, to: 2024 },
  { name: "Functions", count: 29, from: 2016, to: 2024 },
  { name: "Coordinate geometry", count: 38, from: 2016, to: 2024 },
  { name: "Circular measure", count: 18, from: 2016, to: 2024 },
  { name: "Trigonometry", count: 44, from: 2016, to: 2024 },
  { name: "Series", count: 31, from: 2016, to: 2024 },
  { name: "Differentiation", count: 56, from: 2016, to: 2024 },
  { name: "Integration", count: 53, from: 2016, to: 2024 },
];

const DEMO: Record<string, { variant: string; session: string; year: string; qnum: string; marks: number }> = {
  Integration: { variant: "1", session: "Oct/Nov", year: "2022", qnum: "9", marks: 9 },
  Trigonometry: { variant: "2", session: "Feb/Mar", year: "2021", qnum: "4", marks: 6 },
  Series: { variant: "3", session: "Oct/Nov", year: "2023", qnum: "5", marks: 7 },
  Differentiation: { variant: "1", session: "May/June", year: "2019", qnum: "8", marks: 10 },
  Quadratics: { variant: "2", session: "Oct/Nov", year: "2020", qnum: "2", marks: 5 },
};

const COVERAGE = [
  { subject: "Mathematics 9709", papers: "Paper 1", years: "2016–2024", count: 293, live: true },
  { subject: "Physics 9702", papers: "—", years: "—", count: "In review" as const, live: false },
  { subject: "Chemistry 9701", papers: "—", years: "—", count: "In review" as const, live: false },
];

const STEPS = [
  { n: "01", title: "Pick a topic", body: "Choose a syllabus topic and, if you want, narrow it by year, session or paper variant. You see how many questions match before you commit." },
  { n: "02", title: "Attempt it on paper", body: "One question fills the screen with its marks and topic tags. Nothing else moves. You work it out on paper the way you will in the exam." },
  { n: "03", title: "Mark yourself honestly", body: "Reveal the official marking scheme next to your question and enter what you scored. That number decides which topics come back tomorrow." },
];

export function Landing() {
  const [topic, setTopic] = useState("Integration");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const d = DEMO[topic] ?? DEMO.Integration;
  const t = TOPICS.find((x) => x.name === topic);
  const bankTotal = COVERAGE.filter((c) => c.live).reduce((a, c) => a + (typeof c.count === "number" ? c.count : 0), 0);
  const pad = Array.from({ length: d.marks + 1 }, (_, n) => n);

  return (
    <div className="bg-paper font-body text-ink">
      <header className="mx-auto flex max-w-[1360px] items-center gap-4.5 px-10 py-5 max-[600px]:px-[18px]">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-ink font-display text-sm font-bold text-paper">Q</div>
          <span className="font-display text-[17px] font-semibold">Questionbank</span>
        </div>
        <nav className="ml-6.5 flex gap-5.5 max-[600px]:hidden">
          <a href="#topics" className="text-[15px] font-medium text-graphite hover:text-ink hover:no-underline">Browse topics</a>
          <a href="#coverage" className="text-[15px] font-medium text-graphite hover:text-ink hover:no-underline">Coverage</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/login" className="rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-ink hover:bg-tint hover:no-underline">Log in</Link>
          <Link to="/signup" className="rounded-lg border border-line px-4 py-2.5 text-[15px] font-semibold text-ink hover:border-graphite hover:no-underline">Create an account</Link>
        </div>
      </header>
      <div className="border-t border-line" />

      <main>
        <section className="mx-auto grid max-w-[1360px] grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-14 px-10 pb-[62px] pt-[54px] max-[980px]:grid-cols-1 max-[980px]:gap-[38px] max-[600px]:px-[18px]">
          <div>
            <h1 className="mb-[18px] font-display text-[44px] font-semibold leading-[1.08] tracking-[-0.5px] max-[980px]:text-[36px] max-[600px]:text-[29px]">
              Practise A-Level maths by topic, not by paper.
            </h1>
            <p className="mb-[26px] max-w-[44ch] text-lg leading-[1.6] text-graphite">
              Pick a syllabus topic, get every past-paper question on it from the last eight years, attempt them on
              paper, then check yourself against the official marking scheme.
            </p>
            <div className="mb-[30px] flex flex-wrap items-center gap-3.5">
              <Link to="/signup" className="rounded-lg bg-cobalt px-7 py-4 text-[17px] font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press hover:no-underline">
                Start practising
              </Link>
              <span className="text-[15px] text-graphite">Free. No card, no trial.</span>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-6.5 border-t border-line pt-6">
              {[
                { value: bankTotal.toLocaleString("en-GB"), label: "questions, marking schemes attached" },
                { value: "1 subject", label: "Cambridge A-Level, more in review" },
                { value: "2016–2024", label: "every session and variant" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-[28px] font-semibold leading-none [font-variant-numeric:tabular-nums]">{s.value}</div>
                  <div className="mt-1.5 text-sm text-graphite">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="grid grid-cols-[206px_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-surface shadow-sh2 max-[980px]:grid-cols-1">
              <div className="border-r border-line p-4 max-[980px]:border-b max-[980px]:border-r-0">
                <div className="mb-2.5 text-xs font-semibold text-graphite">Syllabus topic</div>
                <div className="flex flex-col gap-px">
                  {Object.keys(DEMO).map((name) => {
                    const on = name === topic;
                    const tp = TOPICS.find((x) => x.name === name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => { setTopic(name); setRevealed(false); setScore(null); }}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-2.5 py-2 text-left font-body text-sm text-ink hover:bg-tint"
                        style={{ background: on ? "var(--color-tint)" : "transparent", fontWeight: on ? 600 : 400 }}
                      >
                        <span className="min-w-0 flex-1">{name}</span>
                        <span className="font-display text-xs text-graphite [font-variant-numeric:tabular-nums]">{tp?.count ?? 0}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3.5 border-t border-line pt-3 text-[13px] leading-[1.5] text-graphite">
                  {t?.count ?? 0} {topic.toLowerCase()} questions in 9709 Paper 1 alone.
                </div>
              </div>

              <div className="flex min-w-0 flex-col">
                <div className="flex flex-wrap gap-x-4.5 gap-y-1.5 border-b border-line p-4">
                  {[
                    { label: "Paper", value: `9709 Paper ${d.variant}` },
                    { label: "Session", value: `${d.session} ${d.year}` },
                    { label: "Question", value: d.qnum },
                    { label: "Marks", value: d.marks },
                  ].map((m) => (
                    <div key={m.label} className="flex items-baseline gap-1.5">
                      <span className="text-xs text-graphite">{m.label}</span>
                      <span className="font-display text-[13px] font-semibold [font-variant-numeric:tabular-nums]">{m.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex aspect-[16/10] items-center justify-center border-b border-line bg-white p-4 text-center text-sm text-graphite">
                  Drop a question crop
                </div>
                <div className="flex flex-wrap items-center gap-2.5 p-3.5">
                  {!revealed ? (
                    <button type="button" onClick={() => setRevealed(true)} className="cursor-pointer rounded-lg border-none bg-cobalt px-5 py-3 font-body text-[15px] font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press">
                      Show marking scheme
                    </button>
                  ) : (
                    <div className="flex w-full flex-wrap items-center gap-3">
                      <span className="text-sm font-medium">How many marks did you get?</span>
                      <div className="flex flex-wrap gap-1.5">
                        {pad.map((n) => {
                          const on = score === n;
                          return (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setScore(n)}
                              className="h-[38px] w-[38px] cursor-pointer rounded font-display text-[15px] font-semibold [font-variant-numeric:tabular-nums]"
                              style={{ border: `1px solid ${on ? "var(--color-ember)" : "var(--color-line)"}`, background: on ? "var(--color-ember)" : "var(--color-surface)", color: on ? "var(--color-cobalt-ink)" : "var(--color-ink)" }}
                            >
                              {n}
                            </button>
                          );
                        })}
                      </div>
                      <button type="button" onClick={() => { setRevealed(false); setScore(null); }} className="ml-auto cursor-pointer border-none bg-transparent py-1.5 font-body text-[13px] font-medium text-graphite hover:text-ink hover:underline">
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="mt-3 px-0.5 text-[13px] text-graphite">
              {score === null
                ? "This is the practice screen. Pick a topic on the left and it loads a real question from that topic."
                : `You scored ${score} of ${d.marks}. In the app that updates your ${topic.toLowerCase()} mastery and decides tomorrow's drill.`}
            </p>
          </div>
        </section>

        <section id="coverage" className="mx-auto max-w-[1360px] border-t border-line px-10 py-[50px] max-[600px]:px-[18px]">
          <h2 className="mb-1 font-display text-[26px] font-semibold">What's in the bank</h2>
          <p className="mb-[22px] text-base text-graphite">Every question is a crop from a real past paper, tagged to a syllabus topic, with its marking scheme attached.</p>
          <div className="border-t border-line">
            <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_92px_96px] gap-4 border-b border-line py-2.5 max-[600px]:hidden">
              {["Subject", "Papers", "Years", "Questions"].map((h, i) => (
                <span key={h} className="text-xs font-semibold text-graphite" style={{ textAlign: i === 3 ? "right" : "left" }}>{h}</span>
              ))}
            </div>
            {COVERAGE.map((c) => (
              <div key={c.subject} className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_92px_96px] items-baseline gap-4 border-b border-line py-3.5">
                <span className="text-[15px] font-medium">{c.subject}</span>
                <span className="text-[15px] text-graphite">{c.papers}</span>
                <span className="text-[15px] text-graphite [font-variant-numeric:tabular-nums]">{c.years}</span>
                <span className="text-right font-display text-base font-semibold [font-variant-numeric:tabular-nums]" style={{ color: c.live ? "var(--color-ink)" : "var(--color-graphite)" }}>
                  {c.live ? c.count.toLocaleString("en-GB") : c.count}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-sm text-graphite">Counts update as questions clear review. Physics and Chemistry are being tagged now.</p>
        </section>

        <section id="topics" className="mx-auto max-w-[1360px] border-t border-line px-10 py-[50px] max-[600px]:px-[18px]">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h2 className="mb-1 font-display text-[26px] font-semibold">9709 Paper 1 topics</h2>
              <p className="text-base text-graphite">Browse the whole syllabus before you make an account.</p>
            </div>
            <Link to="/browse" className="text-[15px] font-medium">See all subjects and topics</Link>
          </div>
          <div className="border-t border-line">
            {TOPICS.map((t) => (
              <Link key={t.name} to="/browse" className="grid grid-cols-[minmax(0,1fr)_132px_74px] items-center gap-4 border-b border-line py-3.5 transition-colors hover:bg-tint hover:no-underline">
                <span className="text-[15px] font-medium text-ink">{t.name}</span>
                <span className="text-sm text-graphite [font-variant-numeric:tabular-nums]">{t.from}–{t.to}</span>
                <span className="text-right font-display text-base font-semibold text-ink [font-variant-numeric:tabular-nums]">{t.count}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] border-t border-line px-10 py-[50px] max-[600px]:px-[18px]">
          <h2 className="mb-6 font-display text-[26px] font-semibold">How a session works</h2>
          <div className="grid grid-cols-3 gap-[34px] max-[980px]:grid-cols-1">
            {STEPS.map((s) => (
              <div key={s.n} className="border-t-2 border-ink pt-3.5">
                <div className="mb-1.5 font-display text-[15px] font-semibold text-graphite [font-variant-numeric:tabular-nums]">{s.n}</div>
                <h3 className="mb-2 font-display text-[19px] font-semibold">{s.title}</h3>
                <p className="text-[15px] leading-[1.6] text-graphite">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] border-t border-line px-10 pb-[66px] pt-[52px] max-[600px]:px-[18px]">
          <div className="flex flex-wrap items-end justify-between gap-6.5">
            <div>
              <h2 className="mb-2.5 max-w-[26ch] font-display text-[30px] font-semibold">Start with the topic you've been avoiding.</h2>
              <p className="max-w-[46ch] text-base text-graphite">Two questions tonight is enough to tell you where you stand.</p>
            </div>
            <Link to="/signup" className="rounded-lg bg-cobalt px-7 py-4 text-[17px] font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press hover:no-underline">
              Start practising
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1360px] flex-wrap items-baseline gap-x-6.5 gap-y-3 border-t border-line px-10 py-[34px] max-[600px]:px-[18px]">
        <span className="text-sm text-graphite">Questionbank</span>
        <Link to="/browse" className="text-sm text-graphite hover:text-ink">Browse topics</Link>
        <Link to="/login" className="text-sm text-graphite hover:text-ink">Log in</Link>
        <span className="ml-auto max-w-[56ch] text-[13px] leading-[1.5] text-graphite">
          Past-paper questions and marking schemes are the copyright of Cambridge Assessment International Education.
          Questionbank is not affiliated with or endorsed by Cambridge.
        </span>
      </footer>
    </div>
  );
}
