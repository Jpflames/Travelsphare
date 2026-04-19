"use client";

import { useState } from "react";
import { toast } from "sonner";

type Listing = {
  _id: string;
  title: string;
  location: string;
  price: number;
};

type Props = {
  initialListings: Listing[];
};

export function ListingManager({ initialListings }: Props) {
  const [listings, setListings] = useState(initialListings);
  const [loading, setLoading] = useState(false);

  const createListing = async (formData: FormData) => {
    setLoading(true);
    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      location: String(formData.get("location") ?? ""),
      price: Number(formData.get("price") ?? 0),
      images: [String(formData.get("image") ?? "")],
      amenities: String(formData.get("amenities") ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      category: String(formData.get("category") ?? "General"),
      propertyType: String(formData.get("propertyType") ?? "Apartment"),
    };

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);

    if (!res.ok) {
      const error = await res.json();
      toast.error(error.message ?? "Could not create listing.");
      return;
    }

    const data = await res.json();
    setListings((prev) => [data.data, ...prev]);
    toast.success("Listing added.");
  };

  const deleteListing = async (id: string) => {
    const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete listing.");
      return;
    }
    setListings((prev) => prev.filter((listing) => listing._id !== id));
    toast.success("Listing deleted.");
  };

  return (
    <div className="space-y-8">
      <form action={createListing} className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Add New Listing</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="title" placeholder="Title" required className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input name="location" placeholder="Location" required className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input name="price" type="number" placeholder="Price" required className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input name="image" placeholder="Image URL" required className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input name="category" placeholder="Category" required className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <select name="propertyType" className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option>Apartment</option>
            <option>Villa</option>
            <option>Resort</option>
            <option>Cabin</option>
          </select>
          <input name="amenities" placeholder="Amenities comma separated" className="rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2" />
          <textarea name="description" placeholder="Description" required className="rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2" rows={4} />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create listing"}
        </button>
      </form>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Manage Listings</h2>
        <div className="mt-4 space-y-3">
          {listings.map((listing) => (
            <article key={listing._id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-slate-900">{listing.title}</p>
                <p className="text-sm text-slate-600">{listing.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold">${listing.price}</p>
                <button
                  type="button"
                  onClick={() => deleteListing(listing._id)}
                  className="rounded-lg border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
