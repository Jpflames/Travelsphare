import { SearchBar } from "@/components/home/search-bar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-25" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 md:px-8 md:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-100">
          Discover your next destination
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          Premium stays, curated experiences, and effortless booking.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-sky-50/90">
          TravelSphere helps you find and book unforgettable properties in the
          world&apos;s most loved locations.
        </p>
        <div className="mt-10">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
