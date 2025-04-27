import { Suspense, useState } from 'react';
import { ReviewContentSkeleton } from './ReviewSkeleton';
import { FilterMenu, ReviewContent, type ReviewTab } from './components';

/**
 * 프로필 페이지의 리뷰 및 별점 섹션 메인 컴포넌트
 */
export default function Reviews() {
  const [selectedTab, setSelectedTab] = useState<ReviewTab>('all');

  return (
    <div>
      {/* 필터 메뉴 */}
      <FilterMenu selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* 선택된 탭에 따라 내용 표시 - Suspense로 감싸서 메뉴는 리로드되지 않도록 함 */}
      <Suspense fallback={<ReviewContentSkeleton />}>
        <ReviewContent selectedTab={selectedTab} />
      </Suspense>
    </div>
  );
}
