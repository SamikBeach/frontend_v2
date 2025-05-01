import { useUserProfile } from '@/app/profile/hooks';
import { useParams } from 'next/navigation';
import { MenuItem } from './MenuItem';

// 탭 타입 정의
export type ReviewTab = 'all' | 'reviews' | 'ratings';

interface FilterMenuProps {
  selectedTab: ReviewTab;
  setSelectedTab: (tab: ReviewTab) => void;
}

export function FilterMenu({ selectedTab, setSelectedTab }: FilterMenuProps) {
  const params = useParams();
  const userId = Number(params.id);
  const { profileData } = useUserProfile(userId);

  // 리뷰 카운트 가져오기
  const reviewCount = profileData.reviewCount.review || 0;
  const ratingCount = profileData.ratingCount || 0;
  const totalCount =
    profileData.reviewAndRatingCount ||
    profileData.reviewCount.total + profileData.ratingCount;

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <MenuItem
        id="all"
        name="전체"
        count={totalCount}
        isSelected={selectedTab === 'all'}
        onClick={() => setSelectedTab('all')}
      />
      <MenuItem
        id="reviews"
        name="리뷰"
        count={reviewCount}
        isSelected={selectedTab === 'reviews'}
        onClick={() => setSelectedTab('reviews')}
      />
      <MenuItem
        id="ratings"
        name="별점만"
        count={ratingCount}
        isSelected={selectedTab === 'ratings'}
        onClick={() => setSelectedTab('ratings')}
      />
    </div>
  );
}
