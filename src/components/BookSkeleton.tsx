import { Skeleton } from '@/components/ui/skeleton';

export function BookSkeleton() {
  return (
    <div className="flex h-full w-full min-w-[140px] flex-col overflow-hidden rounded-xl bg-white">
      <div className="relative flex aspect-[3/4.5] w-full items-center justify-center overflow-hidden bg-gray-100">
        <Skeleton className="h-auto w-full" />
      </div>
      <div className="space-y-2 p-2.5">
        <div className="min-h-[38px]">
          <Skeleton className="mb-1.5 h-[15px] w-[90%]" />
          <Skeleton className="h-[15px] w-[60%]" />
        </div>
        <Skeleton className="h-[13px] w-[70%]" />
        <div className="flex items-center space-x-4 pt-1">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-[13px] w-16" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-[13px] w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
