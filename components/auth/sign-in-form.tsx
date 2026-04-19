"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

type Props = {
  showGoogle?: boolean;
};

export function SignInForm({ showGoogle = true }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCredentialsSignIn = async (formData: FormData) => {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setIsLoading(true);
    setErrorMessage("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    setIsLoading(false);

    if (result?.error) {
      setErrorMessage("Invalid email or password.");
      return;
    }

    window.location.assign("/dashboard");
  };

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Sign In</h1>
      <p className="mt-2 text-sm text-slate-600">
        Access your bookings, wishlist, and personalized travel dashboard.
      </p>

      <form action={handleCredentialsSignIn} className="mt-6 space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-sky-300 focus:ring"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={8}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-sky-300 focus:ring"
        />
        {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {showGoogle ? (
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
        >
          Continue with Google
        </button>
      ) : null}
    </div>
  );
}
