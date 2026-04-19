import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/get-session";
import { getAllUsers } from "@/lib/helpers/queries";

export default async function AdminUsersPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/sign-in");
  }
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await getAllUsers();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <h1 className="text-3xl font-semibold text-slate-900">Manage Users</h1>
      <div className="mt-6 space-y-3">
        {users.map((user) => (
          <article key={String(user._id)} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-600">{user.email}</p>
            <p className="text-xs uppercase tracking-wider text-slate-500">{user.role}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
