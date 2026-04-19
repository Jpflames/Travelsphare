"use client";

export default function MainError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-8">
        <h1 className="text-2xl font-semibold text-rose-800">Something went wrong</h1>
        <p className="mt-2 text-sm text-rose-700">{error.message}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
