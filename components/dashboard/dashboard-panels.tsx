"use client";

import { useState } from "react";
import { toast } from "sonner";

type DashboardPanelsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialBookings: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialWishlist: any[];
};

export function DashboardPanels({ initialBookings, initialWishlist }: DashboardPanelsProps) {
  const [bookings, setBookings] = useState(initialBookings);

  const cancelBooking = async (bookingId: string) => {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });

    if (!res.ok) {
      toast.error("Could not cancel booking.");
      return;
    }

    setBookings((prev) =>
      prev.map((booking) =>
        booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
      )
    );
    toast.success("Booking cancelled.");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Booking History</h2>
        <div className="mt-4 space-y-3">
          {bookings.length ? (
            bookings.map((booking) => (
              <article key={booking._id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">
                  {booking.listingId?.title ?? "Listing"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {new Date(booking.startDate).toDateString()} -{" "}
                  {new Date(booking.endDate).toDateString()}
                </p>
                <p className="mt-1 text-sm text-slate-600">Total: ${booking.totalPrice}</p>
                <p className="mt-1 text-sm capitalize text-slate-600">
                  Status: {booking.status}
                </p>
                {booking.status !== "cancelled" ? (
                  <button
                    type="button"
                    onClick={() => cancelBooking(booking._id)}
                    className="mt-3 rounded-xl border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700"
                  >
                    Cancel Booking
                  </button>
                ) : null}
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-500">No bookings yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Saved Properties</h2>
        <div className="mt-4 space-y-3">
          {initialWishlist.length ? (
            initialWishlist.map((item) => (
              <article key={item._id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.location}</p>
                <p className="mt-1 text-sm text-slate-600">${item.price} / night</p>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-500">No saved properties yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
