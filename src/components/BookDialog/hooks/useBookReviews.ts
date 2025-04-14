import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { getBookReviews, likeReview, unlikeReview } from '@/apis/review';
import { Review } from '@/apis/review/types';
import { useBookDetails } from './useBookDetails';

export function useBookReviews() {
  const { book } = useBookDetails();
  const bookId = book?.id || 0;
  const [page, setPage] = useState(1);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const queryClient = useQueryClient();

  // 리뷰 데이터 가져오기
  const { data, refetch } = useSuspenseQuery({
    queryKey: ['book-reviews', bookId, page],
    queryFn: async () => {
      if (!bookId)
        return {
          data: [],
          meta: { total: 0, page: 1, limit: 5, totalPages: 0 },
        };

      const reviewsData = await getBookReviews(bookId, page, 5);
      console.log('리뷰 API 응답:', reviewsData);
      return reviewsData;
    },
  });

  // API 응답에 따라 reviews 데이터 추출
  const reviews = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const meta = data?.meta || null;

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 좋아요 핸들러
  const handleLike = useCallback(
    async (reviewId: number, isLiked: boolean) => {
      try {
        setIsLikeLoading(true);

        // 낙관적 업데이트
        queryClient.setQueryData(
          ['book-reviews', bookId, page],
          (oldData: any) => {
            // 배열 형태인 경우
            if (Array.isArray(oldData)) {
              return oldData.map((review: Review) =>
                review.id === reviewId
                  ? {
                      ...review,
                      userLiked: !isLiked,
                      likesCount: isLiked
                        ? Math.max(0, (review.likesCount || 0) - 1)
                        : (review.likesCount || 0) + 1,
                    }
                  : review
              );
            }

            // { data: [...], meta: {...} } 형태인 경우
            if (oldData?.data && Array.isArray(oldData.data)) {
              return {
                ...oldData,
                data: oldData.data.map((review: Review) =>
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
            }

            return oldData;
          }
        );

        // 실제 API 호출
        if (isLiked) {
          await unlikeReview(reviewId);
        } else {
          await likeReview(reviewId);
        }

        // 성공 후 데이터 재조회 (불필요한 경우 주석 처리 가능)
        // await refetch();
      } catch (error) {
        console.error('좋아요 처리 중 오류가 발생했습니다:', error);
        // 오류 발생시 데이터 원상복구
        await refetch();
      } finally {
        setIsLikeLoading(false);
      }
    },
    [bookId, page, queryClient, refetch]
  );

  return {
    reviews,
    meta,
    currentPage: page,
    handlePageChange,
    handleLike,
    isLikeLoading,
  };
}
