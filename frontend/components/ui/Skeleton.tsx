"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-surface-container rounded-lg ${className}`}></div>
  );
}

export function VenueCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm h-full flex flex-col">
      <Skeleton className="h-60 rounded-none" />
      <div className="p-6 flex-1">
        <Skeleton className="h-4 w-20 mb-4 rounded-full" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-6" />
        <div className="pt-5 border-t border-surface-variant/30 mt-auto">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
