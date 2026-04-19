import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { demoFindBookingById } from "@/lib/demo/local-store";
import { getAuthSession } from "@/lib/auth/get-session";
import { Booking } from "@/models/Booking";
import { getStripeClient, isStripeConfigured } from "@/lib/helpers/stripe";

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const bookingId = body?.bookingId as string | undefined;

  if (!bookingId) {
    return NextResponse.json({ message: "Booking id is required." }, { status: 400 });
  }

  const appUrl = process.env.NEXTAUTH_URL?.trim() || "http://localhost:3000";

  if (isDemoMode() || !isStripeConfigured()) {
    if (isDemoMode()) {
      const booking = await demoFindBookingById(bookingId);
      if (!booking) {
        return NextResponse.json({ message: "Booking not found." }, { status: 404 });
      }
      if (booking.userId !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    } else {
      await connectToDatabase();
      const booking = await Booking.findById(bookingId).lean();
      if (!booking) {
        return NextResponse.json({ message: "Booking not found." }, { status: 404 });
      }
      if (String(booking.userId) !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({
      url: `${appUrl}/payment/success?bookingId=${bookingId}`,
    });
  }

  await connectToDatabase();
  const booking = await Booking.findById(bookingId).populate("listingId", "title").lean();

  if (!booking) {
    return NextResponse.json({ message: "Booking not found." }, { status: 404 });
  }

  if (String(booking.userId) !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const listingTitle =
    typeof booking.listingId === "object" && booking.listingId
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (booking.listingId as any).title || "TravelSphere stay"
      : "TravelSphere stay";

  const stripe = getStripeClient();
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${appUrl}/payment/success?bookingId=${bookingId}`,
    cancel_url: `${appUrl}/payment/failure?bookingId=${bookingId}`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: `Booking: ${listingTitle}`,
          },
          unit_amount: Math.round(booking.totalPrice * 100),
        },
      },
    ],
    metadata: {
      bookingId,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ url: checkout.url });
}
