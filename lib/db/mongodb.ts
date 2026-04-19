import mongoose from "mongoose";
import "server-only";

import { isDemoMode } from "@/lib/config/is-demo-mode";
import { ensureDemoSeed } from "@/lib/demo/local-store";

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

export async function connectToDatabase() {
  if (isDemoMode()) {
    await ensureDemoSeed();
    return;
  }

  if (cache.conn) {
    return;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(getMongoUri());
  }

  cache.conn = await cache.promise;
}
