import { model, models, Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, default: null },
    image: { type: String, default: null },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const User = models.User || model("User", userSchema);
