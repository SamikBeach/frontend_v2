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
import Image from 'next/image';
import { useState } from 'react';

interface SearchItemProps {
  item: {
    id: number;
    bookId?: number;
    type: string;
    title: string;
    subtitle?: string;
    image?: string;
    coverImage?: string;
    coverImageWidth?: number;
    coverImageHeight?: number;
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

export function SearchItem({ item, onClick, onDelete }: SearchItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // 하이라이트 텍스트 처리
  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight?.toLowerCase() ? (
            <span key={index} className="font-medium text-gray-700">
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
    // rating이 undefined거나 null이면 0으로 처리
    const ratingValue = rating === undefined || rating === null ? 0 : rating;

    // 전체 5개 별 기준, 색상이 있는 별 이미지처럼 렌더링
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 md:h-4 md:w-4 ${
              i < Math.floor(ratingValue)
                ? 'fill-yellow-400 text-yellow-400'
                : i + 0.5 <= ratingValue
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
          <Clock className="h-2.5 w-2.5 text-purple-500 md:h-3.5 md:w-3.5" />
        ),
        text: '읽고 싶어요',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
      },
      [ReadingStatusType.READING]: {
        icon: (
          <BookOpen className="h-2.5 w-2.5 text-blue-500 md:h-3.5 md:w-3.5" />
        ),
        text: '읽는 중',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
      },
      [ReadingStatusType.READ]: {
        icon: (
          <CheckCircle2 className="h-2.5 w-2.5 text-green-500 md:h-3.5 md:w-3.5" />
        ),
        text: '읽었어요',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
      },
    };

    const status = statusConfig[item.userReadingStatus];
    const count =
      item.readingStats?.readingStatusCounts?.[item.userReadingStatus] || 0;

    return (
      <div className="mt-1.5 md:mt-2.5">
        <div
          className={`inline-flex items-center rounded-full ${status.bgColor} px-1.5 py-0.5 text-[10px] leading-none font-medium md:px-2.5 md:py-1 md:text-xs md:leading-normal ${status.textColor}`}
        >
          <span className="flex items-center">
            {status.icon}
            <span className="ml-1">
              {status.text} {count > 0 ? count : ''}
            </span>
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
          className="inline-flex items-center rounded-full bg-purple-50 px-1.5 py-0.5 text-[10px] leading-none font-medium text-purple-600 md:px-2.5 md:py-1 md:text-xs md:leading-normal"
        >
          <span className="flex items-center">
            <Clock className="h-2.5 w-2.5 text-purple-500 md:h-3.5 md:w-3.5" />
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
          className="inline-flex items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] leading-none font-medium text-blue-600 md:px-2.5 md:py-1 md:text-xs md:leading-normal"
        >
          <span className="flex items-center">
            <BookOpen className="h-2.5 w-2.5 text-blue-500 md:h-3.5 md:w-3.5" />
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
          className="inline-flex items-center rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] leading-none font-medium text-green-600 md:px-2.5 md:py-1 md:text-xs md:leading-normal"
        >
          <span className="flex items-center">
            <CheckCircle2 className="h-2.5 w-2.5 text-green-500 md:h-3.5 md:w-3.5" />
            <span className="ml-1">
              읽었어요 {statusCounts[ReadingStatusType.READ]}
            </span>
          </span>
        </div>
      );
    }

    return statuses.length > 0 ? (
      <div className="mt-1.5 flex flex-wrap gap-1.5 md:mt-3">{statuses}</div>
    ) : null;
  };

  // 이미지 URL 선택 로직
  const imageUrl = item.coverImage || item.image || '/images/no-image.png';

  // 이미지 크기 정보 (레이아웃 시프트 방지용)
  const imageWidth = item.coverImageWidth || 240;
  const imageHeight = item.coverImageHeight || 360;

  // 평점과 리뷰 정보 렌더링
  const renderRatingAndReviews = () => {
    const hasRating = item.rating !== undefined;
    const hasReviews = item.reviews !== undefined;
    const hasTotalRatings = item.totalRatings !== undefined;

    if (!hasRating && !hasReviews) return null;

    return (
      <div className="mt-1.5 flex items-center gap-3 md:mt-2.5">
        {/* 별점 */}
        {hasRating && (
          <div className="flex items-center">
            {renderStarRating(item.rating || 0)}
            <span className="mx-1.5 text-xs font-medium text-gray-800 md:text-sm">
              {formatRating(item.rating || 0)}
            </span>
            {hasTotalRatings && (
              <span className="text-xs text-gray-500 md:text-sm">
                ({item.totalRatings || 0})
              </span>
            )}
          </div>
        )}

        {/* 리뷰 수 */}
        {hasReviews && (
          <div className="flex items-center border-l border-gray-200 pl-3">
            <MessageSquare className="h-3 w-3 text-gray-400 md:h-4 md:w-4" />
            <span className="ml-1.5 text-xs text-gray-500 md:text-sm">
              {item.reviews !== undefined && item.reviews > 999
                ? `${Math.floor(item.reviews / 1000)}k`
                : item.reviews || 0}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <CommandItem
      value={`${item.type}-${item.id}-${item.title}`}
      className="group relative flex cursor-pointer items-start gap-3 px-2 py-1 transition-colors hover:bg-gray-50 md:gap-4 md:py-2"
      onSelect={onClick}
    >
      {/* 이미지 섬네일 */}
      <div className="relative w-[110px] flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white md:w-[160px]">
        {/* 로딩 스켈레톤 */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <Image
          src={imageUrl}
          alt={item.title}
          width={imageWidth}
          height={imageHeight}
          className={`h-auto w-full object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjM2MCIgZmlsbD0iI2Y5ZmFmYiIvPgo8L3N2Zz4="
          sizes="(max-width: 768px) 110px, 160px"
          onLoad={() => setImageLoaded(true)}
          onError={e => {
            // 이미지 로드 실패 시 기본 이미지로 대체
            const target = e.currentTarget as HTMLImageElement;
            target.src = `https://placehold.co/240x360/f3f4f6/9ca3af?text=${encodeURIComponent(item.title.slice(0, 10))}`;
            setImageLoaded(true);
          }}
        />
      </div>

      {/* 도서 정보 */}
      <div className="flex min-w-0 flex-1 flex-col justify-start pt-1">
        <h4 className="line-clamp-2 text-sm font-medium text-gray-800 group-hover:text-gray-700 md:text-base">
          {highlightText(item.title, item.highlight)}
        </h4>
        {item.author && (
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 md:mt-1.5 md:text-sm">
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
          className="absolute top-1/2 right-4 flex-shrink-0 -translate-y-1/2 transform cursor-pointer rounded-full p-1 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-gray-300 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none md:p-1.5"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          title="검색어 삭제"
          aria-label="검색어 삭제"
        >
          <X className="h-3 w-3 md:h-4 md:w-4" />
        </button>
      )}
    </CommandItem>
  );
}
