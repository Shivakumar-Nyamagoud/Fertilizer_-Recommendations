"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ImageCarousel({
  images = [],
  interval = 4000,
  className = "",
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images.length) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(id);
  }, [images, interval]);

  if (!images.length) return null;

  return (
    <div
      className={`relative w-full h-[260px] sm:h-[320px] lg:h-[380px] overflow-hidden rounded-3xl shadow-xl ${className}`}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`slide-${i}`}
            fill
            priority={i === 0}
            className="object-cover scale-105"
          />
          {/* subtle dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </div>
      ))}
    </div>
  );
}
