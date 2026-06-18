

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200-lm/60 ${className}`}
      style={{
        animationDuration: "1.5s",
      }}
    />
  );
}

export function CardSkeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`rounded-lg border border-border-token-default bg-background-card p-6 shadow-1 flex flex-col gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function ScoreSkeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-4 ${className}`}>
      <div className="relative h-44 w-44 rounded-full border-[6px] border-gray-200-lm/40 flex items-center justify-center animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-5 w-32 rounded-full" />
    </div>
  );
}

export function TableSkeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`border border-border-token-default bg-background-card rounded-lg p-6 flex flex-col gap-4 ${className}`}>
      <div className="flex justify-between border-b border-border-token-default pb-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/6" />
        <Skeleton className="h-6 w-1/6" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between py-2 border-b border-border-token-default/50 last:border-0">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/5" />
          <Skeleton className="h-4 w-1/5" />
        </div>
      ))}
    </div>
  );
}
