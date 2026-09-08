import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavRail } from "../components/NavRail";
import { useAuth } from "../context/AuthContext";

const SESSIONS = ["May/June 2026", "Oct/Nov 2026", "Feb/Mar 2026", "Not sure yet"];

export function ProfileSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState("May/June 2026");
  const [saved, setSaved] = useState(false);
  const [pwSent, setPwSent] = useState(false);
  const [deleteState, setDeleteState] = useState<"idle" | "confirming" | "deleted">("idle");

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  async function handleSignOut() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="grid min-h-screen grid-cols-[76px_minmax(0,1fr)] bg-paper font-body text-ink max-[760px]:grid-cols-1">
      <NavRail />

      <main className="max-w-[1180px] px-10 pb-[70px] pt-[34px] max-[760px]:px-4 max-[760px]:pb-24 max-[760px]:pt-5">
        <div className="mb-2 flex flex-wrap items-baseline gap-x-[22px] gap-y-3">
          <h1 className="font-display text-[28px] font-semibold">Settings</h1>
          <span className="text-sm text-graphite">Changes save as you make them.</span>
          <span className="ml-auto text-sm font-medium text-ember transition-opacity duration-[400ms]" style={{ opacity: saved ? 1 : 0 }}>
            Saved
          </span>
        </div>
        <p className="mb-7 text-[15px] text-graphite">Signed in as {user?.email}.</p>

        <div className="grid grid-cols-[190px_minmax(0,1fr)] items-start gap-11 max-[1000px]:grid-cols-1">
          <nav className="sticky top-[34px] flex flex-col gap-0.5 max-[1000px]:hidden">
            {["Exam session", "Appearance", "Account"].map((label) => (
              <a key={label} href={`#${label.toLowerCase().replace(" ", "-")}`} className="rounded-md px-2.5 py-2 text-sm font-medium text-graphite hover:bg-tint hover:text-ink hover:no-underline">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex min-w-0 flex-col gap-10">
            <section id="exam-session">
              <h2 className="mb-1 font-display text-[19px] font-semibold">Exam session</h2>
              <p className="mb-3.5 text-sm text-graphite">
                Sets your pace. {session === "Not sure yet" ? "Practice is spread evenly until you set one." : `Weak-topic drills get heavier as ${session} gets closer.`}
              </p>
              <div className="flex flex-wrap gap-2">
                {SESSIONS.map((name) => {
                  const on = session === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => { setSession(name); flashSaved(); }}
                      className="cursor-pointer rounded-lg px-4 py-3 font-body text-sm transition-colors hover:border-graphite"
                      style={{ border: `1px solid ${on ? "var(--color-ink)" : "var(--color-line)"}`, background: on ? "var(--color-ink)" : "transparent", color: on ? "var(--color-paper)" : "var(--color-ink)", fontWeight: on ? 600 : 500 }}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </section>

            <section id="appearance">
              <h2 className="mb-1 font-display text-[19px] font-semibold">Appearance</h2>
              <p className="mb-3.5 text-sm text-graphite">Theme applies across the app on this device.</p>
              <div className="inline-flex overflow-hidden rounded-lg border border-line">
                {[
                  { name: "Light", off: false, title: "Light theme" },
                  { name: "Dark", off: true, title: "Dark theme is being rebuilt" },
                  { name: "System", off: true, title: "Follows your device, once dark is back" },
                ].map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    disabled={t.off}
                    title={t.title}
                    className="border-r border-line px-[18px] py-2.5 font-body text-sm font-medium last:border-r-0 disabled:cursor-not-allowed"
                    style={{ background: !t.off ? "var(--color-ink)" : "transparent", color: !t.off ? "var(--color-paper)" : "var(--color-ink)", opacity: t.off ? 0.45 : 1 }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
              <p className="mt-2.5 text-[13px] text-graphite">Dark is being rebuilt to hold up next to scanned papers. It will come back here when it is ready.</p>
            </section>

            <section id="account">
              <h2 className="mb-1 font-display text-[19px] font-semibold">Account</h2>
              <p className="mb-3.5 text-sm text-graphite">Signed in as {user?.email}.</p>

              <div className="mb-6.5 flex flex-wrap gap-2.5">
                <button type="button" onClick={() => setPwSent(true)} className="cursor-pointer rounded-lg border border-line bg-transparent px-[18px] py-3 font-body text-[15px] font-medium text-ink hover:border-graphite">
                  Change password
                </button>
                <button type="button" onClick={handleSignOut} className="cursor-pointer rounded-lg border border-line bg-transparent px-[18px] py-3 font-body text-[15px] font-medium text-ink hover:border-graphite">
                  Sign out
                </button>
              </div>
              {pwSent && (
                <p className="-mt-4 mb-6.5 text-sm text-ember">Password reset email sent to {user?.email}. It expires in one hour.</p>
              )}

              <div className="rounded-[10px] border border-line px-5 py-4.5">
                <h3 className="mb-1 font-display text-base font-semibold">Delete this account</h3>
                <p className="mb-3.5 text-sm leading-[1.55] text-graphite">
                  Removes your account, your attempts, and your mastery record. Your email is gone from our systems
                  within 24 hours. This cannot be undone.
                </p>

                {deleteState === "idle" && (
                  <button
                    type="button"
                    onClick={() => setDeleteState("confirming")}
                    className="cursor-pointer rounded-lg border border-ember bg-transparent px-[18px] py-3 font-body text-[15px] font-semibold text-ember transition-colors hover:bg-[rgba(184,87,8,.08)]"
                  >
                    Delete account
                  </button>
                )}
                {deleteState === "confirming" && (
                  <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
                    <button type="button" onClick={() => setDeleteState("deleted")} className="cursor-pointer rounded-lg border-none bg-ember px-[18px] py-3 font-body text-[15px] font-semibold text-cobalt-ink">
                      Yes, delete everything
                    </button>
                    <button type="button" onClick={() => setDeleteState("idle")} className="cursor-pointer rounded-lg border border-line bg-transparent px-[18px] py-3 font-body text-[15px] font-medium text-ink hover:border-graphite">
                      Keep my account
                    </button>
                    <span className="text-sm text-graphite">This is immediate. There is no grace period.</span>
                  </div>
                )}
                {deleteState === "deleted" && (
                  <p className="text-[15px] font-medium">
                    Account deleted. In the real app you would be signed out now.{" "}
                    <button type="button" onClick={() => setDeleteState("idle")} className="cursor-pointer border-none bg-transparent p-0 font-body text-[15px] font-semibold text-cobalt hover:underline">
                      Reset this screen
                    </button>
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
