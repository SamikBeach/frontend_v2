import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="h-[340px] rounded-lg bg-white p-3">
      <div className="flex h-full flex-col">
        {/* Header skeleton */}
        <div className="mb-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-1 h-3 w-36" />
        </div>

        {/* Content skeleton */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative h-[200px] w-[200px] overflow-hidden rounded-full">
            <Skeleton className="absolute h-full w-full opacity-40" />
            <div className="absolute top-1/2 left-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
