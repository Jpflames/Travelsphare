"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  listingId: string;
  price: number;
};

export function BookingForm({ listingId, price }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const nights = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return nights > 0 ? nights * price : 0;
  }, [endDate, price, startDate]);

  const bookNow = async () => {
    setLoading(true);
    const bookingRes = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, startDate, endDate, guests }),
    });

    if (!bookingRes.ok) {
      const error = await bookingRes.json();
      toast.error(error.message ?? "Booking failed.");
      setLoading(false);
      return;
    }

    const bookingData = await bookingRes.json();
    const checkoutRes = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: bookingData.data._id }),
    });

    if (!checkoutRes.ok) {
      toast.error("Could not start checkout.");
      setLoading(false);
      return;
    }

    const checkoutData = await checkoutRes.json();
    if (checkoutData.url) {
      window.location.assign(checkoutData.url);
      return;
    }

    toast.error("Checkout URL missing.");
    setLoading(false);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">Reserve this stay</h3>
      <p className="mt-1 text-sm text-slate-500">${price} per night</p>

      <div className="mt-4 grid gap-3">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        />
        <input
          type="number"
          min={1}
          max={12}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
        <span>Estimated total</span>
        <strong className="text-slate-900">${total}</strong>
      </div>

      <button
        type="button"
        onClick={bookNow}
        disabled={loading || !startDate || !endDate || total <= 0}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Processing..." : "Book and Pay"}
      </button>
    </div>
  );
}
