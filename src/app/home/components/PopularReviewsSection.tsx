import { HomeReviewPreview, ReviewType } from '@/apis/review/types';
import { ReviewCard } from '@/components/ReviewCard/ReviewCard';
import { ExtendedReviewResponseDto } from '@/components/ReviewCard/types';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PopularReviewsSectionProps {
  reviews: HomeReviewPreview[];
  isLoading?: boolean;
}

export function PopularReviewsSection({
  reviews,
  isLoading = false,
}: PopularReviewsSectionProps) {
  const router = useRouter();

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
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSpinner />
        </div>
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
