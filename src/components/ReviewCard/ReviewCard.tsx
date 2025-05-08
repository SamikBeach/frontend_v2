import { AuthDialog } from '@/components/Auth/AuthDialog';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useDialogQuery } from '@/hooks/useDialogQuery';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CommentSection } from './components';
import { ReviewActions } from './components/ReviewActions';
import { ReviewContent } from './components/ReviewContent';
import { ReviewDialogHandler } from './components/ReviewDialogHandler';
import { ReviewHeader } from './components/ReviewHeader';
import {
  useCommentLike,
  useReviewComments,
  useReviewLike,
  useReviewMutations,
  useReviewState,
} from './hooks';
import { ExtendedReviewResponseDto, ReviewCardProps } from './types';
import { formatDate } from './utils';

export function ReviewCard({ review, isDetailed }: ReviewCardProps) {
  // Cast to our extended type
  const extendedReview = review as ExtendedReviewResponseDto;

  // 검색 파라미터에서 commentId 가져오기 (알림으로부터 이동한 경우)
  const searchParams = useSearchParams();
  const highlightedCommentId = searchParams?.get('commentId')
    ? parseInt(searchParams.get('commentId')!, 10)
    : null;
  const commentSectionRef = useRef<HTMLDivElement>(null);

  // 현재 사용자 정보 가져오기
  const currentUser = useCurrentUser();

  // AuthDialog 상태 추가
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Book 다이얼로그 쿼리 사용
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });

  // 현재 사용자가 리뷰 작성자인지 확인
  const isAuthor = currentUser?.id === review.author.id;

  // 상태 관리 훅 사용 - 메인 컴포넌트에서만 사용
  // 상세 페이지에서 오면서 commentId가 있으면 댓글 섹션 자동 열기
  const reviewState = useReviewState(extendedReview, !!highlightedCommentId);

  // Review 좋아요 관련 훅
  const { handleLikeToggle, isLoading: isLikeLoading } = useReviewLike();

  // 댓글 좋아요 관련 훅
  const { handleLikeToggle: handleCommentLikeToggle } = useCommentLike();

  // 댓글 관련 훅
  const {
    comments,
    commentText,
    setCommentText,
    handleAddComment,
    handleDeleteComment,
    isLoading: isCommentLoading,
    refetch: refetchComments,
  } = useReviewComments(review.id, reviewState.showComments);

  // 뮤테이션 훅 사용
  const { handleEditReview, handleDeleteReview, handleCreateReview } =
    useReviewMutations({
      review: extendedReview,
      currentUserId: currentUser?.id,
      onUpdateSuccess: () => {
        reviewState.handleEditModeToggle(false);
        reviewState.setReviewDialogOpen(false);
        reviewState.setIsSubmitting(false);
      },
      onDeleteSuccess: () => {
        reviewState.setDeleteDialogOpen(false);
      },
      onCreateSuccess: () => {
        reviewState.setReviewDialogOpen(false);
        reviewState.setIsSubmitting(false);
      },
    });

  // 알림에서 들어온 경우 댓글 섹션 열고 해당 댓글로 스크롤
  useEffect(() => {
    if (
      isDetailed &&
      highlightedCommentId &&
      reviewState.showComments &&
      comments.length > 0
    ) {
      // 댓글 목록이 로드되면 해당 댓글 찾기
      const timer = setTimeout(() => {
        const highlightedCommentElement = document.getElementById(
          `comment-${highlightedCommentId}`
        );
        if (highlightedCommentElement && commentSectionRef.current) {
          highlightedCommentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100); // 약간의 지연 후 스크롤 실행

      return () => clearTimeout(timer);
    }
  }, [
    isDetailed,
    highlightedCommentId,
    reviewState.showComments,
    comments.length,
  ]);

  // 리뷰 편집 모드 핸들러
  const handleEditReviewClick = () => {
    if (review.type === 'review') {
      reviewState.setReviewDialogOpen(true);
    } else {
      reviewState.handleEditModeToggle(true);
    }
    reviewState.setEditedContent(extendedReview.content);
    reviewState.handleTypeChange(extendedReview.type);
    reviewState.handleRatingChange(
      extendedReview.rating ||
        (extendedReview.userRating
          ? (extendedReview.userRating.rating as number)
          : 0)
    );
  };

  // 리뷰 다이얼로그 제출 핸들러
  const handleReviewDialogSubmit = async (rating: number, content: string) => {
    reviewState.setIsSubmitting(true);

    try {
      // 별점 입력 확인 (필수)
      if (rating <= 0) {
        reviewState.showAlert(
          '별점을 입력해주세요',
          '별점은 필수 입력 항목입니다.'
        );
        reviewState.setIsSubmitting(false);
        return;
      }

      // 변경 사항이 있는지 확인
      const originalRating =
        extendedReview.rating ||
        (extendedReview.userRating
          ? (extendedReview.userRating.rating as number)
          : 0);
      const hasRatingChanged = rating !== originalRating;
      const hasContentChanged = content !== extendedReview.content;

      // 변경 사항이 없으면 API 호출 없이 바로 종료
      if (!hasRatingChanged && !hasContentChanged) {
        reviewState.setReviewDialogOpen(false);
        reviewState.setIsSubmitting(false);
        return;
      }

      // 1. 책이 선택된 경우
      if (reviewState.selectedBook) {
        // 리뷰 생성 모드 여부 확인
        const isCreateMode = !extendedReview.content && content.trim();

        if (isCreateMode) {
          if (hasRatingChanged) {
            // 별점이 변경되었을 때만 별점과 함께 리뷰 생성
            await handleCreateReview({
              content,
              type: reviewState.editedType,
              rating,
              selectedBook: reviewState.selectedBook,
            });
          } else {
            // 별점이 변경되지 않았다면 리뷰만 생성 (rating 파라미터 제외)
            await handleCreateReview({
              content,
              type: reviewState.editedType,
              selectedBook: reviewState.selectedBook,
            });
          }
        } else if (hasRatingChanged && hasContentChanged) {
          // 별점과 리뷰 모두 변경된 경우 - 두 API를 모두 호출하고 한 번만 무효화하는 함수 호출
          await handleEditReview({
            content,
            type: reviewState.editedType,
            rating, // 별점 변경 정보 전달
            selectedBook: reviewState.selectedBook,
          });
        } else if (hasRatingChanged) {
          // 별점만 변경된 경우 - handleEditReview를 사용하여 무효화 로직 일원화
          await handleEditReview({
            content,
            type: reviewState.editedType,
            rating,
            selectedBook: reviewState.selectedBook,
          });
        } else if (extendedReview.content && !content.trim()) {
          // 리뷰 내용을 지운 경우 (삭제)
          await handleDeleteReview();
        } else if (hasContentChanged) {
          // 리뷰 내용만 변경된 경우
          await handleEditReview({
            content,
            type: reviewState.editedType,
            selectedBook: reviewState.selectedBook,
          });
        }
      }

      // 작업 완료 후 다이얼로그 닫기
      reviewState.setReviewDialogOpen(false);
      reviewState.setIsSubmitting(false);
    } catch (error) {
      console.error('리뷰/별점 업데이트 실패:', error);
      reviewState.setIsSubmitting(false);
    }
  };

  // 인라인 리뷰 수정 저장 핸들러
  const handleSaveEdit = async () => {
    // 리뷰 타입이면서 책이 선택되지 않은 경우 알림 표시
    if (reviewState.editedType === 'review') {
      if (!reviewState.selectedBook) {
        reviewState.showAlert(
          '책을 선택해주세요',
          '리뷰를 작성하려면 책을 선택해야 합니다.'
        );
        return;
      }

      // 별점 필수 입력 확인
      if (reviewState.editedRating === 0) {
        reviewState.showAlert(
          '별점을 입력해주세요',
          '별점은 필수 입력 항목입니다.'
        );
        return;
      }
    }

    // 변경 사항이 있는지 확인
    const originalRating =
      extendedReview.rating ||
      (extendedReview.userRating
        ? (extendedReview.userRating.rating as number)
        : 0);
    const hasRatingChanged = reviewState.editedRating !== originalRating;
    const hasContentChanged =
      reviewState.editedContent !== extendedReview.content;
    const hasTypeChanged = reviewState.editedType !== extendedReview.type;

    // 변경 사항이 없으면 API 호출 없이 바로 종료
    if (!hasRatingChanged && !hasContentChanged && !hasTypeChanged) {
      reviewState.handleEditModeToggle(false);
      return;
    }

    reviewState.setIsSubmitting(true);

    try {
      // 리뷰 타입인 경우
      if (reviewState.editedType === 'review' && reviewState.selectedBook) {
        // 내용 변경과 별점 변경이 함께 이루어진 경우
        if (hasRatingChanged && (hasContentChanged || hasTypeChanged)) {
          // 별점과 리뷰 모두 변경된 경우 - 두 API를 모두 호출하고 한 번만 무효화하는 함수 호출
          await handleEditReview({
            content: reviewState.editedContent,
            type: reviewState.editedType,
            rating: reviewState.editedRating, // 별점 변경 정보 전달
            selectedBook: reviewState.selectedBook,
          });
          reviewState.handleEditModeToggle(false);
        } else if (hasRatingChanged) {
          // 별점만 변경된 경우 - handleEditReview를 사용하여 무효화 로직 일원화
          await handleEditReview({
            content: reviewState.editedContent,
            type: reviewState.editedType,
            rating: reviewState.editedRating,
            selectedBook: reviewState.selectedBook,
          });
          reviewState.handleEditModeToggle(false);
        } else if (
          extendedReview.content &&
          !reviewState.editedContent.trim()
        ) {
          // 리뷰 내용을 지운 경우 (삭제)
          await handleDeleteReview();
          reviewState.handleEditModeToggle(false);
        } else if (hasContentChanged || hasTypeChanged) {
          // 리뷰 내용 또는 타입만 변경된 경우
          await handleEditReview({
            content: reviewState.editedContent,
            type: reviewState.editedType,
            selectedBook: reviewState.selectedBook,
          });
          reviewState.handleEditModeToggle(false);
        } else {
          // 내용이 없거나 변경 사항이 없으면 수정 모드만 종료
          reviewState.handleEditModeToggle(false);
        }
      }
      // 리뷰 타입이 아닌 경우 (일반 리뷰)
      else if (
        reviewState.editedContent.trim() &&
        (hasContentChanged || hasTypeChanged)
      ) {
        // 내용이나 타입에 변경이 있는 경우에만 업데이트
        await handleEditReview({
          content: reviewState.editedContent,
          type: reviewState.editedType,
          selectedBook: reviewState.selectedBook,
        });
        reviewState.handleEditModeToggle(false);
      }
      // 기존에 내용이 있었는데 내용을 지운 경우 리뷰 삭제
      else if (extendedReview.content && !reviewState.editedContent.trim()) {
        await handleDeleteReview();
        reviewState.handleEditModeToggle(false);
      } else {
        // 내용이 없거나 변경 사항이 없으면 수정 모드만 종료
        reviewState.handleEditModeToggle(false);
      }
    } finally {
      reviewState.setIsSubmitting(false);
    }
  };

  // 좋아요 핸들러 - 낙관적 UI 업데이트 적용 (비로그인 시 AuthDialog 표시 추가)
  const handleLike = async () => {
    // 로그인하지 않은 경우 AuthDialog 표시
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    // 낙관적 UI 업데이트
    reviewState.setIsLiked(!reviewState.isLiked);
    reviewState.setLikeCount((prev: number) =>
      reviewState.isLiked ? (prev || 0) - 1 : (prev || 0) + 1
    );

    try {
      // API 호출
      await handleLikeToggle(review.id, reviewState.isLiked || false);
    } catch (error) {
      // 에러 발생 시 UI 되돌리기
      reviewState.setIsLiked(reviewState.isLiked);
      reviewState.setLikeCount(reviewState.likeCount);
      console.error('좋아요 처리 중 오류:', error);
    }
  };

  // 댓글 추가 핸들러 커스텀 - 비로그인 시 AuthDialog 표시 추가
  const handleSubmitComment = async () => {
    // 로그인하지 않은 경우 AuthDialog 표시
    if (!currentUser) {
      setAuthDialogOpen(true);
      return;
    }

    await handleAddComment();
    // 댓글 추가 후 댓글 목록 표시
    reviewState.setShowComments(true);
  };

  // Book dialog 열기 핸들러
  const handleBookClick = () => {
    if (review.books && review.books.length > 0) {
      const book = review.books[0];
      // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
      const bookIsbn = (book as any).isbn13 || (book as any).isbn || '';
      openBookDialog(bookIsbn);
    }
  };

  // 댓글 토글 핸들러
  const handleToggleComments = () => {
    const newShowComments = reviewState.handleToggleComments();

    // 댓글 목록을 펼칠 때 데이터가 최신 상태인지 확인
    if (newShowComments) {
      refetchComments();
    }
  };

  // ReviewComments가 받는 currentUser 타입에 맞게 수정
  const getUserForComments = () => {
    if (!currentUser) {
      return {
        id: 0,
        name: 'guest',
        username: 'guest',
        avatar: undefined,
      };
    }

    return {
      id: currentUser.id,
      name: currentUser.username || 'guest',
      username: currentUser.username || 'guest',
      avatar: currentUser.profileImage || undefined,
    };
  };

  return (
    <>
      <Card className="w-full overflow-hidden border-gray-200 shadow-none">
        <CardHeader className="p-5 pb-3">
          <ReviewHeader
            review={extendedReview}
            isAuthor={isAuthor}
            isDropdownOpen={reviewState.isDropdownOpen}
            setIsDropdownOpen={reviewState.setIsDropdownOpen}
            onEdit={handleEditReviewClick}
            onDelete={() => reviewState.setDeleteDialogOpen(true)}
          />
        </CardHeader>
        <CardContent className="space-y-4 px-5 pt-0 pb-4">
          <ReviewContent
            review={extendedReview}
            isEditMode={reviewState.isEditMode}
            displayContent={reviewState.displayContent}
            isLongContent={reviewState.isLongContent}
            expanded={reviewState.expanded}
            setExpanded={reviewState.setExpanded}
            editedContent={reviewState.editedContent}
            setEditedContent={reviewState.setEditedContent}
            editedType={reviewState.editedType}
            editedRating={reviewState.editedRating}
            selectedBook={reviewState.selectedBook}
            onTypeChange={reviewState.handleTypeChange}
            onRatingChange={reviewState.handleRatingChange}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={() => reviewState.handleEditModeToggle(false)}
            onBookDialogOpen={reviewState.handleBookDialogOpen}
            onRemoveSelectedBook={reviewState.handleRemoveSelectedBook}
            onBookClick={handleBookClick}
          />
        </CardContent>
        <Separator className="bg-gray-100" />
        {!reviewState.isEditMode &&
          extendedReview.activityType !== 'rating' && (
            <CardFooter className="flex flex-col gap-4 px-5 py-3">
              <ReviewActions
                isLiked={reviewState.isLiked || false}
                likesCount={reviewState.likeCount || 0}
                commentCount={review.commentCount || 0}
                showComments={reviewState.showComments}
                isLikeLoading={isLikeLoading}
                onLike={handleLike}
                onToggleComments={handleToggleComments}
              />

              {/* 댓글 섹션 */}
              {reviewState.showComments && comments && (
                <div ref={commentSectionRef} className="w-full min-w-0">
                  <CommentSection
                    comments={comments}
                    formatDate={formatDate}
                    currentUser={getUserForComments()}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    isCommentLoading={isCommentLoading}
                    handleSubmitComment={handleSubmitComment}
                    handleDeleteComment={handleDeleteComment}
                    handleCommentLikeToggle={handleCommentLikeToggle}
                    highlightedCommentId={highlightedCommentId}
                  />
                </div>
              )}
            </CardFooter>
          )}
      </Card>

      {/* 다이얼로그 핸들러 컴포넌트 */}
      <ReviewDialogHandler
        // 알림 다이얼로그
        alertDialogOpen={reviewState.alertDialogOpen}
        setAlertDialogOpen={reviewState.setAlertDialogOpen}
        alertTitle={reviewState.alertTitle}
        alertMessage={reviewState.alertMessage}
        // 삭제 다이얼로그
        deleteDialogOpen={reviewState.deleteDialogOpen}
        setDeleteDialogOpen={reviewState.setDeleteDialogOpen}
        onDeleteConfirm={handleDeleteReview}
        isRatingActivity={extendedReview.activityType === 'rating'}
        // 책 선택 다이얼로그
        bookDialogOpen={reviewState.bookDialogOpen}
        setBookDialogOpen={reviewState.setBookDialogOpen}
        onBookSelect={reviewState.handleBookSelect}
        // 리뷰 편집 다이얼로그
        reviewDialogOpen={reviewState.reviewDialogOpen}
        setReviewDialogOpen={reviewState.setReviewDialogOpen}
        selectedBookTitle={reviewState.selectedBook?.title || '리뷰 수정'}
        initialContent={reviewState.editedContent}
        initialRating={reviewState.editedRating}
        isSubmitting={reviewState.isSubmitting}
        onReviewSubmit={handleReviewDialogSubmit}
      />

      {/* 로그인 다이얼로그 추가 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
