interface EmptyStateProps {
  isMyProfile: boolean;
}

export function EmptyState({ isMyProfile }: EmptyStateProps) {
  return (
    <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          {isMyProfile
            ? '구독한 서재가 없습니다'
            : '이 사용자가 구독한 서재가 없습니다'}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {isMyProfile
            ? '다른 사용자의 서재를 구독해보세요'
            : '다른 사용자를 확인해보세요'}
        </p>
      </div>
    </div>
  );
}
