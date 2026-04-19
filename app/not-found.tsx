import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-4xl font-semibold text-slate-900">404</h1>
        <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
