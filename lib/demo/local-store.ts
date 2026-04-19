import "server-only";

import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import type { z } from "zod";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { listingSchema } from "@/lib/helpers/schemas";
import { DEMO_ADMIN_EMAIL, DEMO_PASSWORD, DEMO_USER_EMAIL } from "@/lib/demo/constants";

type ListingPatch = Partial<z.infer<typeof listingSchema>>;

type Role = "user" | "admin";
type PropertyType = "Apartment" | "Villa" | "Resort" | "Cabin";
type BookingStatus = "pending" | "confirmed" | "cancelled";

type DemoUser = {
  _id: string;
  name: string;
  email: string;
  password: string | null;
  image: string | null;
  wishlist: string[];
  role: Role;
  createdAt: Date;
};

type DemoListing = {
  _id: string;
  hostId: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  amenities: string[];
  category: string;
  propertyType: PropertyType;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type DemoBooking = {
  _id: string;
  userId: string;
  listingId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  guests: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
};

type DemoReview = {
  _id: string;
  userId: string;
  listingId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

type DemoState = {
  seeded: boolean;
  users: DemoUser[];
  listings: DemoListing[];
  bookings: DemoBooking[];
  reviews: DemoReview[];
};

declare global {
  // eslint-disable-next-line no-var
  var __travelsphereDemoState: DemoState | undefined;
}

function emptyState(): DemoState {
  return { seeded: false, users: [], listings: [], bookings: [], reviews: [] };
}

function getState(): DemoState {
  if (!global.__travelsphereDemoState) {
    global.__travelsphereDemoState = emptyState();
  }
  return global.__travelsphereDemoState;
}

function newObjectId(): string {
  return randomBytes(12).toString("hex");
}

function listingImage(path: string) {
  return `https://images.unsplash.com/${path}`;
}

let seeding: Promise<void> | null = null;

export async function ensureDemoSeed(): Promise<void> {
  if (!isDemoMode()) {
    return;
  }

  const state = getState();
  if (state.seeded) {
    return;
  }

  if (!seeding) {
    seeding = (async () => {
      const passwordHash = await hash(DEMO_PASSWORD, 10);

      const adminId = "64fa0b8f1c9d440001a11102";
      const userId = "64fa0b8f1c9d440001a11101";

      const now = new Date();

      state.users.push(
        {
          _id: userId,
          name: "Demo Traveler",
          email: DEMO_USER_EMAIL,
          password: passwordHash,
          image: null,
          wishlist: [],
          role: "user",
          createdAt: now,
        },
        {
          _id: adminId,
          name: "Demo Admin",
          email: DEMO_ADMIN_EMAIL,
          password: passwordHash,
          image: null,
          wishlist: [],
          role: "admin",
          createdAt: now,
        }
      );

      const listingsSeed: Omit<DemoListing, "_id" | "createdAt" | "updatedAt">[] = [
        {
          hostId: adminId,
          title: "Skyline Apartment in Tel Aviv",
          description:
            "Bright apartment minutes from the beach with a workspace, fast Wi‑Fi, and a full kitchen. Ideal for couples or solo travelers exploring the city.",
          location: "Tel Aviv, Israel",
          price: 129,
          images: [
            listingImage("photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop"),
          ],
          amenities: ["Wi‑Fi", "Kitchen", "Workspace", "Washer"],
          category: "City",
          propertyType: "Apartment",
          rating: 4.8,
          reviewsCount: 1,
        },
        {
          hostId: adminId,
          title: "Stone Villa Overlooking Jerusalem",
          description:
            "Spacious villa with panoramic views, private terrace, and room for families. Quiet neighborhood with easy access to historic sites.",
          location: "Jerusalem, Israel",
          price: 349,
          images: [
            listingImage("photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop"),
          ],
          amenities: ["Parking", "Terrace", "Fireplace", "Family friendly"],
          category: "Luxury",
          propertyType: "Villa",
          rating: 4.9,
          reviewsCount: 0,
        },
        {
          hostId: adminId,
          title: "Dead Sea Wellness Resort Suite",
          description:
            "Resort suite with spa access, mineral pool, and desert sunsets. Perfect for a restorative long weekend.",
          location: "Dead Sea, Israel",
          price: 219,
          images: [
            listingImage("photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop"),
          ],
          amenities: ["Spa", "Pool", "Breakfast", "Concierge"],
          category: "Resort",
          propertyType: "Resort",
          rating: 4.7,
          reviewsCount: 0,
        },
        {
          hostId: adminId,
          title: "Eilat Coastal Cabin",
          description:
            "Cozy cabin steps from coral reefs and diving schools. Compact, air‑conditioned, and great for adventure travelers.",
          location: "Eilat, Israel",
          price: 99,
          images: [
            listingImage("photo-1449158743715-0bff0b03f7fb?q=80&w=1600&auto=format&fit=crop"),
          ],
          amenities: ["A/C", "Snorkel gear", "Outdoor shower"],
          category: "Coastal",
          propertyType: "Cabin",
          rating: 4.6,
          reviewsCount: 0,
        },
        {
          hostId: adminId,
          title: "Haifa Hills Apartment",
          description:
            "Modern apartment near the Baha'i Gardens with tram access, balcony coffee nook, and sunset views over the bay.",
          location: "Haifa, Israel",
          price: 89,
          images: [
            listingImage("photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop"),
          ],
          amenities: ["Balcony", "Tram nearby", "Coffee machine"],
          category: "City",
          propertyType: "Apartment",
          rating: 4.5,
          reviewsCount: 0,
        },
      ];

      const listingIds: string[] = [];
      for (const item of listingsSeed) {
        const id = newObjectId();
        listingIds.push(id);
        state.listings.push({
          ...item,
          _id: id,
          createdAt: now,
          updatedAt: now,
        });
      }

      const firstListingId = listingIds[0]!;
      state.users[0]!.wishlist.push(firstListingId);

      state.reviews.push({
        _id: newObjectId(),
        userId,
        listingId: firstListingId,
        rating: 5,
        comment: "Fantastic stay — clean, quiet, and the host was responsive.",
        createdAt: now,
        updatedAt: now,
      });

      const stayStart = new Date(now);
      stayStart.setDate(stayStart.getDate() - 14);
      const stayEnd = new Date(stayStart);
      stayEnd.setDate(stayEnd.getDate() + 3);

      state.bookings.push({
        _id: newObjectId(),
        userId,
        listingId: firstListingId,
        startDate: stayStart,
        endDate: stayEnd,
        totalPrice: 129 * 3,
        guests: 2,
        status: "confirmed",
        createdAt: now,
        updatedAt: now,
      });

      state.seeded = true;
    })();
  }

  await seeding;
}

function userPublic(user: DemoUser) {
  return { _id: user._id, name: user.name, image: user.image };
}

export async function demoListListings(params: {
  location?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  await ensureDemoSeed();
  const state = getState();
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const minPrice = params.minPrice ?? 0;
  const maxPrice = params.maxPrice ?? 1_000_000;

  let rows = state.listings.filter(
    (l) => l.price >= minPrice && l.price <= maxPrice
  );

  if (params.location) {
    const q = params.location.toLowerCase();
    rows = rows.filter((l) => l.location.toLowerCase().includes(q));
  }

  if (params.propertyType) {
    rows = rows.filter((l) => l.propertyType === params.propertyType);
  }

  const sortKey = params.sort ?? "createdAt";
  const sorted = [...rows].sort((a, b) => {
    if (sortKey === "price_asc") return a.price - b.price;
    if (sortKey === "price_desc") return b.price - a.price;
    if (sortKey === "rating") return b.rating - a.rating;
    if (sortKey === "popularity") return b.reviewsCount - a.reviewsCount;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const total = sorted.length;
  const slice = sorted.slice((page - 1) * limit, page * limit);

  return { listings: slice.map((l) => ({ ...l })), total, page, limit };
}

export async function demoGetListingById(id: string) {
  await ensureDemoSeed();
  const listing = getState().listings.find((l) => l._id === id);
  return listing ? { ...listing } : null;
}

export async function demoGetListingReviews(listingId: string) {
  await ensureDemoSeed();
  const state = getState();
  return state.reviews
    .filter((r) => r.listingId === listingId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 20)
    .map((review) => {
      const user = state.users.find((u) => u._id === review.userId);
      return {
        ...review,
        userId: user ? userPublic(user) : { _id: review.userId, name: "Traveler", image: null },
      };
    });
}

export async function demoGetUserBookings(userId: string) {
  await ensureDemoSeed();
  const state = getState();
  return state.bookings
    .filter((b) => b.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((b) => {
      const listing = state.listings.find((l) => l._id === b.listingId);
      return {
        ...b,
        listingId: listing
          ? {
              _id: listing._id,
              title: listing.title,
              location: listing.location,
              images: listing.images,
              price: listing.price,
            }
          : b.listingId,
      };
    });
}

export async function demoGetUserWishlist(userId: string) {
  await ensureDemoSeed();
  const state = getState();
  const user = state.users.find((u) => u._id === userId);
  if (!user) {
    return [];
  }

  return user.wishlist
    .map((id) => state.listings.find((l) => l._id === id))
    .filter(Boolean)
    .map((listing) => ({
      _id: listing!._id,
      title: listing!.title,
      location: listing!.location,
      images: listing!.images,
      price: listing!.price,
      rating: listing!.rating,
      propertyType: listing!.propertyType,
    }));
}

export async function demoGetAllUsers() {
  await ensureDemoSeed();
  return getState().users
    .map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function demoGetAllBookings() {
  await ensureDemoSeed();
  const state = getState();
  return state.bookings
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((b) => {
      const listing = state.listings.find((l) => l._id === b.listingId);
      const user = state.users.find((u) => u._id === b.userId);
      return {
        ...b,
        listingId: listing
          ? { _id: listing._id, title: listing.title, location: listing.location }
          : b.listingId,
        userId: user
          ? { _id: user._id, name: user.name, email: user.email }
          : { _id: b.userId, name: "Unknown", email: "" },
      };
    });
}

export async function demoFindUserByEmail(email: string) {
  await ensureDemoSeed();
  return getState().users.find((u) => u.email === email.toLowerCase()) ?? null;
}

export async function demoRegisterUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  await ensureDemoSeed();
  const state = getState();
  const user: DemoUser = {
    _id: newObjectId(),
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.passwordHash,
    image: null,
    wishlist: [],
    role: "user",
    createdAt: new Date(),
  };
  state.users.push(user);
}

export async function demoUpsertGoogleUser(input: {
  name: string;
  email: string;
  image: string | null;
}) {
  await ensureDemoSeed();
  const state = getState();
  const email = input.email.toLowerCase();
  let user = state.users.find((u) => u.email === email);
  if (!user) {
    user = {
      _id: newObjectId(),
      name: input.name,
      email,
      password: null,
      image: input.image,
      wishlist: [],
      role: "user",
      createdAt: new Date(),
    };
    state.users.push(user);
  }
}

export async function demoCreateListing(hostId: string, data: Omit<DemoListing, "_id" | "hostId" | "createdAt" | "updatedAt" | "rating" | "reviewsCount">) {
  await ensureDemoSeed();
  const state = getState();
  const now = new Date();
  const listing: DemoListing = {
    ...data,
    _id: newObjectId(),
    hostId,
    rating: 0,
    reviewsCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  state.listings.unshift(listing);
  return { ...listing };
}

export async function demoUpdateListing(id: string, partial: ListingPatch) {
  await ensureDemoSeed();
  const state = getState();
  const listing = state.listings.find((l) => l._id === id);
  if (!listing) {
    return null;
  }
  Object.assign(listing, partial, { updatedAt: new Date() });
  return { ...listing };
}

export async function demoDeleteListing(id: string) {
  await ensureDemoSeed();
  const state = getState();
  state.listings = state.listings.filter((l) => l._id !== id);
  state.bookings = state.bookings.filter((b) => b.listingId !== id);
  state.reviews = state.reviews.filter((r) => r.listingId !== id);
  for (const user of state.users) {
    user.wishlist = user.wishlist.filter((lid) => lid !== id);
  }
}

export async function demoGetBookingsForUser(userId: string, isAdmin: boolean) {
  await ensureDemoSeed();
  const state = getState();
  const rows = isAdmin ? state.bookings : state.bookings.filter((b) => b.userId === userId);
  return rows
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((b) => {
      const listing = state.listings.find((l) => l._id === b.listingId);
      return {
        ...b,
        listingId: listing
          ? {
              _id: listing._id,
              title: listing.title,
              location: listing.location,
              images: listing.images,
              price: listing.price,
            }
          : b.listingId,
      };
    });
}

export async function demoFindListingById(id: string) {
  await ensureDemoSeed();
  return getState().listings.find((l) => l._id === id) ?? null;
}

export async function demoHasOverlappingBooking(listingId: string, start: Date, end: Date) {
  await ensureDemoSeed();
  return getState().bookings.some(
    (b) =>
      b.listingId === listingId &&
      ["pending", "confirmed"].includes(b.status) &&
      b.startDate < end &&
      b.endDate > start
  );
}

export async function demoCreateBooking(input: {
  userId: string;
  listingId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  guests: number;
}) {
  await ensureDemoSeed();
  const state = getState();
  const now = new Date();
  const booking: DemoBooking = {
    _id: newObjectId(),
    userId: input.userId,
    listingId: input.listingId,
    startDate: input.startDate,
    endDate: input.endDate,
    totalPrice: input.totalPrice,
    guests: input.guests,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  state.bookings.push(booking);
  return { ...booking };
}

export async function demoFindBookingById(id: string) {
  await ensureDemoSeed();
  const booking = getState().bookings.find((b) => b._id === id);
  if (!booking) {
    return null;
  }
  const state = getState();
  const listing = state.listings.find((l) => l._id === booking.listingId);
  return {
    ...booking,
    listingId: listing
      ? { _id: listing._id, title: listing.title, location: listing.location }
      : booking.listingId,
  };
}

export async function demoUpdateBooking(
  id: string,
  status: BookingStatus,
  userId: string,
  isAdmin: boolean
) {
  await ensureDemoSeed();
  const state = getState();
  const booking = state.bookings.find((b) => b._id === id);
  if (!booking) {
    return null;
  }
  if (!isAdmin && booking.userId !== userId) {
    return null;
  }
  booking.status = status;
  booking.updatedAt = new Date();
  return { ...booking };
}

export async function demoSetBookingStatus(id: string, status: BookingStatus) {
  await ensureDemoSeed();
  const booking = getState().bookings.find((b) => b._id === id);
  if (!booking) {
    return;
  }
  booking.status = status;
  booking.updatedAt = new Date();
}

export async function demoWishlistAdd(userId: string, listingId: string) {
  await ensureDemoSeed();
  const user = getState().users.find((u) => u._id === userId);
  if (!user) {
    return;
  }
  if (!user.wishlist.includes(listingId)) {
    user.wishlist.push(listingId);
  }
}

export async function demoWishlistRemove(userId: string, listingId: string) {
  await ensureDemoSeed();
  const user = getState().users.find((u) => u._id === userId);
  if (!user) {
    return;
  }
  user.wishlist = user.wishlist.filter((id) => id !== listingId);
}

export async function demoWishlistGet(userId: string) {
  await ensureDemoSeed();
  const state = getState();
  const user = state.users.find((u) => u._id === userId);
  if (!user) {
    return [];
  }
  return user.wishlist
    .map((id) => state.listings.find((l) => l._id === id))
    .filter(Boolean)
    .map((listing) => ({
      _id: listing!._id,
      title: listing!.title,
      location: listing!.location,
      images: listing!.images,
      price: listing!.price,
      rating: listing!.rating,
      propertyType: listing!.propertyType,
    }));
}

export async function demoHasBookingForReview(userId: string, listingId: string) {
  await ensureDemoSeed();
  return getState().bookings.some(
    (b) =>
      b.userId === userId &&
      b.listingId === listingId &&
      ["confirmed", "pending"].includes(b.status)
  );
}

export async function demoUpsertReview(input: {
  userId: string;
  listingId: string;
  rating: number;
  comment: string;
}) {
  await ensureDemoSeed();
  const state = getState();
  const now = new Date();
  let review = state.reviews.find(
    (r) => r.userId === input.userId && r.listingId === input.listingId
  );

  if (!review) {
    review = {
      _id: newObjectId(),
      userId: input.userId,
      listingId: input.listingId,
      rating: input.rating,
      comment: input.comment,
      createdAt: now,
      updatedAt: now,
    };
    state.reviews.push(review);
  } else {
    review.rating = input.rating;
    review.comment = input.comment;
    review.updatedAt = now;
  }

  const forListing = state.reviews.filter((r) => r.listingId === input.listingId);
  const avg = forListing.reduce((sum, r) => sum + r.rating, 0) / forListing.length;
  const listing = state.listings.find((l) => l._id === input.listingId);
  if (listing) {
    listing.rating = Number(avg.toFixed(2));
    listing.reviewsCount = forListing.length;
    listing.updatedAt = now;
  }

  return { ...review! };
}
