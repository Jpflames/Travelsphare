/**
 * Default signing secret for local/demo when NEXTAUTH_SECRET is unset.
 * NextAuth middleware (Edge) and some checks require a real env value — see next.config `env`.
 */
export const DEMO_NEXTAUTH_SECRET =
  "demo-only-secret-replace-with-env-in-production-min-32-chars";

export function getNextAuthSecret(): string {
  return process.env.NEXTAUTH_SECRET?.trim() || DEMO_NEXTAUTH_SECRET;
}
