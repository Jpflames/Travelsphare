"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <Link href={`/listings/${listing.id}`}>
        <div className="relative h-56">
          <Image src={listing.image} alt={listing.title} fill className="object-cover" />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{listing.title}</h3>
            <span className="rounded-xl bg-slate-100 px-2 py-1 text-xs font-medium">
              {listing.type}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{listing.location}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              <span className="text-lg font-bold text-slate-900">${listing.price}</span> / night
            </p>
            <p className="text-sm font-medium text-amber-500">
              {listing.rating.toFixed(1)} ({listing.reviews})
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
