import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../../components/AuthLayout";
import { verifyEmailRequest } from "../../lib/api";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("Verifying your email…");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }

    verifyEmailRequest(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "That link is invalid or has expired.");
      });
  }, [token]);

  return (
    <AuthLayout
      heading={status === "success" ? "Email verified." : status === "error" ? "That did not work." : "One moment."}
      subheading={message}
      footNote="Trouble signing in? Email help@questionbank.example and we will sort it out."
      asideHeading="What happens next"
      asideBlurb="Once verified, sign in and you will pick your subjects and exam session."
    >
      {status === "success" && (
        <Link
          to="/login"
          state={{ afterVerify: true }}
          className="inline-block rounded-lg bg-cobalt px-7 py-4 font-body text-[17px] font-semibold text-cobalt-ink transition-colors hover:bg-cobalt-press"
        >
          Sign in
        </Link>
      )}
      {status === "error" && (
        <Link to="/signup" className="font-semibold text-cobalt hover:underline">
          Back to sign up
        </Link>
      )}
    </AuthLayout>
  );
}
