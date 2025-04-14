import { useSuspenseQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getBookByIsbn } from '@/apis/book';
import { ReadingStatusType } from '@/apis/reading-status';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useDialogQuery } from '@/hooks/useDialogQuery';

import { Book } from '@/apis/book/types';
import { BookDetails } from '../types';
import { useUserLibraries } from './useUserLibraries';

// 북 데이터를 BookDetails 형식으로 보강
function enrichBookDetails(book: Book): BookDetails {
  // 예상되는 리뷰 타입으로 변환
  const reviews =
    typeof book.reviews === 'number'
      ? [] // 숫자인 경우 빈 배열로 초기화
      : book.reviews || [];

  // 사용자 별점과 읽기 상태 디버깅
  if (book.userRating) {
    console.log('Book user rating data:', book.userRating);
  }

  if (book.userReadingStatus) {
    console.log('Book user reading status:', book.userReadingStatus);
  }

  // 임시 데이터로 API에서 제공하지 않는 데이터를 추가
  const enrichedBook = {
    ...book,
    reviews, // 숫자 대신 배열로 설정
    coverImage:
      book.coverImage || `https://picsum.photos/seed/${book.id}/400/600`,
    toc: `제1장 도입부\n제2장 본론\n  제2.1절 첫 번째 주제\n  제2.2절 두 번째 주제\n제3장 결론`,
    authorInfo: `${book.author}는 해당 분야에서 20년 이상의 경력을 가진 저명한 작가입니다. 여러 저서를 통해 독자들에게 새로운 시각과 통찰을 제공해왔습니다.`,
  } as BookDetails;

  // 기본 태그 추가 (API에서 제공하지 않는 경우)
  if (!enrichedBook.tags) {
    enrichedBook.tags = ['베스트셀러'];
    if (book.category?.name) enrichedBook.tags.push(book.category.name);
    if (book.subcategory?.name) enrichedBook.tags.push(book.subcategory.name);
  }

  // 기본 리뷰 데이터 추가 (API에서 제공하지 않는 경우)
  if (!enrichedBook.reviews || enrichedBook.reviews.length === 0) {
    enrichedBook.reviews = [
      {
        id: 1,
        user: {
          name: '김독서',
          avatar: `https://i.pravatar.cc/150?u=user1`,
        },
        rating: 4.5,
        content:
          '정말 좋은 책이었습니다. 깊이 있는 통찰과 함께 현대적 해석이 인상적이었습니다.',
        date: '2024-03-15',
        likes: 24,
        comments: 8,
      },
      {
        id: 2,
        user: {
          name: '이책벌레',
          avatar: `https://i.pravatar.cc/150?u=user2`,
        },
        rating: 5,
        content:
          '필독서입니다. 이 분야에 관심이 있는 분들이라면 꼭 읽어보세요.',
        date: '2024-02-28',
        likes: 32,
        comments: 12,
      },
    ];
  }

  return enrichedBook;
}

export function useBookDetails() {
  const { isbn } = useDialogQuery({ type: 'book' });
  const currentUser = useCurrentUser();
  const { libraries } = useUserLibraries();

  // 책 상세 정보 가져오기 (ISBN으로 API 호출)
  const { data: book, isLoading } = useSuspenseQuery({
    queryKey: ['book-detail', isbn],
    queryFn: () => (isbn ? getBookByIsbn(isbn) : null),
  });

  // 알라딘으로 이동하는 함수
  const handleOpenAladin = useCallback(() => {
    if (!isbn) return;
    window.open(
      `https://www.aladin.co.kr/shop/wproduct.aspx?isbn=${isbn}`,
      '_blank'
    );
  }, [isbn]);

  // 상세 정보와 UI에 필요한 추가 정보를 합침
  const displayBook = book ? enrichBookDetails(book) : null;

  return {
    book: displayBook,
    isbn: isbn || '',
    userLibraries: libraries,
    userRating: displayBook?.userRating || null,
    userReadingStatus: displayBook?.userReadingStatus
      ? (displayBook.userReadingStatus as ReadingStatusType)
      : null,
  };
}
