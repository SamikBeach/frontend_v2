import { ReviewType } from '@/apis/review/types';
import { Suspense, useState } from 'react';
import { CommunityContentSkeleton } from './CommunitySkeleton';
import { FilterMenu, ReviewList } from './components';
import { useTypeCountsLoader } from './hooks';

/**
 * 필터와 콘텐츠를 함께 로드하는 내부 컴포넌트
 */
function FilterAndContentLoader() {
  const [selectedType, setSelectedType] = useState<ReviewType | undefined>(
    undefined
  );

  // 타입 카운트 로드
  const typeCounts = useTypeCountsLoader();

  return (
    <div>
      {/* 필터 메뉴 */}
      <FilterMenu
        counts={typeCounts}
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />

      {/* 리뷰 리스트 영역 - 메뉴 선택에 따라 이 부분만 다시 로드됨 */}
      <Suspense fallback={<CommunityContentSkeleton />}>
        <ReviewList selectedType={selectedType} />
      </Suspense>
    </div>
  );
}

/**
 * 프로필 페이지의 커뮤니티 섹션 메인 컴포넌트
 */
export default function Community() {
  return <FilterAndContentLoader />;
}
