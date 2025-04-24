import { ReadingStatusType } from '@/apis/reading-status/types';
import { deleteReview, updateReview } from '@/apis/review/review';
import { ReviewResponseDto } from '@/apis/review/types';
import { communityCategoryColors } from '@/atoms/community';
import { ReviewDialog } from '@/components/ReviewDialog/ReviewDialog';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useDialogQuery } from '@/hooks/useDialogQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  SendHorizontal,
  Star,
  ThumbsUp,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useReviewComments, useReviewLike } from '../hooks';

// 읽기 통계 정보 인터페이스
interface ReadingStats {
  currentReaders?: number;
  completedReaders?: number;
  averageReadingTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  readingStatusCounts?: Record<ReadingStatusType, number>;
}

// 유저 평점 인터페이스
interface UserRating {
  rating: number;
  comment?: string;
}

// Extend the ReviewBook interface to add the missing properties
interface ExtendedReviewBook {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  publisher: string;
  isbn?: string;
  isbn13?: string;
  publishDate?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  totalRatings?: number;
  ratingCount?: number;
  readingStats?: ReadingStats;
  userRating?: UserRating;
  userReadingStatus?: ReadingStatusType;
}

// 저자 평점 인터페이스
interface AuthorRating {
  bookId: number;
  rating: number;
  comment?: string;
}

// Extend the ReviewResponseDto to include rating property
interface ExtendedReviewResponseDto extends Omit<ReviewResponseDto, 'books'> {
  rating?: number;
  books: ExtendedReviewBook[];
  authorRatings?: AuthorRating[];
}

// 로컬에서 사용할 Comment 인터페이스 정의
interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    email?: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
  replies?: Comment[];
}

interface ReviewCardProps {
  review: ReviewResponseDto;
  currentUser: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export function ReviewCard({ review, currentUser }: ReviewCardProps) {
  // Cast to our extended type
  const extendedReview = review as ExtendedReviewResponseDto;

  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { open: openBookDialog } = useDialogQuery({ type: 'book' });
  const queryClient = useQueryClient();

  // Review 수정 관련 상태
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Review 좋아요 관련 훅
  const { handleLikeToggle, isLoading: isLikeLoading } = useReviewLike();
  const [isLiked, setIsLiked] = useState(review.isLiked);
  const [likesCount, setLikesCount] = useState(review.likeCount);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 댓글 관련 훅
  const {
    comments,
    commentText,
    setCommentText,
    handleAddComment,
    isLoading: isCommentLoading,
    refetch,
  } = useReviewComments(review.id, showComments);

  // 현재 사용자가 리뷰 작성자인지 확인
  const isAuthor = currentUser.id === review.author.id;

  // 리뷰 수정 mutation
  const updateReviewMutation = useMutation({
    mutationFn: ({
      id,
      content,
      rating,
    }: {
      id: number;
      content: string;
      rating: number;
    }) => {
      return updateReview(id, { content, type: review.type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-reviews'] });
      toast.success('리뷰가 수정되었습니다.');
      setReviewDialogOpen(false);
    },
    onError: () => {
      toast.error('리뷰 수정 중 오류가 발생했습니다.');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // 리뷰 삭제 mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-reviews'] });
      toast.success('리뷰가 삭제되었습니다.');
    },
    onError: () => {
      toast.error('리뷰 삭제 중 오류가 발생했습니다.');
    },
  });

  // 리뷰 수정 핸들러
  const handleEditReview = (rating: number, content: string) => {
    setIsSubmitting(true);
    updateReviewMutation.mutate({
      id: review.id,
      content,
      rating,
    });
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = () => {
    deleteReviewMutation.mutate(review.id);
    setDeleteDialogOpen(false);
  };

  // Add a helper function to get the name initial safely
  const getNameInitial = (name?: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  // 좋아요 핸들러 - 낙관적 UI 업데이트 적용
  const handleLike = async () => {
    // 낙관적 UI 업데이트
    setIsLiked(!isLiked);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));

    try {
      // API 호출
      await handleLikeToggle(review.id, isLiked);
    } catch (error) {
      // 에러 발생 시 UI 되돌리기
      setIsLiked(isLiked);
      setLikesCount(review.likeCount);
      console.error('Failed to toggle like:', error);
    }
  };

  // 댓글 추가 핸들러 커스텀 - 댓글 추가 후 댓글 목록 표시
  const handleSubmitComment = async () => {
    await handleAddComment();
    // 댓글 추가 후 댓글 목록 표시
    setShowComments(true);
  };

  // 날짜 포맷팅
  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return format(date, 'PPP p', { locale: ko });
  };

  // 텍스트가 길면 접어두기
  const isLongContent = review.content.length > 300;
  const displayContent =
    isLongContent && !expanded
      ? review.content.substring(0, 300) + '...'
      : review.content;

  // Book dialog 열기 핸들러
  const handleBookClick = () => {
    if (review.books && review.books.length > 0) {
      const book = review.books[0] as ExtendedReviewBook;
      // isbn13이 있으면 우선 사용하고, 없으면 isbn 사용
      const bookIsbn = book.isbn13 || book.isbn || '';
      openBookDialog(bookIsbn);
    }
  };

  // 별점 렌더링 헬퍼 함수
  const renderStarRating = (rating: number | string) => {
    // rating이 숫자가 아닐 경우 숫자로 변환
    const ratingValue =
      typeof rating === 'number'
        ? rating
        : typeof rating === 'string'
          ? parseFloat(rating)
          : 0;

    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="h-3.5 w-3.5 text-yellow-400"
            fill="url(#half-star)"
          />
        );
      } else {
        stars.push(<Star key={i} className="h-3.5 w-3.5 text-gray-200" />);
      }
    }

