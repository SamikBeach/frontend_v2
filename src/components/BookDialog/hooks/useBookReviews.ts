import {
  getBookReviews,
  likeReview,
  Review,
  unlikeReview,
} from '@/apis/review';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useBookDetails } from './useBookDetails';

export function useBookReviews() {
  const { book } = useBookDetails();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  // 리뷰 목록 조회
  const { data } = useSuspenseQuery({
    queryKey: ['book-reviews', book?.id, page, limit],
    queryFn: () =>
      book?.id
        ? getBookReviews(book.id, page, limit)
        : { data: [], meta: { total: 0, page: 1, limit, totalPages: 0 } },
  });

  // 리뷰 좋아요 뮤테이션
  const { mutate: toggleLike } = useMutation({
    mutationFn: async ({
      reviewId,
      isLiked,
    }: {
      reviewId: number;
      isLiked: boolean;
    }) => {
      if (isLiked) {
        await unlikeReview(reviewId);
      } else {
        await likeReview(reviewId);
      }
      return { reviewId, isLiked };
    },
    onMutate: async ({ reviewId, isLiked }) => {
      // 낙관적 업데이트를 위해 기존 데이터 저장
      await queryClient.cancelQueries({ queryKey: ['book-reviews', book?.id] });
      const previousData = queryClient.getQueryData([
        'book-reviews',
        book?.id,
        page,
        limit,
      ]);

      // 낙관적 업데이트 적용
      queryClient.setQueryData(
        ['book-reviews', book?.id, page, limit],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((review: Review) => {
              if (review.id === reviewId) {
                return {
                  ...review,
                  isLiked: !isLiked,
                  likeCount: isLiked
                    ? review.likeCount - 1
                    : review.likeCount + 1,
                };
              }
              return review;
            }),
          };
        }
      );

      return { previousData };
    },
    onError: (error, variables, context) => {
      // 오류 발생 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueryData(
          ['book-reviews', book?.id, page, limit],
          context.previousData
        );
      }
      toast.error('좋아요 처리 중 오류가 발생했습니다.');
    },
    onSettled: () => {
      // 성공 또는 실패 후 데이터 갱신
      queryClient.invalidateQueries({ queryKey: ['book-reviews', book?.id] });
    },
  });

  // 페이지 이동 핸들러
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // 좋아요 토글 핸들러
  const handleLike = useCallback(
    (reviewId: number, isLiked: boolean) => {
      toggleLike({ reviewId, isLiked });
    },
    [toggleLike]
  );

  return {
    reviews: data?.data || [],
    meta: data?.meta || { total: 0, page: 1, limit, totalPages: 0 },
    handlePageChange,
    handleLike,
    currentPage: page,
  };
}
