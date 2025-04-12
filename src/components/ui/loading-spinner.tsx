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
        'animate-spin rounded-full border-t-2 border-b-2 border-gray-900',
        sizeClass[size],
        className
      )}
    >
      <VisuallyHidden>로딩 중...</VisuallyHidden>
    </div>
  );
}
