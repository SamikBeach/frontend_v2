import { LibraryTag } from '@/apis/library/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useBookDetails, useBookLibraries } from './hooks';

// 에러 폴백 컴포넌트
function LibrariesError() {
  return (
    <div className="rounded-xl bg-red-50 p-4 text-center">
      <p className="text-sm text-red-600">
        서재 정보를 불러오는데 실패했습니다
      </p>
    </div>
  );
}

// 서재 목록 컴포넌트
function LibrariesList() {
  const { book } = useBookDetails();
  const { libraries, isEmpty } = useBookLibraries(book?.id);

  if (isEmpty) {
    return (
      <div className="rounded-xl bg-gray-50 p-4 text-center">
        <p className="text-gray-500">이 책이 등록된 서재가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {libraries.map(library => (
        <Link key={library.id} href={`/library/${library.id}`}>
          <div className="flex items-center rounded-xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
            <div className="flex flex-1 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                <BookOpen className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{library.name}</p>
                  <div className="flex flex-wrap gap-1">
                    {library.tags &&
                      (library.tags as LibraryTag[]).map((tag, index) => (
                        <Badge
                          key={index}
                          className="rounded-full border-0 bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-900"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                  </div>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                  <span>{library.owner?.username || '익명 사용자'}</span>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{library.booksCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{library.subscribersCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// 로딩 컴포넌트
function LibrariesLoading() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
        >
          <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
          <div className="flex-1">
            <div className="mb-1 h-4 w-24 rounded bg-gray-200"></div>
            <div className="h-3 w-16 rounded bg-gray-200"></div>
          </div>
          <div className="h-6 w-12 rounded-lg bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

// LibrariesSkeleton 컴포넌트
export function LibrariesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
        >
          <Skeleton className="h-11 w-11 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-3 w-24 rounded-full" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function BookLibraries() {
  const { book } = useBookDetails();

  if (!book || !book.id) return null;

  return (
    <div>
      <ErrorBoundary FallbackComponent={LibrariesError}>
        <Suspense fallback={<LibrariesSkeleton />}>
          <LibrariesList />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
