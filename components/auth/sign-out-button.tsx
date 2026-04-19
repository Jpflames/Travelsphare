"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
    >
      Sign Out
    </button>
  );
}
