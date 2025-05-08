import { getPopularReviewsForHome } from '@/apis/review/review';
import { HomeReviewPreview, ReviewsResponse } from '@/apis/review/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * 홈 화면에 표시할 인기 리뷰 데이터를 가져오는 훅
 * @param limit 가져올 리뷰 수 (기본값: 4)
 */
export function useHomePopularReviewsQuery(limit: number = 4) {
  const { data, isLoading, error } = useQuery<ReviewsResponse>({
    queryKey: ['home', 'popularReviews', limit],
    queryFn: () => getPopularReviewsForHome(limit),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시
  });

  // 서버 응답에서 reviews를 HomeReviewPreview 형식으로 변환
  const reviews = useMemo<HomeReviewPreview[]>(() => {
    if (!data?.reviews) return [];

    return data.reviews.map(review => ({
      id: review.id,
      content: review.content,
      type: review.type,
      author: review.author,
      authorName: review.author.username,
      previewImage: review.author.profileImage,
      likeCount: review.likeCount,
      commentCount: review.commentCount,
      isLiked: review.isLiked,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      books:
        review.books?.map(book => ({
          ...book,
        })) || [],
      userRating: review.userRating,
      rating:
        review.userRating?.rating ??
        ((review.books?.[0] as any)?.rating
          ? Number((review.books[0] as any).rating)
          : undefined),
      images: review.images || [],
    }));
  }, [data]);

  return {
    reviews,
    isLoading,
    error,
    totalReviews: data?.total || 0,
  };
}
