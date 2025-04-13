import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageSquare, Star, ThumbsUp } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useBookDetails, useReviewDialog } from './hooks';

interface ReviewComment {
  id: number;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
}

export function BookReviews() {
  const { book } = useBookDetails();
  const { handleOpenReviewDialog } = useReviewDialog();

  if (!book) return null;

  const reviews = book.reviews || [];
  const displayReviews = reviews.slice(0, 10);

  // 리뷰 상태 관리
  const [likedReviews, setLikedReviews] = useState<Record<number, boolean>>({});
  const [reviewLikes, setReviewLikes] = useState<Record<number, number>>(
    Object.fromEntries(reviews.map(review => [review.id, review.likes]))
  );
  const [expandedComments, setExpandedComments] = useState<
    Record<number, boolean>
  >({});
  const [commentText, setCommentText] = useState<string>('');

  // 샘플 댓글 데이터
  const sampleComments: Record<number, ReviewComment[]> = {};
  reviews.forEach(review => {
    sampleComments[review.id] = [
      {
        id: 1,
        user: {
          name: '김독서',
          avatar: 'https://i.pravatar.cc/150?u=user1',
        },
        content:
          '정말 공감되는 리뷰입니다. 저도 이 책을 읽고 비슷한 생각을 했어요.',
        date: '2023년 12월 15일',
      },
      {
        id: 2,
        user: {
          name: '박문학',
          avatar: 'https://i.pravatar.cc/150?u=user2',
        },
        content:
          '이 부분에 대해 조금 다른 생각이 있는데, 저는 작가의 의도가 그보다 더 복잡하다고 생각해요.',
        date: '2023년 12월 16일',
      },
    ];
  });

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

  // 댓글 토글 핸들러
  const toggleComments = (reviewId: number) => {
    setExpandedComments(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // 댓글 제출 핸들러
  const handleSubmitComment = (reviewId: number) => {
    if (!commentText.trim()) return;

    alert(`댓글이 추가되었습니다: "${commentText}"`);
    setCommentText('');
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
              <div
                key={review.id}
                className="rounded-2xl border border-gray-200 bg-white p-4"
              >
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
                    </div>

                    <p className="mt-3 text-base leading-relaxed whitespace-pre-line text-gray-800">
                      {review.content}
                    </p>

                    <div className="mt-3 flex items-center gap-4">
                      <button
                        className={`flex cursor-pointer items-center gap-1.5 text-sm ${likedReviews[review.id] ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={() => handleLike(review.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="font-medium">
                          {reviewLikes[review.id] || review.likes}
                        </span>
                      </button>
                      <div className="h-4 border-r border-gray-200"></div>
                      <button
                        className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => toggleComments(review.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">{review.comments}</span>
                      </button>
                    </div>

                    {/* 댓글 영역 */}
                    {expandedComments[review.id] && (
                      <div className="mt-5 space-y-4">
                        {/* 댓글 입력 */}
                        <div className="flex items-start pl-3">
                          <Avatar className="h-7 w-7 flex-shrink-0 border-0">
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              U
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-2 flex-1">
                            <div className="flex gap-2">
                              <Input
                                placeholder="댓글을 입력하세요..."
                                className="h-9 flex-1 rounded-lg border-gray-200 bg-white text-sm"
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmitComment(review.id);
                                  }
                                }}
                              />
                              <Button
                                onClick={() => handleSubmitComment(review.id)}
                                className="h-9 rounded-lg bg-gray-900 px-3 text-white hover:bg-gray-800"
                                disabled={!commentText.trim()}
                              >
                                등록
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* 댓글 목록 */}
                        <div className="mt-2 space-y-2 pl-3">
                          {sampleComments[review.id]?.length > 0 ? (
                            sampleComments[review.id]?.map(comment => (
                              <div key={comment.id} className="flex gap-2 pb-1">
                                <Avatar className="h-7 w-7 flex-shrink-0 border-0">
                                  <AvatarImage
                                    src={comment.user.avatar}
                                    alt={comment.user.name}
                                  />
                                  <AvatarFallback className="bg-gray-200 text-gray-700">
                                    {comment.user.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 rounded-xl bg-gray-50 p-2.5">
                                  <div className="mb-0.5 flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900">
                                      {comment.user.name}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                      {comment.date}
                                    </span>
                                  </div>
                                  <p className="text-[15px] leading-relaxed text-gray-700">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="py-3 text-center text-sm text-gray-500">
                              아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm text-gray-500">아직 리뷰가 없습니다</p>
          <Button
            variant="outline"
            className="mt-3 rounded-full text-sm font-medium"
            onClick={() => handleOpenReviewDialog()}
          >
            첫 리뷰를 작성해보세요
          </Button>
        </div>
      )}
    </div>
  );
}
