'use client';

import { CreateLibraryDto } from '@/apis/library/types';
import { ReadingStatusType } from '@/apis/reading-status';
import {
  actionButtonsLibraryDropdownAtom,
  readingStatusDropdownOpenAtom,
} from '@/atoms/book-dialog';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { LibraryDialog } from '@/components/Library';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { useAtom } from 'jotai';
import { ChevronDown, ListPlus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  useBookDetails,
  useLibrary,
  useReadingStatus,
  useUserLibraries,
} from '../hooks';
import { ConflictAlertDialog } from './ConflictAlertDialog';

export function BookActionButtons() {
  const { book, isbn, userLibraries } = useBookDetails();
  const currentUser = useCurrentUser();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // 드롭다운 상태 atom 사용
  const [readingStatusOpen, setReadingStatusOpen] = useAtom(
    readingStatusDropdownOpenAtom
  );
  const [libraryAddOpen, setLibraryAddOpen] = useAtom(
    actionButtonsLibraryDropdownAtom
  );

  const {
    readingStatus,
    isPending,
    statusTexts,
    statusIcons,
    handleReadingStatusChange,
    getReadingStatusStyle,
  } = useReadingStatus();
  const {
    handleAddToLibrary,
    error,
    resetError,
    conflictDialogOpen,
    conflictLibraryName,
    onConflictDialogOpenChange,
  } = useLibrary(book, isbn, userLibraries);
  const { createLibrary } = useUserLibraries();

  // 새 서재 생성 다이얼로그 상태
  const [isNewLibraryDialogOpen, setIsNewLibraryDialogOpen] = useState(false);

  // 새 서재 생성 핸들러
  const handleCreateNewLibrary = async (libraryData: CreateLibraryDto) => {
    await createLibrary(libraryData);
  };

  // 에러 상태 처리
  useEffect(() => {
    if (error) {
      // 오류가 UI에 이미 표시되었으므로 여기서는 로깅만 제거
      return () => resetError();
    }
  }, [error, resetError]);

  // 상태 텍스트 표시
  const displayStatusText = readingStatus
    ? statusTexts[readingStatus]
    : '읽기 상태 설정';

  // 상태 아이콘 표시
  const displayStatusIcon = readingStatus ? statusIcons[readingStatus] : null;

  // 읽기 상태 변경 핸들러 래퍼 함수
  const onReadingStatusChange = (status: ReadingStatusType | 'NONE') => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    if (book?.id) {
      handleReadingStatusChange(status);
    } else {
      toast.error('책 정보를 불러오는 중 오류가 발생했습니다.');
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

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <ResponsiveDropdownMenu
          open={readingStatusOpen}
          onOpenChange={setReadingStatusOpen}
          shouldScaleBackground={false}
        >
          <ResponsiveDropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full cursor-pointer rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-900',
                readingStatus
                  ? getReadingStatusStyle(readingStatus)
                  : 'bg-gray-50 text-gray-700'
              )}
              disabled={isPending}
            >
              {displayStatusIcon && (
                <span className="mr-1.5" suppressHydrationWarning>
                  {typeof displayStatusIcon === 'string'
                    ? displayStatusIcon
                    : ''}
                </span>
              )}
              <span suppressHydrationWarning>
                {typeof displayStatusText === 'string' ? displayStatusText : ''}
              </span>
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </ResponsiveDropdownMenuTrigger>
          <ResponsiveDropdownMenuContent className="min-w-48 rounded-xl">
            {Object.values(ReadingStatusType).map(status => (
              <ResponsiveDropdownMenuItem
                key={status}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2',
                  readingStatus === status ? 'bg-gray-100' : '',
                  status === ReadingStatusType.WANT_TO_READ &&
                    'hover:bg-purple-50',
                  status === ReadingStatusType.READING && 'hover:bg-blue-50',
                  status === ReadingStatusType.READ && 'hover:bg-green-50'
                )}
                onSelect={() => onReadingStatusChange(status)}
                disabled={isPending}
              >
                <span className="text-base">{statusIcons[status]}</span>
                <span
                  className={cn(
                    status === ReadingStatusType.WANT_TO_READ &&
                      'text-purple-600',
                    status === ReadingStatusType.READING && 'text-blue-600',
                    status === ReadingStatusType.READ && 'text-green-600'
                  )}
                >
                  {statusTexts[status]}
                </span>
              </ResponsiveDropdownMenuItem>
            ))}

            {/* 선택 안함 옵션 */}
            <ResponsiveDropdownMenuItem
              key="none"
              className={cn(
                'mt-1 flex cursor-pointer items-center gap-2 rounded-lg border-t px-3 py-2',
                readingStatus === null ? 'bg-gray-100' : '',
                'hover:bg-red-50'
              )}
              onSelect={() => onReadingStatusChange('NONE' as any)}
              disabled={isPending}
            >
              <span className="text-base">{statusIcons['NONE']}</span>
              <span className="text-red-600">{statusTexts['NONE']}</span>
            </ResponsiveDropdownMenuItem>
          </ResponsiveDropdownMenuContent>
        </ResponsiveDropdownMenu>

        <ResponsiveDropdownMenu
          open={libraryAddOpen}
          onOpenChange={setLibraryAddOpen}
          shouldScaleBackground={false}
        >
          <ResponsiveDropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full cursor-pointer rounded-full border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
            >
              <ListPlus className="mr-1.5 h-4 w-4" />
              <span className="text-sm">서재에 담기</span>
            </Button>
          </ResponsiveDropdownMenuTrigger>
          <ResponsiveDropdownMenuContent className="min-w-48 rounded-xl">
            {userLibraries && userLibraries.length > 0 ? (
              userLibraries.map(library => (
                <ResponsiveDropdownMenuItem
                  key={library.id}
                  className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-gray-100"
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
      </div>

      {/* LibraryDialog 컴포넌트로 대체 */}
      <LibraryDialog
        open={isNewLibraryDialogOpen}
        onOpenChange={setIsNewLibraryDialogOpen}
        mode="create"
        onCreateLibrary={handleCreateNewLibrary}
      />

      {/* 충돌 알림 다이얼로그 */}
      <ConflictAlertDialog
        open={conflictDialogOpen}
        onOpenChange={onConflictDialogOpenChange}
        libraryName={conflictLibraryName}
      />

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
