import { MessageSquare, Star, ThumbsUp } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { BookDetails } from './types';

interface BookReviewsProps {
  book: BookDetails;
  onOpenReviewDialog: () => void;
}

export function BookReviews({ book, onOpenReviewDialog }: BookReviewsProps) {
  const reviews = book.reviews || [];
  const displayReviews = reviews.slice(0, 10);

  return (
    <div className="space-y-5">
      {displayReviews.length > 0 ? (
        <div className="space-y-3">
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
          <div className="space-y-3">
            {displayReviews.map(review => (
              <div key={review.id} className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={review.user.avatar}
                        alt={review.user.name}
                      />
                      <AvatarFallback>
                        {review.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{review.user.name}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Star className="mr-0.5 h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{review.rating.toFixed(1)}</span>
                        </div>
                        <span>·</span>
                        <span>{review.date}</span>
                        {review.user.readCount && (
                          <>
                            <span>·</span>
                            <span>읽은 책 {review.user.readCount}권</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-800">
                  {review.content}
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-full px-2.5 text-gray-600 hover:bg-gray-100"
                  >
                    <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
                    <span>{review.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-full px-2.5 text-gray-600 hover:bg-gray-100"
                  >
                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                    <span>{review.comments}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-gray-50 p-5 text-center">
          <p className="text-sm text-gray-500">아직 리뷰가 없습니다</p>
          <Button
            variant="ghost"
            className="mt-2 text-sm text-gray-700 hover:text-gray-900"
            onClick={onOpenReviewDialog}
          >
            첫 리뷰를 작성해보세요
          </Button>
        </div>
      )}
    </div>
  );
}
