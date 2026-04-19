import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { demoDeleteListing, demoUpdateListing } from "@/lib/demo/local-store";
import { getAuthSession } from "@/lib/auth/get-session";
import { Listing } from "@/models/Listing";
import { listingSchema } from "@/lib/helpers/schemas";
import { getListingById, getListingReviews } from "@/lib/helpers/queries";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  const reviews = await getListingReviews(id);
  return NextResponse.json({ data: listing, reviews });
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = listingSchema.partial().safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  if (isDemoMode()) {
    const listing = await demoUpdateListing(id, parsed.data);
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }
    return NextResponse.json({ data: listing });
  }

  await connectToDatabase();
  const listing = await Listing.findByIdAndUpdate(id, parsed.data, { new: true }).lean();

  if (!listing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  return NextResponse.json({ data: listing });
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (isDemoMode()) {
    await demoDeleteListing(id);
    return NextResponse.json({ ok: true });
  }

  await connectToDatabase();
  await Listing.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
