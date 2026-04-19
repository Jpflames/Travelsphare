import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import {
  demoGetAllBookings,
  demoGetAllUsers,
  demoGetListingById,
  demoGetListingReviews,
  demoGetUserBookings,
  demoGetUserWishlist,
  demoListListings,
} from "@/lib/demo/local-store";
import { Listing } from "@/models/Listing";
import { Booking } from "@/models/Booking";
import { User } from "@/models/User";
import { Review } from "@/models/Review";

export async function getListings(params: {
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  if (isDemoMode()) {
    return demoListListings(params);
  }

  await connectToDatabase();

  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const query: Record<string, unknown> = {
    price: {
      $gte: params.minPrice ?? 0,
      $lte: params.maxPrice ?? 1_000_000,
    },
  };

  if (params.location) {
    query.location = { $regex: params.location, $options: "i" };
  }
  if (params.propertyType) {
    query.propertyType = params.propertyType;
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    popularity: { reviewsCount: -1 },
    createdAt: { createdAt: -1 },
  };

  const [listings, total] = await Promise.all([
    Listing.find(query)
      .sort(sortMap[params.sort ?? "createdAt"] ?? sortMap.createdAt)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Listing.countDocuments(query),
  ]);

  return { listings, total, page, limit };
}

export async function getListingById(id: string) {
  if (isDemoMode()) {
    return demoGetListingById(id);
  }

  await connectToDatabase();
  return Listing.findById(id).lean();
}

export async function getListingReviews(listingId: string) {
  if (isDemoMode()) {
    return demoGetListingReviews(listingId);
  }

  await connectToDatabase();
  return Review.find({ listingId })
    .populate("userId", "name image")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
}

export async function getUserBookings(userId: string) {
  if (isDemoMode()) {
    return demoGetUserBookings(userId);
  }

  await connectToDatabase();
  return Booking.find({ userId })
    .populate("listingId", "title location images price")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getUserWishlist(userId: string) {
  if (isDemoMode()) {
    return demoGetUserWishlist(userId);
  }

  await connectToDatabase();
  const user = await User.findById(userId)
    .populate("wishlist", "title location images price rating propertyType")
    .lean();
  return user?.wishlist ?? [];
}

export async function getAllUsers() {
  if (isDemoMode()) {
    return demoGetAllUsers();
  }

  await connectToDatabase();
  return User.find({}, "name email role createdAt").sort({ createdAt: -1 }).lean();
}

export async function getAllBookings() {
  if (isDemoMode()) {
    return demoGetAllBookings();
  }

  await connectToDatabase();
  return Booking.find({})
    .populate("userId", "name email")
    .populate("listingId", "title location")
    .sort({ createdAt: -1 })
    .lean();
}
