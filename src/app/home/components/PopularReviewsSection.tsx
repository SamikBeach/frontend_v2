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
    <section className="h-auto p-2 sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Users className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            커뮤니티 인기글
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer text-xs font-medium text-gray-500 hover:text-gray-900 sm:text-sm"
          onClick={handleMoreClick}
        >
          더보기
        </Button>
      </div>

      {isLoading ? (
        <PopularReviewsSkeleton />
      ) : reviews.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-gray-500">인기 커뮤니티 글이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
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
