"use client";

function Pulse({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[#1e2640] rounded-lg ${className ?? "h-4 w-full"}`} />
  );
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#1e2640] bg-[#141827] p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.3)]">
      <div className="flex gap-4">
        <Pulse className="h-10 w-10 rounded-[14px] shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <Pulse className="h-3 w-24" />
          <Pulse className="h-7 w-28" />
          <Pulse className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <main className="px-6 pb-12 pt-8">
      {/* Metric cards */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[368px_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Net Worth skeleton */}
          <div className="rounded-2xl border border-[#1e2640] bg-[#141827] p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Pulse className="h-3 w-16" />
                <Pulse className="h-6 w-32" />
              </div>
              <Pulse className="h-6 w-16 rounded-full" />
            </div>
            <div className="mt-5 space-y-3">
              {[0, 1, 2].map((i) => (
                <Pulse key={i} className="h-[52px] rounded-[14px]" />
              ))}
            </div>
          </div>

          {/* Donut chart skeleton */}
          <div className="rounded-2xl border border-[#1e2640] bg-[#141827] p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.3)]">
            <Pulse className="h-4 w-36 mb-2" />
            <Pulse className="h-3 w-24 mb-5" />
            <div className="grid grid-cols-[120px_1fr] gap-6">
              <Pulse className="h-[120px] w-[120px] rounded-full" />
              <div className="space-y-3 pt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Pulse className="h-2 w-2 rounded-full shrink-0" />
                    <Pulse className="h-3 w-16" />
                    <Pulse className="h-1.5 flex-1 rounded-full" />
                    <Pulse className="h-3 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Income chart skeleton */}
          <div className="rounded-2xl border border-[#1e2640] bg-[#141827] p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.3)]">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1.5">
                <Pulse className="h-4 w-40" />
                <Pulse className="h-3 w-32" />
              </div>
              <div className="flex gap-3">
                <Pulse className="h-4 w-16 rounded-full" />
                <Pulse className="h-4 w-20 rounded-full" />
              </div>
            </div>
            <Pulse className="h-[240px] rounded-[16px]" />
          </div>

          {/* Transactions skeleton */}
          <div className="rounded-2xl border border-[#1e2640] bg-[#141827] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="space-y-1.5">
                <Pulse className="h-4 w-36" />
                <Pulse className="h-3 w-16" />
              </div>
              <Pulse className="h-8 w-36 rounded-[14px]" />
            </div>
            <div className="px-6 pb-6 divide-y divide-[#161d30]">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.3fr_0.8fr_0.8fr_0.6fr] gap-4 py-4 items-center"
                >
                  <div className="flex items-center gap-3">
                    <Pulse className="h-8 w-8 rounded-full shrink-0" />
                    <Pulse className="h-4 w-28" />
                  </div>
                  <Pulse className="hidden sm:block h-5 w-16 rounded-full" />
                  <Pulse className="hidden sm:block h-4 w-20" />
                  <Pulse className="h-4 w-14 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
