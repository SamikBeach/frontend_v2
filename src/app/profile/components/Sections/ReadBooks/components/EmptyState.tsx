import { BookOpen } from 'lucide-react';
import { EmptyState as CommonEmptyState } from '../../../common';

export function EmptyState() {
  return (
    <CommonEmptyState
      title="책 목록이 없습니다"
      description="아직 등록된 책이 없습니다. 책을 추가해보세요."
      icon={<BookOpen className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />}
    />
  );
}
