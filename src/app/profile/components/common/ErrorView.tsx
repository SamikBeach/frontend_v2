'use client';

import { Button } from '@/components/ui/button';

interface ErrorViewProps {
  onRetry: () => void;
}

export function ErrorView({ onRetry }: ErrorViewProps) {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <h2 className="mb-3 text-2xl font-semibold text-gray-800">
        정보를 불러올 수 없습니다
      </h2>
      <p className="mb-6 max-w-md text-gray-600">
        프로필 정보를 불러오는 중 문제가 발생했습니다.
      </p>
      <Button onClick={onRetry}>다시 시도</Button>
    </div>
  );
}
