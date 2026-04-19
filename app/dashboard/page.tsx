import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getAuthSession } from "@/lib/auth/get-session";
import { DashboardPanels } from "@/components/dashboard/dashboard-panels";
import { getUserBookings, getUserWishlist } from "@/lib/helpers/queries";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const [bookings, wishlist] = await Promise.all([
    getUserBookings(session.user.id),
    getUserWishlist(session.user.id),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
      <h1 className="text-3xl font-semibold text-slate-900">User Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Welcome back, {session.user.name ?? "Traveler"}.
      </p>
      <p className="mt-1 text-sm text-slate-500">Role: {session.user.role}</p>
      <div className="mt-6">
        <SignOutButton />
      </div>
      <div className="mt-8">
        <DashboardPanels initialBookings={bookings} initialWishlist={wishlist} />
      </div>
    </main>
  );
}
