import { FileText, MessageSquare, Star } from 'lucide-react';
import { EmptyState } from '../../../common';

// 빈 상태 컴포넌트 - 리뷰
export function EmptyReviewState() {
  return (
    <EmptyState
      title="작성한 책 리뷰가 없습니다"
      description="아직 작성한 책 리뷰가 없습니다. 책을 읽고 리뷰를 작성해보세요."
      icon={<MessageSquare className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />}
    />
  );
}

// 빈 상태 컴포넌트 - 별점
export function EmptyRatingState() {
  return (
    <EmptyState
      title="작성한 별점이 없습니다"
      description="아직 작성한 별점이 없습니다. 책을 읽고 별점을 남겨보세요."
      icon={<Star className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />}
    />
  );
}

// 빈 상태 컴포넌트 - 전체(리뷰와 별점)
export function EmptyAllState() {
  return (
    <EmptyState
      title="작성한 리뷰와 별점이 없습니다"
      description="아직 작성한 리뷰와 별점이 없습니다. 책을 읽고 리뷰나 별점을 남겨보세요."
      icon={<FileText className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />}
    />
  );
}
