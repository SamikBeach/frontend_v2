import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Star,
  ThumbsUp,
  Trash,
} from 'lucide-react';
import { Suspense, useCallback, useState } from 'react';

import { deleteReview, updateComment } from '@/apis/review';
import {
  Review,
  ReviewComment as ReviewCommentType,
} from '@/apis/review/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
import { useBookReviews, useReviewDialog } from './hooks';
import { useReviewComments } from './hooks/useReviewComments';

// 날짜 포맷팅 함수
export const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, 'PPP', { locale: ko });
  } catch (error) {
    return dateStr;
  }
};

// 리뷰의 별점을 가져오는 헬퍼 함수
const getReviewRating = (review: Review): number => {
  // @ts-expect-error - rating 속성이 있을 수 있음
  if (review.rating !== undefined) return review.rating;
  return 0;
};

// 리뷰 댓글 컴포넌트
function ReviewComments({ reviewId }: { reviewId: number }) {
  const currentUser = useCurrentUser();
  const {
    comments,
    commentText,
    isSubmitting,
    isDeleting,
    handleCommentTextChange,
    handleSubmitComment,
    handleDeleteComment,
  } = useReviewComments(reviewId);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const queryClient = useQueryClient();

  // 댓글 수정 mutation
  const updateCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => updateComment(commentId, { content }),
    onSuccess: () => {
      // 성공 시 댓글 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
      setEditingCommentId(null);
      setEditCommentText('');
      toast.success('댓글이 수정되었습니다');
    },
    onError: error => {
      toast.error('댓글 수정 중 오류가 발생했습니다');
      console.error('댓글 수정 오류:', error);
    },
  });

  // 댓글 수정 시작
  const handleStartEditComment = (comment: ReviewCommentType) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  // 댓글 수정 완료
  const handleUpdateComment = async (commentId: number) => {
    if (!editCommentText.trim()) {
      toast.error('댓글 내용을 입력해주세요');
      return;
    }

    updateCommentMutation.mutate({ commentId, content: editCommentText });
  };

  // 댓글 작성자 확인
  const isMyComment = (comment: ReviewCommentType) => {
    return currentUser?.id === comment.author.id;
  };

  return (
    <div className="space-y-4">
      {/* 댓글 입력 */}
      <div className="flex items-start pl-3">
        <Avatar className="mt-1 h-7 w-7 flex-shrink-0 border-0">
          <AvatarFallback className="bg-gray-200 text-gray-700">
            {currentUser?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="ml-2 flex-1">
          <div className="flex gap-2">
            <Textarea
              placeholder="댓글을 입력하세요..."
              className="max-h-[150px] min-h-[36px] flex-1 resize-none rounded-lg border-gray-200 bg-white py-2 text-sm shadow-none"
              value={commentText}
              onChange={e => handleCommentTextChange(e.target.value)}
              onKeyDown={e => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
              disabled={isSubmitting}
              rows={1}
              style={{ overflow: 'hidden', height: 'auto' }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
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
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-2 pb-1">
              <Avatar className="mt-1 h-7 w-7 flex-shrink-0 border-0">
                <AvatarImage
                  src={comment.author.profileImage || ''}
                  alt={comment.author.username}
                />
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {comment.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-xl bg-gray-50 p-2.5">
                {editingCommentId === comment.id ? (
                  // 댓글 수정 폼
                  <div className="space-y-2">
                    <Textarea
                      value={editCommentText}
                      onChange={e => setEditCommentText(e.target.value)}
                      className="max-h-[150px] min-h-[36px] w-full resize-none rounded-lg border-gray-200 bg-white py-2 text-sm shadow-none"
                      placeholder="댓글을 수정하세요..."
                      rows={1}
                      style={{ overflow: 'hidden', height: 'auto' }}
                      onInput={e => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                      onKeyDown={e => {
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                          e.preventDefault();
                          handleUpdateComment(comment.id);
                        }
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-md border-gray-200 px-2 text-xs"
                        onClick={handleCancelEditComment}
                      >
                        취소
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 rounded-md bg-gray-900 px-2 text-xs text-white hover:bg-gray-800"
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={updateCommentMutation.isPending}
                      >
                        {updateCommentMutation.isPending
                          ? '저장 중...'
                          : '저장'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 일반 댓글 표시
                  <>
                    <div className="mb-0.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {comment.author.username}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      {isMyComment(comment) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2 text-sm"
                              onClick={() => handleStartEditComment(comment)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              수정하기
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="flex cursor-pointer items-center gap-2 text-sm text-red-500"
                                  onSelect={e => e.preventDefault()}
                                >
                                  <Trash className="h-3.5 w-3.5 text-red-500" />
                                  삭제하기
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    이 댓글을 정말 삭제하시겠습니까? 이 작업은
                                    되돌릴 수 없습니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    className="bg-red-500 text-white hover:bg-red-600"
                                  >
                                    {isDeleting ? '삭제 중...' : '삭제'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-700">
                      {comment.content}
                    </p>
                  </>
                )}
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
  const currentUser = useCurrentUser();
  const { handleOpenReviewDialog } = useReviewDialog();
  const { reviews, handleLike, isLikeLoading } = useBookReviews();
  const queryClient = useQueryClient();

  // 좋아요 로딩 상태 추적
  const [likingReviewId, setLikingReviewId] = useState<number | null>(null);

  // 확장된 댓글 상태 관리
  const [expandedComments, setExpandedComments] = useState<
    Record<number, boolean>
  >({});

  // 리뷰 삭제 mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      // 리뷰 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['book-reviews'] });
      toast.success('리뷰가 삭제되었습니다');
    },
    onError: error => {
      toast.error('리뷰 삭제 중 오류가 발생했습니다');
      console.error('리뷰 삭제 오류:', error);
    },
  });

  // 댓글 토글 핸들러
  const toggleComments = useCallback((reviewId: number) => {
    setExpandedComments(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  }, []);

  // 좋아요 핸들러 (로딩 상태 추적)
  const handleLikeWithState = useCallback(
    (reviewId: number, isLiked: boolean) => {
      setLikingReviewId(reviewId);

      // API 요청
      handleLike(reviewId, isLiked);

      // 일정 시간 후 로딩 상태 해제 (UI 깜빡임 방지)
      setTimeout(() => {
        setLikingReviewId(null);
      }, 500);
    },
    [handleLike]
  );

  // 작성자 확인
  const isMyReview = (review: Review) => {
    return currentUser?.id === review.author.id;
  };

  // 리뷰 수정 핸들러
  const handleEditReview = (review: Review) => {
    handleOpenReviewDialog(getReviewRating(review));
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReviewClick = async (reviewId: number) => {
    deleteReviewMutation.mutate(reviewId);
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="px-1 py-6 text-center">
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
    <div className="space-y-0">
      <div>
        {reviews.map((review: Review, index: number) => (
          <div
            key={review.id}
            className={`py-5 ${
              index !== reviews.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={review.author.profileImage || ''}
                  alt={review.author.username}
                />
                <AvatarFallback className="bg-gray-100">
                  {review.author.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium text-gray-900">
                      {review.author.username}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {/* 내 리뷰일 경우 액션 버튼 */}
                  {isMyReview(review) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 text-sm"
                          onClick={() => handleEditReview(review)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          수정하기
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2 text-sm text-red-500"
                              onSelect={e => e.preventDefault()}
                            >
                              <Trash className="h-3.5 w-3.5 text-red-500" />
                              삭제하기
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
                              <AlertDialogDescription>
                                이 리뷰를 정말 삭제하시겠습니까? 이 작업은
                                되돌릴 수 없습니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteReviewClick(review.id)
                                }
                                className="bg-red-500 text-white hover:bg-red-600"
                              >
                                {deleteReviewMutation.isPending &&
                                deleteReviewMutation.variables === review.id
                                  ? '삭제 중...'
                                  : '삭제'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {/* 별점 표시 - 평점이 있는 경우에만 렌더링 */}
                {getReviewRating(review) > 0 && (
                  <div className="mt-1 flex items-center">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(getReviewRating(review))
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-500">
                      ({getReviewRating(review)})
                    </span>
                  </div>
                )}

                <p className="mt-3 text-gray-700">{review.content}</p>

                {/* 이미지가 있는 경우 표시 */}
                {review.images && review.images.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {review.images.map((image: any) => (
                      <div
                        key={image.id}
                        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md"
                      >
                        <img
                          src={image.url}
                          alt="리뷰 이미지"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    className={`h-8 rounded-full p-0 px-2 ${
                      review.userLiked
                        ? 'text-pink-500 hover:bg-pink-50 hover:text-pink-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() =>
                      handleLikeWithState(review.id, review.userLiked || false)
                    }
                    disabled={likingReviewId === review.id && isLikeLoading}
                  >
                    {review.userLiked ? (
                      <ThumbsUp className="h-4 w-4 fill-pink-500 text-pink-500" />
                    ) : (
                      <ThumbsUp className="h-4 w-4" />
                    )}
                    <span
                      className={`font-medium ${review.userLiked ? 'text-pink-500' : ''}`}
                    >
                      {review.likesCount || 0}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-8 rounded-full p-0 px-2 text-gray-600 hover:bg-gray-50"
                    onClick={() => toggleComments(review.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-medium">
                      {review.commentsCount || 0}
                    </span>
                  </Button>
                </div>

                {/* 댓글 영역 - 댓글이 있는 경우 */}
                {expandedComments[review.id] && (
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense
                      fallback={
                        <div className="mt-4 h-20 animate-pulse rounded-lg bg-gray-100"></div>
                      }
                    >
                      <div className="mt-4">
                        <ReviewComments reviewId={review.id} />
                      </div>
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

export function BookReviews() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<ReviewsLoading />}>
        <ReviewsList />
      </Suspense>
    </ErrorBoundary>
  );
}
