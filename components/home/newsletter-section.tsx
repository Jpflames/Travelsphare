export function NewsletterSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
      <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-8 md:p-12">
        <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Get exclusive travel deals in your inbox
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Receive curated destinations, limited-time offers, and smart travel tips.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-sky-300 focus:ring"
          />
          <button
            type="button"
            className="rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
