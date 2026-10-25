import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [dark, setDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("tka-theme", next ? "dark" : "light");
    } catch {
      /* storage penuh/di-block: abaikan */
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <svg
            viewBox="0 0 64 64"
            className="h-7 w-7 rounded-lg"
            aria-hidden="true"
          >
            <rect width="64" height="64" rx="14" fill="#4f46e5" />
            <path
              d="M14 40l8-24 8 24M18 32h8"
              stroke="#fff"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M42 16v20l10-8"
              fill="none"
              stroke="#c7d2fe"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            Latihan <span className="text-brand">TKA</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-label={dark ? "Mode terang" : "Mode gelap"}
          className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {dark ? (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
