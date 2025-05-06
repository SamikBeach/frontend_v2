import { BookDetailDto, getBookDetail } from '@/apis/book';
import { bookReadingStatusAtom } from '@/atoms/book-dialog';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

export function useBookDetails() {
  const { searchParams } = useQueryParams();
  const setReadingStatus = useSetAtom(bookReadingStatusAtom);

  // URL에서 ISBN이나 ID 파라미터 가져오기
  const id = searchParams.get('id');
  const isbn = searchParams.get('isbn');

  const idParam = id ? parseInt(id) : undefined;
  const isbnParam = isbn || undefined;

  // 유효한 ID 또는 ISBN이 있는지 확인
  const hasValidParam = idParam !== undefined || isbnParam !== undefined;

  // 책 상세 정보 조회
  const { data } = useSuspenseQuery<BookDetailDto>({
    queryKey: ['book-detail', isbnParam || idParam],
    queryFn: () => getBookDetail(idParam, isbnParam),
    enabled: hasValidParam,
  });

  // 초기 로딩 시 읽기 상태 설정
  useEffect(() => {
    if (data?.userReadingStatus !== undefined) {
      setReadingStatus(data.userReadingStatus);
    }
  }, [data?.userReadingStatus, setReadingStatus]);

  return {
    book: data,
    id: idParam,
    isbn: isbnParam,
    userRating: data?.userRating,
    userReadingStatus: data?.userReadingStatus,
    userLibraries: data?.userLibraries,
  };
}
