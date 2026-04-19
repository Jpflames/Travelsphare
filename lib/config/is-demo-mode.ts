import "server-only";

/**
 * Offline demo: no MongoDB connection string required.
 * Set TRAVELSPHERE_USE_DATABASE=true and MONGODB_URI to use a real database.
 */
export function isDemoMode(): boolean {
  if (process.env.TRAVELSPHERE_USE_DATABASE === "true") {
    return false;
  }
  return !process.env.MONGODB_URI?.trim();
}
