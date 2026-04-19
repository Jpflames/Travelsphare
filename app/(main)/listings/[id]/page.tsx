import { notFound } from "next/navigation";
import { BookingForm } from "@/components/listings/booking-form";
import { ImageCarousel } from "@/components/listings/image-carousel";
import { ReviewCard } from "@/components/listings/review-card";
import { ReviewForm } from "@/components/listings/review-form";
import { WishlistButton } from "@/components/listings/wishlist-button";
import { TrackRecentView } from "@/components/listings/track-recent-view";
import { getListingById, getListingReviews } from "@/lib/helpers/queries";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetailsPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  const reviews = await getListingReviews(id);
  const mapQuery = encodeURIComponent(listing.location);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-10 md:px-8">
      <TrackRecentView listingId={id} />
      <section className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <ImageCarousel images={listing.images ?? []} />
          <h1 className="mt-6 text-3xl font-semibold text-slate-900">{listing.title}</h1>
          <p className="mt-2 text-slate-600">{listing.location}</p>
          <div className="mt-4 flex items-center gap-4">
            <p className="text-lg font-bold text-slate-900">${listing.price} / night</p>
            <p className="text-sm font-semibold text-amber-500">
              {listing.rating?.toFixed(1) ?? "0.0"} ({listing.reviewsCount ?? 0} reviews)
            </p>
            <WishlistButton listingId={id} />
          </div>
          <p className="mt-5 text-slate-700">{listing.description}</p>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900">Amenities</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {(listing.amenities ?? []).map((amenity: string) => (
                <span
                  key={amenity}
                  className="rounded-full bg-sky-50 px-3 py-1 text-sm text-sky-700"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <BookingForm listingId={id} price={listing.price} />
          <ReviewForm listingId={id} />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Location</h2>
          <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200">
            <iframe
              title="Listing location"
              src={`https://maps.google.com/maps?q=${mapQuery}&z=13&output=embed`}
              className="h-72 w-full"
              loading="lazy"
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>
          <div className="mt-3 space-y-3">
            {reviews.length ? (
              reviews.map((review) => <ReviewCard key={String(review._id)} review={review} />)
            ) : (
              <p className="text-sm text-slate-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
