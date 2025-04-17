import {
  CreateLibraryDto,
  Library,
  LibraryDetail,
  LibrarySortOption,
  LibraryTag,
} from '@/apis/library/types';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { CreateLibraryDialog } from '@/components/Library';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { BookOpen, ListPlus, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
import { ConflictAlertDialog } from './components/ConflictAlertDialog';
import { useBookDetails, useBookLibraries } from './hooks';
import { useLibrary } from './hooks/useLibrary';
import { useUserLibraries } from './hooks/useUserLibraries';

// 에러 폴백 컴포넌트
function LibrariesError({ resetErrorBoundary }: any) {
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

// 서재 목록 컴포넌트
function LibrariesList({ sortOption }: { sortOption?: LibrarySortOption }) {
  const { book } = useBookDetails();
  const effectiveSortOption = sortOption || LibrarySortOption.SUBSCRIBERS;

  // sortOption이 변경될 때마다 쿼리 다시 실행하도록 설정
  const {
    libraries,
    isEmpty,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,
  } = useBookLibraries(book?.id, 5, effectiveSortOption);
  const currentUser = useCurrentUser();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { createLibrary, libraries: userLibraries } = useUserLibraries();
  const {
    handleAddToLibrary,
    conflictDialogOpen,
    conflictLibraryName,
    closeConflictDialog,
  } = useLibrary(book, book?.isbn || '', userLibraries);

  // 새 서재 생성 다이얼로그 상태
  const [isNewLibraryDialogOpen, setIsNewLibraryDialogOpen] = useState(false);

  // 새 서재 생성 및 책 추가 핸들러
  const handleCreateLibraryWithBook = async (libraryData: CreateLibraryDto) => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    try {
      const newLibrary = await createLibrary(libraryData);
      if (newLibrary && book) {
        // 새로 생성된 서재에 책 추가 - 책 데이터는 필요한 경우에만 추가
        toast.success(`'${newLibrary.name}' 서재가 생성되었습니다.`);
      }
    } catch {
      toast.error('서재 생성 중 오류가 발생했습니다');
    }
  };

  // 서재에 담기 핸들러 래퍼 함수
  const handleAddToLibraryWithAuth = (libraryId: number) => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    handleAddToLibrary(libraryId);
  };

  // 새 서재 생성 다이얼로그 표시 핸들러
  const handleShowNewLibraryDialog = () => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    setIsNewLibraryDialogOpen(true);
  };

  if (isEmpty) {
    return (
      <div className="px-1 py-6 text-center">
        <p className="text-sm text-gray-500">
          아직 이 책이 등록된 서재가 없습니다.
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="mt-3 w-44 max-w-xs rounded-full border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
            >
              <ListPlus className="mr-1.5 h-4 w-4" />
              <span className="text-sm">내 서재에 담기</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-44 rounded-xl">
            {userLibraries && userLibraries.length > 0 ? (
              userLibraries.map((library: Library) => (
                <DropdownMenuItem
                  key={library.id}
                  className="cursor-pointer rounded-lg py-2"
                  onClick={() => handleAddToLibraryWithAuth(library.id)}
                >
                  {library.name}
                  <span className="ml-1 text-xs text-gray-500">
                    {library.bookCount || 0}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                서재가 없습니다.
              </div>
            )}
            <DropdownMenuItem
              className="cursor-pointer rounded-lg py-2 text-black hover:bg-gray-100"
              onClick={handleShowNewLibraryDialog}
            >
              <Plus className="mr-1.5 h-4 w-4" />새 서재 만들기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 충돌 알림 다이얼로그 */}
        <ConflictAlertDialog
          open={conflictDialogOpen}
          onOpenChange={closeConflictDialog}
          libraryName={conflictLibraryName}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 p-1">
      {libraries.map((library: LibraryDetail) => (
        <Link key={library.id} href={`/library/${library.id}`}>
          <div className="group mb-2 h-full rounded-xl bg-[#F9FAFB] p-4 transition-all duration-200 hover:bg-[#F2F4F6]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                    {library.name}
                  </h3>
                </div>
                <p className="text-xs text-gray-500">
                  {library.owner?.username || '익명'}
                </p>
              </div>
            </div>

            <div className="mt-2 line-clamp-2 text-sm text-gray-600">
              {library.description}
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {library.tags &&
                (library.tags as LibraryTag[]).slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-700 group-hover:bg-gray-200"
                  >
                    {tag.name}
                  </Badge>
                ))}
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gray-400" />
                <span>{library.subscribersCount || 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                <span>{library.booksCount || 0}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* 서재 더보기 버튼 */}
      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="rounded-full text-sm font-medium"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800"></span>
                로딩 중...
              </span>
            ) : (
              '서재 더 보기'
            )}
          </Button>
        </div>
      )}

      {/* 새 서재 생성 다이얼로그 - 공통 컴포넌트 사용 */}
      <CreateLibraryDialog
        open={isNewLibraryDialogOpen}
        onOpenChange={setIsNewLibraryDialogOpen}
        onCreateLibrary={handleCreateLibraryWithBook}
      />

      {/* 충돌 알림 다이얼로그 */}
      <ConflictAlertDialog
        open={conflictDialogOpen}
        onOpenChange={closeConflictDialog}
        libraryName={conflictLibraryName}
      />

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
}

// LibrariesSkeleton 컴포넌트
export function LibrariesSkeleton() {
  return (
    <div className="space-y-5 p-1">
      {[1, 2, 3].map(i => (
        <div key={i} className="group mb-2 h-full rounded-xl bg-[#F9FAFB] p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-3 w-24 rounded-full" />
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
          <div className="mt-3 flex gap-1">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="mt-3 flex gap-4">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookLibraries({
  sortOption,
}: {
  sortOption?: LibrarySortOption;
}) {
  return (
    <ErrorBoundary FallbackComponent={LibrariesError}>
      <Suspense fallback={<LibrariesSkeleton />}>
        <LibrariesList sortOption={sortOption} />
      </Suspense>
    </ErrorBoundary>
  );
}
