import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import {
  demoCreateBooking,
  demoFindListingById,
  demoGetBookingsForUser,
  demoHasOverlappingBooking,
} from "@/lib/demo/local-store";
import { getAuthSession } from "@/lib/auth/get-session";
import { Booking } from "@/models/Booking";
import { Listing } from "@/models/Listing";
import { bookingSchema } from "@/lib/helpers/schemas";
import { limitByIp } from "@/lib/helpers/rate-limit";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (isDemoMode()) {
    const bookings = await demoGetBookingsForUser(
      session.user.id,
      session.user.role === "admin"
    );
    return NextResponse.json({ data: bookings });
  }

  await connectToDatabase();

  const filter =
    session.user.role === "admin" ? {} : { userId: new Types.ObjectId(session.user.id) };

  const bookings = await Booking.find(filter)
    .populate("listingId", "title location images price")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ data: bookings });
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const ip = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";
  const { limited } = limitByIp(ip, 20, 60_000);
  if (limited) {
    return NextResponse.json({ message: "Rate limit exceeded." }, { status: 429 });
  }

  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  const startDate = new Date(parsed.data.startDate);
  const endDate = new Date(parsed.data.endDate);

  if (startDate >= endDate) {
    return NextResponse.json({ message: "Invalid date range." }, { status: 400 });
  }

  if (isDemoMode()) {
    const listing = await demoFindListingById(parsed.data.listingId);
    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    const overlaps = await demoHasOverlappingBooking(parsed.data.listingId, startDate, endDate);
    if (overlaps) {
      return NextResponse.json(
        { message: "These dates are unavailable for this listing." },
        { status: 409 }
      );
    }

    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = listing.price * nights;

    const booking = await demoCreateBooking({
      userId: session.user.id,
      listingId: parsed.data.listingId,
      startDate,
      endDate,
      totalPrice,
      guests: parsed.data.guests,
    });

    return NextResponse.json({ data: booking }, { status: 201 });
  }

  await connectToDatabase();

  const listing = await Listing.findById(parsed.data.listingId).lean();
  if (!listing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }

  const overlappingBooking = await Booking.findOne({
    listingId: parsed.data.listingId,
    status: { $in: ["pending", "confirmed"] },
    $and: [{ startDate: { $lt: endDate } }, { endDate: { $gt: startDate } }],
  }).lean();

  if (overlappingBooking) {
    return NextResponse.json(
      { message: "These dates are unavailable for this listing." },
      { status: 409 }
    );
  }

  const nights = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = listing.price * nights;

  const booking = await Booking.create({
    userId: new Types.ObjectId(session.user.id),
    listingId: new Types.ObjectId(parsed.data.listingId),
    startDate,
    endDate,
    totalPrice,
    guests: parsed.data.guests,
    status: "pending",
  });

  return NextResponse.json({ data: booking }, { status: 201 });
}