    return (
      <div className="flex">
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        {stars}
      </div>
    );
  };

  // 책의 평점과 리뷰 수 표시
  const renderRatingAndReviews = (book: ExtendedReviewBook) => {
    const hasRating = book.rating !== undefined && book.rating > 0;
    const hasReviews = book.reviews !== undefined && book.reviews > 0;
    const hasTotalRatings =
      book.totalRatings !== undefined && book.totalRatings > 0;

    if (!hasRating && !hasReviews) return null;

    // rating이 숫자가 아닐 경우 숫자로 변환
    const ratingValue = hasRating
      ? typeof book.rating === 'number'
        ? book.rating
        : typeof book.rating === 'string'
          ? parseFloat(book.rating)
          : 0
      : 0;

    return (
      <div className="mt-1.5 flex items-center gap-2">
        {/* 별점 */}
        {hasRating && (
          <div className="flex items-center">
            {renderStarRating(ratingValue)}
            <span className="ml-1 text-xs font-medium text-gray-800">
              {ratingValue.toFixed(1)}
            </span>
            {hasTotalRatings && (
              <span className="ml-0.5 text-xs text-gray-500">
                ({book.totalRatings})
              </span>
            )}
          </div>
        )}

        {/* 리뷰 수 */}
        {hasReviews && (
          <div className="flex items-center border-l border-gray-200 pl-2">
            <MessageCircle className="h-3.5 w-3.5 text-gray-400" />
            <span className="ml-1 text-xs text-gray-500">
              {book.reviews! > 999
                ? `${Math.floor(book.reviews! / 1000)}k`
                : book.reviews}
            </span>
          </div>
        )}
      </div>
    );
  };

  // 읽기 상태 표시 함수
  const renderReadingStatus = (book: ExtendedReviewBook) => {
    if (!book.userReadingStatus) return null;

    const statusConfig = {
      [ReadingStatusType.WANT_TO_READ]: {
        icon: <Clock className="h-3 w-3 text-purple-500" />,
        text: '읽고 싶어요',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
      },
      [ReadingStatusType.READING]: {
        icon: <BookOpen className="h-3 w-3 text-blue-500" />,
        text: '읽는 중',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
      },
      [ReadingStatusType.READ]: {
        icon: <CheckCircle2 className="h-3 w-3 text-green-500" />,
        text: '읽었어요',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
      },
    };

    const status = statusConfig[book.userReadingStatus];

    // 읽기 상태 카운트 추출
    const statusCount =
      book.readingStats?.readingStatusCounts?.[book.userReadingStatus] || 0;
    const hasStatusCount = statusCount > 0;

    return (
      <div className="mt-1.5">
        <div
          className={`inline-flex items-center rounded-full ${status.bgColor} px-2 py-0.5 text-[10px] font-medium ${status.textColor}`}
        >
          <span className="flex items-center">
            {status.icon}
            <span className="ml-0.5">{status.text}</span>
            {hasStatusCount && (
              <span className="ml-1 text-[10px] opacity-75">
                {statusCount > 999
                  ? `${Math.floor(statusCount / 1000)}k명`
                  : `${statusCount}명`}
              </span>
            )}
          </span>
        </div>
      </div>
    );
  };

  // 댓글 토글 핸들러
  const handleToggleComments = () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);

    // 댓글 목록을 펼칠 때 데이터가 최신 상태인지 확인
    if (newShowComments) {
      refetch();
    }
  };

  return (
    <Card className="mb-6 overflow-hidden border-gray-200 shadow-none">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Link href={`/profile/${review.author.username}`}>
              <Avatar className="h-11 w-11 border-0">
                <AvatarImage
                  src={`https://i.pravatar.cc/150?u=${review.author.id}`}
                  alt={review.author.username}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-100 text-gray-800">
                  {getNameInitial(review.author.username)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${review.author.username}`}
                  className="font-semibold text-gray-900 hover:text-gray-700"
                >
                  {review.author.username}
                </Link>
                <span
                  className="ml-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-700"
                  style={{
                    backgroundColor:
                      communityCategoryColors[
                        review.type as keyof typeof communityCategoryColors
                      ] || '#F9FAFB',
                  }}
                >
                  {getReviewTypeName(review.type)}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                {/* 저자 평점(authorRatings) 표시 또는 리뷰의 rating 값 사용 */}
                {extendedReview.authorRatings &&
                  extendedReview.authorRatings.length > 0 && (
                    <div className="flex items-center rounded-full bg-yellow-50 px-2 py-0.5">
                      {renderStarRating(extendedReview.authorRatings[0].rating)}
                      <span className="ml-0.5 text-xs font-medium text-yellow-700">
                        {typeof extendedReview.authorRatings[0].rating ===
                        'number'
                          ? extendedReview.authorRatings[0].rating.toFixed(1)
                          : parseFloat(
                              String(extendedReview.authorRatings[0].rating)
                            ).toFixed(1)}
                      </span>
                    </div>
                  )}
                {!extendedReview.authorRatings &&
                  extendedReview.rating &&
                  extendedReview.rating > 0 && (
                    <div className="flex items-center rounded-full bg-yellow-50 px-2 py-0.5">
                      {renderStarRating(extendedReview.rating)}
                      <span className="ml-0.5 text-xs font-medium text-yellow-700">
                        {typeof extendedReview.rating === 'number'
                          ? extendedReview.rating.toFixed(1)
                          : parseFloat(String(extendedReview.rating)).toFixed(
                              1
                            )}
                      </span>
                    </div>
                  )}
                <span className="text-xs text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>
          {isAuthor && (
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg py-2"
                  onSelect={() => {
                    setReviewDialogOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-lg py-2 text-red-500 hover:text-red-500"
                  onSelect={() => {
                    setDeleteDialogOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Trash className="mr-2 h-4 w-4 text-red-500" />
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pt-0 pb-4">
        {/* 본문 내용 */}
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
          <div
            className="flex cursor-pointer gap-3 rounded-xl border border-gray-100 bg-[#F9FAFB] p-3 transition-colors hover:bg-gray-100"
            onClick={handleBookClick}
          >
            <div className="flex-shrink-0">
              <img
                src={review.books[0].coverImage}
                alt={review.books[0].title}
                className="h-[110px] w-[72px] rounded-lg object-cover shadow-sm"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {review.books[0].title}
                </h4>
                <p className="text-xs text-gray-500">
                  {review.books[0].author}
                </p>

                {/* 별점 및 리뷰 수 */}
                {renderRatingAndReviews(review.books[0] as ExtendedReviewBook)}

                {/* 읽기 상태 */}
                {renderReadingStatus(review.books[0] as ExtendedReviewBook)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <Separator className="bg-gray-100" />
      <CardFooter className="flex flex-col gap-4 px-5 py-3">
        <div className="flex w-full items-center gap-3">
          <button
            onClick={handleLike}
            disabled={isLikeLoading}
            className={`flex h-8 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors ${
              isLiked
                ? 'bg-pink-50 text-pink-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ThumbsUp
              className={`mr-0.5 h-4 w-4 ${isLiked ? 'fill-pink-500' : ''}`}
            />
            <span>{likesCount}</span>
          </button>
          <button
            onClick={handleToggleComments}
            className={`flex h-8 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-medium transition-colors ${
              showComments
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="mr-0.5 h-4 w-4" />
            <span>{review.commentCount || 0}</span>
          </button>
        </div>

        {/* 댓글 섹션 */}
        {showComments && (
          <div className="w-full space-y-3">
            {/* 댓글 입력 */}
            <div className="flex gap-2">
              <Avatar className="mt-1 h-7 w-7 flex-shrink-0">
                <AvatarImage
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {getNameInitial(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="댓글을 입력하세요..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      className="h-9 flex-1 rounded-xl border-gray-200 bg-gray-50 text-sm shadow-none"
                      disabled={isCommentLoading}
                      onKeyDown={e => {
                        // Cmd+Enter(Mac) 또는 Ctrl+Enter(Windows)로 댓글 제출
                        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                          e.preventDefault();
                          if (commentText.trim() && !isCommentLoading) {
                            handleSubmitComment();
                          }
                        }
                      }}
                    />
                  </div>
                  <Button
                    size="icon"
                    className="h-9 w-9 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || isCommentLoading}
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 댓글 로딩 상태 */}
            {isCommentLoading ? (
              <div className="my-6 flex flex-col items-center justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700"></div>
                <p className="mt-3 text-xs text-gray-500">
                  댓글을 불러오는 중...
                </p>
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-3 pl-9">
                {comments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            ) : (
              <div className="my-2 flex flex-col items-center justify-center rounded-xl bg-gray-50 px-4 py-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <MessageCircle className="h-6 w-6 text-gray-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-800">
                  아직 댓글이 없습니다
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  이 글에 첫 번째 댓글을 작성해보세요
                </p>
                <Button
                  variant="outline"
                  className="mt-4 h-8 rounded-full border-gray-300 bg-white px-4 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    // 댓글 입력창에 포커스
                    const commentInput = document.querySelector(
                      `input[placeholder="댓글을 입력하세요..."]`
                    ) as HTMLInputElement;
                    if (commentInput) commentInput.focus();
                  }}
                >
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  댓글 작성하기
                </Button>
              </div>
            )}
          </div>
        )}
      </CardFooter>

      {/* 리뷰 수정 다이얼로그 */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        bookTitle={
          review.books && review.books.length > 0 ? review.books[0].title : ''
        }
        initialContent={review.content}
        initialRating={extendedReview.authorRatings?.[0]?.rating || 0}
        isEditMode={true}
        isSubmitting={isSubmitting}
        onSubmit={handleEditReview}
      />

      {/* 리뷰 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>리뷰 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 리뷰를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">취소</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-red-500 hover:bg-red-600"
              onClick={handleDeleteReview}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function getReviewTypeName(type: string): string {
  switch (type) {
    case 'general':
      return '일반';
    case 'review':
      return '리뷰';
    case 'discussion':
      return '토론';
    case 'question':
      return '질문';
    case 'meetup':
      return '모임';
    case 'tip':
      return '팁';
    default:
      return '기타';
  }
}

interface CommentItemProps {
  comment: Comment;
  formatDate: (date: string | Date) => string;
}

function CommentItem({ comment, formatDate }: CommentItemProps) {
  return (
    <div className="flex gap-2">
      <Avatar className="h-7 w-7 flex-shrink-0">
        <AvatarImage
          src={`https://i.pravatar.cc/150?u=${comment.author.id}`}
          alt={comment.author.username}
          className="object-cover"
        />
        <AvatarFallback className="bg-gray-200 text-gray-700">
          {comment.author.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 rounded-xl bg-gray-50 p-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/profile/${comment.author.username}`}
              className="text-sm font-medium text-gray-900 hover:underline"
            >
              {comment.author.username}
            </Link>
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-800">{comment.content}</p>
      </div>
    </div>
  );
}
