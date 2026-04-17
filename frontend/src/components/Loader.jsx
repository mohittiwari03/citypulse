function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl animate-pulse ${className}`}
    />
  );
}

export default function Loader() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* Weather skeleton */}
      <div className="card p-6 flex flex-col gap-4 animate-pulse">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="w-16 h-16 rounded-xl" />
        </div>
        <Skeleton className="h-16 w-28" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      </div>

      {/* News skeletons */}
      <div className="lg:col-span-2 flex flex-col gap-3">
        <Skeleton className="h-5 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-4 flex flex-col gap-2 animate-pulse">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
