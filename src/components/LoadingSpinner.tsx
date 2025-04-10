import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  height?: string;
  width?: string;
}

export function LoadingSpinner({
  className,
  height = 'h-12',
  width = 'w-12',
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          `animate-spin rounded-full border-4 border-gray-200 border-t-gray-900`,
          height,
          width
        )}
      ></div>
    </div>
  );
}
