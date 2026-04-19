import { SignInForm } from "@/components/auth/sign-in-form";
import { isDemoMode } from "@/lib/config/is-demo-mode";
import { DEMO_ADMIN_EMAIL, DEMO_PASSWORD, DEMO_USER_EMAIL } from "@/lib/demo/constants";

export default function SignInPage() {
  const demo = isDemoMode();
  const googleConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()
  );

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center px-4 py-12">
      {demo ? (
        <p className="mb-6 w-full rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          Running in <strong>demo mode</strong> (no <code className="text-xs">.env</code> needed).
          Sign in with{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs">{DEMO_USER_EMAIL}</code> or{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs">{DEMO_ADMIN_EMAIL}</code> and
          password <code className="rounded bg-white px-1 py-0.5 text-xs">{DEMO_PASSWORD}</code>.
        </p>
      ) : null}
      <SignInForm showGoogle={googleConfigured} />
    </main>
  );
}
