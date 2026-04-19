import { model, models, Schema, type InferSchemaType, Types } from "mongoose";

const listingSchema = new Schema(
  {
    hostId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      enum: ["Apartment", "Villa", "Resort", "Cabin"],
      default: "Apartment",
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

listingSchema.index({ location: "text", title: "text", description: "text" });

export type ListingDocument = Omit<InferSchemaType<typeof listingSchema>, "hostId"> & {
  hostId: Types.ObjectId;
};

export const Listing = models.Listing || model("Listing", listingSchema);
