import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/get-session";
import { getAllBookings } from "@/lib/helpers/queries";

export default async function AdminBookingsPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/sign-in");
  }
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const bookings = await getAllBookings();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <h1 className="text-3xl font-semibold text-slate-900">Manage Bookings</h1>
      <div className="mt-6 space-y-3">
        {bookings.map((booking) => (
          <article
            key={String(booking._id)}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <p className="font-semibold text-slate-900">
              {booking.listingId?.title ?? "Listing"}
            </p>
            <p className="text-sm text-slate-600">
              User: {booking.userId?.name ?? "Unknown"}
            </p>
            <p className="text-sm text-slate-600">Total: ${booking.totalPrice}</p>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              {booking.status}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
