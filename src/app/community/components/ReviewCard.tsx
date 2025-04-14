import { Comment, ReviewResponseDto } from '@/apis/review/types';
import { communityCategoryColors } from '@/atoms/community';
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
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  ChevronRight,
  MessageCircle,
  MoreHorizontal,
  SendHorizontal,
  ThumbsUp,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useReviewComments, useReviewLike } from '../hooks';

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
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Review 좋아요 관련 훅
  const { handleLikeToggle, isLoading: isLikeLoading } = useReviewLike();
  const [isLiked, setIsLiked] = useState(review.isLiked);
  const [likesCount, setLikesCount] = useState(review.likeCount);

  // 댓글 관련 훅
  const {
    comments,
    commentText,
    setCommentText,
    handleAddComment,
    isLoading: isCommentLoading,
  } = useReviewComments(review.id);

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
                <span className="text-xs text-gray-500">
                  @{review.author.username}
                </span>
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
              <p className="mt-0.5 text-xs text-gray-500">
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>
          <DropdownMenu>
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
              <DropdownMenuItem className="cursor-pointer rounded-lg py-2">
                북마크에 추가
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer rounded-lg py-2">
                링크 복사
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer rounded-lg py-2 text-red-500">
                신고하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <div className="flex gap-3 rounded-xl border border-gray-100 bg-[#F9FAFB] p-3">
            <div className="flex-shrink-0">
              <img
                src={review.books[0].coverImage}
                alt={review.books[0].title}
                className="h-[105px] w-[70px] rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                <h4 className="font-medium text-gray-900">
                  {review.books[0].title}
                </h4>
                <p className="text-sm text-gray-500">
                  {review.books[0].author}
                </p>
              </div>
              <Link
                href={`/books/${review.books[0].id}`}
                className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                자세히 보기
                <ChevronRight className="ml-0.5 h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </CardContent>
      <Separator className="bg-gray-100" />
      <CardFooter className="flex flex-col gap-4 px-5 py-4">
        <div className="flex w-full items-center">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex h-9 items-center gap-1.5 rounded-lg px-2.5 ${
                isLiked
                  ? 'bg-[#FFE2E2] text-red-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={handleLike}
              disabled={isLikeLoading}
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="font-medium">{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-gray-600 hover:bg-gray-50"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium">{review.commentCount}</span>
            </Button>
          </div>
        </div>

        {/* 댓글 영역 */}
        {showComments && (
          <div className="w-full space-y-3">
            <Separator className="bg-gray-100" />

            {/* 댓글 입력 */}
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-0">
                <AvatarImage
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-100 text-gray-800">
                  {getNameInitial(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <Input
                placeholder="댓글을 입력하세요..."
                className="h-9 flex-1 rounded-xl border-gray-200 bg-[#F9FAFB] text-sm"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <Button
                size="icon"
                className="h-9 w-9 rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800"
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || isCommentLoading}
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-3 pt-1">
              {comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

// 카테고리 이름 변환 유틸리티 함수
function getReviewTypeName(type: string): string {
  const typeNames: Record<string, string> = {
    general: '일반',
    discussion: '토론',
    review: '리뷰',
    question: '질문',
    meetup: '모임',
  };

  return typeNames[type] || '일반';
}

// 댓글 컴포넌트
interface CommentItemProps {
  comment: Comment;
  formatDate: (date: string | Date) => string;
}

function CommentItem({ comment, formatDate }: CommentItemProps) {
  return (
    <div className="flex gap-2">
      <Avatar className="h-8 w-8 border-0">
        <AvatarImage
          src={`https://i.pravatar.cc/150?u=${comment.author.id}`}
          alt={comment.author.username}
          className="object-cover"
        />
        <AvatarFallback className="bg-gray-100 text-gray-800">
          {comment.author.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {comment.author.username}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-800">{comment.content}</p>
      </div>
    </div>
  );
}
