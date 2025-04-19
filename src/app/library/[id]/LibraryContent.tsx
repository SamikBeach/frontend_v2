import { Book as BookType } from '@/apis/book';
import { removeBookFromLibrary } from '@/apis/library';
import { useLibraryDetail } from '@/app/libraries/hooks/useLibraryDetail';
import { BookCard } from '@/components/BookCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useDialogQuery } from '@/hooks';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { AddBookDialog } from './components/AddBookDialog';

// DeleteBookDialog 컴포넌트: 책 삭제 확인 다이얼로그
interface DeleteBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: number;
  bookTitle: string;
  libraryId: number;
  onDelete: () => void;
}

function DeleteBookDialog({
  open,
  onOpenChange,
  bookId,
  bookTitle,
  libraryId,
  onDelete,
}: DeleteBookDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  // 책 삭제 mutation
  const { mutateAsync } = useMutation({
    mutationFn: () => removeBookFromLibrary(libraryId, bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library', libraryId] });
      queryClient.invalidateQueries({
        queryKey: ['library-updates', libraryId],
      });
      toast.success('책이 서재에서 삭제되었습니다.');
      onDelete();
      onOpenChange(false);
    },
    onError: error => {
      console.error('책 삭제 중 오류 발생:', error);
      toast.error('책 삭제 중 오류가 발생했습니다.');
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await mutateAsync();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-medium">
            {bookTitle}을(를) 서재에서 삭제하시겠습니까?
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm text-gray-500">
            이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="cursor-pointer rounded-lg border-gray-200"
            disabled={isDeleting}
          >
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 focus:ring-red-600"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function LibraryContent() {
  const params = useParams();
  const router = useRouter();
  const libraryId = parseInt(params.id as string, 10);
  const { library } = useLibraryDetail(libraryId);
  const currentUser = useCurrentUser();
  const isMobile = useIsMobile();
  const { open: openBookDialog } = useDialogQuery({
    type: 'book',
    idType: 'id',
  });
  const queryClient = useQueryClient();

  // 삭제 다이얼로그 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [showAddBookDialog, setShowAddBookDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!library) {
    return null;
  }

  // 현재 사용자가 서재 소유자인지 확인
  const isOwner = currentUser?.id === library?.owner?.id;

  // 라이브러리 책 형식 변환
  const booksWithDetails =
    library.books?.map(libraryBook => ({
      ...libraryBook.book,
      id: libraryBook.bookId,
      libraryBookId: libraryBook.id,
    })) || [];

  // 책 클릭 핸들러
  const handleBookClick = (book: BookType) => {
    openBookDialog(book.id.toString());
  };

  // 책 삭제 핸들러
  const handleDeleteBook = (bookId: number, title: string) => {
    setBookToDelete({
      id: bookId,
      title: title || '제목 없음',
    });
    setDeleteDialogOpen(true);
    setIsDropdownOpen(false);
  };

  // 다른 서재로 이동 핸들러
  const handleMoveToOtherLibrary = (bookId: number) => {
    // 여기서는 단순히 책 상세 페이지로 이동하여 사용자가 다른 서재에 추가할 수 있게 합니다
    openBookDialog(bookId.toString());
  };

  // 삭제 후 캐시 업데이트
  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['library', libraryId] });
  };

  return (
    <div className="space-y-3">
      {/* 서재 설명 */}
      <div className="rounded-xl bg-white py-2">
        <p className="text-gray-700">
          {library.description || '설명이 없습니다.'}
        </p>
      </div>

      <Separator className="border-gray-100" />

      {/* 책 목록 */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-gray-900">담긴 책</h2>
            <div className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-600">
              {booksWithDetails.length}
            </div>
          </div>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 rounded-lg"
              onClick={() => setShowAddBookDialog(true)}
            >
              <Plus className="h-4 w-4" />
              <span>책 추가</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
          {booksWithDetails.length > 0 ? (
            booksWithDetails.map(book => (
              <div key={book.id} className="group relative">
                <BookCard book={book as BookType} onClick={handleBookClick} />
                {isOwner && (
                  <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu
                      open={isDropdownOpen}
                      onOpenChange={setIsDropdownOpen}
                    >
                      <DropdownMenuTrigger asChild>
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
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleMoveToOtherLibrary(book.id)}
                          className="cursor-pointer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>다른 서재로 옮기기</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteBook(
                              book.id,
                              book.title || '제목 없음'
                            );
                          }}
                          className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                          <span className="text-red-600 hover:text-red-600">
                            삭제하기
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p className="text-gray-500">아직 추가된 책이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 책 삭제 다이얼로그 */}
      {bookToDelete && (
        <DeleteBookDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          bookId={bookToDelete.id}
          bookTitle={bookToDelete.title}
          libraryId={libraryId}
          onDelete={handleDeleteSuccess}
        />
      )}

      {/* 책 추가 다이얼로그 */}
      {showAddBookDialog && (
        <AddBookDialog
          isOpen={showAddBookDialog}
          onOpenChange={setShowAddBookDialog}
          libraryId={libraryId}
        />
      )}
    </div>
  );
}
