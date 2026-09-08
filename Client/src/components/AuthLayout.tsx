import type { ReactNode } from "react";

interface AuthLayoutProps {
  stepLabel?: string;
  heading: string;
  subheading: string;
  children: ReactNode;
  footNote: string;
  asideHeading: string;
  asideBlurb: string;
  asideContent?: ReactNode;
}

export function AuthLayout({
  stepLabel,
  heading,
  subheading,
  children,
  footNote,
  asideHeading,
  asideBlurb,
  asideContent,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      <div className="grid min-h-screen grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] max-[940px]:grid-cols-1">
        <div className="flex min-h-screen flex-col bg-surface px-[54px] pt-[34px] pb-[48px] max-[600px]:px-[18px] max-[600px]:pt-[26px] max-[600px]:pb-[34px]">
          <div className="mb-auto flex items-center gap-[11px]">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-ink font-display text-sm font-bold text-paper">
              Q
            </div>
            <span className="font-display text-[17px] font-semibold">Questionbank</span>
            {stepLabel && (
              <span className="ml-[14px] text-sm text-graphite">{stepLabel}</span>
            )}
          </div>

          <div className="max-w-[520px] py-[44px]">
            <h1 className="mb-3 text-[38px] font-semibold leading-[1.12] tracking-[-0.4px] font-display max-[940px]:text-[32px] max-[600px]:text-[27px]">
              {heading}
            </h1>
            <p className="mb-[30px] text-[17px] leading-[1.6] text-graphite">{subheading}</p>

            {children}
          </div>

          <p className="mt-auto max-w-[52ch] text-[13px] leading-[1.55] text-graphite">
            {footNote}
          </p>
        </div>

        <aside className="flex flex-col gap-[26px] border-l border-line px-10 pt-[34px] pb-[48px] max-[940px]:border-l-0 max-[940px]:border-t">
          <div>
            <h2 className="mb-1 font-display text-[19px] font-semibold">{asideHeading}</h2>
            <p className="text-sm leading-[1.55] text-graphite">{asideBlurb}</p>
          </div>

          {asideContent}

          <p className="mt-auto text-[13px] leading-[1.55] text-graphite">
            Past-paper questions and marking schemes are the copyright of Cambridge Assessment
            International Education. Questionbank is not affiliated with or endorsed by Cambridge.
          </p>
        </aside>
      </div>
    </div>
  );
}
