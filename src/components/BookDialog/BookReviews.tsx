import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageSquare, Star, ThumbsUp } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { BookDetails } from './types';

interface BookReviewsProps {
  book: BookDetails;
  onOpenReviewDialog: () => void;
}

export function BookReviews({ book, onOpenReviewDialog }: BookReviewsProps) {
  const reviews = book.reviews || [];
  const displayReviews = reviews.slice(0, 10);

  // 좋아요 상태 관리
  const [likedReviews, setLikedReviews] = useState<Record<number, boolean>>({});
  const [reviewLikes, setReviewLikes] = useState<Record<number, number>>(
    Object.fromEntries(reviews.map(review => [review.id, review.likes]))
  );

  // 날짜 포맷팅 함수
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'PPP', { locale: ko });
    } catch (error) {
      return dateStr;
    }
  };

  // 좋아요 핸들러
  const handleLike = (reviewId: number) => {
    setLikedReviews(prev => {
      const isLiked = prev[reviewId] || false;
      return { ...prev, [reviewId]: !isLiked };
    });

    setReviewLikes(prev => {
      const currentLikes = prev[reviewId] || 0;
      const liked = likedReviews[reviewId] || false;
      return {
        ...prev,
        [reviewId]: liked ? currentLikes - 1 : currentLikes + 1,
      };
    });
  };

  return (
    <div className="space-y-5">
      {displayReviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.length > 10 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                모든 리뷰 보기
              </Button>
            </div>
          )}
          <div className="space-y-4">
            {displayReviews.map(review => (
              <div key={review.id} className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={review.user.avatar}
                      alt={review.user.name}
                    />
                    <AvatarFallback>
                      {review.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900">
                        {review.user.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.date)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(review.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="mt-3 text-base leading-relaxed whitespace-pre-line text-gray-800">
                      {review.content}
                    </p>

                    <div className="mt-3 flex items-center gap-4">
                      <button
                        className={`flex items-center gap-1.5 text-sm ${likedReviews[review.id] ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={() => handleLike(review.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="font-medium">
                          {reviewLikes[review.id] || review.likes}
                        </span>
                      </button>
                      <div className="h-4 border-r border-gray-200"></div>
                      <button
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => alert('댓글 기능 준비 중입니다.')}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">{review.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-gray-50 p-5 text-center">
          <p className="text-sm text-gray-500">아직 리뷰가 없습니다</p>
          <Button
            variant="outline"
            className="mt-3 rounded-full text-sm font-medium"
            onClick={onOpenReviewDialog}
          >
            첫 리뷰를 작성해보세요
          </Button>
        </div>
      )}
    </div>
  );
}
