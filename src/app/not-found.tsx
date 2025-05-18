'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          Loading...
        </div>
      }
    >
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <h2 className="mb-6 text-xl">페이지를 찾을 수 없습니다</h2>
        <p className="mb-8 text-center text-gray-600">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Button asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </Suspense>
  );
}
