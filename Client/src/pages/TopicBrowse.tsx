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

const TOTAL = TOPICS.reduce((a, t) => a + t.count, 0);

export function TopicBrowse() {
  return (
    <div className="bg-paper font-body text-ink">
      <header className="mx-auto flex max-w-[1360px] items-center gap-4.5 px-10 py-5 max-[600px]:px-[18px]">
        <Link to="/" className="flex items-center gap-2.5 text-ink hover:no-underline">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-ink font-display text-sm font-bold text-paper">Q</div>
          <span className="font-display text-[17px] font-semibold">Questionbank</span>
        </Link>
        <nav className="ml-6.5 flex gap-5.5 max-[600px]:hidden">
          <span className="text-[15px] font-semibold text-ink">Browse topics</span>
          <a href="#coverage" className="text-[15px] font-medium text-graphite hover:text-ink hover:no-underline">Coverage</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/login" className="rounded-lg px-3.5 py-2.5 text-[15px] font-medium text-ink hover:bg-tint hover:no-underline">Log in</Link>
          <Link to="/signup" className="rounded-lg border border-line px-4 py-2.5 text-[15px] font-semibold text-ink hover:border-graphite hover:no-underline">Create an account</Link>
        </div>
      </header>
      <div className="border-t border-line" />

      <main className="mx-auto max-w-[1360px] px-10 pb-[60px] pt-11 max-[600px]:px-[18px]">
        <div className="grid grid-cols-[minmax(0,1fr)_300px] items-end gap-14 border-b border-line pb-[30px] max-[900px]:grid-cols-1 max-[900px]:gap-[22px]">
          <div>
            <h1 className="mb-3.5 max-w-none font-display text-[40px] font-semibold leading-[1.1] tracking-[-0.4px] max-[900px]:text-[34px] max-[600px]:text-[28px]">
              Every Mathematics 9709 topic, with how many past-paper questions are in each
            </h1>
            <p className="max-w-[52ch] text-[17px] leading-[1.6] text-graphite">
              Cambridge A-Level Mathematics, Paper 1. Counts are questions we have cropped, tagged and matched to a
              marking scheme. You can see all of this without an account.
            </p>
          </div>
          <div className="flex flex-col gap-3.5">
            <div>
              <div className="font-display text-[34px] font-semibold leading-none [font-variant-numeric:tabular-nums]">{TOTAL}</div>
              <div className="mt-1.5 text-sm text-graphite">Mathematics 9709 questions ready to practise</div>
            </div>
            <Link to="/signup" className="rounded-lg bg-cobalt px-[22px] py-[15px] text-base font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press hover:no-underline">
              Create a free account
            </Link>
          </div>
        </div>

        <section className="mb-11 mt-[30px]">
          <div className="mb-3.5 flex flex-wrap items-baseline gap-x-4.5 gap-y-2.5">
            <h2 className="font-display text-[23px] font-semibold">Paper 1 — Pure Mathematics 1</h2>
            <span className="text-[15px] text-graphite">Compulsory</span>
            <span className="ml-auto text-[15px] text-graphite [font-variant-numeric:tabular-nums]">{TOTAL} questions</span>
          </div>
          <div className="border-t-2 border-ink">
            <div className="grid grid-cols-[minmax(0,1fr)_148px_86px_104px] gap-4 border-b border-line py-2.5 max-[600px]:hidden">
              <span className="text-xs font-semibold text-graphite">Syllabus topic</span>
              <span className="text-xs font-semibold text-graphite">Sessions covered</span>
              <span className="text-right text-xs font-semibold text-graphite">Questions</span>
              <span />
            </div>
            {TOPICS.map((t) => (
              <div key={t.name} className="grid grid-cols-[minmax(0,1fr)_148px_86px_104px] items-center gap-4 border-b border-line py-3.5">
                <Link to="/signup" className="min-w-0 text-base font-medium text-ink hover:text-cobalt">{t.name}</Link>
                <span className="text-sm text-graphite [font-variant-numeric:tabular-nums]">{t.from} to {t.to}</span>
                <span className="text-right font-display text-base font-semibold [font-variant-numeric:tabular-nums]">{t.count}</span>
                <Link to="/signup" className="justify-self-end rounded-lg border border-line px-3.5 py-2 text-sm font-medium text-ink hover:border-graphite hover:no-underline">
                  Practise
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-line pb-1.5 pt-[30px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="mb-2.5 max-w-[30ch] font-display text-[26px] font-semibold">Pick one of the {TOTAL} and see how you do</h2>
              <p className="max-w-[50ch] text-base leading-[1.6] text-graphite">
                Browsing is open to anyone. An account is only needed to attempt questions and keep a record of what
                you've scored.
              </p>
            </div>
            <Link to="/signup" className="rounded-lg bg-cobalt px-6.5 py-4 text-[17px] font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press hover:no-underline">
              Create a free account
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1360px] flex-wrap items-baseline gap-x-6.5 gap-y-3 border-t border-line px-10 py-[34px] max-[600px]:px-[18px]">
        <span className="text-sm text-graphite">Questionbank</span>
        <Link to="/" className="text-sm text-graphite hover:text-ink">Home</Link>
        <Link to="/login" className="text-sm text-graphite hover:text-ink">Log in</Link>
        <span className="ml-auto max-w-[56ch] text-[13px] leading-[1.5] text-graphite">
          Past-paper questions and marking schemes are the copyright of Cambridge Assessment International Education.
          Questionbank is not affiliated with or endorsed by Cambridge.
        </span>
      </footer>
    </div>
  );
}
