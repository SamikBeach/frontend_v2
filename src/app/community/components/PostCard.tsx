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
import {
  ChevronRight,
  MessageCircle,
  MoreHorizontal,
  SendHorizontal,
  Share2,
  ThumbsUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { comments as allComments, mainCategories } from '../data';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export function PostCard({ post, currentUser }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [comment, setComment] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // 이 게시물에 해당하는 댓글만 필터링
  const postComments = allComments.filter(
    comment => comment.postId === post.id
  );

  // 포스트의 카테고리 찾기
  const category = mainCategories.find(cat => cat.id === post.category);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 텍스트가 길면 접어두기
  const isLongContent = post.content.length > 300;
  const displayContent =
    isLongContent && !expanded
      ? post.content.substring(0, 300) + '...'
      : post.content;

  return (
    <Card className="mb-6 overflow-hidden border-gray-200">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="h-11 w-11 border-0">
                <AvatarImage
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-100 text-gray-800">
                  {post.author.name[0]}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${post.author.username}`}
                  className="font-semibold text-gray-900 hover:text-gray-700"
                >
                  {post.author.name}
                </Link>
                <span className="text-xs text-gray-500">
                  @{post.author.username}
                </span>
                {category && (
                  <span
                    className="ml-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-700"
                    style={{
                      backgroundColor: category.color,
                    }}
                  >
                    {category.name}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-gray-500">
                {formatDate(post.timestamp)}
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
                게시물 공유하기
              </DropdownMenuItem>
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
        {post.image && (
          <div className="overflow-hidden rounded-xl">
            <Image
              src={post.image}
              alt="Post image"
              width={600}
              height={400}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* 책 정보가 있는 경우 */}
        {post.book && (
          <div className="flex gap-3 rounded-xl border border-gray-100 bg-[#F9FAFB] p-3">
            <div className="flex-shrink-0">
              <Image
                src={post.book.coverImage}
                alt={post.book.title}
                width={70}
                height={105}
                className="h-[105px] w-[70px] rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                <h4 className="font-medium text-gray-900">{post.book.title}</h4>
                <p className="text-sm text-gray-500">{post.book.author}</p>
              </div>
              <Link
                href={`/books/${encodeURIComponent(post.book.title)}`}
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
                liked
                  ? 'bg-[#FFE2E2] text-red-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={handleLike}
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
              <span className="font-medium">{post.comments}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-gray-600 hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
              <span className="font-medium">{post.shares}</span>
            </Button>
          </div>
        </div>

        {/* 댓글 목록 */}
        {showComments && postComments.length > 0 && (
          <div className="space-y-3 border-y border-gray-100 py-3">
            {postComments.map(comment => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="h-8 w-8 border-0">
                  <AvatarImage
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-800">
                    {comment.author.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-2xl bg-[#F9FAFB] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/profile/${comment.author.username}`}
                      className="text-sm font-medium text-gray-900"
                    >
                      {comment.author.name}
                    </Link>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{comment.content}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <button className="text-xs font-medium text-gray-500 hover:text-gray-700">
                      좋아요 {comment.likes}
                    </button>
                    <span className="text-xs text-gray-400">•</span>
                    <button className="text-xs font-medium text-gray-500 hover:text-gray-700">
                      답글 달기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 댓글 입력 */}
        <div className="flex w-full gap-3">
          <Avatar className="h-9 w-9 border-0">
            <AvatarImage
              src={currentUser.avatar}
              alt={currentUser.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-100 text-gray-800">
              {currentUser.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="댓글을 남겨보세요..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="h-9 rounded-xl border-gray-200 bg-[#F9FAFB]"
            />
            <Button
              size="icon"
              className="h-9 w-9 rounded-xl bg-gray-900 hover:bg-gray-800"
              disabled={!comment.trim()}
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
