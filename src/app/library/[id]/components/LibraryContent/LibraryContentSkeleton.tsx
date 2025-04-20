import { Separator } from '@/components/ui/separator';

export function LibraryContentSkeleton() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-white py-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
      </div>
      <Separator className="border-gray-100" />
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-6 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="ml-2 h-6 w-8 animate-pulse rounded-full bg-gray-200"></div>
          </div>
        </div>
        <div className="3xl:grid-cols-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] animate-pulse rounded-lg bg-gray-200"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
