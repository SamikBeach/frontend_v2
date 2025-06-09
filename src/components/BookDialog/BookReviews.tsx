import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Send,
  Star,
  ThumbsUp,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense, useCallback, useEffect, useState } from 'react';

import { deleteReview, updateComment } from '@/apis/review';
import {
  Review,
  ReviewComment as ReviewCommentType,
} from '@/apis/review/types';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { ReviewDialog } from '@/components/ReviewDialog/ReviewDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
  ResponsiveAlertDialogTrigger,
} from '@/components/ui/responsive-alert-dialog';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { invalidateUserProfileQueries } from '@/utils/query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
import { BookReviewsSkeleton } from './components/common/Skeletons';
import { useBookDetails, useBookReviews, useReviewDialog } from './hooks';
import { useReviewComments } from './hooks/useReviewComments';

// 날짜 포맷팅 함수 (댓글용)
export const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, 'PPP p', { locale: ko });
  } catch {
    return dateStr;
  }
};

// 스마트 날짜 포맷팅 함수 (3일 이내는 상대시간, 이후는 절대시간)
export const formatSmartDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const daysDiff = differenceInDays(now, date);

    // 3일 이내는 상대시간 표시
    if (daysDiff <= 3) {
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    }

    // 3일 이후는 절대시간 표시 (날짜 + 시간)
    return format(date, 'PPP p', { locale: ko });
  } catch {
    return dateStr;
  }
};

// 리뷰의 별점을 가져오는 헬퍼 함수
const getReviewRating = (review: Review): number => {
  // 새로운 API 응답 형식에서 userRating 확인
  const anyReview = review as any;

  // 1. userRating 객체에서 rating 확인
  if (
    anyReview.userRating?.rating !== undefined &&
    typeof anyReview.userRating.rating === 'number'
  ) {
    return anyReview.userRating.rating;
  }

  // 2. 기존 방식: review 객체에 직접 rating 속성이 있는지 확인
  if (anyReview.rating !== undefined && typeof anyReview.rating === 'number') {
    return anyReview.rating;
  }

  // 3. book 객체에 rating이 있는지 확인
  if (anyReview.book?.rating && typeof anyReview.book.rating === 'number') {
    return anyReview.book.rating;
  }

  return 0;
};

