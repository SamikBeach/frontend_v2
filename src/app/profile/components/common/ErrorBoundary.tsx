'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ErrorView } from './ErrorView';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// 하이드레이션 에러인지 확인하는 함수
function isHydrationError(error: ErrorEvent | PromiseRejectionEvent): boolean {
  if ('error' in error) {
    const message = error.error?.message || error.message || '';
    return (
      message.includes('Hydration') ||
      message.includes('hydration') ||
      message.includes('Text content does not match') ||
      message.includes('server-rendered HTML') ||
      message.includes('useLayoutEffect does nothing on the server')
    );
  }

  if ('reason' in error) {
    const message = error.reason?.message || String(error.reason) || '';
    return (
      message.includes('Hydration') ||
      message.includes('hydration') ||
      message.includes('Text content does not match') ||
      message.includes('server-rendered HTML') ||
      message.includes('useLayoutEffect does nothing on the server')
    );
  }

  return false;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 전역 에러 핸들러 등록
    const handleError = (event: ErrorEvent) => {
      // 하이드레이션 에러는 무시
      if (isHydrationError(event)) {
        console.warn(
          'Hydration error ignored:',
          event.error?.message || event.message
        );
        return;
      }
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // 하이드레이션 에러는 무시
      if (isHydrationError(event)) {
        console.warn('Hydration promise rejection ignored:', event.reason);
        return;
      }
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
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
