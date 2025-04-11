import { Comment, PostResponseDto } from '@/apis/post';
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
import { usePostComments, usePostLike } from '../hooks';

interface PostCardProps {
  post: PostResponseDto;
  currentUser: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export function PostCard({ post, currentUser }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Post 좋아요 관련 훅
  const { handleLikeToggle, isLoading: isLikeLoading } = usePostLike();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likeCount);

  // 댓글 관련 훅
  const {
    comments,
    commentText,
    setCommentText,
    handleAddComment,
    isLoading: isCommentLoading,
  } = usePostComments(post.id);

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
      await handleLikeToggle(post.id, isLiked);
    } catch (error) {
      // 에러 발생 시 UI 되돌리기
      setIsLiked(isLiked);
      setLikesCount(post.likeCount);
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
  const isLongContent = post.content.length > 300;
  const displayContent =
    isLongContent && !expanded
      ? post.content.substring(0, 300) + '...'
      : post.content;

  return (
    <Card className="mb-6 overflow-hidden border-gray-200 shadow-none">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="h-11 w-11 border-0">
                <AvatarImage
                  src={`https://i.pravatar.cc/150?u=${post.author.id}`}
                  alt={post.author.username}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-100 text-gray-800">
                  {getNameInitial(post.author.username)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${post.author.username}`}
                  className="font-semibold text-gray-900 hover:text-gray-700"
                >
                  {post.author.username}
                </Link>
                <span className="text-xs text-gray-500">
                  @{post.author.username}
                </span>
                <span
                  className="ml-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-700"
                  style={{
                    backgroundColor:
                      communityCategoryColors[
                        post.type as keyof typeof communityCategoryColors
                      ] || '#F9FAFB',
                  }}
                >
                  {getPostTypeName(post.type)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                {formatDate(post.createdAt)}
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
        {post.images && post.images.length > 0 && (
          <div className="overflow-hidden rounded-xl">
            <img
              src={post.images[0].url}
              alt="Post image"
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* 책 정보가 있는 경우 */}
        {post.books && post.books.length > 0 && (
          <div className="flex gap-3 rounded-xl border border-gray-100 bg-[#F9FAFB] p-3">
            <div className="flex-shrink-0">
              <img
                src={post.books[0].coverImage}
                alt={post.books[0].title}
                className="h-[105px] w-[70px] rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                <h4 className="font-medium text-gray-900">
                  {post.books[0].title}
                </h4>
                <p className="text-sm text-gray-500">{post.books[0].author}</p>
              </div>
              <Link
                href={`/books/${post.books[0].id}`}
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
              <span className="font-medium">{post.commentCount}</span>
            </Button>
          </div>
        </div>

        {/* 댓글 목록 - 애니메이션 단순화 */}
        {showComments && (
          <div className="w-full border-b border-gray-100 py-3">
            <div className="max-w-full space-y-3">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    formatDate={formatDate}
                  />
                ))
              ) : (
                <p className="py-6 text-center text-sm text-gray-500">
                  아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                </p>
              )}
            </div>
          </div>
        )}

        {/* 댓글 입력 */}
        <div className="flex w-full gap-3">
          <Avatar className="h-9 w-9 border-0">
            <AvatarImage
              src={currentUser?.avatar}
              alt={currentUser?.name || 'User'}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-100 text-gray-800">
              {getNameInitial(currentUser?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="댓글을 남겨보세요..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="h-9 rounded-xl border-gray-200 bg-[#F9FAFB]"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <Button
              size="icon"
              className="h-9 w-9 rounded-xl bg-gray-900 hover:bg-gray-800"
              disabled={!commentText.trim() || isCommentLoading}
              onClick={handleSubmitComment}
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

// 게시물 타입 이름 변환 함수
function getPostTypeName(type: string): string {
  switch (type) {
    case 'general':
      return '일반';
    case 'discussion':
      return '토론';
    case 'review':
      return '리뷰';
    case 'question':
      return '질문';
    case 'meetup':
      return '모임';
    default:
      return '일반';
  }
}

// 댓글 아이템 컴포넌트
interface CommentItemProps {
  comment: Comment;
  formatDate: (date: string | Date) => string;
}

function CommentItem({ comment, formatDate }: CommentItemProps) {
  return (
    <div className="flex w-full gap-2">
      <Avatar className="h-8 w-8 flex-shrink-0 border-0">
        <AvatarImage
          src={`https://i.pravatar.cc/150?u=${comment.author.id}`}
          alt={comment.author.username}
          className="object-cover"
        />
        <AvatarFallback className="bg-gray-100 text-gray-800">
          {comment.author.username?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 rounded-2xl bg-[#F9FAFB] px-3 py-2 break-words">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${comment.author.username}`}
            className="text-sm font-medium text-gray-900"
          >
            {comment.author.username}
          </Link>
          <span className="text-xs text-gray-500">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-800">{comment.content}</p>
        <div className="mt-1 flex items-center gap-1">
          <button className="text-xs font-medium text-gray-500 hover:text-gray-700">
            좋아요
          </button>
          <span className="text-xs text-gray-400">•</span>
          <button className="text-xs font-medium text-gray-500 hover:text-gray-700">
            답글 달기
          </button>
        </div>
      </div>
    </div>
  );
}
