import { Skeleton } from '@/components/ui/skeleton';

export function LibraryCardSkeleton() {
  return (
    <div className="group h-full rounded-xl border-none bg-[#F9FAFB] p-5 shadow-none">
      <div className="mb-3 flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div>
          <Skeleton className="mb-1 h-4 w-40" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="mb-4 h-10 w-full" />
      <div className="grid grid-cols-2 gap-2.5">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}
