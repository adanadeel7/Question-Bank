import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { useAuth } from "../../context/AuthContext";

const NEXT_STEPS = [
  { n: "01", title: "Verify your email", body: "We just sent you a link. Click it to activate your account." },
  { n: "02", title: "Tell us your subjects and session", body: "Two quick steps, then you know what your first drill looks like." },
  { n: "03", title: "Attempt your first question", body: "Eight questions, on paper, marked by you against the official scheme." },
];

export function Signup() {
  const { register } = useAuth();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  async function handleSubmit({ name, email, password }: { name: string; email: string; password: string }) {
    await register(name, email, password);
    setSubmittedEmail(email);
  }

  if (submittedEmail) {
    return (
      <AuthLayout
        heading="Check your email."
        subheading={`We sent a verification link to ${submittedEmail}. Click it, then come back and sign in.`}
        footNote="By creating an account you agree to our terms. We do not sell your data and there is a delete-account button in settings that actually deletes it."
        asideHeading="What happens next"
        asideBlurb="Three short steps, then you are attempting questions."
        asideContent={
          <div className="flex flex-col gap-[18px]">
            {NEXT_STEPS.map((n) => (
              <div key={n.n} className="grid grid-cols-[26px_minmax(0,1fr)] items-start gap-3">
                <span className="pt-0.5 font-display text-sm font-semibold text-graphite [font-variant-numeric:tabular-nums]">
                  {n.n}
                </span>
                <div>
                  <div className="text-[15px] font-semibold">{n.title}</div>
                  <p className="mt-[3px] text-sm leading-[1.55] text-graphite">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        }
      >
        <Link
          to="/login"
          state={{ afterVerify: true }}
          className="inline-block rounded-lg bg-cobalt px-7 py-4 font-body text-[17px] font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press"
        >
          I have verified, take me to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heading="Make an account and start with your weakest topic."
      subheading="Free, and it stays free. Two questions and you will know where you stand."
      footNote="By creating an account you agree to our terms. We do not sell your data and there is a delete-account button in settings that actually deletes it."
      asideHeading="What happens next"
      asideBlurb="Three short steps, then you are attempting questions."
      asideContent={
        <div className="flex flex-col gap-[18px]">
          {NEXT_STEPS.map((n) => (
            <div key={n.n} className="grid grid-cols-[26px_minmax(0,1fr)] items-start gap-3">
              <span className="pt-0.5 font-display text-sm font-semibold text-graphite [font-variant-numeric:tabular-nums]">
                {n.n}
              </span>
              <div>
                <div className="text-[15px] font-semibold">{n.title}</div>
                <p className="mt-[3px] text-sm leading-[1.55] text-graphite">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <AuthForm mode="signup" onSubmit={handleSubmit} />
      <p className="mt-[18px] text-[15px] text-graphite">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-cobalt hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
