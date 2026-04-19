import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth/get-session";
import { getListings } from "@/lib/helpers/queries";
import { ListingManager } from "@/components/admin/listing-manager";

export default async function AdminPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const { listings } = await getListings({ page: 1, limit: 50, sort: "createdAt" });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-3xl font-semibold text-slate-900">Admin Panel</h1>
      <p className="mt-2 text-slate-600">
        You have administrative access to manage listings, users, and bookings.
      </p>
      <div className="mt-4 flex gap-3">
        <Link href="/admin/users" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          View Users
        </Link>
        <Link
          href="/admin/bookings"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          View Bookings
        </Link>
      </div>
      <div className="mt-8">
        <ListingManager initialListings={listings} />
      </div>
    </main>
  );
}
