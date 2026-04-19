export default function MainLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <div className="h-10 w-60 animate-pulse rounded-xl bg-slate-200" />
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </main>
  );
}
