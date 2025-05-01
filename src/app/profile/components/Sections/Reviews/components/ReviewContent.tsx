import { AllList } from './AllList';
import { ReviewTab } from './FilterMenu';
import { RatingList } from './RatingList';
import { ReviewList } from './ReviewList';

interface ReviewContentProps {
  selectedTab: ReviewTab;
}

export function ReviewContent({ selectedTab }: ReviewContentProps) {
  return (
    <>
      {selectedTab === 'all' && <AllList />}
      {selectedTab === 'reviews' && <ReviewList />}
      {selectedTab === 'ratings' && <RatingList />}
    </>
  );
}
