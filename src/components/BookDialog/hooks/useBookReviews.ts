import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { getBookReviews, likeReview, unlikeReview } from '@/apis/review';
import { Review, ReviewSortType, ReviewsResponse } from '@/apis/review/types';
import { bookReviewSortAtom } from '@/atoms/book';
import { useBookDetails } from './useBookDetails';

export function useBookReviews() {
  const { book } = useBookDetails();
  const bookId = book?.id || 0;
  const [sort, setSort] = useAtom(bookReviewSortAtom); // Jotai atom 사용
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
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['book-reviews', bookId, sort], // sort 변경 시 자동으로 refetch
    queryFn: async ({ pageParam }) => {
      if (!bookId) {
        return {
          data: [],
          meta: { total: 0, page: 1, limit, totalPages: 0, sort },
        } as ReviewsResponse;
      }

      const page = pageParam as number;
      const reviewsData = await getBookReviews(bookId, page, limit, sort);
      return reviewsData;
    },
    getNextPageParam: (lastPage: ReviewsResponse) => {
      const { meta } = lastPage;
      // 다음 페이지가 있는지 확인, 없으면 undefined 반환 (hasNextPage가 false가 됨)
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
    placeholderData: keepPreviousData,
    initialPageParam: 1,
  });

  // 모든 페이지의 리뷰를 하나의 배열로 병합
  const reviews =
    data?.pages.flatMap(page => (Array.isArray(page.data) ? page.data : [])) ||
    [];

  // 메타데이터는 마지막 페이지의 것을 사용
  const meta = data?.pages[data.pages.length - 1]?.meta || null;

  // 정렬 방식 변경 핸들러
  const handleSortChange = useCallback(
    (newSort: ReviewSortType) => {
      if (newSort !== sort) {
        setSort(newSort);
        // 정렬이 변경되면 queryKey가 바뀌어 자동으로 refetch 발생
      }
    },
    [sort, setSort]
  );

  // 더보기 버튼 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 리뷰 좋아요 뮤테이션
  const { mutate: likeMutate, isPending: isLikePending } = useMutation({
    mutationFn: async ({
      reviewId,
      isLiked,
    }: {
      reviewId: number;
      isLiked: boolean;
    }) => {
      if (isLiked) {
        return await unlikeReview(reviewId);
      } else {
        return await likeReview(reviewId);
      }
    },
    onMutate: async ({ reviewId, isLiked }) => {
      // 낙관적 업데이트 - 무한 쿼리 구조에 맞게 수정
      await queryClient.cancelQueries({
        queryKey: ['book-reviews', bookId, sort],
      });

      queryClient.setQueryData(
        ['book-reviews', bookId, sort],
        (oldData: any) => {
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
        }
      );

      return { queryKey: ['book-reviews', bookId, sort] };
    },
    onError: (error, variables, context) => {
      // 에러 발생시 쿼리 무효화하여 데이터 재조회
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });

  // 좋아요 핸들러 - 뮤테이션 사용
  const handleLike = useCallback(
    (reviewId: number, isLiked: boolean) => {
      likeMutate({ reviewId, isLiked });
    },
    [likeMutate]
  );

  return {
    reviews,
    meta,
    status,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,
    handleLike,
    isLikeLoading: isLikePending,
    sort,
    handleSortChange,
  };
}
