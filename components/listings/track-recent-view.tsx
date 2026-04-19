"use client";

import { useEffect } from "react";
import { useTravelStore } from "@/store/use-travel-store";

export function TrackRecentView({ listingId }: { listingId: string }) {
  const addRecentlyViewed = useTravelStore((state) => state.addRecentlyViewed);

  useEffect(() => {
    addRecentlyViewed(listingId);
  }, [addRecentlyViewed, listingId]);

  return null;
}
