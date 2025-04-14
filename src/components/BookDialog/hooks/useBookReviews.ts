import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { getBookReviews, likeReview, unlikeReview } from '@/apis/review';
import { Review, ReviewsResponse } from '@/apis/review/types';
import { useBookDetails } from './useBookDetails';

export function useBookReviews() {
  const { book } = useBookDetails();
  const bookId = book?.id || 0;
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const queryClient = useQueryClient();
  const limit = 5; // 한 페이지에 보여줄 리뷰 수

  // 리뷰 데이터 가져오기 (무한 스크롤/페이지네이션)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    status,
  } = useInfiniteQuery({
    queryKey: ['book-reviews', bookId],
    queryFn: async ({ pageParam }) => {
      if (!bookId) {
        return {
          data: [],
          meta: { total: 0, page: 1, limit, totalPages: 0 },
        } as ReviewsResponse;
      }

      const page = pageParam as number;
      const reviewsData = await getBookReviews(bookId, page, limit);
      return reviewsData;
    },
    getNextPageParam: (lastPage: ReviewsResponse) => {
      const { meta } = lastPage;
      // 다음 페이지가 있는지 확인, 없으면 undefined 반환 (hasNextPage가 false가 됨)
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // 모든 페이지의 리뷰를 하나의 배열로 병합
  const reviews =
    data?.pages.flatMap(page => (Array.isArray(page.data) ? page.data : [])) ||
    [];

  // 메타데이터는 마지막 페이지의 것을 사용
  const meta = data?.pages[data.pages.length - 1]?.meta || null;

  // 더보기 버튼 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 좋아요 핸들러
  const handleLike = useCallback(
    async (reviewId: number, isLiked: boolean) => {
      try {
        setIsLikeLoading(true);

        // 낙관적 업데이트 - 무한 쿼리 구조에 맞게 수정
        queryClient.setQueryData(['book-reviews', bookId], (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          // 페이지들을 순회하면서 해당 리뷰 업데이트
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
              if (!page || !page.data) return page;

              return {
                ...page,
                data: page.data.map((review: Review) =>
                  review.id === reviewId
                    ? {
                        ...review,
                        userLiked: !isLiked,
                        likesCount: isLiked
                          ? Math.max(0, (review.likesCount || 0) - 1)
                          : (review.likesCount || 0) + 1,
                      }
                    : review
                ),
              };
            }),
          };
        });

        // 실제 API 호출
        if (isLiked) {
          await unlikeReview(reviewId);
        } else {
          await likeReview(reviewId);
        }
      } catch (error) {
        // 오류 발생시 데이터 재조회
        await refetch();
      } finally {
        setIsLikeLoading(false);
      }
    },
    [bookId, queryClient, refetch]
  );

  return {
    reviews,
    meta,
    status,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,
    handleLike,
    isLikeLoading,
  };
}
