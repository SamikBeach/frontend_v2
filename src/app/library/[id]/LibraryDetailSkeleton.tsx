// 서재 상세 로딩 스켈레톤
export function LibraryDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex py-6">
        <div className="flex-1 pl-8">
          <div className="mb-2 h-8 w-64 rounded bg-gray-200"></div>
          <div className="h-4 w-32 rounded bg-gray-200"></div>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-[1fr_400px]">
        <div className="space-y-6 pl-8">
          <div className="h-24 rounded-lg bg-gray-200"></div>
          <div className="h-6 w-48 rounded bg-gray-200"></div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-lg bg-gray-200"
              ></div>
            ))}
          </div>
        </div>
        <div className="pr-8">
          <div className="space-y-6">
            <div className="h-48 rounded-xl bg-gray-200"></div>
            <div className="h-48 rounded-xl bg-gray-200"></div>
            <div className="h-48 rounded-xl bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
