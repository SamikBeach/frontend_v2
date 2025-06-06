'use client';

import {
  CreateLibraryDto,
  LibraryListItem,
  LibrarySortOption,
} from '@/apis/library/types';
import { bookLibrariesDropdownAtom } from '@/atoms/book-dialog';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { LibraryDialog } from '@/components/Library';
import { LibraryCard, LibraryCardSkeleton } from '@/components/LibraryCard';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getTagColor } from '@/utils/tags';
import { useAtom } from 'jotai';
import { ListPlus, Plus } from 'lucide-react';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useBookDetails, useBookLibraries } from '../../hooks';
import { useLibrary } from '../../hooks/useLibrary';
import { useUserLibraries } from '../../hooks/useUserLibraries';
import { ConflictAlertDialog } from '../ConflictAlertDialog';

// 에러 폴백 컴포넌트
function LibrariesError({ resetErrorBoundary }: any) {
  return (
    <div className="p-4 text-center">
      <h3 className="mb-2 text-base font-medium text-red-500">오류 발생</h3>
      <p className="mb-4 text-sm text-gray-600">
        서재 정보를 불러오는 중 오류가 발생했습니다.
      </p>
      <Button size="sm" onClick={resetErrorBoundary} className="cursor-pointer">
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
    onConflictDialogOpenChange,
  } = useLibrary(book, book?.isbn || '', userLibraries);

  // 새 서재 생성 다이얼로그 상태
  const [isNewLibraryDialogOpen, setIsNewLibraryDialogOpen] = useState(false);
  const [libraryAddOpen, setLibraryAddOpen] = useAtom(
    bookLibrariesDropdownAtom
  );

  // 새 서재 생성 및 책 추가 핸들러
  const handleCreateLibraryWithBook = async (libraryData: CreateLibraryDto) => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    await createLibrary(libraryData);
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
        <ResponsiveDropdownMenu
          open={libraryAddOpen}
          onOpenChange={setLibraryAddOpen}
        >
          <ResponsiveDropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="mt-3 w-44 max-w-xs cursor-pointer rounded-full border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
            >
              <ListPlus className="mr-1.5 h-4 w-4" />
              <span className="text-sm">내 서재에 담기</span>
            </Button>
          </ResponsiveDropdownMenuTrigger>
          <ResponsiveDropdownMenuContent className="min-w-44 rounded-xl">
            {userLibraries && userLibraries.length > 0 ? (
              userLibraries.map(library => (
                <ResponsiveDropdownMenuItem
                  key={library.id}
                  className="cursor-pointer rounded-lg py-2"
                  onSelect={() => handleAddToLibraryWithAuth(library.id)}
                >
                  {library.name}
                  <span className="ml-1 text-xs text-gray-500">
                    {library.bookCount || 0}
                  </span>
                </ResponsiveDropdownMenuItem>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                서재가 없습니다.
              </div>
            )}
            <ResponsiveDropdownMenuItem
              className="cursor-pointer rounded-lg py-2 text-black hover:bg-gray-100"
              onSelect={handleShowNewLibraryDialog}
            >
              <Plus className="mr-1.5 h-4 w-4" />새 서재 만들기
            </ResponsiveDropdownMenuItem>
          </ResponsiveDropdownMenuContent>
        </ResponsiveDropdownMenu>

        {/* 충돌 알림 다이얼로그 */}
        <ConflictAlertDialog
          open={conflictDialogOpen}
          onOpenChange={onConflictDialogOpenChange}
          libraryName={conflictLibraryName}
        />

        {/* 로그인 다이얼로그 */}
        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

        {/* 새 서재 생성 다이얼로그 */}
        <LibraryDialog
          open={isNewLibraryDialogOpen}
          onOpenChange={setIsNewLibraryDialogOpen}
          mode="create"
          onCreateLibrary={handleCreateLibraryWithBook}
        />
      </div>
    );
  }

  return (
    <div className="p-1">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {libraries.map((library: LibraryListItem) => (
          <div key={library.id}>
            <LibraryCard
              library={library}
              tags={library.tags?.map((tag, index) => ({
                id: String(tag.tagId),
                name: tag.tagName,
                color: getTagColor(index % 8),
              }))}
              hidePublicTag={true}
            />
          </div>
        ))}
      </div>

      {/* 서재 더보기 버튼 */}
      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="cursor-pointer rounded-full text-sm font-medium"
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

      {/* 충돌 알림 다이얼로그 */}
      <ConflictAlertDialog
        open={conflictDialogOpen}
        onOpenChange={onConflictDialogOpenChange}
        libraryName={conflictLibraryName}
      />

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      {/* 새 서재 생성 다이얼로그 */}
      <LibraryDialog
        open={isNewLibraryDialogOpen}
        onOpenChange={setIsNewLibraryDialogOpen}
        mode="create"
        onCreateLibrary={handleCreateLibraryWithBook}
      />
    </div>
  );
}

// 홈화면용 인기 서재 목록 (변경된 타입에 맞게)
export function LibrariesSkeleton() {
  return (
    <div className="p-1">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <LibraryCardSkeleton key={i} />
        ))}
      </div>
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
