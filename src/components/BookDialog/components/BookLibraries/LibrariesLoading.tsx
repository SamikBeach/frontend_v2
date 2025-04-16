import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// 에러 폴백 컴포넌트
export function LibrariesError({ error, resetErrorBoundary }: any) {
  return (
    <div className="p-4 text-center">
      <h3 className="mb-2 text-base font-medium text-red-500">오류 발생</h3>
      <p className="mb-4 text-sm text-gray-600">
        서재 정보를 불러오는 중 오류가 발생했습니다.
      </p>
      <Button size="sm" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </div>
  );
}

// 로딩 컴포넌트
export function LibrariesLoading() {
  return (
    <div className="p-1">
      <div className="flex items-center justify-center py-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-500"></div>
      </div>
    </div>
  );
}

// 서재 목록 스켈레톤
export function LibrariesSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-gray-100 p-4"
          >
            <Skeleton className="h-12 w-12 rounded" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-4 w-48 rounded" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        ))}
    </div>
  );
}
