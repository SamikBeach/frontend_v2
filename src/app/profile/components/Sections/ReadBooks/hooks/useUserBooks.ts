import { ReadingStatusType } from '@/apis/reading-status/types';
import { getUserBooks } from '@/apis/user/user';
import { TimeRange } from '@/components/SortDropdown';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

/**
 * 사용자의 책 목록 데이터를 반환하는 훅 (무한 스크롤 + Suspense 구현)
 * @param status 독서 상태 필터 (옵션)
 * @param sort 정렬 옵션
 * @param timeRange 기간 필터
 * @returns 책 목록 및 무한 스크롤 관련 프로퍼티
 */
export function useUserBooks(
  status?: ReadingStatusType,
  sort: string = 'createdAt-desc',
  timeRange: TimeRange = 'all'
) {
  const params = useParams();
  const userId = Number(params.id as string);
  const PAGE_SIZE = 12;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['user-books', userId, status, sort, timeRange],
      queryFn: async ({ pageParam = 1 }) => {
        return getUserBooks(
          userId,
          status,
          pageParam,
          PAGE_SIZE,
          sort,
          timeRange
        );
      },
      getNextPageParam: lastPage => {
        // 다음 페이지가 있는 경우 페이지 번호 반환, 없는 경우 undefined
        return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
      },
      initialPageParam: 1,
    });

  // 모든 페이지의 책 목록을 하나의 배열로 병합
  const books =
    data?.pages.flatMap(page =>
      page.items.map(item => ({
        id: item.book.id,
        title: item.book.title,
        author: item.book.author,
        coverImage: item.book.coverImage,
        isbn: item.book.isbn,
        isbn13: item.book.isbn13,
        publisher: item.book.publisher,
        rating: item.book.rating || 0,
        reviews: item.book.reviews || 0,
        totalRatings: item.book.totalRatings,
        status: item.status,
        currentPage: item.currentPage,
        startDate: item.startDate,
        finishDate: item.finishDate,
        createdAt: item.createdAt, // 정렬을 위해 추가
      }))
    ) || [];

  // 총 데이터 수는 첫 페이지의 total 값을 사용
  const total = data?.pages[0]?.total || 0;

  return {
    books,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    total,
  };
}
