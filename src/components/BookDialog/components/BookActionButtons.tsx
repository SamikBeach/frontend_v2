import { CreateLibraryDto } from '@/apis/library/types';
import { ReadingStatusType } from '@/apis/reading-status';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { CreateLibraryDialog } from '@/components/Library';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';
import { ChevronDown, ListPlus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  useBookDetails,
  useBookshelf,
  useReadingStatus,
  useUserLibraries,
} from '../hooks';

export function BookActionButtons() {
  const { book, isbn, userLibraries } = useBookDetails();
  const currentUser = useCurrentUser();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const {
    readingStatus,
    isPending,
    statusTexts,
    statusIcons,
    handleReadingStatusChange,
    getReadingStatusStyle,
  } = useReadingStatus();
  const {
    handleAddToBookshelf,
    isPending: isBookshelfPending,
    error,
    resetError,
  } = useBookshelf(book, isbn, userLibraries);
  const { isLoggedIn, createLibrary } = useUserLibraries();

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
        // 새로 생성된 서재에 책 추가
        handleAddToBookshelf(newLibrary.id);
      }
      toast.success('새 서재를 만들고 책을 추가했습니다');
    } catch (error) {
      toast.error('서재 생성 중 오류가 발생했습니다');
      console.error('서재 생성 오류:', error);
    }
  };

  // 에러 상태 처리
  useEffect(() => {
    if (error) {
      console.error('서재에 책 추가 중 오류:', error);
      // 오류가 UI에 이미 표시되었으므로 여기서는 로깅만
      return () => resetError();
    }
  }, [error, resetError]);

  // 상태 텍스트 표시
  const displayStatusText = readingStatus
    ? statusTexts[readingStatus]
    : '책 상태 설정';

  // 상태 아이콘 표시
  const displayStatusIcon = readingStatus ? statusIcons[readingStatus] : null;

  // 읽기 상태 변경 핸들러 래퍼 함수
  const onReadingStatusChange = (status: ReadingStatusType) => {
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
  const handleAddToBookshelfWithAuth = (libraryId: number) => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    handleAddToBookshelf(libraryId);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-900',
                readingStatus
                  ? getReadingStatusStyle(readingStatus)
                  : 'bg-gray-50 text-gray-700'
              )}
              disabled={isPending}
            >
              {displayStatusIcon && (
                <span className="mr-1.5">{displayStatusIcon}</span>
              )}
              <span>{displayStatusText}</span>
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 rounded-xl">
            {Object.values(ReadingStatusType).map(status => (
              <DropdownMenuItem
                key={status}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2',
                  readingStatus === status ? 'bg-gray-100' : '',
                  status === ReadingStatusType.WANT_TO_READ &&
                    'hover:bg-purple-50',
                  status === ReadingStatusType.READING && 'hover:bg-blue-50',
                  status === ReadingStatusType.READ && 'hover:bg-green-50'
                )}
                onClick={() => onReadingStatusChange(status)}
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
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full rounded-full border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
              disabled={isBookshelfPending}
            >
              <ListPlus className="mr-1.5 h-4 w-4" />
              <span className="text-sm">
                {isBookshelfPending ? '처리 중...' : '내 서재에 담기'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-xl">
            {userLibraries && userLibraries.length > 0 ? (
              userLibraries.map(library => (
                <DropdownMenuItem
                  key={library.id}
                  className="cursor-pointer rounded-lg py-2"
                  onClick={() => handleAddToBookshelfWithAuth(library.id)}
                  disabled={isBookshelfPending}
                >
                  {library.name}
                  <span className="ml-2 text-xs text-gray-500">
                    ({library.bookCount || 0}권)
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
      </div>

      {/* 새 서재 생성 다이얼로그 */}
      <CreateLibraryDialog
        open={isNewLibraryDialogOpen}
        onOpenChange={setIsNewLibraryDialogOpen}
        onCreateLibrary={handleCreateLibraryWithBook}
      />

      {/* 로그인 다이얼로그 */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode="login"
      />
    </>
  );
}
