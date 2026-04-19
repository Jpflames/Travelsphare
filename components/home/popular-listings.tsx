import { SectionHeading } from "@/components/common/section-heading";
import { ListingCard } from "@/components/listings/listing-card";
import { getListings } from "@/lib/helpers/queries";
import type { Listing } from "@/types/listing";

export async function PopularListings() {
  const { listings } = await getListings({
    page: 1,
    limit: 3,
    sort: "rating",
  });

  const mapped: Listing[] = listings.map((listing) => ({
    id: String(listing._id),
    title: listing.title,
    location: listing.location,
    price: listing.price,
    rating: listing.rating ?? 0,
    image:
      listing.images?.[0] ??
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop",
    type: listing.propertyType,
    reviews: listing.reviewsCount ?? 0,
  }));

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-16">
      <SectionHeading
        eyebrow="Popular Stays"
        title="Handpicked listings for your next trip"
        description="From luxurious villas to cozy cabins, discover top-rated properties with instant booking."
      />
      {mapped.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mapped.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-slate-600">
          No listings to show yet. Add listings in the admin panel or seed your database.
        </p>
      )}
    </section>
  );
}
