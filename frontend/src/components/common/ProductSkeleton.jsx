import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-card overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-neutral-100" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-neutral-200 rounded w-3/4" />
        <div className="space-y-1.5">
          <div className="h-3.5 bg-neutral-200 rounded w-full" />
          <div className="h-3.5 bg-neutral-200 rounded w-5/6" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
          <div className="h-7 bg-neutral-200 rounded w-20" />
          <div className="h-9 bg-neutral-200 rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
