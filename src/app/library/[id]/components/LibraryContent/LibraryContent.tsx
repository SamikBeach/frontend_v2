import { Book } from '@/apis/book/types';
import { LibraryListItem } from '@/apis/library/types';
import { Separator } from '@/components/ui/separator';
import { useBookDetailOpen } from '@/hooks/useBookDetailOpen';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useLibraryDetail } from '../../hooks';
import { AddBookDialog } from '../AddBookDialog';
import { BookList } from './BookList';
import { BookListHeader } from './BookListHeader';
import { DeleteBookDialog } from './DeleteBookDialog';
import { LibraryContentSkeleton } from './LibraryContentSkeleton';
import { useLibraryBooks, useUserLibraries } from './hooks';

// 서재에 표시될 책 타입을 위한 인터페이스
interface LibraryBookItem extends Partial<Book> {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  libraryBookId?: number;
}

export function LibraryContent() {
  const params = useParams();
  const libraryId = parseInt(params.id as string, 10);
  const { library, isLoading } = useLibraryDetail(libraryId);
  const currentUser = useCurrentUser();
  const openBookDetail = useBookDetailOpen();

  // 사용자 서재 목록 불러오기
  const { userLibraries, isLoading: isLoadingLibraries } = useUserLibraries(
    libraryId,
    library?.owner?.id
  );

  // 책 관련 hooks
  const { moveBook } = useLibraryBooks(libraryId);

  // 상태 관리
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [showAddBookDialog, setShowAddBookDialog] = useState(false);

  if (isLoading || !library) {
    return <LibraryContentSkeleton />;
  }

  // 현재 사용자가 서재 소유자인지 확인
  const isOwner = currentUser?.id === library?.owner?.id;

  // 라이브러리 책 형식 변환
  const booksWithDetails: LibraryBookItem[] =
    library.books?.map(libraryBook => ({
      ...libraryBook.book,
      id: libraryBook.bookId,
      libraryBookId: libraryBook.id,
    })) || [];

  // 책 클릭 핸들러
  const handleBookClick = (book: LibraryBookItem) => {
    const bookIsbn = book.isbn13 || book.isbn;
    if (!bookIsbn) return;
    openBookDetail(bookIsbn);
  };

  // 책 삭제 핸들러
  const handleDeleteBook = (bookId: number, title: string) => {
    setBookToDelete({
      id: bookId,
      title: title || '제목 없음',
    });
    setDeleteDialogOpen(true);
  };

  // 책 다른 서재로 이동 핸들러
  const handleMoveToLibrary = (bookId: number, targetLibraryId: number) => {
    moveBook({
      bookId,
      targetLibraryId,
    });
  };

  return (
    <div className="space-y-3">
      <Separator className="border-gray-100" />

      {/* 책 목록 */}
      <div>
        <BookListHeader
          booksCount={booksWithDetails.length}
          isOwner={isOwner}
          onAddBook={() => setShowAddBookDialog(true)}
        />

        <div className="3xl:grid-cols-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          <BookList
            books={booksWithDetails as unknown as Book[]}
            isOwner={isOwner}
            libraryId={libraryId}
            userLibraries={userLibraries as LibraryListItem[]}
            isLoadingLibraries={isLoadingLibraries}
            onMoveBook={handleMoveToLibrary}
            onDeleteBook={handleDeleteBook}
            onBookClick={handleBookClick as (book: Book) => void}
          />
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
          onDelete={() => {}}
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
