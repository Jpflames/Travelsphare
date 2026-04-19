import { SearchFilters } from "@/components/listings/search-filters";
import { ListingCard } from "@/components/listings/listing-card";
import { getListings } from "@/lib/helpers/queries";
import type { Listing } from "@/types/listing";

type ListingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const { listings, total, page, limit } = await getListings({
    location: typeof params.location === "string" ? params.location : undefined,
    propertyType:
      typeof params.propertyType === "string" ? params.propertyType : undefined,
    minPrice:
      typeof params.minPrice === "string" ? Number(params.minPrice) : undefined,
    maxPrice:
      typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined,
    sort: typeof params.sort === "string" ? params.sort : undefined,
    page: typeof params.page === "string" ? Number(params.page) : 1,
    limit: 12,
  });

  const mappedListings: Listing[] = listings.map((listing) => ({
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
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <h1 className="text-3xl font-semibold text-slate-900">Explore Listings</h1>
      <p className="mt-2 text-slate-600">
        Filter and sort premium stays by location, price, and property type.
      </p>

      <div className="mt-6">
        <SearchFilters />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mappedListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Showing page {page} ({mappedListings.length} of {total} total listings, {limit} per
        page)
      </p>
    </main>
  );
}
