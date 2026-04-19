import { model, models, Schema, type InferSchemaType, Types } from "mongoose";

const bookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listingId: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true, min: 1 },
    guests: { type: Number, required: true, min: 1, max: 12 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ listingId: 1, startDate: 1, endDate: 1 });

export type BookingDocument = Omit<
  InferSchemaType<typeof bookingSchema>,
  "userId" | "listingId"
> & {
  userId: Types.ObjectId;
  listingId: Types.ObjectId;
};

export const Booking = models.Booking || model("Booking", bookingSchema);
