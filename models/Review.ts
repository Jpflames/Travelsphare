import { model, models, Schema, type InferSchemaType, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1200 },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1, listingId: 1 }, { unique: true });

export type ReviewDocument = Omit<
  InferSchemaType<typeof reviewSchema>,
  "userId" | "listingId"
> & {
  userId: Types.ObjectId;
  listingId: Types.ObjectId;
};

export const Review = models.Review || model("Review", reviewSchema);
