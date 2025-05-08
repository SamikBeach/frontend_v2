import { ReviewType } from '@/apis/review/types';
import { ReviewCard } from '@/components/ReviewCard/ReviewCard';
import { ExtendedReviewResponseDto } from '@/components/ReviewCard/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHomePopularReviewsQuery } from '../hooks';

// 인기 리뷰 스켈레톤 컴포넌트
export function PopularReviewsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(2)].map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="mt-4 flex justify-between">
              <div className="flex gap-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function PopularReviewsSection() {
  const router = useRouter();
  const { reviews, isLoading } = useHomePopularReviewsQuery();

  const handleMoreClick = () => {
    router.push('/community');
  };

  return (
    <section className="h-auto p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            커뮤니티 인기글
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-medium text-gray-500 hover:text-gray-900"
          onClick={handleMoreClick}
        >
          더보기
        </Button>
      </div>

      {isLoading ? (
        <PopularReviewsSkeleton />
      ) : (
        <div className="space-y-4">
          {reviews.slice(0, 2).map(review => (
            <ReviewCard
              key={review.id}
              review={review as unknown as ExtendedReviewResponseDto}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// 리뷰 타입에 따른 색상
function getReviewTypeColor(type: ReviewType): string {
  switch (type) {
    case 'general':
      return '#E2E8F0'; // 파스텔 그레이
    case 'discussion':
      return '#FFF8E2'; // 파스텔 옐로우
    case 'review':
      return '#F2E2FF'; // 파스텔 퍼플
    case 'question':
      return '#FFE2EC'; // 파스텔 코럴
    case 'meetup':
      return '#E2FFFC'; // 파스텔 민트
    default:
      return '#E2E8F0';
  }
}

// 리뷰 타입에 따른 이름
function getReviewTypeName(type: ReviewType): string {
  switch (type) {
    case 'general':
      return '일반';
    case 'discussion':
      return '토론';
    case 'review':
      return '리뷰';
    case 'question':
      return '질문';
    case 'meetup':
      return '모임';
    default:
      return '일반';
  }
}
