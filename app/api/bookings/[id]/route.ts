import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { demoUpdateBooking } from "@/lib/demo/local-store";
import { getAuthSession } from "@/lib/auth/get-session";
import { Booking } from "@/models/Booking";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body?.status;

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  if (isDemoMode()) {
    const booking = await demoUpdateBooking(
      id,
      status,
      session.user.id,
      session.user.role === "admin"
    );
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ data: booking });
  }

  await connectToDatabase();

  const filter =
    session.user.role === "admin"
      ? { _id: id }
      : { _id: id, userId: new Types.ObjectId(session.user.id) };

  const booking = await Booking.findOneAndUpdate(filter, { status }, { new: true }).lean();

  if (!booking) {
    return NextResponse.json({ message: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({ data: booking });
}
