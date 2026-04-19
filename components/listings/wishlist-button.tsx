"use client";

import { useState } from "react";
import { toast } from "sonner";

export function WishlistButton({ listingId }: { listingId: string }) {
  const [saved, setSaved] = useState(false);

  const toggle = async () => {
    const method = saved ? "DELETE" : "POST";
    const res = await fetch(`/api/wishlist/${listingId}`, { method });
    if (!res.ok) {
      toast.error("Could not update wishlist.");
      return;
    }
    setSaved(!saved);
    toast.success(saved ? "Removed from wishlist." : "Saved to wishlist.");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
