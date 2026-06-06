import { ProductGridSkeleton } from "@/components/ui/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="container-site py-10">
      <div className="mb-8 space-y-2">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
      </div>
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-4 w-32 rounded" />
          ))}
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
