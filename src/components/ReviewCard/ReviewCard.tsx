import { createOrUpdateRating, deleteRating } from '@/apis/rating/rating';
import { deleteReview, updateReview } from '@/apis/review/review';
import { ReviewType } from '@/apis/review/types';
import { SearchResult } from '@/apis/search/types';
import { AddBookDialog } from '@/app/library/[id]/components';
import { ReviewDialog } from '@/components/ReviewDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useDialogQuery } from '@/hooks/useDialogQuery';
import {
  invalidateUserProfileQueries,
  isCurrentUserProfilePage,
} from '@/utils/query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CommentSection } from './components';
import { BookPreview } from './components/BookPreview';
import { ReviewActions } from './components/ReviewActions';
import { ReviewEditForm } from './components/ReviewEditForm';
import { ReviewHeader } from './components/ReviewHeader';
import { useCommentLike, useReviewComments, useReviewLike } from './hooks';
import { ExtendedReviewResponseDto, ReviewCardProps } from './types';
import { formatDate } from './utils';

export function ReviewCard({ review }: ReviewCardProps) {
  // Cast to our extended type
  const extendedReview = review as ExtendedReviewResponseDto;

  // 현재 사용자 정보 가져오기
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });

  // Review 수정 관련 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(extendedReview.content);
  const [editedType, setEditedType] = useState(extendedReview.type);
  const [editedRating, setEditedRating] = useState<number>(
    extendedReview.rating ||
      (extendedReview.userRating
        ? (extendedReview.userRating.rating as number)
        : 0)
  );
  const [selectedBook, setSelectedBook] = useState<SearchResult | null>(
    review.books && review.books.length > 0
      ? {
          id: review.books[0].id,
          type: 'book',
          isbn: (review.books[0] as any).isbn || '',
          isbn13: (review.books[0] as any).isbn13 || '',
          title: review.books[0].title,
          author: review.books[0].author,
          publisher: review.books[0].publisher,
          image: review.books[0].coverImage,
        }
      : null
  );
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  // ReviewDialog 관련 상태
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // Review 좋아요 관련 훅
  const { handleLikeToggle, isLoading: isLikeLoading } = useReviewLike();
  const [isLiked, setIsLiked] = useState(extendedReview.isLiked);
  const [likeCount, setLikeCount] = useState(extendedReview.likeCount);

  // 댓글 좋아요 관련 훅
  const { handleLikeToggle: handleCommentLikeToggle } = useCommentLike();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 댓글 관련 훅
  const {
    comments,
    commentText,
    setCommentText,
    handleAddComment,
    handleDeleteComment,
    isLoading: isCommentLoading,
    refetch: refetchComments,
  } = useReviewComments(review.id, showComments);

  // 현재 사용자가 리뷰 작성자인지 확인
  const isAuthor = currentUser?.id === review.author.id;

  // 초기 수정 상태 설정
  useEffect(() => {
    if (review) {
      setEditedContent(extendedReview.content);
      setEditedType(extendedReview.type);
      setEditedRating(
        extendedReview.rating ||
          (extendedReview.userRating
            ? (extendedReview.userRating.rating as number)
            : 0)
      );
    }
  }, [review, extendedReview.userRating]);

  // 리뷰 수정 mutation
  const updateReviewMutation = useMutation({
    mutationFn: ({
      id,
      content,
      type,
      bookId,
      isbn,
    }: {
      id: number;
      content: string;
      type: ReviewType;
      bookId?: number;
      isbn?: string;
      rating?: number; // 타입 정의는 유지 (기존 코드 호환성)
    }) => {
      return updateReview(id, {
        content,
        type,
        ...(bookId ? { bookId } : {}),
        ...(isbn ? { isbn } : {}),
        // rating은 전달하지 않음
      });
    },
    onSuccess: (_, variables) => {
      // 모든 리뷰 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['communityReviews'],
        exact: false,
      });

      // 원본 타입과 수정된 타입이 다른 경우 두 타입 모두 무효화
      if (review.type !== variables.type) {
        queryClient.invalidateQueries({
          queryKey: ['review', review.type],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ['review', variables.type],
          exact: false,
        });
      }

      // 단일 리뷰 데이터도 무효화
      queryClient.invalidateQueries({
        queryKey: ['review', review.id],
      });

      // 책 관련 데이터가 변경된 경우 책 데이터도 무효화
      if (variables.isbn) {
        queryClient.invalidateQueries({
          queryKey: ['book-detail', variables.isbn],
        });
      }

      // 프로필 페이지 관련 쿼리 선택적 무효화
      if (isCurrentUserProfilePage(pathname, currentUser?.id)) {
        // 유저 프로필 관련 쿼리 일괄 무효화
        invalidateUserProfileQueries(queryClient, pathname, currentUser?.id);
      }

      toast.success('리뷰가 수정되었습니다.');
      setIsEditMode(false);
      setReviewDialogOpen(false);
    },
    onError: (error: any) => {
      console.error('리뷰 업데이트 실패:', error);
      const errorMessage =
        error.response?.data?.message || '리뷰 수정 중 오류가 발생했습니다.';
      setAlertTitle('오류');
      setAlertMessage(errorMessage);
      setAlertDialogOpen(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // 리뷰 삭제 mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => {
      // 커뮤니티 리뷰 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['communityReviews'],
        exact: false,
      });

      // 프로필 페이지에서 필요한 쿼리 무효화
      if (isCurrentUserProfilePage(pathname, currentUser?.id)) {
        // 유저 프로필 관련 쿼리 일괄 무효화
        invalidateUserProfileQueries(queryClient, pathname, currentUser?.id);
      }

      toast.success('리뷰가 삭제되었습니다.');
    },
    onError: () => {
      toast.error('리뷰 삭제 중 오류가 발생했습니다.');
    },
  });

  // 별점 삭제 mutation
  const deleteRatingMutation = useMutation({
    mutationFn: (id: number) => deleteRating(id),
    onSuccess: () => {
      // 커뮤니티 리뷰 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['communityReviews'],
        exact: false,
      });

      // 프로필 페이지에서 필요한 쿼리 무효화
      if (isCurrentUserProfilePage(pathname, currentUser?.id)) {
        // 유저 프로필 관련 쿼리 일괄 무효화
        invalidateUserProfileQueries(queryClient, pathname, currentUser?.id);
      }

      toast.success('별점이 삭제되었습니다.');
    },
    onError: () => {
      toast.error('별점 삭제 중 오류가 발생했습니다.');
    },
  });

  // 책 선택 대화상자 열기 핸들러
  const handleBookDialogOpen = () => {
    if (editedType === 'review') {
      setBookDialogOpen(true);
    }
  };

  // 책 선택 핸들러
  const handleBookSelect = (book: SearchResult) => {
    setSelectedBook(book);
    setBookDialogOpen(false);
  };

  // 책 선택 제거 핸들러
  const handleRemoveSelectedBook = () => {
    setSelectedBook(null);
    setEditedRating(0);
  };

  // 별점 선택 핸들러
  const handleRatingChange = (newRating: number) => {
    setEditedRating(newRating);
  };

  // 태그 변경 핸들러
  const handleTypeChange = (newType: ReviewType) => {
    setEditedType(newType);
    // 리뷰 태그가 아니면 책과 별점 초기화
    if (newType !== 'review') {
      setSelectedBook(null);
      setEditedRating(0);
    }
  };

  // 리뷰 수정 핸들러
  const handleEditReview = () => {
    if (review.type === 'review') {
      setReviewDialogOpen(true);
    } else {
      setIsEditMode(true);
    }
    setEditedContent(extendedReview.content);
    setEditedType(extendedReview.type);
    setEditedRating(
      extendedReview.rating ||
        (extendedReview.userRating
          ? (extendedReview.userRating.rating as number)
          : 0)
    );
  };

  // 리뷰 다이얼로그 제출 핸들러
  const handleReviewDialogSubmit = async (rating: number, content: string) => {
    setIsSubmitting(true);

    try {
      // 1. 책이 선택된 경우 별점 정보 먼저 등록
      if (selectedBook) {
        const bookId = Number(selectedBook.id);
        const isNegativeBookId = bookId < 0;
        const bookIsbn = selectedBook.isbn13 || selectedBook.isbn || '';

        // 별점 등록 API 호출
        await createOrUpdateRating(
          bookId,
          { rating },
          isNegativeBookId ? bookIsbn : undefined
        );
      }

      // 2. 리뷰 업데이트 호출 (rating 속성은 전달하지 않음)
      await updateReviewMutation.mutateAsync({
        id: review.id,
        content,
        type: editedType,
        ...(selectedBook
          ? {
              bookId: Number(selectedBook.id),
              isbn:
                Number(selectedBook.id) < 0
                  ? selectedBook.isbn13 || selectedBook.isbn || ''
                  : undefined,
            }
          : {}),
      });

      setIsSubmitting(false);
    } catch (error) {
      console.error('리뷰 업데이트 실패:', error);
      setIsSubmitting(false);
    }
  };

  // 인라인 리뷰 수정 저장 핸들러
  const handleSaveEdit = async () => {
    // 내용이 없으면 제출 안함
    if (!editedContent.trim()) return;

    // 리뷰 타입이면서 책이 선택되지 않았거나 별점이 없는 경우 알림 표시
    if (editedType === 'review') {
      if (!selectedBook) {
        setAlertTitle('책을 선택해주세요');
        setAlertMessage('리뷰를 작성하려면 책을 선택해야 합니다.');
        setAlertDialogOpen(true);
        return;
      }

      if (editedRating === 0) {
        setAlertTitle('별점을 입력해주세요');
        setAlertMessage('리뷰를 작성하려면 별점을 입력해야 합니다.');
        setAlertDialogOpen(true);
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // 리뷰 타입이 'review'인 경우
      if (editedType === 'review' && selectedBook) {
        const bookId =
          typeof selectedBook.id === 'number'
            ? selectedBook.id
            : parseInt(String(selectedBook.id), 10);
        const bookIsbn = selectedBook.isbn || selectedBook.isbn13 || '';

        // bookId가 없거나 음수인 경우 -1로 설정하고 반드시 ISBN 전달
        const isNegativeBookId = bookId < 0;
        const finalBookId = isNegativeBookId ? -1 : bookId;

        // 1. 먼저 평점 업데이트
        await createOrUpdateRating(
          finalBookId,
          { rating: editedRating },
          isNegativeBookId ? bookIsbn : undefined
        );

        // 2. 그 다음 리뷰 업데이트 (rating 제외)
        await updateReviewMutation.mutateAsync({
          id: review.id,
          content: editedContent,
          type: editedType,
          bookId: finalBookId,
          isbn: isNegativeBookId ? bookIsbn : undefined,
        });
      } else {
        // 리뷰 타입이 'review'가 아닌 경우 일반 리뷰 업데이트만 수행
        await updateReviewMutation.mutateAsync({
          id: review.id,
          content: editedContent,
          type: editedType,
        });
      }
    } catch (error) {
      console.error('리뷰 업데이트 실패:', error);
      toast.error('리뷰 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedContent(extendedReview.content);
    setEditedType(extendedReview.type);
    setEditedRating(
      extendedReview.rating ||
        (extendedReview.userRating
          ? (extendedReview.userRating.rating as number)
          : 0)
    );
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = () => {
    if (extendedReview.activityType === 'rating') {
      // 별점인 경우 deleteRating API 호출
      deleteRatingMutation.mutate(review.id);
    } else {
      // 일반 리뷰인 경우 deleteReview API 호출
      deleteReviewMutation.mutate(review.id);
    }
    setDeleteDialogOpen(false);
  };

  // 좋아요 핸들러 - 낙관적 UI 업데이트 적용
  const handleLike = async () => {
    // 로그인하지 않은 경우 차단
    if (!currentUser) {
      // 로그인 필요 안내 (필요시 여기에 로그인 모달 열기 등의 코드 추가)
      return;
    }

    // 낙관적 UI 업데이트
    setIsLiked(!isLiked);
    setLikeCount(prev => (isLiked ? (prev || 0) - 1 : (prev || 0) + 1));

    try {
      // API 호출
      await handleLikeToggle(review.id, isLiked || false);
    } catch (error) {
      // 에러 발생 시 UI 되돌리기
      setIsLiked(isLiked);
      setLikeCount(likeCount);
      console.error('좋아요 처리 중 오류:', error);
    }
  };

  // 댓글 추가 핸들러 커스텀 - 댓글 추가 후 댓글 목록 표시
  const handleSubmitComment = async () => {
    await handleAddComment();
    // 댓글 추가 후 댓글 목록 표시
    setShowComments(true);
  };

  // 텍스트가 길면 접어두기
  const isLongContent = extendedReview.content.length > 300;
  const displayContent =
    isLongContent && !expanded
      ? extendedReview.content.substring(0, 300) + '...'
      : extendedReview.content;

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
    const newShowComments = !showComments;
    setShowComments(newShowComments);

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
    <Card className="overflow-hidden border-gray-200 shadow-none">
      <CardHeader className="p-5 pb-3">
        <ReviewHeader
          review={extendedReview}
          isAuthor={isAuthor}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onEdit={handleEditReview}
          onDelete={() => setDeleteDialogOpen(true)}
        />
      </CardHeader>
      <CardContent className="space-y-4 px-5 pt-0 pb-4">
        {!isEditMode ? (
          <>
            {/* 일반 모드: 본문 내용 */}
            <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-800">
              {displayContent}
              {isLongContent && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="ml-1 font-medium text-gray-500 hover:text-gray-700"
                >
                  {expanded ? '접기' : '더보기'}
                </button>
              )}
            </p>

            {/* 이미지가 있는 경우 */}
            {review.images && review.images.length > 0 && (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={review.images[0].url}
                  alt="Review image"
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            {/* 책 정보가 있는 경우 */}
            {review.books && review.books.length > 0 && (
              <BookPreview
                book={review.books[0] as any}
                onClick={handleBookClick}
              />
            )}
          </>
        ) : (
          <ReviewEditForm
            content={editedContent}
            setContent={setEditedContent}
            type={editedType}
            setType={handleTypeChange}
            selectedBook={selectedBook}
            rating={editedRating}
            setRating={handleRatingChange}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            onBookDialogOpen={handleBookDialogOpen}
            onRemoveSelectedBook={handleRemoveSelectedBook}
            originalType={review.type}
          />
        )}
      </CardContent>
      <Separator className="bg-gray-100" />
      {!isEditMode && extendedReview.activityType !== 'rating' && (
        <CardFooter className="flex flex-col gap-4 px-5 py-3">
          <ReviewActions
            isLiked={isLiked || false}
            likesCount={likeCount || 0}
            commentCount={review.commentCount || 0}
            showComments={showComments}
            isLikeLoading={isLikeLoading}
            onLike={handleLike}
            onToggleComments={handleToggleComments}
          />

          {/* 댓글 섹션 */}
          {showComments && comments && (
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
            />
          )}
        </CardFooter>
      )}

      {/* Book search dialog */}
      <AddBookDialog
        isOpen={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
        libraryId={0} // Dummy value since we're just using for book selection
        onBookSelect={handleBookSelect}
      />

      {/* ReviewDialog for editing reviews of type 'review' */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        bookTitle={selectedBook?.title || '리뷰 수정'}
        initialRating={editedRating}
        initialContent={editedContent}
        isEditMode={true}
        isSubmitting={isSubmitting}
        onSubmit={handleReviewDialogSubmit}
        onCancel={() => setReviewDialogOpen(false)}
      />

      {/* 리뷰 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {extendedReview.activityType === 'rating'
                ? '별점 삭제'
                : '리뷰 삭제'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {extendedReview.activityType === 'rating'
                ? '이 별점을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
                : '이 리뷰를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer rounded-xl">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer rounded-xl bg-red-500 hover:bg-red-600"
              onClick={handleDeleteReview}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for validation */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="cursor-pointer rounded-lg bg-gray-900 hover:bg-gray-800">
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
