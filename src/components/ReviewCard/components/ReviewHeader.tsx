import { ReviewUser } from '@/apis/review/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { ExtendedReviewResponseDto } from '../types';
import { getNameInitial, renderStarRating } from '../utils';
import { TagName } from './TagName';

interface ReviewHeaderProps {
  review: ExtendedReviewResponseDto;
  isAuthor: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (state: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onUserClick?: (userId: number) => void;
}

export function ReviewHeader({
  review,
  isAuthor,
  isDropdownOpen,
  setIsDropdownOpen,
  onEdit,
  onDelete,
  onUserClick,
}: ReviewHeaderProps) {
  // Check if author has profileImage property, otherwise cast to ReviewUser
  const author = review.author as ReviewUser;
  const avatarSrc = author.profileImage || `/images/avatars/placeholder.png`;

  return (
    <div className="flex items-start justify-between">
      <div className="flex gap-3">
        <Avatar
          className="h-8 w-8 cursor-pointer"
          onClick={() => onUserClick && onUserClick(review.author.id)}
        >
          <AvatarImage src={avatarSrc} alt={review.author.username} />
          <AvatarFallback>
            {getNameInitial(review.author.username)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${review.author.id}`}
              className="text-sm font-semibold text-gray-900 hover:text-gray-700"
              onClick={() => onUserClick && onUserClick(review.author.id)}
            >
              {review.author.username}
            </Link>
            <TagName type={review.type} />
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            {/* 저자 평점(authorRatings) 표시 또는 리뷰의 rating 값 사용 */}
            {review.authorRatings && review.authorRatings.length > 0 && (
              <div className="flex items-center rounded-full bg-yellow-50 px-2 py-0.5">
                {renderStarRating(review.authorRatings[0].rating)}
                <span className="ml-0.5 text-xs font-medium text-yellow-700">
                  {typeof review.authorRatings[0].rating === 'number'
                    ? review.authorRatings[0].rating.toFixed(1)
                    : parseFloat(
                        String(review.authorRatings[0].rating)
                      ).toFixed(1)}
                </span>
              </div>
            )}
            {!review.authorRatings && review.rating && review.rating > 0 && (
              <div className="flex items-center rounded-full bg-yellow-50 px-2 py-0.5">
                {renderStarRating(review.rating)}
                <span className="ml-0.5 text-xs font-medium text-yellow-700">
                  {typeof review.rating === 'number'
                    ? review.rating.toFixed(1)
                    : parseFloat(String(review.rating)).toFixed(1)}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          </div>
        </div>
      </div>
      {isAuthor && (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
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
                onEdit();
                setIsDropdownOpen(false);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              수정하기
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer rounded-lg py-2 text-red-500 hover:bg-red-50 hover:text-red-500"
              onSelect={() => {
                onDelete();
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
  );
}
