import Link from "next/link";
import { cancelBookingById } from "@/lib/bookings/update-status";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PaymentFailurePage({ searchParams }: Props) {
  const params = await searchParams;
  const bookingId = typeof params.bookingId === "string" ? params.bookingId : undefined;

  if (bookingId) {
    await cancelBookingById(bookingId);
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-rose-200 bg-rose-50 p-8">
        <h1 className="text-3xl font-semibold text-rose-800">Payment Failed</h1>
        <p className="mt-2 text-rose-700">
          Your payment was not completed. You can try booking again.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/dashboard" className="rounded-2xl border border-rose-700 px-4 py-2">
            Dashboard
          </Link>
          <Link href="/listings" className="rounded-2xl bg-rose-700 px-4 py-2 text-white">
            Retry Booking
          </Link>
        </div>
      </div>
    </main>
  );
}
