import { cn } from '@/lib/utils';
import { VisuallyHidden } from './visually-hidden';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  className,
}: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'relative animate-spin rounded-full',
        sizeClass[size],
        className
      )}
    >
      {/* 외부 링 */}
      <div className="absolute inset-0 rounded-full border-2 border-gray-200" />

      {/* 회전하는 게이지 */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gray-600" />

      <VisuallyHidden>로딩 중...</VisuallyHidden>
    </div>
  );
}
