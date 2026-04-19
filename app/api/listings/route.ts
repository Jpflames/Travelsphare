import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { demoCreateListing } from "@/lib/demo/local-store";
import { getAuthSession } from "@/lib/auth/get-session";
import { Listing } from "@/models/Listing";
import { listingSchema } from "@/lib/helpers/schemas";
import { limitByIp } from "@/lib/helpers/rate-limit";
import { getListings } from "@/lib/helpers/queries";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const location = url.searchParams.get("location") ?? undefined;
  const propertyType = url.searchParams.get("propertyType") ?? undefined;
  const minPrice = Number(url.searchParams.get("minPrice") ?? 0);
  const maxPrice = Number(url.searchParams.get("maxPrice") ?? 1_000_000);
  const sort = url.searchParams.get("sort") ?? "createdAt";
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = Number(url.searchParams.get("limit") ?? 12);

  const { listings, total, page: safePage, limit: safeLimit } = await getListings({
    location,
    propertyType,
    minPrice,
    maxPrice,
    sort,
    page,
    limit,
  });

  return NextResponse.json({
    data: listings,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  });
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const ip = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";
  const { limited } = limitByIp(ip, 20, 60_000);

  if (limited) {
    return NextResponse.json({ message: "Rate limit exceeded." }, { status: 429 });
  }

  const session = await getAuthSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = listingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid listing payload" }, { status: 400 });
  }

  if (isDemoMode()) {
    const listing = await demoCreateListing(session.user.id, {
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      price: parsed.data.price,
      images: parsed.data.images,
      amenities: parsed.data.amenities,
      category: parsed.data.category,
      propertyType: parsed.data.propertyType,
    });
    return NextResponse.json({ data: listing }, { status: 201 });
  }

  await connectToDatabase();

  const listing = await Listing.create({
    ...parsed.data,
    hostId: new Types.ObjectId(session.user.id),
  });

  return NextResponse.json({ data: listing }, { status: 201 });
}
