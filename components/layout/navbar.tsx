import Link from "next/link";
import { getAuthSession } from "@/lib/auth/get-session";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/common/theme-toggle";

export async function Navbar() {
  const session = await getAuthSession();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
          Travel<span className="text-sky-600">Sphere</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/">Home</Link>
          <Link href="/listings">Listings</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <SignOutButton />
          ) : (
            <Link
              href="/sign-in"
              className="rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-600/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
