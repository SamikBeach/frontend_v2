import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Star } from 'lucide-react';
import { ReactNode } from 'react';

// 별점 렌더링 헬퍼 함수
export const renderStarRating = (rating: number | string): ReactNode => {
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
        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
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

// 이름의 첫 글자를 대문자로 가져오는 유틸리티 함수
export const getNameInitial = (name?: string): string => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

// 날짜 포맷팅 함수
export const formatDate = (dateStr: string | Date): string => {
  const date = new Date(dateStr);
  return format(date, 'PPP p', { locale: ko });
};

// 리뷰 타입 이름 가져오기
export const getReviewTypeName = (type: string): string => {
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
};
