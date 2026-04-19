type ReviewCardProps = {
  review: {
    _id: string;
    rating: number;
    comment: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId: any;
  };
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-900">
          {review.userId?.name ?? "Traveler"}
        </p>
        <p className="text-sm font-semibold text-amber-500">{review.rating.toFixed(1)}</p>
      </div>
      <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
    </article>
  );
}
