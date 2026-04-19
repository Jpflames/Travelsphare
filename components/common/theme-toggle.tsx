"use client";

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.classList.toggle("dark");
      }}
      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm"
    >
      Theme
    </button>
  );
}
