import { SearchResult } from '@/apis/search/types';
import { Star } from 'lucide-react';

// 평점 렌더링 함수
export const renderStarRating = (rating?: number) => {
  const ratingValue = rating || 0;
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
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

// 하이라이트 텍스트 처리
export const highlightText = (text: string, highlight?: string) => {
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

// 이미지 URL 정규화
export const normalizeImageUrl = (url: string): string => {
  if (!url) return '/images/no-image.png';
  return url.replace(/^https?:\/\//, '//');
};

// Book 또는 SearchResult 타입의 객체에서 이미지 URL을 안전하게 추출하는 함수
export const getImageUrl = (book: SearchResult): string => {
  return book.coverImage || book.image || '/images/no-image.png';
};

// 책 식별자 생성 헬퍼 함수
export const getBookIdentifier = (book: SearchResult): string => {
  const isbn = book.isbn || '';
  const isbn13 = book.isbn13 || '';
  return `${isbn}-${isbn13}-${book.title}`;
}; 