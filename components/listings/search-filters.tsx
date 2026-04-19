"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 md:grid-cols-5">
      <input
        defaultValue={searchParams.get("location") ?? ""}
        placeholder="Search location"
        onBlur={(e) => update("location", e.target.value)}
        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
      />
      <input
        type="number"
        min={0}
        placeholder="Min price"
        defaultValue={searchParams.get("minPrice") ?? ""}
        onBlur={(e) => update("minPrice", e.target.value)}
        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
      />
      <input
        type="number"
        min={0}
        placeholder="Max price"
        defaultValue={searchParams.get("maxPrice") ?? ""}
        onBlur={(e) => update("maxPrice", e.target.value)}
        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
      />
      <select
        defaultValue={searchParams.get("propertyType") ?? ""}
        onChange={(e) => update("propertyType", e.target.value)}
        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="">All types</option>
        <option value="Apartment">Apartment</option>
        <option value="Villa">Villa</option>
        <option value="Resort">Resort</option>
        <option value="Cabin">Cabin</option>
      </select>
      <select
        defaultValue={searchParams.get("sort") ?? "createdAt"}
        onChange={(e) => update("sort", e.target.value)}
        className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
      >
        <option value="createdAt">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
        <option value="popularity">Most Popular</option>
      </select>
    </div>
  );
}
