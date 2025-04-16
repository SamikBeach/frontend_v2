'use client';

import { ReadingStatusType } from '@/apis/reading-status/types';
import { UserRating } from '@/apis/search/types';
import { CommandItem } from '@/components/ui/command';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  MessageSquare,
  Star,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface SearchItemProps {
  item: {
    id: number;
    type: string;
    title: string;
    subtitle?: string;
    image?: string;
    coverImage?: string;
    author?: string;
    highlight?: string;
    rating?: number;
    reviews?: number;
    totalRatings?: number;
    isbn?: string;
    isbn13?: string;
    readingStats?: {
      currentReaders: number;
      completedReaders: number;
      averageReadingTime: string;
      difficulty: 'easy' | 'medium' | 'hard';
      readingStatusCounts?: Record<ReadingStatusType, number>;
    };
    userReadingStatus?: ReadingStatusType | null;
    userRating?: UserRating | null;
  };
  onClick: () => void;
  onDelete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchItem({
  item,
  onClick,
  onDelete,
  size = 'md',
}: SearchItemProps) {
  const [imageError, setImageError] = useState(false);

  const isSmall = size === 'sm';

  // 하이라이트 텍스트 처리
  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight?.toLowerCase() ? (
            <span key={index} className="font-medium text-gray-900">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // 평점 형식화 함수
  const formatRating = (rating: any): string => {
    if (typeof rating === 'number') {
      return rating.toFixed(1);
    }

    if (typeof rating === 'string') {
      const parsedRating = parseFloat(rating);
      return Number.isNaN(parsedRating) ? rating : parsedRating.toFixed(1);
    }

    return String(rating);
  };

  // 주어진 평점에 따라 채워진 별과 빈 별을 렌더링하는 함수
  const renderStarRating = (rating?: number) => {
    if (!rating) return null;

    // 전체 5개 별 기준, 색상이 있는 별 이미지처럼 렌더링
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`${isSmall ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : i + 0.5 <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // 사용자의 읽기 상태 태그 렌더링
  const renderUserReadingStatus = () => {
    if (!item.userReadingStatus) return null;

    const statusConfig = {
      [ReadingStatusType.WANT_TO_READ]: {
        icon: (
          <Clock
            className={`${isSmall ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} text-purple-500`}
          />
        ),
        text: '읽고 싶어요',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
      },
      [ReadingStatusType.READING]: {
        icon: (
          <BookOpen
            className={`${isSmall ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} text-blue-500`}
          />
        ),
        text: '읽는 중',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
      },
      [ReadingStatusType.READ]: {
        icon: (
          <CheckCircle2
            className={`${isSmall ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} text-green-500`}
          />
        ),
        text: '읽었어요',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
      },
    };

    const status = statusConfig[item.userReadingStatus];

    return (
      <div className={`${isSmall ? 'mt-1.5' : 'mt-2.5'}`}>
        <div
          className={`inline-flex items-center rounded-full ${status.bgColor} ${
            isSmall
              ? 'px-1.5 py-0.5 text-[10px] leading-none'
              : 'px-2.5 py-1 text-xs'
          } font-medium ${status.textColor}`}
        >
          <span className="flex items-center">
            {status.icon}
            <span className="ml-1">{status.text}</span>
          </span>
        </div>
      </div>
    );
  };

  // 읽기 상태 태그 렌더링
  const renderReadingStatusTags = () => {
    // 사용자의 읽기 상태가 있다면 태그 렌더링 건너뛰기 (중복 방지)
    if (item.userReadingStatus) return null;

    if (!item.readingStats || !item.readingStats.readingStatusCounts)
      return null;

    const statusCounts = item.readingStats.readingStatusCounts;
    const statuses = [];

    // 각 상태별로 사람 수가 있을 때만 태그 추가
    if (
      statusCounts[ReadingStatusType.WANT_TO_READ] &&
      statusCounts[ReadingStatusType.WANT_TO_READ] > 0
    ) {
      statuses.push(
        <div
          key="want"
          className={`inline-flex items-center rounded-full bg-purple-50 ${
            isSmall
              ? 'px-1.5 py-0.5 text-[10px] leading-none'
              : 'px-2.5 py-1 text-xs'
          } font-medium text-purple-600`}
        >
          <span className="flex items-center">
            <Clock
              className={`${isSmall ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} text-purple-500`}
            />
            <span className="ml-1">
              읽고 싶어요 {statusCounts[ReadingStatusType.WANT_TO_READ]}
            </span>
          </span>
        </div>
      );
    }

    if (
      statusCounts[ReadingStatusType.READING] &&
      statusCounts[ReadingStatusType.READING] > 0
    ) {
      statuses.push(
        <div
          key="reading"
          className={`inline-flex items-center rounded-full bg-blue-50 ${
            isSmall
              ? 'px-1.5 py-0.5 text-[10px] leading-none'
              : 'px-2.5 py-1 text-xs'
          } font-medium text-blue-600`}
        >
          <span className="flex items-center">
            <BookOpen
              className={`${isSmall ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} text-blue-500`}
            />
            <span className="ml-1">
              읽는 중 {statusCounts[ReadingStatusType.READING]}
            </span>
          </span>
        </div>
      );
    }

    if (
      statusCounts[ReadingStatusType.READ] &&
      statusCounts[ReadingStatusType.READ] > 0
    ) {
      statuses.push(
        <div
          key="read"
          className={`inline-flex items-center rounded-full bg-green-50 ${
            isSmall
              ? 'px-1.5 py-0.5 text-[10px] leading-none'
              : 'px-2.5 py-1 text-xs'
          } font-medium text-green-600`}
        >
          <span className="flex items-center">
            <CheckCircle2
              className={`${isSmall ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'} text-green-500`}
            />
            <span className="ml-1">
              읽었어요 {statusCounts[ReadingStatusType.READ]}
            </span>
          </span>
        </div>
      );
    }

    return statuses.length > 0 ? (
      <div className={`${isSmall ? 'mt-1.5' : 'mt-3'} flex flex-wrap gap-1.5`}>
        {statuses}
      </div>
    ) : null;
  };

  // 이미지 URL 선택 로직
  const imageUrl = item.coverImage || item.image || '/images/no-image.png';

  // 평점과 리뷰 정보 렌더링
  const renderRatingAndReviews = () => {
    const hasRating = !!item.rating;
    const hasReviews = item.reviews !== undefined && item.reviews > 0;
    const hasTotalRatings =
      item.totalRatings !== undefined && item.totalRatings > 0;

    if (!hasRating && !hasReviews) return null;

    return (
      <div
        className={`${isSmall ? 'mt-1.5' : 'mt-2.5'} flex items-center gap-3`}
      >
        {/* 별점 */}
        {hasRating && (
          <div className="flex items-center">
            {renderStarRating(item.rating)}
            <span
              className={`${isSmall ? 'text-xs' : 'text-sm'} mx-1.5 font-medium text-gray-800`}
            >
              {formatRating(item.rating)}
            </span>
            {hasTotalRatings && (
              <span
                className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-500`}
              >
                ({item.totalRatings})
              </span>
            )}
          </div>
        )}

        {/* 리뷰 수 */}
        {hasReviews && (
          <div className="flex items-center border-l border-gray-200 pl-3">
            <MessageSquare
              className={`${isSmall ? 'h-3 w-3' : 'h-4 w-4'} text-gray-400`}
            />
            <span
              className={`${isSmall ? 'text-[10px]' : 'text-sm'} ml-1.5 text-gray-500`}
            >
              {item.reviews && item.reviews > 999
                ? `${Math.floor(item.reviews / 1000)}k`
                : item.reviews}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <CommandItem
      value={`${item.type}-${item.id}-${item.title}`}
      className={`group relative flex cursor-pointer items-start gap-4 px-3 ${isSmall ? 'py-2' : 'py-3.5'} transition-colors hover:bg-gray-50`}
      onSelect={onClick}
    >
      {/* 이미지 섬네일 */}
      <div
        className={`relative flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white ${isSmall ? 'w-[70px]' : 'w-[140px]'}`}
      >
        {!imageError ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="h-auto w-full object-contain"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className={`flex w-full items-center justify-center bg-gray-50 ${isSmall ? 'h-[100px]' : 'h-[190px]'}`}
          >
            <span className={`${isSmall ? 'text-2xl' : 'text-3xl'}`}>📚</span>
          </div>
        )}
      </div>

      {/* 도서 정보 */}
      <div className="flex min-w-0 flex-1 flex-col justify-start pt-1">
        <h4
          className={`line-clamp-2 ${isSmall ? 'text-sm' : 'text-base'} font-medium text-gray-900 group-hover:text-gray-800`}
        >
          {highlightText(item.title, item.highlight)}
        </h4>
        {item.author && (
          <p
            className={`${isSmall ? 'mt-0.5 text-xs' : 'mt-1.5 text-sm'} line-clamp-1 text-gray-500`}
          >
            {item.author}
          </p>
        )}

        {/* 평점 및 리뷰 정보 */}
        {renderRatingAndReviews()}

        {/* 사용자 읽기 상태 */}
        {renderUserReadingStatus()}

        {/* 읽기 상태 태그 */}
        {renderReadingStatusTags()}
      </div>

      {/* 삭제 버튼 (최근 검색어에만 표시) */}
      {onDelete && (
        <button
          className={`absolute top-1/2 right-4 flex-shrink-0 -translate-y-1/2 transform cursor-pointer rounded-full text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-gray-300 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none ${isSmall ? 'p-1' : 'p-1.5'}`}
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          title="검색어 삭제"
          aria-label="검색어 삭제"
        >
          <X className={`${isSmall ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </button>
      )}
    </CommandItem>
  );
}
