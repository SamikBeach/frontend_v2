import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
  className?: string;
}

/**
 * 프로필 페이지의 모든 섹션에서 사용하는 통일된 Empty 상태 컴포넌트
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex h-64 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 sm:h-80 sm:px-6 sm:py-12 ${className}`}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:mb-6 sm:h-16 sm:w-16">
          {icon}
        </div>
      )}

      <h3 className="text-base font-medium text-gray-900 sm:text-lg">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-center text-xs text-gray-500 sm:mt-3 sm:text-sm">
        {description}
      </p>

      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'default'}
          className={`mt-4 h-9 rounded-full px-4 text-xs sm:mt-6 sm:h-10 sm:px-5 sm:text-sm ${
            action.variant === 'outline'
              ? 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
