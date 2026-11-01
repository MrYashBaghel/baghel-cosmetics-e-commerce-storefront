import type { Product } from "@/lib/types";

export function RatingStars({
  rating,
  count,
  showValue = true,
  className = "",
}: {
  rating: number;
  count?: number;
  showValue?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label={`${rating} out of 5 stars`}>
      <div className="flex gap-0.5 text-[0.82rem] leading-none" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <span key={index} className={index < Math.round(rating) ? "text-gold" : "text-plum/20"}>
            ★
          </span>
        ))}
      </div>
      {showValue && (
        <span className="text-[0.7rem] font-medium text-plum/55">
          {rating.toFixed(1)}{count !== undefined ? ` (${count} reviews)` : ""}
        </span>
      )}
    </div>
  );
}

export function productRatingLabel(product: Product) {
  return `${product.rating.toFixed(1)} out of 5 from ${product.reviewCount} reviews`;
}
