/**
 * Skeleton — Design System ZAMIS Print
 * Loading placeholders for different content types.
 * Usage: <Skeleton type="card" /> | <Skeleton type="text" lines={3} />
 */

/* ---- Base Skeleton ---- */
const Skeleton = ({ type = 'text', lines = 1, className = '' }) => {
  if (type === 'text') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton-text ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
          />
        ))}
      </div>
    );
  }

  if (type === 'title') return <div className={`skeleton-title ${className}`} />;
  if (type === 'image') return <div className={`skeleton-image ${className}`} />;
  if (type === 'circle') return <div className={`skeleton-circle w-10 h-10 ${className}`} />;
  if (type === 'card')   return <div className={`skeleton-card h-48 ${className}`} />;

  return <div className={`skeleton h-4 ${className}`} />;
};

/* ---- Product Card Skeleton ---- */
export const ProductCardSkeleton = () => (
  <div className="card-base p-0 overflow-hidden">
    <div className="skeleton-image rounded-none aspect-[4/5] bg-neutral-100" />
    <div className="p-4 flex flex-col gap-3">
      <div className="skeleton-title" />
      <div className="skeleton-text w-1/2" />
      <div className="flex items-center justify-between mt-2">
        <div className="skeleton h-6 w-20 rounded-lg" />
        <div className="skeleton h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

/* ---- Product Detail Skeleton ---- */
export const ProductDetailSkeleton = () => (
  <div className="grid-detail py-8">
    <div className="skeleton-image rounded-2xl h-96" />
    <div className="flex flex-col gap-5">
      <div className="skeleton h-4 w-20 rounded-full" />
      <div className="skeleton h-8 w-3/4 rounded-lg" />
      <div className="skeleton h-6 w-24 rounded-lg" />
      <Skeleton type="text" lines={4} />
      <div className="flex gap-3 mt-4">
        <div className="skeleton h-12 w-32 rounded-xl" />
        <div className="skeleton h-12 flex-1 rounded-xl" />
      </div>
    </div>
  </div>
);

export default Skeleton;
