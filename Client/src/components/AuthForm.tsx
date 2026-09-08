import { useState, type FormEvent } from "react";

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (values: { name: string; email: string; password: string }) => Promise<void>;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const isLogin = mode === "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filled = email.includes("@") && password.length > 0 && (isLogin || name.trim().length >= 3);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!filled || submitting) return;

    if (!isLogin && password.length < 8) {
      setError(`Passwords need at least 8 characters. Yours has ${password.length}.`);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ name, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-[420px]">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-center gap-[11px] rounded-lg border border-line bg-surface px-[18px] py-[14px] font-body text-base font-semibold text-ink transition-colors duration-100 hover:border-graphite hover:bg-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
        onClick={() => {}}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.4-.2-2H12v3.9h6c-.1 1-.8 2.5-2.2 3.5l3.4 2.6c2-1.9 3.3-4.6 3.3-8Z" />
          <path fill="#34A853" d="M12 23c2.9 0 5.3-1 7-2.6l-3.4-2.6c-.9.6-2.1 1-3.6 1a6.3 6.3 0 0 1-6-4.3l-3.5 2.7A10.9 10.9 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M6 14.5a6.5 6.5 0 0 1 0-4.2L2.5 7.6a10.9 10.9 0 0 0 0 9.6L6 14.5Z" />
          <path fill="#EA4335" d="M12 5.5c1.6 0 3 .6 4.1 1.6l3-3A10.6 10.6 0 0 0 12 1a10.9 10.9 0 0 0-9.5 5.6L6 9.3A6.3 6.3 0 0 1 12 5.5Z" />
        </svg>
        Continue with Google
      </button>

      <div className="my-[22px] flex items-center gap-[14px]">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[13px] text-graphite">or use your email</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <label className="mb-4 block">
            <span className="mb-1.5 block text-[13px] font-semibold text-graphite">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ayesha Khan"
              autoComplete="name"
              className="w-full rounded-lg border border-line bg-surface px-[14px] py-[13px] font-body text-base text-ink focus:border-cobalt focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-cobalt"
            />
          </label>
        )}

        <label className="mb-4 block">
          <span className="mb-1.5 block text-[13px] font-semibold text-graphite">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            autoComplete="email"
            className="w-full rounded-lg border border-line bg-surface px-[14px] py-[13px] font-body text-base text-ink focus:border-cobalt focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-cobalt"
          />
        </label>

        <label className="mb-2 block">
          <span className="mb-1.5 block text-[13px] font-semibold text-graphite">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isLogin ? "Your password" : "At least 8 characters"}
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={`w-full rounded-lg border bg-surface px-[14px] py-[13px] font-body text-base text-ink focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-cobalt ${
              error ? "border-ember" : "border-line focus:border-cobalt"
            }`}
          />
        </label>

        {error && <p className="mb-2 text-sm leading-[1.5] text-ember">{error}</p>}

        {isLogin ? (
          <div className="mb-5 flex justify-start">
            <a href="#reset" className="text-sm font-medium text-cobalt hover:text-cobalt-press hover:underline">
              Forgot your password?
            </a>
          </div>
        ) : (
          <p className="mb-5 text-[13px] leading-[1.55] text-graphite">
            At least 8 characters. We only use your email to sign you in and to reset your password.
          </p>
        )}

        <button
          type="submit"
          disabled={!filled || submitting}
          className="w-full cursor-pointer rounded-lg border-none px-5 py-4 font-body text-[17px] font-semibold text-cobalt-ink transition-colors duration-150 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-cobalt disabled:cursor-not-allowed"
          style={{
            background: filled && !submitting ? "var(--color-cobalt)" : "var(--color-graphite)",
            opacity: filled && !submitting ? 1 : 0.45,
          }}
        >
          {submitting ? "Please wait…" : isLogin ? "Sign in" : "Create my account"}
        </button>
      </form>
    </div>
  );
}
