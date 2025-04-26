import { LibraryCardSkeleton } from '@/components/LibraryCard';
import { Skeleton } from '@/components/ui/skeleton';

export function LibrariesSkeleton() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <LibraryCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
