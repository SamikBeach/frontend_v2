'use client';

import { getReviewById } from '@/apis/review';
import { ReviewCard } from '@/components/ReviewCard';
import { ExtendedReviewResponseDto } from '@/components/ReviewCard/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center">
      <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-medium text-red-800">
          리뷰를 불러오는 데 실패했습니다
        </h3>
        <p className="mb-4 text-sm text-red-600">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

function ReviewDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-0 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="ml-3 flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-1 h-4 w-24" />
        </div>
      </div>
      <Skeleton className="mb-4 h-64 w-full rounded-lg" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
}

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ reviewId: string }>;
}) {
  // React.use()를 사용하여 params Promise를 언래핑
  const unwrappedParams = React.use(params);
  const reviewIdParam = parseInt(unwrappedParams.reviewId, 10);

  // 잘못된 ID 처리
  if (isNaN(reviewIdParam)) {
    return (
      <div className="py-20 text-center text-gray-500">
        잘못된 리뷰 ID입니다.
      </div>
    );
  }

  // useQuery를 사용하여 데이터 로딩 상태 관리
  const {
    data: review,
    isLoading,
    isError,
    error,
  } = useQuery<ExtendedReviewResponseDto, Error>({
    queryKey: ['review', reviewIdParam],
    queryFn: () => getReviewById(reviewIdParam),
  });

  // 로딩 중 상태 표시
  if (isLoading) {
    return (
      <div>
        <ReviewDetailSkeleton />
      </div>
    );
  }

  // 에러 상태 표시
  if (isError) {
    return (
      <div>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="flex min-h-[80vh] w-full flex-col items-center justify-center">
            <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center">
              <h3 className="mb-2 text-lg font-medium text-red-800">
                리뷰를 불러오는 데 실패했습니다
              </h3>
              <p className="mb-4 text-sm text-red-600">{error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
              >
                다시 시도
              </button>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!review) {
    return (
      <div>
        <div className="py-20 text-center text-gray-500">
          리뷰를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  // 데이터가 있는 경우 정상 표시
  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 py-0 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            href="/community"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>목록으로</span>
          </Link>
        </div>
        <ReviewCard review={review} isDetailed={true} />
      </div>
    </div>
  );
}
