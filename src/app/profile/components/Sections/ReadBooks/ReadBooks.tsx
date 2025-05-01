import { ReadingStatusType } from '@/apis/reading-status/types';
import { Suspense, useState } from 'react';
import { BooksList, FilterMenu } from './components';
import { useReadingStatusCounts } from './hooks';
import { BooksGridSkeleton, FilterMenuSkeleton } from './ReadBooksSkeleton';

// 메인 컴포넌트 - 필터 탭 포함
export default function ReadBooks() {
  const [selectedStatus, setSelectedStatus] = useState<
    ReadingStatusType | undefined
  >(undefined);

  const { statusCounts, isLoading } = useReadingStatusCounts();

  // 독서 상태 변경 핸들러
  const handleStatusChange = (statusType: ReadingStatusType | undefined) => {
    setSelectedStatus(statusType);
  };

  return (
    <div>
      {/* 독서 상태 필터 */}
      {isLoading ? (
        <FilterMenuSkeleton />
      ) : (
        <FilterMenu
          selectedStatus={selectedStatus}
          statusCounts={statusCounts}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* 책 목록 섹션 - 필터 선택에 따라 이 부분만 다시 로드됨 */}
      <Suspense fallback={<BooksGridSkeleton />}>
        <BooksList status={selectedStatus} />
      </Suspense>
    </div>
  );
}
