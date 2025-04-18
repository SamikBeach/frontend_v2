export function LibraryHeaderSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white pt-3">
      <div className="flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
          <div className="flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
            <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200"></div>
          </div>
          <div className="h-6 w-16 animate-pulse rounded-md border border-gray-200 bg-gray-100"></div>
        </div>
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-10 w-32 animate-pulse rounded-full bg-gray-200"></div>
      </div>
    </div>
  );
} 