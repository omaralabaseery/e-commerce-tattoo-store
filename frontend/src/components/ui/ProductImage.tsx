"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a product image, falling back to a tasteful monochrome placeholder
 * (initials + subtle grain) when no real image is available. Keeps the whole
 * storefront looking premium even without uploaded assets.
 */
export function ProductImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  const initials = alt
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className={cn("relative overflow-hidden bg-mist", className)}>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-mist via-white to-line transition-transform duration-500 ease-premium group-hover:scale-105">
          <span className="select-none text-3xl font-semibold tracking-tight text-ink/15">
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
