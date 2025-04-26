import { HomeReviewPreview, ReviewType } from '@/apis/review/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageCircle, ThumbsUp, Users } from 'lucide-react';
import Link from 'next/link';

interface PopularReviewsSectionProps {
  reviews: HomeReviewPreview[];
  isLoading?: boolean;
}

export function PopularReviewsSection({
  reviews,
  isLoading = false,
}: PopularReviewsSectionProps) {
  // 날짜 포맷팅 함수
  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return format(date, 'MM.dd', { locale: ko });
  };

  return (
    <section className="h-auto p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#9935FF]" />
          <h2 className="text-xl font-semibold text-gray-900">
            커뮤니티 인기글
          </h2>
        </div>
        <Link href="/community">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            더보기
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.slice(0, 2).map(review => (
            <Card
              key={review.id}
              className="border border-gray-200 shadow-none transition-colors hover:bg-gray-50"
            >
              <Link href={`/community?review=${review.id}`}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={`https://i.pravatar.cc/150?u=${review.authorName}`}
                          alt={review.authorName}
                        />
                        <AvatarFallback>
                          {review.authorName?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.authorName}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {review.createdAt
                              ? formatDate(review.createdAt)
                              : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pt-0 pb-3">
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {review.content}
                  </p>
                  {review.books && review.books.length > 0 && (
                    <div className="mt-3 flex gap-3 rounded-xl border border-gray-100 bg-[#F9FAFB] p-3">
                      <div className="flex-shrink-0">
                        <img
                          src={review.books[0].coverImage}
                          alt={review.books[0].title}
                          className="h-[70px] w-[45px] rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.books[0].title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {review.books[0].author}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <Separator className="bg-gray-100" />
                <CardFooter className="flex items-center px-4 py-3 text-xs text-gray-500">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="h-3.5 w-3.5 text-gray-400" />
                      <span>{review.likeCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5 text-gray-400" />
                      <span>{review.commentCount || 0}</span>
                    </div>
                  </div>
                </CardFooter>
              </Link>
            </Card>
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
