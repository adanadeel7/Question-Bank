import { useState } from "react";
import { Link } from "react-router-dom";

const SUBJECTS = [
  { name: "Mathematics 9709", live: 1284, review: 212, papers: 96, tagged: 82 },
  { name: "Physics 9702", live: 967, review: 148, papers: 72, tagged: 61 },
  { name: "Chemistry 9701", live: 612, review: 96, papers: 48, tagged: 35 },
  { name: "Further Maths 9231", live: 238, review: 41, papers: 24, tagged: 14 },
  { name: "Biology 9700", live: 0, review: 0, papers: 0, tagged: 0 },
];

const JOBS = [
  { file: "9709_s23_qp_11.pdf", meta: "job 214, started 00:42", state: "In review", pct: 34, detail: "101 of 300 reviewed", act: "Open queue", group: "active" },
  { file: "9702_w23_qp_42.pdf", meta: "job 215, started 01:10", state: "Extracting", pct: 78, detail: "page 39 of 50", act: "Watch log", group: "active" },
  { file: "9701_m24_qp_22.pdf", meta: "job 213, started 00:05", state: "Failed", pct: 12, detail: "stopped at page 6 of 48", act: "See error", group: "failed" },
  { file: "9231_s24_qp_12.pdf", meta: "job 212, finished 23:41", state: "Done", pct: 100, detail: "88 questions live", act: "View", group: "done" },
  { file: "9709_w23_qp_13.pdf", meta: "job 211, finished 22:58", state: "Done", pct: 100, detail: "134 questions live", act: "View", group: "done" },
  { file: "9702_s23_qp_22.pdf", meta: "job 210, finished 21:30", state: "Done", pct: 100, detail: "97 questions live", act: "View", group: "done" },
];

const REPORTS = [
  { reason: "Marking scheme is for the wrong question", ref: "9709 P1 · Oct/Nov 2021 · Q6", days: 5 },
  { reason: "Crop cuts off part (b)(ii)", ref: "9702 P4 · May/June 2022 · Q3", days: 4 },
  { reason: "Tagged vectors, is actually differentiation", ref: "9709 P1 · Feb/Mar 2023 · Q8", days: 2 },
  { reason: "Image will not load", ref: "9701 P2 · Oct/Nov 2023 · Q4", days: 1 },
  { reason: "Marks say 7, paper says 5", ref: "9709 P3 · May/June 2024 · Q9", days: 0 },
];

const QUALITY = [
  { label: "Crops approved without edits", value: "81%", ember: false },
  { label: "Marks read below 70% confidence", value: "9%", ember: true },
  { label: "Topic tags corrected in review", value: "14%", ember: false },
  { label: "Schemes matched automatically", value: "93%", ember: false },
];

const FILTERS = ["active", "failed", "done"] as const;

