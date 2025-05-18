import { Book } from '@/apis/book/types';
import { createLibrary } from '@/apis/library/library';
import { CreateLibraryDto, LibraryListItem } from '@/apis/library/types';
import { BookCard } from '@/components/BookCard';
import { LibraryDialog } from '@/components/Library';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuSub,
  ResponsiveDropdownMenuSubContent,
  ResponsiveDropdownMenuSubTrigger,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface BookItemProps {
  book: Book;
  isOwner: boolean;
  libraryId: number;
  isDropdownOpen: boolean;
  onDropdownOpenChange: (open: boolean) => void;
  onMoveBook: (targetLibraryId: number) => void;
  onDeleteBook: () => void;
  onBookClick: (book: Book) => void;
  userLibraries: LibraryListItem[];
  isLoadingLibraries: boolean;
}

export function BookItem({
  book,
  isOwner,
  libraryId,
  isDropdownOpen,
  onDropdownOpenChange,
  onMoveBook,
  onDeleteBook,
  onBookClick,
  userLibraries,
  isLoadingLibraries,
}: BookItemProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);

  // Create a memoized handler for moving books
  const handleMoveBook = useCallback(
    (targetLibraryId: number) => {
      onMoveBook(targetLibraryId);
    },
    [onMoveBook]
  );

  // 서재 생성 다이얼로그 핸들러
  const handleCreateLibrary = useCallback(() => {
    setShowLibraryDialog(true);
    // 드롭다운 메뉴 닫기
    onDropdownOpenChange(false);
  }, [onDropdownOpenChange]);

  // 서재 생성 API 호출 함수
  const handleCreateLibrarySubmit = useCallback(
    async (libraryData: CreateLibraryDto) => {
      try {
        // API 직접 호출
        await createLibrary(libraryData);

        // 성공 메시지 표시
        toast.success('새 서재가 생성되었습니다');

        // 서재 목록 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: ['user-libraries'] });

        // 서재 목록이 갱신되도록 페이지를 새로고침
        router.refresh();

        // 다이얼로그 닫기
        setShowLibraryDialog(false);
      } catch (error) {
        console.error('서재 생성 중 오류 발생:', error);
        // 오류 메시지는 LibraryDialog 내부에서 처리됨
        throw error; // 오류를 상위로 전파하여 LibraryDialog에서 처리되게 함
      }
    },
    [router, queryClient]
  );

  return (
    <div className="group relative">
      <BookCard book={book} onClick={() => onBookClick(book)} />
      {isOwner && (
        <div className="absolute top-2 right-2 z-10">
          <ResponsiveDropdownMenu
            open={isDropdownOpen}
            onOpenChange={onDropdownOpenChange}
          >
            <ResponsiveDropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`bg-opacity-80 hover:bg-opacity-100 h-8 w-8 rounded-full bg-white p-1.5 ${
                  isDropdownOpen
                    ? 'visible'
                    : 'visible md:invisible md:group-hover:visible'
                }`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </ResponsiveDropdownMenuTrigger>
            <ResponsiveDropdownMenuContent align="end" className="w-48">
              <ResponsiveDropdownMenuSub>
                <ResponsiveDropdownMenuSubTrigger>
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  <span>다른 서재로 옮기기</span>
                </ResponsiveDropdownMenuSubTrigger>
                <ResponsiveDropdownMenuSubContent className="max-h-80 overflow-y-auto">
                  {isLoadingLibraries ? (
                    <ResponsiveDropdownMenuItem disabled>
                      <span className="w-full text-left">
                        서재 목록 불러오는 중...
                      </span>
                    </ResponsiveDropdownMenuItem>
                  ) : userLibraries.length === 0 ? (
                    <div>
                      <ResponsiveDropdownMenuItem disabled>
                        <span className="w-full text-left">
                          서재가 없습니다
                        </span>
                      </ResponsiveDropdownMenuItem>
                      <ResponsiveDropdownMenuItem
                        onSelect={handleCreateLibrary}
                      >
                        <span className="w-full text-left font-medium text-gray-900">
                          + 새 서재 만들기
                        </span>
                      </ResponsiveDropdownMenuItem>
                    </div>
                  ) : userLibraries.filter(lib => lib.id !== libraryId)
                      .length === 0 ? (
                    <div>
                      <ResponsiveDropdownMenuItem disabled>
                        <span className="w-full text-left">
                          서재가 없습니다
                        </span>
                      </ResponsiveDropdownMenuItem>
                      <ResponsiveDropdownMenuItem
                        onSelect={handleCreateLibrary}
                      >
                        <span className="w-full text-left font-medium text-gray-900">
                          + 새 서재 만들기
                        </span>
                      </ResponsiveDropdownMenuItem>
                    </div>
                  ) : (
                    userLibraries
                      .filter(lib => lib.id !== libraryId) // 현재 서재 제외
                      .map(lib => (
                        <ResponsiveDropdownMenuItem
                          key={lib.id}
                          onSelect={() => handleMoveBook(lib.id)}
                        >
                          <span className="w-full text-left">{lib.name}</span>
                        </ResponsiveDropdownMenuItem>
                      ))
                  )}
                </ResponsiveDropdownMenuSubContent>
              </ResponsiveDropdownMenuSub>
              <ResponsiveDropdownMenuItem
                onSelect={onDeleteBook}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 flex-shrink-0" />
                <span>삭제하기</span>
              </ResponsiveDropdownMenuItem>
            </ResponsiveDropdownMenuContent>
          </ResponsiveDropdownMenu>
        </div>
      )}

      {/* 서재 생성 다이얼로그 */}
      <LibraryDialog
        open={showLibraryDialog}
        onOpenChange={setShowLibraryDialog}
        mode="create"
        onCreateLibrary={handleCreateLibrarySubmit}
      />
    </div>
  );
}
