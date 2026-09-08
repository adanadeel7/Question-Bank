import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/AuthLayout";
import { AuthForm } from "../../components/AuthForm";
import { useAuth } from "../../context/AuthContext";

const SUBJECTS = [
  { subject: "Mathematics 9709", count: "1,284" },
  { subject: "Physics 9702", count: "967" },
  { subject: "Chemistry 9701", count: "612" },
  { subject: "Further Maths 9231", count: "238" },
];

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit({ email, password }: { email: string; password: string }) {
    await login(email, password);
    const afterVerify = (location.state as { afterVerify?: boolean } | null)?.afterVerify;
    navigate(afterVerify ? "/onboarding" : "/dashboard");
  }

  return (
    <AuthLayout
      heading="Back to it."
      subheading="Sign in to pick up your drill and keep your streak."
      footNote="Trouble signing in? Email help@questionbank.example and we will sort it out."
      asideHeading="What is in the bank"
      asideBlurb="3,101 past-paper questions, each cropped from a real paper with its marking scheme attached."
      asideContent={
        <div className="border-t border-line">
          {SUBJECTS.map((c) => (
            <div
              key={c.subject}
              className="flex items-baseline justify-between gap-[14px] border-b border-line py-3"
            >
              <span className="min-w-0 text-[15px]">{c.subject}</span>
              <span className="font-display text-[15px] font-semibold [font-variant-numeric:tabular-nums]">
                {c.count}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <AuthForm mode="login" onSubmit={handleSubmit} />
      <p className="mt-[18px] text-[15px] text-graphite">
        No account yet?{" "}
        <Link to="/signup" className="font-semibold text-cobalt hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
