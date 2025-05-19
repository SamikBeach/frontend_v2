import { useSuspenseQuery } from '@tanstack/react-query';

import { getBookByIsbn } from '@/apis/book';
import { ReadingStatusType } from '@/apis/reading-status';
import { useDialogQuery } from '@/hooks/useDialogQuery';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useParams } from 'next/navigation';

import { Book } from '@/apis/book/types';
import { BookDetails } from '../types';
import { useUserLibraries } from './useUserLibraries';

// 북 데이터를 BookDetails 형식으로 보강
function enrichBookDetails(book: Book): BookDetails {
  // TypeScript 타입 호환을 위한 중간 타입 생성
  const baseBook = {
    ...book,
  };

  // unknown으로 캐스팅 후 BookDetails로 변환
  const enrichedBook = baseBook as unknown as BookDetails;

  return enrichedBook;
}

export function useBookDetails() {
  const params = useParams();
  const { searchParams } = useQueryParams();
  const { id: dialogId } = useDialogQuery({ type: 'book' });
  const { libraries } = useUserLibraries();

  // dialog 쿼리가 있으면 dialogId, 없으면 page param/searchParams 기반
  let id: string | null = null;
  if (dialogId) {
    id = dialogId;
  } else {
    id =
      (params as Record<string, string | undefined>).id ||
      (params as Record<string, string | undefined>).isbn ||
      searchParams.get('id') ||
      searchParams.get('isbn') ||
      null;
  }

  // 책 상세 정보 가져오기 (ISBN 또는 ID로 API 호출)
  const { data: book } = useSuspenseQuery({
    queryKey: ['book-detail', id],
    queryFn: () => (id ? getBookByIsbn(id) : null),
  });

  // 상세 정보와 UI에 필요한 추가 정보를 합침
  const displayBook = book ? enrichBookDetails(book) : null;

  return {
    book: displayBook,
    isbn: id || '', // 변수명은 유지하되 id 값을 사용
    userLibraries: libraries,
    userRating: displayBook?.userRating || null,
    userReadingStatus: displayBook?.userReadingStatus
      ? (displayBook.userReadingStatus as ReadingStatusType)
      : null,
  };
}
