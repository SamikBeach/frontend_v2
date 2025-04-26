'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ErrorView } from './ErrorView';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 전역 에러 핸들러 등록
    const handleError = () => {
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <ErrorView
        onRetry={() => {
          setHasError(false);
          router.refresh();
        }}
      />
    );
  }

  return <>{children}</>;
}