export function AdminDashboard() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("active");
  const [dismissed, setDismissed] = useState(false);
  const [opened, setOpened] = useState<Record<string, boolean>>({});

  const liveTotal = SUBJECTS.reduce((a, s) => a + s.live, 0);
  const reviewTotal = SUBJECTS.reduce((a, s) => a + s.review, 0);
  const jobs = JOBS.filter((j) => j.group === filter);
  const failed = JOBS.filter((j) => j.group === "failed").length;
  const openReports = REPORTS.length;
  const oldest = Math.max(...REPORTS.map((r) => r.days));

  const kpis = [
    { value: liveTotal.toLocaleString("en-GB"), label: "questions live to students", ember: false },
    { value: reviewTotal.toLocaleString("en-GB"), label: "waiting on review", ember: reviewTotal > 400 },
    { value: openReports, label: `open reports, oldest ${oldest} days`, ember: oldest >= 3 },
    { value: failed, label: "ingestion job failed tonight", ember: failed > 0 },
  ];

  return (
    <div className="min-h-screen bg-admin-paper font-body text-[14px] text-admin-ink">
      <header className="flex flex-wrap items-center gap-5 bg-admin-ink px-5 py-2.5 text-[#E8EBEF]">
        <span className="font-display text-sm font-semibold">Questionbank admin</span>
        <nav className="flex gap-4">
          <span className="text-[13px] font-semibold text-white">Overview</span>
          <Link to="/admin/queue" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Ingestion review</Link>
          <Link to="/admin/questions/editor" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Question editor</Link>
          <Link to="/admin/questions/new" className="text-[13px] font-medium text-[#9AA4B0] hover:text-white hover:no-underline">Add question</Link>
          <span className="text-[13px] font-medium text-[#9AA4B0]">Reports</span>
        </nav>
        <span className="ml-auto text-[13px] text-[#9AA4B0] [font-variant-numeric:tabular-nums]">
          Saturday 6 September, 01:47. Next extraction 02:00.
        </span>
      </header>

      <div className="mx-auto max-w-[1560px] p-5">
        <div className="mb-5 grid grid-cols-4 border border-admin-line bg-surface max-[720px]:grid-cols-2">
          {kpis.map((k, i) => (
            <div key={i} className="border-r border-admin-line px-[18px] py-4 last:border-r-0">
              <div className="font-display text-[26px] font-semibold leading-none [font-variant-numeric:tabular-nums]" style={{ color: k.ember ? "var(--color-ember)" : "var(--color-admin-ink)" }}>
                {k.value}
              </div>
              <div className="mt-[5px] text-[13px] leading-[1.4] text-admin-graphite">{k.label}</div>
            </div>
          ))}
        </div>

        {!dismissed && (
          <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2.5 border border-ember border-l-4 bg-surface px-4 py-3">
            <span className="text-sm font-semibold">Job 213 failed at page 6</span>
            <span className="text-sm text-admin-graphite">
              Chemistry 9701 Feb/Mar 2024 Paper 22 — the source PDF has no text layer, so nothing could be extracted.
            </span>
            <Link to="/admin/queue" className="ml-auto cursor-pointer border-none bg-admin-ink px-3.5 py-2.5 font-body text-[13px] font-semibold text-white hover:bg-black hover:no-underline">
              See error
            </Link>
            <button type="button" onClick={() => setDismissed(true)} className="cursor-pointer border border-admin-line bg-transparent px-3 py-2.5 font-body text-[13px] font-medium text-admin-graphite hover:border-admin-graphite hover:text-admin-ink">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-[minmax(0,1.25fr)_minmax(340px,0.8fr)] items-start gap-5 max-[1080px]:grid-cols-1">
          <div className="flex min-w-0 flex-col gap-5">
            <section className="border border-admin-line bg-surface px-5 pb-5 pt-[18px]">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2.5">
                <h2 className="font-display text-[15px] font-semibold">Tagged questions by subject</h2>
                <span className="text-[13px] text-admin-graphite [font-variant-numeric:tabular-nums]">
                  {liveTotal.toLocaleString("en-GB")} live, {reviewTotal.toLocaleString("en-GB")} in review
                </span>
              </div>
              <div className="border-t border-admin-line">
                <div className="grid grid-cols-[minmax(0,1.1fr)_78px_minmax(0,1fr)_96px] gap-3.5 border-b border-admin-line py-2 max-[720px]:grid-cols-[minmax(0,1fr)_78px]">
                  <span className="text-xs text-admin-graphite">Subject</span>
                  <span className="text-right text-xs text-admin-graphite">Live</span>
                  <span className="text-xs text-admin-graphite max-[720px]:hidden">Coverage of papers ingested</span>
                  <span className="text-right text-xs text-admin-graphite max-[720px]:hidden">In review</span>
                </div>
                {SUBJECTS.map((s) => {
                  const p = s.papers ? Math.round((s.tagged / s.papers) * 100) : 0;
                  return (
                    <div key={s.name} className="grid grid-cols-[minmax(0,1.1fr)_78px_minmax(0,1fr)_96px] items-center gap-3.5 border-b border-admin-line py-2.5 max-[720px]:grid-cols-[minmax(0,1fr)_78px]">
                      <span className="min-w-0 text-sm font-medium">{s.name}</span>
                      <span className="text-right font-display text-[15px] font-semibold [font-variant-numeric:tabular-nums]">
                        {s.live ? s.live.toLocaleString("en-GB") : "—"}
                      </span>
                      <div className="flex min-w-0 items-center gap-2.5 max-[720px]:hidden">
                        <div className="h-[7px] flex-1 overflow-hidden bg-admin-line">
                          <div className="h-full" style={{ width: `${p}%`, background: "linear-gradient(90deg, #3B5BDB, #B85708)", backgroundSize: `${(10000 / Math.max(p, 1)).toFixed(0)}% 100%` }} />
                        </div>
                        <span className="w-[34px] text-right text-xs text-admin-graphite [font-variant-numeric:tabular-nums]">
                          {s.papers ? `${p}%` : "—"}
                        </span>
                      </div>
                      <span className="text-right text-sm [font-variant-numeric:tabular-nums] max-[720px]:hidden" style={{ color: s.review > 150 ? "var(--color-ember)" : "var(--color-admin-graphite)" }}>
                        {s.review ? s.review.toLocaleString("en-GB") : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2.5 text-[13px] text-admin-graphite">
                Coverage is papers with every question tagged, over papers ingested. Biology is not shown — no papers
                ingested yet.
              </p>
            </section>

            <section className="border border-admin-line bg-surface px-5 pb-5 pt-[18px]">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2.5">
                <h2 className="font-display text-[15px] font-semibold">Ingestion jobs</h2>
                <div className="inline-flex border border-admin-line">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className="cursor-pointer border-r border-admin-line px-3 py-[7px] font-body text-xs font-medium capitalize last:border-r-0"
                      style={{ background: filter === f ? "var(--color-admin-ink)" : "transparent", color: filter === f ? "#fff" : "var(--color-admin-ink)" }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {jobs.length > 0 ? (
                <div className="border-t border-admin-line">
                  {jobs.map((j) => (
                    <div key={j.file} className="grid grid-cols-[minmax(0,1fr)_128px_150px_92px] items-center gap-3.5 border-b border-admin-line py-2.5 max-[720px]:grid-cols-[minmax(0,1fr)_auto]">
                      <div className="min-w-0">
                        <div className="text-sm font-medium [font-variant-numeric:tabular-nums]">{j.file}</div>
                        <div className="mt-0.5 text-xs text-admin-graphite [font-variant-numeric:tabular-nums]">{j.meta}</div>
                      </div>
                      <span
                        className="text-[13px] font-semibold max-[720px]:hidden"
                        style={{ color: j.state === "Failed" ? "var(--color-ember)" : j.state === "Done" ? "var(--color-admin-graphite)" : "var(--color-admin-ink)" }}
                      >
                        {j.state}
                      </span>
                      <div className="min-w-0 max-[720px]:hidden">
                        <div className="h-1.5 overflow-hidden bg-admin-line">
                          <div className="h-full" style={{ width: `${j.pct}%`, background: j.state === "Failed" ? "var(--color-ember)" : j.state === "Done" ? "var(--color-admin-graphite)" : "var(--color-cobalt)" }} />
                        </div>
                        <div className="mt-1 text-xs text-admin-graphite [font-variant-numeric:tabular-nums]">{j.detail}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpened((prev) => ({ ...prev, [j.file]: true }))}
                        className="cursor-pointer justify-self-end border border-admin-line bg-transparent px-3 py-[7px] font-body text-[13px] font-medium text-admin-ink hover:border-admin-graphite"
                      >
                        {opened[j.file] ? "Opened" : j.act}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="my-4 text-sm text-admin-graphite">No {filter} jobs. The next scheduled extraction runs at 02:00.</p>
              )}
            </section>
          </div>

          <aside className="flex flex-col gap-5">
            <section className="border border-admin-line bg-surface px-5 pb-5 pt-[18px]">
              <div className="mb-1 flex items-baseline justify-between gap-2.5">
                <h2 className="font-display text-[15px] font-semibold">Reported questions</h2>
                <span className="text-[13px] text-admin-graphite [font-variant-numeric:tabular-nums]">{openReports} open</span>
              </div>
              <p className="mb-3 text-[13px] text-admin-graphite">
                Oldest first. A report older than three days is a student who lost marks over it.
              </p>
              <div className="border-t border-admin-line">
                {REPORTS.map((r, k) => (
                  <div key={k} className="grid grid-cols-[minmax(0,1fr)_84px_78px] items-center gap-3 border-b border-admin-line py-2.5 max-[720px]:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{r.reason}</div>
                      <div className="mt-0.5 text-xs text-admin-graphite [font-variant-numeric:tabular-nums]">{r.ref}</div>
                    </div>
                    <span className="text-right text-[13px] [font-variant-numeric:tabular-nums] max-[720px]:hidden" style={{ color: r.days >= 3 ? "var(--color-ember)" : "var(--color-admin-graphite)" }}>
                      {r.days === 0 ? "today" : `${r.days}d old`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOpened((prev) => ({ ...prev, [`r${k}`]: true }))}
                      className="cursor-pointer justify-self-end border border-admin-line bg-transparent px-[11px] py-[7px] font-body text-[13px] font-medium text-admin-ink hover:border-admin-graphite"
                    >
                      {opened[`r${k}`] ? "Opened" : "Open"}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-admin-line bg-surface px-5 pb-5 pt-[18px]">
              <h2 className="mb-3 font-display text-[15px] font-semibold">Extraction quality, last 7 days</h2>
              <div className="border-t border-admin-line">
                {QUALITY.map((q) => (
                  <div key={q.label} className="flex items-baseline justify-between gap-3 border-b border-admin-line py-[9px]">
                    <span className="min-w-0 text-sm">{q.label}</span>
                    <span className="whitespace-nowrap font-display text-sm font-semibold [font-variant-numeric:tabular-nums]" style={{ color: q.ember ? "var(--color-ember)" : "var(--color-admin-ink)" }}>
                      {q.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-[13px] leading-[1.5] text-admin-graphite">
                Marks confidence is the weakest field. Most misreads are papers where the mark sits in the margin
                rather than in brackets.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
