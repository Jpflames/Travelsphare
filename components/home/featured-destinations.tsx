import Image from "next/image";
import { SectionHeading } from "@/components/common/section-heading";
import { featuredDestinations } from "@/lib/helpers/mock-data";

export function FeaturedDestinations() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
      <SectionHeading
        eyebrow="Featured Destinations"
        title="Places travelers are booking right now"
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {featuredDestinations.map((destination) => (
          <article
            key={destination.name}
            className="group relative h-80 overflow-hidden rounded-3xl"
          >
            <Image
              src={destination.image}
              alt={destination.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="text-2xl font-semibold">{destination.name}</h3>
              <p className="text-sm text-white/80">{destination.stays}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
