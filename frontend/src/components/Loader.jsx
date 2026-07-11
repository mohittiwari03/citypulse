function Skeleton({ className = "" }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ background: "rgba(255,255,255,0.05)" }}
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
            <div className="h-3 w-16 rounded-lg bg-white/5" />
            <div className="h-8 w-32 rounded-lg bg-white/5" />
          </div>
          <div className="w-16 h-16 rounded-xl bg-white/5" />
        </div>
        <div className="h-16 w-28 rounded-lg bg-white/5" />
        <div className="grid grid-cols-2 gap-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>

      {/* News skeletons */}
      <div className="lg:col-span-2 flex flex-col gap-3">
        <Skeleton className="h-5 w-48 bg-white/5" />
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 flex flex-col gap-2 animate-pulse bg-slate-900/35 border border-blue-500/10 rounded-2xl">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
