"use client";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export default function StarRating({ rating, count, size = "md", showCount = true }: StarRatingProps) {
  const iconSize = size === "sm" ? "text-[14px]" : size === "md" ? "text-[18px]" : "text-[24px]";
  const textSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center bg-surface-container-lowest/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm border border-outline-variant/10">
        <span className={`material-symbols-outlined ${iconSize} text-yellow-500`} style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
        <span className={`${textSize} font-black text-on-surface ml-0.5`}>
          {rating > 0 ? rating.toFixed(1) : "New"}
        </span>
      </div>
      {showCount && count !== undefined && (
        <span className={`${textSize} text-on-surface-variant opacity-70 ml-1`}>
          ({count})
        </span>
      )}
    </div>
  );
}
