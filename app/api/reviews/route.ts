import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { demoHasBookingForReview, demoUpsertReview } from "@/lib/demo/local-store";
import { getAuthSession } from "@/lib/auth/get-session";
import { Booking } from "@/models/Booking";
import { Review } from "@/models/Review";
import { Listing } from "@/models/Listing";
import { reviewSchema } from "@/lib/helpers/schemas";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  if (isDemoMode()) {
    const hasStayed = await demoHasBookingForReview(
      session.user.id,
      parsed.data.listingId
    );
    if (!hasStayed) {
      return NextResponse.json(
        { message: "You can review only listings you booked." },
        { status: 403 }
      );
    }

    const review = await demoUpsertReview({
      userId: session.user.id,
      listingId: parsed.data.listingId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    });

    return NextResponse.json({ data: review });
  }

  await connectToDatabase();

  const hasStayed = await Booking.findOne({
    userId: new Types.ObjectId(session.user.id),
    listingId: new Types.ObjectId(parsed.data.listingId),
    status: { $in: ["confirmed", "pending"] },
  }).lean();

  if (!hasStayed) {
    return NextResponse.json(
      { message: "You can review only listings you booked." },
      { status: 403 }
    );
  }

  const review = await Review.findOneAndUpdate(
    {
      userId: new Types.ObjectId(session.user.id),
      listingId: new Types.ObjectId(parsed.data.listingId),
    },
    {
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const ratingStats = await Review.aggregate([
    { $match: { listingId: new Types.ObjectId(parsed.data.listingId) } },
    {
      $group: {
        _id: "$listingId",
        avgRating: { $avg: "$rating" },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);

  if (ratingStats[0]) {
    await Listing.findByIdAndUpdate(parsed.data.listingId, {
      rating: Number(ratingStats[0].avgRating.toFixed(2)),
      reviewsCount: ratingStats[0].reviewsCount,
    });
  }

  return NextResponse.json({ data: review });
}
