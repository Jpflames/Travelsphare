import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().min(20).max(2000),
  location: z.string().trim().min(2).max(140),
  price: z.number().min(1),
  images: z.array(z.string().url()).min(1),
  amenities: z.array(z.string().trim().min(1)).default([]),
  category: z.string().trim().min(2).max(60),
  propertyType: z.enum(["Apartment", "Villa", "Resort", "Cabin"]),
});

export const bookingSchema = z.object({
  listingId: z.string().min(1),
  startDate: z.string().date(),
  endDate: z.string().date(),
  guests: z.number().int().min(1).max(12),
});

export const reviewSchema = z.object({
  listingId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().trim().min(3).max(1200),
});
