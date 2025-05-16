import { ReactNode } from 'react';

interface ChartContainerProps {
  children: ReactNode;
  className?: string;
}

export function ChartContainer({
  children,
  className = '',
}: ChartContainerProps) {
  return (
    <div
      className={`min-h-[400px] w-full rounded-lg bg-white p-0 sm:p-3 ${className}`}
    >
      {children}
    </div>
  );
}
