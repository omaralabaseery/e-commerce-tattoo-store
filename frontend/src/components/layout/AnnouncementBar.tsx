"use client";

import { useState } from "react";
import { X } from "lucide-react";

/** Slim promo bar — free-shipping threshold drives conversion. Dismissible. */
export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="relative z-50 bg-ink text-paper">
      <div className="container-site flex h-9 items-center justify-center gap-2 text-center text-xs font-medium tracking-wide">
        <span>Free express delivery on orders over 50 KWD · Authentic professional supplies</span>
        <button
          aria-label="Dismiss"
          onClick={() => setOpen(false)}
          className="absolute right-4 rounded-full p-1 text-paper/70 transition-colors hover:text-paper"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
