"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length
    ? images
    : [
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop",
      ];

  return (
    <div className="space-y-3">
      <div className="relative h-96 overflow-hidden rounded-3xl">
        <Image src={safeImages[index]} alt="Property image" fill className="object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {safeImages.slice(0, 8).map((image, imageIndex) => (
          <button
            type="button"
            key={`${image}-${imageIndex}`}
            onClick={() => setIndex(imageIndex)}
            className="relative h-20 overflow-hidden rounded-2xl border border-slate-200"
          >
            <Image src={image} alt="Property thumbnail" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
