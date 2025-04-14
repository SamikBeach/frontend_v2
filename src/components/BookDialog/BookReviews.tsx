import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageSquare, Star, ThumbsUp } from 'lucide-react';
import { Suspense } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useBookReviews, useReviewDialog } from './hooks';
import { useReviewComments } from './hooks/useReviewComments';

interface ReviewComment {
  id: number;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
}

// 날짜 포맷팅 함수
export const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, 'PPP', { locale: ko });
  } catch (error) {
    return dateStr;
  }
};

// 리뷰 댓글 컴포넌트
function ReviewComments({ reviewId }: { reviewId: number }) {
  const {
    comments,
    commentText,
    isSubmitting,
    handleCommentTextChange,
    handleSubmitComment,
    handleDeleteComment,
  } = useReviewComments(reviewId);

  return (
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
              onChange={e => handleCommentTextChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <Button
              onClick={handleSubmitComment}
              className="h-9 rounded-lg bg-gray-900 px-3 text-white hover:bg-gray-800"
              disabled={!commentText.trim() || isSubmitting}
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </Button>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-2 space-y-2 pl-3">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-2 pb-1">
              <Avatar className="h-7 w-7 flex-shrink-0 border-0">
                <AvatarImage
                  src={comment.author.profileImage || ''}
                  alt={comment.author.username}
                />
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {comment.author.username[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-xl bg-gray-50 p-2.5">
                <div className="mb-0.5 flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {comment.author.username}
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
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
  );
}

// 에러 폴백 컴포넌트
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
      <p className="text-sm text-red-600">
        리뷰를 불러오는 중 오류가 발생했습니다
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-2 border-red-200 text-red-600 hover:bg-red-100"
        onClick={resetErrorBoundary}
      >
        다시 시도
      </Button>
    </div>
  );
}

// 리뷰 로딩 컴포넌트
function ReviewsLoading() {
  return (
    <div className="space-y-4">
      {[1, 2].map(i => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 bg-white p-4"
        >
          <div className="flex animate-pulse items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200"></div>
              <div className="flex gap-1">
                <div className="h-4 w-4 rounded bg-gray-200"></div>
                <div className="h-4 w-4 rounded bg-gray-200"></div>
                <div className="h-4 w-4 rounded bg-gray-200"></div>
                <div className="h-4 w-4 rounded bg-gray-200"></div>
                <div className="h-4 w-4 rounded bg-gray-200"></div>
              </div>
              <div className="h-16 rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 메인 리뷰 목록 컴포넌트
function ReviewsList() {
  const { handleOpenReviewDialog } = useReviewDialog();
  const { reviews, handleLike, meta } = useBookReviews();

  // 확장된 댓글 상태 관리
  const [expandedComments, setExpandedComments] = useState<
    Record<number, boolean>
  >({});

  // 댓글 토글 핸들러
  const toggleComments = (reviewId: number) => {
    setExpandedComments(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  if (reviews.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-4">
      {meta.total > meta.limit && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={() =>
              window.open(`/book/${reviews[0]?.books[0]?.id}/reviews`, '_blank')
            }
          >
            모든 리뷰 보기
          </Button>
        </div>
      )}
      <div className="space-y-4">
        {reviews.map(review => (
          <div
            key={review.id}
            className="rounded-2xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={review.author.profileImage || ''}
                  alt={review.author.username}
                />
                <AvatarFallback>
                  {review.author.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    {review.author.username}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                {/* 별점 표시는 API에서 가져온 데이터에 없을 수 있음, 향후 수정 */}
                <div className="mt-1 flex items-center">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 3 // 별점 데이터가 없는 경우 기본값
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

                {/* 이미지가 있으면 표시 */}
                {review.images && review.images.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`리뷰 이미지 ${index + 1}`}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-4">
                  <button
                    className={`flex cursor-pointer items-center gap-1.5 text-sm ${review.isLiked ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => handleLike(review.id, review.isLiked)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="font-medium">{review.likeCount}</span>
                  </button>
                  <div className="h-4 border-r border-gray-200"></div>
                  <button
                    className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => toggleComments(review.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-medium">{review.commentCount}</span>
                  </button>
                </div>

                {/* 댓글 영역 */}
                {expandedComments[review.id] && (
                  <ErrorBoundary
                    FallbackComponent={({ error, resetErrorBoundary }) => (
                      <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                        댓글을 불러오는 중 오류가 발생했습니다
                        <Button
                          variant="link"
                          size="sm"
                          className="ml-2 text-red-600 underline"
                          onClick={resetErrorBoundary}
                        >
                          다시 시도
                        </Button>
                      </div>
                    )}
                  >
                    <Suspense
                      fallback={
                        <div className="mt-4 animate-pulse space-y-2">
                          <div className="h-8 w-full rounded-lg bg-gray-200"></div>
                          <div className="h-16 w-full rounded-lg bg-gray-200"></div>
                        </div>
                      }
                    >
                      <ReviewComments reviewId={review.id} />
                    </Suspense>
                  </ErrorBoundary>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 메인 컴포넌트
export function BookReviews() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<ReviewsLoading />}>
        <ReviewsList />
      </Suspense>
    </ErrorBoundary>
  );
}
