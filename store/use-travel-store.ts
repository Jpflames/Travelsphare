"use client";

import { create } from "zustand";

type TravelState = {
  recentlyViewed: string[];
  addRecentlyViewed: (listingId: string) => void;
};

export const useTravelStore = create<TravelState>((set) => ({
  recentlyViewed: [],
  addRecentlyViewed: (listingId) =>
    set((state) => ({
      recentlyViewed: [listingId, ...state.recentlyViewed.filter((id) => id !== listingId)]
        .slice(0, 12),
    })),
}));
