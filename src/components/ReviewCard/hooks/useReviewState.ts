import { ReviewType } from '@/apis/review/types';
import { SearchResult } from '@/apis/search/types';
import { useEffect, useState } from 'react';
import { ExtendedReviewResponseDto } from '../types';

export function useReviewState(
  review: ExtendedReviewResponseDto,
  initialShowComments = false
) {
  // UI 상태 관리
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(initialShowComments);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Review 수정 관련 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(review.content);
  const [editedType, setEditedType] = useState<ReviewType>(review.type);
  const [editedRating, setEditedRating] = useState<number>(
    review.rating ||
      (review.userRating ? (review.userRating.rating as number) : 0)
  );

  // 책 선택 관련 상태
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

  // 다이얼로그 관련 상태
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // 좋아요 상태
  const [isLiked, setIsLiked] = useState(review.isLiked);
  const [likeCount, setLikeCount] = useState(review.likeCount);

  // 댓글 상태
  const [commentText, setCommentText] = useState('');

  // 초기 수정 상태 설정
  useEffect(() => {
    if (review) {
      setEditedContent(review.content);
      setEditedType(review.type);
      setEditedRating(
        review.rating ||
          (review.userRating ? (review.userRating.rating as number) : 0)
      );
    }
  }, [review, review.userRating]);

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

  // 편집 모드 진입 핸들러
  const handleEditModeToggle = (enabled: boolean) => {
    setIsEditMode(enabled);
    if (!enabled) {
      // 취소 시 초기 상태로 복원
      setEditedContent(review.content);
      setEditedType(review.type);
      setEditedRating(
        review.rating ||
          (review.userRating ? (review.userRating.rating as number) : 0)
      );
    }
  };

  // 알림 다이얼로그 설정
  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertDialogOpen(true);
  };

  // 댓글 토글 핸들러
  const handleToggleComments = () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);
    return newShowComments;
  };

  // 텍스트가 길면 접어두기
  const isLongContent = review.content.length > 300;
  const displayContent =
    isLongContent && !expanded
      ? review.content.substring(0, 300) + '...'
      : review.content;

  return {
    // UI 상태
    expanded,
    setExpanded,
    showComments,
    setShowComments,
    isDropdownOpen,
    setIsDropdownOpen,
    isLongContent,
    displayContent,

    // 리뷰 수정 상태
    isSubmitting,
    setIsSubmitting,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isEditMode,
    editedContent,
    setEditedContent,
    editedType,
    editedRating,

    // 책 선택 상태
    selectedBook,
    setSelectedBook,

    // 다이얼로그 상태
    bookDialogOpen,
    setBookDialogOpen,
    alertDialogOpen,
    setAlertDialogOpen,
    alertMessage,
    alertTitle,
    reviewDialogOpen,
    setReviewDialogOpen,

    // 좋아요 상태
    isLiked,
    setIsLiked,
    likeCount,
    setLikeCount,

    // 댓글 상태
    commentText,
    setCommentText,

    // 핸들러 메서드
    handleBookDialogOpen,
    handleBookSelect,
    handleRemoveSelectedBook,
    handleRatingChange,
    handleTypeChange,
    handleEditModeToggle,
    showAlert,
    handleToggleComments,
  };
}
