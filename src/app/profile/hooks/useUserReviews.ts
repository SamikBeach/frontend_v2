import { ReviewResponseDto, ReviewType } from '@/apis/review/types';
import { ReviewPreviewDto } from '@/apis/user/types';
import { getUserReviews } from '@/apis/user/user';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface UseUserReviewsResult {
  reviews: ReviewResponseDto[];
  isLoading: boolean;
  error: Error | null;
  totalReviews: number;
  currentPage: number;
  totalPages: number;
  fetchNextPage?: () => Promise<any>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

// 미리보기 리뷰를 완전한 리뷰로 변환하는 함수
const transformReviewPreview = (
  review: ReviewPreviewDto
): ReviewResponseDto => {
  return {
    id: review.id,
    content: review.content,
    type: review.type as ReviewType,
    author: {
      id: 0, // API 응답에 없는 데이터이므로 기본값 설정
      username: '',
      email: '',
    },
    images: review.previewImage
      ? [{ id: review.previewImage.id, url: review.previewImage.url }]
      : [],
    books: [],
    likeCount: review.likeCount,
    commentCount: review.commentCount,
    isLiked: false,
    createdAt: review.createdAt,
    updatedAt: new Date(),
  };
};

/**
 * 사용자 리뷰를 로드하는 훅 (페이지네이션 방식)
 */
export function useUserReviews(
  page: number = 1,
  limit: number = 10
): UseUserReviewsResult {
  const params = useParams();
  const userId = Number(params.id);

  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ['user-reviews', userId, page, limit],
    queryFn: async () => {
      return getUserReviews(userId, page, limit);
    },
  });

  return {
    reviews: data?.reviews ? data.reviews.map(transformReviewPreview) : [],
    isLoading,
    error: error as Error | null,
    totalReviews: data?.total || 0,
    currentPage: page,
    totalPages: data?.totalPages || 0,
  };
}

/**
 * 사용자의 특정 타입 리뷰만 로드하는 훅 (페이지네이션 방식)
 */
export function useUserReviewsByType(
  page: number = 1,
  limit: number = 10,
  reviewType: ReviewType | 'all'
): UseUserReviewsResult {
  const params = useParams();
  const userId = Number(params.id);

  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ['user-reviews-by-type', userId, page, limit, reviewType],
    queryFn: async () => {
      const result = await getUserReviews(userId, page, limit);

      // 'all'이 아닌 경우에만 프론트엔드에서 필터링
      if (reviewType !== 'all') {
        const filteredReviews = result.reviews.filter(
          review => review.type === reviewType
        );
        return {
          ...result,
          reviews: filteredReviews,
          total: filteredReviews.length,
          totalPages: Math.ceil(filteredReviews.length / limit) || 1,
        };
      }

      return result;
    },
  });

  return {
    reviews: data?.reviews ? data.reviews.map(transformReviewPreview) : [],
    isLoading,
    error: error as Error | null,
    totalReviews: data?.total || 0,
    currentPage: page,
    totalPages: data?.totalPages || 0,
  };
}

/**
 * 사용자의 특정 타입 리뷰만 로드하는 훅 (무한 스크롤 방식)
 */
export function useUserReviewsInfinite(
  limit: number = 10,
  reviewType: ReviewType | 'all' = 'all'
): UseUserReviewsResult {
  const params = useParams();
  const userId = Number(params.id);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['user-reviews-infinite', userId, limit, reviewType],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getUserReviews(userId, pageParam, limit);

      // 리뷰 데이터 필터링 (프론트엔드에서)
      let filtered = result.reviews;
      if (reviewType !== 'all') {
        filtered = result.reviews.filter(review => review.type === reviewType);
      }

      return {
        ...result,
        reviews: filtered,
        page: pageParam,
        hasNextPage: pageParam < result.totalPages,
      };
    },
    getNextPageParam: lastPage => {
      if (lastPage.hasNextPage) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // 모든 페이지의 리뷰 목록을 하나의 배열로 병합
  const reviews =
    data?.pages.flatMap(
      page => page.reviews?.map(transformReviewPreview) || []
    ) || [];

  // 첫 페이지의 총 리뷰 수 데이터
  const totalReviews = data?.pages[0]?.total || 0;

  return {
    reviews,
    isLoading: status === 'pending',
    error: error as Error | null,
    totalReviews,
    currentPage: data?.pages?.length || 1,
    totalPages: data?.pages[0]?.totalPages || 0,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}
