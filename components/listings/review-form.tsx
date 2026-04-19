"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ReviewForm({ listingId }: { listingId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, rating, comment }),
    });
    setLoading(false);

    if (!res.ok) {
      const error = await res.json();
      toast.error(error.message ?? "Could not save review.");
      return;
    }

    toast.success("Review submitted.");
    setComment("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h4 className="font-semibold text-slate-900">Leave a review</h4>
      <div className="mt-3 grid gap-3">
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={submitReview}
          disabled={loading || !comment.trim()}
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </div>
  );
}
