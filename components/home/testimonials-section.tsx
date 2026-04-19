const testimonials = [
  {
    name: "Ava Johnson",
    role: "Digital Nomad",
    message:
      "TravelSphere made it incredibly easy to find unique stays that matched my style and budget.",
  },
  {
    name: "Noah Kim",
    role: "Frequent Traveler",
    message:
      "The booking flow feels premium and fast. I booked three city stays in under 10 minutes.",
  },
  {
    name: "Mia Hassan",
    role: "Family Planner",
    message:
      "Clear pricing, smooth checkout, and great support. This is now my go-to travel platform.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
      <div className="rounded-[2rem] bg-slate-900 px-6 py-12 md:px-12">
        <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
          Trusted by travelers worldwide
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-3xl bg-white/8 p-6 text-white">
              <p className="text-sm leading-7 text-slate-200">&quot;{item.message}&quot;</p>
              <p className="mt-4 font-semibold">{item.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {item.role}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
