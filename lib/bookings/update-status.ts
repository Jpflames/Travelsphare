import "server-only";

import { connectToDatabase } from "@/lib/db/mongodb";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { demoSetBookingStatus } from "@/lib/demo/local-store";
import { Booking } from "@/models/Booking";

export async function confirmBookingById(bookingId: string) {
  if (isDemoMode()) {
    await demoSetBookingStatus(bookingId, "confirmed");
    return;
  }

  await connectToDatabase();
  await Booking.findByIdAndUpdate(bookingId, { status: "confirmed" });
}

export async function cancelBookingById(bookingId: string) {
  if (isDemoMode()) {
    await demoSetBookingStatus(bookingId, "cancelled");
    return;
  }

  await connectToDatabase();
  await Booking.findByIdAndUpdate(bookingId, { status: "cancelled" });
}
