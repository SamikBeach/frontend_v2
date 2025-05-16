interface EmptyStateProps {
  isMyProfile: boolean;
}

export function EmptyState({ isMyProfile }: EmptyStateProps) {
  return (
    <div className="mt-4 flex items-center justify-center rounded-lg bg-gray-50 py-8 sm:mt-8 sm:py-16">
      <div className="px-4 text-center sm:px-6">
        <h3 className="text-base font-medium text-gray-900 sm:text-lg">
          {isMyProfile
            ? '구독한 서재가 없습니다'
            : '이 사용자가 구독한 서재가 없습니다'}
        </h3>
        <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
          {isMyProfile
            ? '다른 사용자의 서재를 구독해보세요'
            : '다른 사용자를 확인해보세요'}
        </p>
      </div>
    </div>
  );
}
