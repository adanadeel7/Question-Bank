import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { label: "Dashboard", to: "/dashboard", d: "M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5" },
  { label: "Practice", to: "/practice", d: "M12 3v18M3 12h18" },
  { label: "Progress", to: "/progress", d: "M4 19V5m0 14h16M8 15l4-6 3 3 4-7" },
  { label: "History", to: "/history", d: "M12 8v5l4 2M3.5 12a8.5 8.5 0 1 0 2.6-6.1M3.5 4v4h4" },
];

export function NavRail() {
  const location = useLocation();
  const { user } = useAuth();
  const initials = (user?.email ?? "??").slice(0, 2).toUpperCase();

  return (
    <nav className="sticky top-0 flex h-screen flex-col items-center gap-1 border-r border-line bg-surface py-5 max-[760px]:fixed max-[760px]:inset-x-0 max-[760px]:top-auto max-[760px]:bottom-0 max-[760px]:h-[60px] max-[760px]:flex-row max-[760px]:justify-around max-[760px]:border-r-0 max-[760px]:border-t max-[760px]:px-2">
      <div className="mb-[18px] grid h-[34px] w-[34px] place-items-center rounded-lg bg-ink font-display text-[15px] font-bold text-paper max-[760px]:hidden">
        Q
      </div>
      {NAV.map((n) => {
        const active = location.pathname === n.to;
        return (
          <Link
            key={n.label}
            to={n.to}
            title={n.label}
            className="grid h-[46px] w-[46px] place-items-center rounded-[10px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
            style={{
              background: active ? "var(--color-tint)" : "transparent",
              color: active ? "var(--color-cobalt)" : "var(--color-graphite)",
            }}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d={n.d} />
            </svg>
          </Link>
        );
      })}
      <div className="flex-1 max-[760px]:hidden" />
      <Link
        to="/settings"
        title="Profile and settings"
        className="grid h-[38px] w-[38px] place-items-center rounded-full bg-ink font-display text-sm font-semibold text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
      >
        {initials}
      </Link>
    </nav>
  );
}
