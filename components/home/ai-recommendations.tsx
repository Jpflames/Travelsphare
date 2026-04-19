"use client";

import { useMemo, useState } from "react";

const suggestions: Record<string, string[]> = {
  beach: ["Bali Ocean Villa", "Santorini Blue Dome Retreat", "Maldives Water Bungalow"],
  mountain: ["Swiss Alpine Cabin", "Banff Forest Lodge", "Aspen Peak Chalet"],
  city: ["Tokyo Skyline Loft", "Dubai Marina Penthouse", "Paris Boutique Apartment"],
};

export function AIRecommendations() {
  const [preference, setPreference] = useState("beach");
  const results = useMemo(() => suggestions[preference] ?? suggestions.beach, [preference]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
      <div className="rounded-[2rem] border border-indigo-100 bg-gradient-to-r from-indigo-50 to-sky-50 p-8">
        <h2 className="text-2xl font-semibold text-slate-900">AI Travel Recommendations</h2>
        <p className="mt-2 text-sm text-slate-600">
          Choose your vibe and get instant travel suggestions.
        </p>
        <select
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          className="mt-4 rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="beach">Beach</option>
          <option value="mountain">Mountain</option>
          <option value="city">City</option>
        </select>
        <ul className="mt-4 grid gap-2 md:grid-cols-3">
          {results.map((item) => (
            <li key={item} className="rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
