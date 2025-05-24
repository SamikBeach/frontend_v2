import { Heart } from 'lucide-react';
import { EmptyState as CommonEmptyState } from '../../../common';

interface EmptyStateProps {
  isMyProfile: boolean;
}

export function EmptyState({ isMyProfile }: EmptyStateProps) {
  return (
    <CommonEmptyState
      title={
        isMyProfile
          ? '구독한 서재가 없습니다'
          : '이 사용자가 구독한 서재가 없습니다'
      }
      description={
        isMyProfile
          ? '다른 사용자의 서재를 구독해보세요'
          : '다른 사용자를 확인해보세요'
      }
      icon={<Heart className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />}
    />
  );
}
