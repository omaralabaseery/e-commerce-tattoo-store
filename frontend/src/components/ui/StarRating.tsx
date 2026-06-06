import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`Rated ${rating} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i <= Math.round(rating) ? "fill-ink text-ink" : "text-line"
          )}
        />
      ))}
      <span className="ml-1 text-xs text-muted">{rating.toFixed(1)}</span>
    </div>
  );
}
