import { ReviewResponseDto, ReviewType } from '@/apis/review/types';
import { ReviewPreviewDto } from '@/apis/user/types';
import { getUserReviews } from '@/apis/user/user';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface UseUserReviewsResult {
  reviews: ReviewResponseDto[];
  isLoading: boolean;
  error: Error | null;
  totalReviews: number;
  currentPage: number;
  totalPages: number;
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
