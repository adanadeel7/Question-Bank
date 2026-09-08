import { Link } from "react-router-dom";

export function NotBuiltYet() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper font-body text-ink">
      <p className="text-graphite">This screen isn't built yet.</p>
      <Link to="/dashboard" className="font-semibold text-cobalt hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
