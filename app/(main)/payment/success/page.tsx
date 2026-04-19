import Link from "next/link";
import { confirmBookingById } from "@/lib/bookings/update-status";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const bookingId = typeof params.bookingId === "string" ? params.bookingId : undefined;

  if (bookingId) {
    await confirmBookingById(bookingId);
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
        <h1 className="text-3xl font-semibold text-emerald-800">Payment Successful</h1>
        <p className="mt-2 text-emerald-700">
          Your booking is confirmed. You can find it in your dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/dashboard" className="rounded-2xl bg-emerald-700 px-4 py-2 text-white">
            Go to Dashboard
          </Link>
          <Link href="/listings" className="rounded-2xl border border-emerald-700 px-4 py-2">
            Explore More
          </Link>
        </div>
      </div>
    </main>
  );
}
