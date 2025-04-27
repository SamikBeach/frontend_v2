import { Book } from '@/apis';
import { ReadingStatusType } from '@/apis/reading-status/types';
import { BookOpen, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import { renderStarRating } from '../utils';

interface BookPreviewProps {
  book: Book;
  onClick: () => void;
}

export function BookPreview({ book, onClick }: BookPreviewProps) {
  // 책의 평점과 리뷰 수 표시
  const renderRatingAndReviews = (book: Book) => {
    const hasReviews = book.reviews !== undefined && book.reviews > 0;
    const hasTotalRatings =
      book.totalRatings !== undefined && book.totalRatings > 0;

    // rating이 숫자가 아닐 경우 숫자로 변환
    const ratingValue =
      book.rating !== undefined
        ? typeof book.rating === 'number'
          ? book.rating
          : typeof book.rating === 'string'
            ? parseFloat(book.rating)
            : 0
        : 0;

    return (
      <div className="mt-1.5 flex items-center gap-2">
        {/* 별점 - 항상 표시 (0점이어도 표시) */}
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
  const renderReadingStatus = (book: Book) => {
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

  return (
    <div
      className="flex cursor-pointer gap-3 rounded-xl border border-gray-100 bg-[#F9FAFB] p-3 transition-colors hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-[110px] w-[72px] rounded-lg object-cover shadow-sm"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          <h4 className="text-sm font-medium text-gray-900">{book.title}</h4>
          <p className="text-xs text-gray-500">{book.author}</p>

          {/* 별점 및 리뷰 수 - 항상 표시 */}
          {renderRatingAndReviews(book)}

          {/* 읽기 상태 */}
          {renderReadingStatus(book)}
        </div>
      </div>
    </div>
  );
}
