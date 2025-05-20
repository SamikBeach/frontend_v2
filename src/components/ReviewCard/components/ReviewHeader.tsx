import { ReviewUser } from '@/apis/review/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { ExtendedReviewResponseDto } from '../types';
import { getNameInitial, renderStarRating } from '../utils';
import { ReviewHeaderDropdown } from './ReviewHeaderDropdown';
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
  const avatarSrc = author.profileImage ?? undefined;

  // 별점이 있는지 확인 (userRating이나 rating이 있고 0보다 큰 경우)
  const hasRating =
    (review.userRating && review.userRating.rating > 0) ||
    (review.rating && review.rating > 0);

  // 별점 값 계산
  const rating = review.userRating
    ? review.userRating.rating
    : review.rating && review.rating > 0
      ? review.rating
      : 0;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Avatar
          className="h-8 w-8 cursor-pointer"
          onClick={() => onUserClick && onUserClick(review.author.id)}
        >
          <AvatarImage
            src={avatarSrc}
            alt={review.author.username}
            className="object-cover"
          />
          <AvatarFallback className="text-xs">
            {getNameInitial(review.author.username)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${review.author.id}`}
              className="text-sm font-semibold text-gray-900 hover:text-gray-700"
              onClick={() => onUserClick && onUserClick(review.author.id)}
            >
              {review.author.username}
            </Link>
            <TagName type={review.type} activityType={review.activityType} />

            {/* 별점 표시 - 별점이 있을 때만 표시 */}
            {hasRating && (
              <div className="flex items-center rounded-full bg-yellow-50 px-2 py-0.5">
                {renderStarRating(rating)}
                <span className="ml-0.5 text-xs font-medium text-yellow-700">
                  {typeof rating === 'number'
                    ? rating.toFixed(1)
                    : parseFloat(String(rating)).toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* 날짜 표시는 별도의 라인에 배치 */}
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </span>
        </div>
      </div>
      {isAuthor && (
        <ReviewHeaderDropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
