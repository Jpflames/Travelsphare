"use client";

import { useState } from "react";

const quickReplies: Record<string, string> = {
  visa: "Visa requirements depend on your passport and destination. Check your destination embassy portal before booking.",
  weather: "For the best weather, check local seasonal ranges and avoid peak monsoon weeks.",
  budget: "Set your budget first, then filter by nightly price and look for longer-stay discounts.",
};

export function ChatbotWidget() {
  const [answer, setAnswer] = useState(
    "Hi! I am your TravelSphere assistant. Ask about visa, weather, or budget."
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Travel Assistant</h2>
        <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{answer}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.keys(quickReplies).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setAnswer(quickReplies[key])}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
