import { LibraryDetail, LibraryTag } from '@/apis/library/types';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useBookDetails, useBookLibraries } from './hooks';

// 로딩 컴포넌트
function LibrariesLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-48 rounded bg-gray-200"></div>
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-xl bg-gray-100"></div>
        ))}
      </div>
    </div>
  );
}

// 에러 컴포넌트
function LibrariesError({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="p-4 text-center">
      <p className="text-red-500">
        서재 정보를 불러오는 중 오류가 발생했습니다
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 cursor-pointer text-sm text-blue-500 hover:underline"
      >
        다시 시도
      </button>
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
      {(libraries as LibraryDetail[]).map(library => (
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

export function BookLibraries() {
  const { book } = useBookDetails();
  const { libraries, isEmpty } = useBookLibraries(book?.id);

  if (!book || !book.id) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-900">
          이 책이 등록된 서재({isEmpty ? 0 : libraries.length})
        </p>
      </div>

      <ErrorBoundary FallbackComponent={LibrariesError}>
        <Suspense fallback={<LibrariesLoading />}>
          <LibrariesList />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
