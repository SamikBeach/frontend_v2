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
      ) : reviews.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-gray-500">인기 게시물이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.slice(0, 2).map(review => (
            <Card
              key={review.id}
              className="group rounded-xl border border-gray-200"
            >
              <Link href={`/community/review/${review.id}`}>
                <CardHeader className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border-0">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${review.id}`}
                        alt={review.authorName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-800">
                        {review.authorName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-medium text-gray-700"
                          style={{
                            backgroundColor: getReviewTypeColor(review.type),
                          }}
                        >
                          {getReviewTypeName(review.type)}
                        </span>
                        <p className="text-xs text-gray-500">
                          {review.authorName} · {formatDate(review.createdAt)}
                        </p>
                      </div>
                      <p className="mt-1 line-clamp-1 text-[15px] font-medium text-gray-900 transition-colors duration-150 group-hover:text-[#3182F6]">
                        {review.content}
                      </p>
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
                      <span>{review.likeCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5 text-gray-400" />
                      <span>{review.commentCount}</span>
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

// 날짜 포맷
function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    return format(dateObj, '오늘 a h시 m분', { locale: ko });
  } else if (diffDays < 2) {
    return format(dateObj, '어제 a h시 m분', { locale: ko });
  } else if (diffDays < 7) {
    return format(dateObj, 'eeee', { locale: ko });
  } else {
    return format(dateObj, 'yyyy년 MM월 dd일', { locale: ko });
  }
}