// 리뷰 댓글 컴포넌트
function ReviewComments({ reviewId }: { reviewId: number }) {
  const currentUser = useCurrentUser();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const {
    comments,
    commentText,
    isSubmitting,
    isDeleting,
    isLikingComment,
    handleCommentTextChange,
    handleSubmitComment,
    handleDeleteComment,
    handleLikeComment,
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
    onError: () => {
      toast.error('댓글 수정 중 오류가 발생했습니다');
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

  // 로그인 체크 후 댓글 작성 처리
  const handleCommentSubmitWithAuth = () => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }
    handleSubmitComment();
  };

  return (
    <div className="space-y-4">
      {/* 댓글 입력 */}
      <div className="flex items-start pl-3">
        <Avatar
          className="mt-1 h-7 w-7 flex-shrink-0 cursor-pointer border-0"
          asChild
        >
          <Link href={`/profile/${currentUser?.id}`}>
            <AvatarImage
              src={currentUser?.profileImage || undefined}
              alt={currentUser?.username || 'User'}
            />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              {currentUser?.username?.[0] || 'U'}
            </AvatarFallback>
          </Link>
        </Avatar>
        <div className="ml-2 flex-1">
          <div className="flex gap-2">
            <Textarea
              placeholder="댓글을 입력하세요..."
              className="max-h-[150px] min-h-[36px] flex-1 resize-none rounded-lg border-gray-200 bg-white py-2 text-base shadow-none placeholder:text-sm sm:text-sm sm:placeholder:text-sm"
              value={commentText}
              onChange={e => handleCommentTextChange(e.target.value)}
              onKeyDown={e => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  if (commentText.trim() && !isSubmitting) {
                    handleCommentSubmitWithAuth();
                  }
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
              onClick={handleCommentSubmitWithAuth}
              className="h-9 w-9 cursor-pointer rounded-lg bg-green-600 p-0 text-white hover:bg-green-700"
              disabled={!commentText.trim() || isSubmitting}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-2 space-y-2 pl-3">
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="flex gap-2 pb-1">
              <Avatar
                className="mt-1 h-7 w-7 flex-shrink-0 cursor-pointer border-0"
                asChild
              >
                <Link href={`/profile/${comment.author.id}`}>
                  <AvatarImage
                    src={comment.author.profileImage || undefined}
                    alt={comment.author.username}
                  />
                  <AvatarFallback className="text-xs">
                    {comment.author.username.charAt(0)}
                  </AvatarFallback>
                </Link>
              </Avatar>
              <div className="flex-1 rounded-xl bg-gray-50 p-2.5">
                {editingCommentId === comment.id ? (
                  // 댓글 수정 폼
                  <div className="space-y-2">
                    <Textarea
                      value={editCommentText}
                      onChange={e => setEditCommentText(e.target.value)}
                      className="max-h-[150px] min-h-[36px] w-full resize-none rounded-lg border-gray-200 bg-white py-2 text-base shadow-none placeholder:text-sm sm:text-sm sm:placeholder:text-sm"
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
                          if (
                            editCommentText.trim() &&
                            !updateCommentMutation.isPending
                          ) {
                            handleUpdateComment(comment.id);
                          }
                        }
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <div className="mr-auto pl-1 text-xs text-gray-500">
                        {navigator.platform.includes('Mac')
                          ? 'Cmd+Enter'
                          : 'Ctrl+Enter'}
                        로 저장
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 cursor-pointer rounded-md border-gray-200 px-3 text-xs sm:h-9 sm:px-4"
                        onClick={handleCancelEditComment}
                      >
                        취소
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 w-8 cursor-pointer rounded-md bg-green-600 p-0 text-white hover:bg-green-700 sm:h-9 sm:w-9"
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={updateCommentMutation.isPending}
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 일반 댓글 표시
                  <>
                    <div className="mb-0.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profile/${comment.author.id}`}
                          className="cursor-pointer text-sm font-medium text-gray-900 hover:underline"
                        >
                          {comment.author.username}
                        </Link>
                        <span className="text-xs text-gray-500">
                          {formatSmartDate(comment.createdAt)}
                        </span>
                      </div>
                      {isMyComment(comment) && (
                        <ResponsiveDropdownMenu>
                          <ResponsiveDropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 cursor-pointer p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </ResponsiveDropdownMenuTrigger>
                          <ResponsiveDropdownMenuContent
                            align="end"
                            className="w-36"
                          >
                            <ResponsiveDropdownMenuItem
                              className="flex cursor-pointer items-center gap-2 text-sm"
                              onSelect={() => handleStartEditComment(comment)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              수정하기
                            </ResponsiveDropdownMenuItem>
                            <ResponsiveAlertDialog>
                              <ResponsiveAlertDialogTrigger asChild>
                                <ResponsiveDropdownMenuItem
                                  className="flex cursor-pointer items-center gap-2 text-sm text-red-500 hover:text-red-500 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-500"
                                  onSelect={e => e.preventDefault()}
                                >
                                  <Trash className="h-3.5 w-3.5 text-red-500" />
                                  삭제하기
                                </ResponsiveDropdownMenuItem>
                              </ResponsiveAlertDialogTrigger>
                              <ResponsiveAlertDialogContent>
                                <ResponsiveAlertDialogHeader>
                                  <ResponsiveAlertDialogTitle>
                                    댓글 삭제
                                  </ResponsiveAlertDialogTitle>
                                  <ResponsiveAlertDialogDescription>
                                    이 댓글을 정말 삭제하시겠습니까? 이 작업은
                                    되돌릴 수 없습니다.
                                  </ResponsiveAlertDialogDescription>
                                </ResponsiveAlertDialogHeader>
                                <ResponsiveAlertDialogFooter drawerClassName="flex flex-col-reverse gap-2">
                                  <ResponsiveAlertDialogCancel className="cursor-pointer">
                                    취소
                                  </ResponsiveAlertDialogCancel>
                                  <ResponsiveAlertDialogAction
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    className="bg-red-500 text-white hover:bg-red-600"
                                    drawerClassName="bg-red-500 text-white hover:bg-red-600"
                                  >
                                    {isDeleting ? '삭제 중...' : '삭제'}
                                  </ResponsiveAlertDialogAction>
                                </ResponsiveAlertDialogFooter>
                              </ResponsiveAlertDialogContent>
                            </ResponsiveAlertDialog>
                          </ResponsiveDropdownMenuContent>
                        </ResponsiveDropdownMenu>
                      )}
                    </div>
                    <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-700">
                      {comment.content}
                    </p>

                    {/* 좋아요 버튼 */}
                    <div className="mt-1 flex justify-start">
                      <button
                        onClick={() =>
                          handleLikeComment(
                            comment.id,
                            comment.isLiked || false
                          )
                        }
                        disabled={isLikingComment}
                        className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors ${
                          comment.isLiked
                            ? 'bg-green-50 text-green-600'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp
                          className={`h-3 w-3 ${comment.isLiked ? 'fill-green-600' : ''}`}
                        />
                        <span>{comment.likeCount || 0}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="py-3 text-center text-sm text-gray-500">
            아직 댓글이 없습니다. 첫번째 댓글을 남겨보세요.
          </p>
        )}
      </div>

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
}

// 에러 폴백 컴포넌트
function ErrorFallback({
  error: _,
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
        className="mt-2 cursor-pointer border-red-200 text-red-600 hover:bg-red-100"
        onClick={resetErrorBoundary}
      >
        다시 시도
      </Button>
    </div>
  );
}

// 리뷰 텍스트 컴포넌트 (더보기 기능 포함)
function ReviewText({
  content,
  reviewId,
  expandedReviews,
  setExpandedReviews,
}: {
  content: string;
  reviewId: number;
  expandedReviews: Record<number, boolean>;
  setExpandedReviews: (
    updater: (prev: Record<number, boolean>) => Record<number, boolean>
  ) => void;
}) {
  const isMobile = useIsMobile();

  // 텍스트가 길면 접어두기 (7줄 기준)
  const lineCount = content.split('\n').length;
  const isLongContent = lineCount > 7 || content.length > 500;
  const expanded = expandedReviews[reviewId] || false;

  const handleExpand = () => {
    if (!expanded) {
      setExpandedReviews(prev => ({
        ...prev,
        [reviewId]: true,
      }));
    }
  };

  const shouldEnableExpand = isLongContent && !expanded;

  return (
    <div
      className={`relative ${shouldEnableExpand && isMobile ? 'cursor-pointer' : ''}`}
      onClick={isMobile && shouldEnableExpand ? handleExpand : undefined}
      role={isMobile && shouldEnableExpand ? 'button' : undefined}
      tabIndex={isMobile && shouldEnableExpand ? 0 : undefined}
      aria-expanded={isMobile && shouldEnableExpand ? expanded : undefined}
    >
      <p
        className={`text-[15px] leading-relaxed whitespace-pre-line text-gray-800 ${
          !expanded ? 'line-clamp-7' : ''
        }`}
      >
        {content}
      </p>
      {shouldEnableExpand && (
        <span
          className="mt-2 inline-block cursor-pointer text-sm text-[#A0AEC0] hover:underline"
          onClick={e => {
            e.stopPropagation();
            handleExpand();
          }}
          tabIndex={0}
          role="button"
          aria-expanded={expanded}
        >
          더 보기
        </span>
      )}
    </div>
  );
}

// 메인 리뷰 목록 컴포넌트
function ReviewsList({
  onReviewCountChange,
}: {
  onReviewCountChange?: (count: number) => void;
}) {
  const currentUser = useCurrentUser();
  const { book } = useBookDetails();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const {
    handleOpenReviewDialog,
    handleOpenEditReviewDialog,
    reviewDialogOpen,
    setReviewDialogOpen,
    userRating,
    isEditMode,
    initialContent,
    handleReviewSubmit,
    isSubmitting,
  } = useReviewDialog();
  const pathname = usePathname();

  const {
    reviews,
    handleLike,
    isLikeLoading,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,
    isLoading,
    meta,
  } = useBookReviews();
  const queryClient = useQueryClient();

  // 리뷰 카운트를 부모에게 전달
  useEffect(() => {
    if (meta?.total !== undefined && onReviewCountChange) {
      onReviewCountChange(meta.total);
    }
  }, [meta?.total, onReviewCountChange]);

  // 좋아요 로딩 상태 추적
  const [likingReviewId, setLikingReviewId] = useState<number | null>(null);

  // 확장된 댓글 상태 관리
  const [expandedComments, setExpandedComments] = useState<
    Record<number, boolean>
  >({});

  // 확장된 리뷰 상태 관리 (더보기 기능)
  const [expandedReviews, setExpandedReviews] = useState<
    Record<number, boolean>
  >({});

  // 리뷰 삭제 mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      // 리뷰 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['book-reviews'] });

      // 프로필 페이지 관련 쿼리 무효화
      invalidateUserProfileQueries(queryClient, pathname, currentUser?.id);

      toast.success('리뷰가 삭제되었습니다');
    },
    onError: () => {
      toast.error('리뷰 삭제 중 오류가 발생했습니다');
    },
  });

  // 댓글 토글 핸들러
  const toggleComments = useCallback((reviewId: number) => {
    setExpandedComments(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  }, []);

  // 사용자가 로그인했는지 확인하고 좋아요 처리 또는 로그인 다이얼로그 표시
  const handleLikeWithAuth = useCallback(
    (reviewId: number, isLiked: boolean) => {
      if (!currentUser) {
        setAuthDialogOpen(true);
        return;
      }

      setLikingReviewId(reviewId);
      handleLike(reviewId, isLiked);

      setTimeout(() => {
        setLikingReviewId(null);
      }, 500);
    },
    [currentUser, handleLike]
  );

  // 댓글 토글 전 로그인 체크
  const handleCommentsToggleWithAuth = useCallback(
    (reviewId: number) => {
      // 로그인 체크 로직 제거하고 바로 토글 기능 실행
      toggleComments(reviewId);
    },
    [toggleComments]
  );

  // 리뷰 작성 또는 수정 전 로그인 체크
  const handleReviewDialogWithAuth = useCallback(() => {
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    handleOpenReviewDialog();
  }, [currentUser, handleOpenReviewDialog]);

  // 작성자 확인
  const isMyReview = (review: Review) => {
    return currentUser?.id === review.author.id;
  };

  // 리뷰 수정 핸들러
  const handleEditReview = (review: Review) => {
    handleOpenEditReviewDialog(review);
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReviewClick = async (reviewId: number) => {
    deleteReviewMutation.mutate(reviewId);
  };

  // 로딩 중일 때는 리뷰 없음 메시지를 표시하지 않습니다
  if (isLoading) {
    return <BookReviewsSkeleton />;
  }

  // 로딩이 완료된 후 리뷰가 없는 경우에만 표시
  if (!reviews || reviews.length === 0) {
    return (
      <div className="px-1 py-6 text-center">
        <p className="text-sm text-gray-500">아직 리뷰가 없습니다</p>
        <Button
          variant="outline"
          className="mt-3 cursor-pointer rounded-full text-sm font-medium"
          onClick={handleReviewDialogWithAuth}
        >
          첫 리뷰를 작성해보세요
        </Button>

        {/* 리뷰 다이얼로그 추가 */}
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          bookTitle={book?.title || ''}
          initialRating={userRating}
          initialContent={initialContent}
          isEditMode={isEditMode}
          onSubmit={handleReviewSubmit}
          isSubmitting={isSubmitting}
        />

        {/* 로그인 다이얼로그 */}
        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div>
        {reviews.map((review: Review, index: number) => {
          // 리뷰 별점 확인
          const rating = getReviewRating(review);

          return (
            <div
              key={review.id}
              className={`${index === 0 ? 'pt-2 pb-6' : 'py-6'} ${
                index !== reviews.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <Avatar
                  className="mt-0.5 h-9 w-9 flex-shrink-0 cursor-pointer"
                  asChild
                >
                  <Link href={`/profile/${review.author.id}`}>
                    <AvatarImage
                      src={review.author.profileImage || undefined}
                      alt={review.author.username}
                    />
                    <AvatarFallback className="text-sm">
                      {review.author.username.charAt(0)}
                    </AvatarFallback>
                  </Link>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profile/${review.author.id}`}
                          className="cursor-pointer text-sm font-medium text-gray-800 hover:underline"
                        >
                          {review.author.username}
                        </Link>
                        <span className="text-xs text-gray-500">
                          {formatSmartDate(review.createdAt)}
                        </span>
                      </div>

                      {/* 별점 표시 UI */}
                      <div className="mt-1 flex items-center">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        {rating > 0 && (
                          <span className="ml-1 text-xs text-gray-500">
                            ({rating})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 내 리뷰일 경우 액션 버튼 */}
                    {isMyReview(review) && (
                      <ResponsiveDropdownMenu>
                        <ResponsiveDropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 cursor-pointer p-0 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </ResponsiveDropdownMenuTrigger>
                        <ResponsiveDropdownMenuContent
                          align="end"
                          className="w-36"
                        >
                          <ResponsiveDropdownMenuItem
                            className="flex cursor-pointer items-center gap-2 text-sm"
                            onSelect={() => handleEditReview(review)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            수정하기
                          </ResponsiveDropdownMenuItem>
                          <ResponsiveAlertDialog>
                            <ResponsiveAlertDialogTrigger asChild>
                              <ResponsiveDropdownMenuItem
                                className="flex cursor-pointer items-center gap-2 text-sm text-red-500 hover:text-red-500 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-500"
                                onSelect={e => e.preventDefault()}
                              >
                                <Trash className="h-3.5 w-3.5 text-red-500" />
                                삭제하기
                              </ResponsiveDropdownMenuItem>
                            </ResponsiveAlertDialogTrigger>
                            <ResponsiveAlertDialogContent>
                              <ResponsiveAlertDialogHeader>
                                <ResponsiveAlertDialogTitle>
                                  리뷰 삭제
                                </ResponsiveAlertDialogTitle>
                                <ResponsiveAlertDialogDescription>
                                  이 리뷰를 정말 삭제하시겠습니까? 이 작업은
                                  되돌릴 수 없습니다.
                                </ResponsiveAlertDialogDescription>
                              </ResponsiveAlertDialogHeader>
                              <ResponsiveAlertDialogFooter drawerClassName="flex flex-col-reverse gap-2">
                                <ResponsiveAlertDialogCancel className="cursor-pointer">
                                  취소
                                </ResponsiveAlertDialogCancel>
                                <ResponsiveAlertDialogAction
                                  onClick={() =>
                                    handleDeleteReviewClick(review.id)
                                  }
                                  className="cursor-pointer bg-red-500 text-white hover:bg-red-600"
                                  drawerClassName="cursor-pointer bg-red-500 text-white hover:bg-red-600"
                                >
                                  {deleteReviewMutation.isPending &&
                                  deleteReviewMutation.variables === review.id
                                    ? '삭제 중...'
                                    : '삭제'}
                                </ResponsiveAlertDialogAction>
                              </ResponsiveAlertDialogFooter>
                            </ResponsiveAlertDialogContent>
                          </ResponsiveAlertDialog>
                        </ResponsiveDropdownMenuContent>
                      </ResponsiveDropdownMenu>
                    )}
                  </div>

                  <div className="mt-2">
                    <ReviewText
                      content={review.content}
                      reviewId={review.id}
                      expandedReviews={expandedReviews}
                      setExpandedReviews={setExpandedReviews}
                    />
                  </div>

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

                  <div className="mt-2.5 flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      className={`flex h-7 cursor-pointer items-center gap-1 rounded-full border px-2.5 ${
                        review.isLiked
                          ? 'border-green-200 bg-green-50 text-green-600 hover:border-green-300 hover:bg-green-100 hover:text-green-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                      onClick={() =>
                        handleLikeWithAuth(review.id, review.isLiked || false)
                      }
                      disabled={likingReviewId === review.id && isLikeLoading}
                    >
                      {review.isLiked ? (
                        <ThumbsUp className="h-3.5 w-3.5 fill-green-600 text-green-600" />
                      ) : (
                        <ThumbsUp className="h-3.5 w-3.5" />
                      )}
                      <span
                        className={`text-xs font-medium ${review.isLiked ? 'text-green-600' : ''}`}
                      >
                        {review.likesCount || 0}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex h-7 cursor-pointer items-center gap-1 rounded-full border border-gray-200 px-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                      onClick={() => handleCommentsToggleWithAuth(review.id)}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">
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
          );
        })}
      </div>

      {/* 리뷰 더보기 버튼 */}
      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="cursor-pointer rounded-full text-sm font-medium"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-800"></span>
                로딩 중...
              </span>
            ) : (
              '리뷰 더 보기'
            )}
          </Button>
        </div>
      )}

      {/* 리뷰 다이얼로그 추가 */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        bookTitle={book?.title || ''}
        initialRating={userRating}
        initialContent={initialContent}
        isEditMode={isEditMode}
        onSubmit={handleReviewSubmit}
        isSubmitting={isSubmitting}
      />

      {/* 로그인 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
}

export function BookReviews({
  onReviewCountChange,
}: {
  onReviewCountChange?: (count: number) => void;
}) {
  // 최상위 Suspense를 그대로 유지하되 여러 번 스켈레톤이 전환되는 깜빡임 현상을 방지
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<BookReviewsSkeleton />}>
        <ReviewsList onReviewCountChange={onReviewCountChange} />
      </Suspense>
    </ErrorBoundary>
  );
}
