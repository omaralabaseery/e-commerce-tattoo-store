export default function Loading() {
  return (
    <div className="container-site py-8">
      <div className="skeleton mb-6 h-3 w-48 rounded" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="skeleton aspect-square w-full rounded-card" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-9 w-3/4 rounded" />
          <div className="skeleton h-4 w-28 rounded" />
          <div className="skeleton h-8 w-32 rounded" />
          <div className="skeleton h-20 w-full rounded" />
          <div className="flex gap-3 pt-2">
            <div className="skeleton h-11 w-32 rounded-full" />
            <div className="skeleton h-11 flex-1 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
