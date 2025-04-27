import { ReviewResponseDto } from '@/apis/review/types';
import {
  useUserActivityInfinite,
  useUserProfile,
  useUserRatingsInfinite,
  useUserReviewsInfinite,
} from '@/app/profile/hooks';
import { ReviewCard } from '@/components/ReviewCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ReviewContentSkeleton } from './ReviewSkeleton';

// 빈 상태 컴포넌트 - 리뷰
function EmptyReviewState() {
  return (
    <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          작성한 책 리뷰가 없습니다
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          아직 작성한 책 리뷰가 없습니다. 책을 읽고 리뷰를 작성해보세요.
        </p>
      </div>
    </div>
  );
}

// 빈 상태 컴포넌트 - 별점
function EmptyRatingState() {
  return (
    <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-50 py-16">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          작성한 별점이 없습니다
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          아직 작성한 별점이 없습니다. 책을 읽고 별점을 남겨보세요.
        </p>
      </div>
    </div>
  );
}

// 필터 메뉴 항목 컴포넌트
function MenuItem({
  id,
  name,
  count,
  isSelected,
  onClick,
}: {
  id: string;
  name: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        'flex h-8 cursor-pointer items-center rounded-full border px-3 text-[13px] font-medium transition-all',
        isSelected
          ? 'border-blue-200 bg-blue-50 text-blue-600'
          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
      )}
      onClick={onClick}
    >
      <span>{name}</span>
      <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-100 px-1 text-[11px] text-gray-600">
        {count}
      </span>
    </button>
  );
}

// 리뷰 목록 컴포넌트
function ReviewList() {
  const pageSize = 6;

  // 'review' 타입의 리뷰만 가져오는 hooks 사용
  const { reviews, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserReviewsInfinite(pageSize, ['review']);

  if (reviews.length === 0) {
    return <EmptyReviewState />;
  }

  return (
    <InfiniteScroll
      dataLength={reviews.length}
      next={fetchNextPage}
      hasMore={hasNextPage ?? false}
      loader={
        isFetchingNextPage && (
          <div className="mt-6 flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )
      }
      scrollThreshold={0.9}
      className="mt-8"
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {reviews.map((review: ReviewResponseDto) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

// 별점 목록 컴포넌트
function RatingList() {
  const pageSize = 6;

  // 별점 목록 가져오기
  const { ratings, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserRatingsInfinite(pageSize);

  if (ratings.length === 0) {
    return <EmptyRatingState />;
  }

  return (
    <InfiniteScroll
      dataLength={ratings.length}
      next={fetchNextPage}
      hasMore={hasNextPage ?? false}
      loader={
        isFetchingNextPage && (
          <div className="mt-6 flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )
      }
      scrollThreshold={0.9}
      className="mt-8"
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {ratings.map(rating => (
          <ReviewCard
            key={`rating-${rating.id}`}
            review={{
              id: rating.id,
              content: rating.comment || '',
              type: 'review', // 리뷰 타입 유지
              createdAt: rating.createdAt,
              updatedAt: rating.updatedAt,
              author: rating.user,
              books: rating.book ? [rating.book] : [],
              userRating: {
                bookId: rating.bookId,
                rating: rating.rating,
                comment: rating.comment,
              },
              likeCount: 0,
              commentCount: 0,
              isLiked: false,
              images: [],
              activityType: 'rating', // 별점 활동 타입 추가
            }}
          />
        ))}
      </div>
    </InfiniteScroll>
  );
}

// 전체 목록 컴포넌트 (활동 피드)
function AllList() {
  const pageSize = 6;

  // 통합된 활동 피드 사용 (API에서 리뷰와 별점을 함께 제공)
  const { activities, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserActivityInfinite(pageSize);

  if (activities.length === 0) {
    return <EmptyReviewState />;
  }

  return (
    <InfiniteScroll
      dataLength={activities.length}
      next={fetchNextPage}
      hasMore={hasNextPage ?? false}
      loader={
        isFetchingNextPage && (
          <div className="mt-6 flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )
      }
      scrollThreshold={0.9}
      className="mt-8"
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {activities.map(item => {
          // 활동 타입에 따라 ReviewCard에 맞는 형태로 표시
          const activityType = item.activityType || 'review';

          // 리뷰 타입인 경우
          if (activityType === 'review') {
            return <ReviewCard key={`review-${item.id}`} review={item} />;
          }

          // 별점 타입인 경우
          return (
            <ReviewCard
              key={`rating-${item.id}`}
              review={{
                id: item.id,
                content: item.comment || '',
                type: 'review', // 리뷰 타입 유지
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                author: item.user,
                books: item.book ? [item.book] : [],
                userRating: {
                  bookId: item.bookId,
                  rating: item.rating,
                  comment: item.comment,
                },
                likeCount: 0,
                commentCount: 0,
                isLiked: false,
                images: [],
                activityType: 'rating', // 별점 활동 타입 추가
              }}
            />
          );
        })}
      </div>
    </InfiniteScroll>
  );
}

// 선택된 탭에 따라 콘텐츠를 표시하는 컴포넌트
function ReviewContent({
  selectedTab,
}: {
  selectedTab: 'all' | 'reviews' | 'ratings';
}) {
  return (
    <>
      {selectedTab === 'all' && <AllList />}
      {selectedTab === 'reviews' && <ReviewList />}
      {selectedTab === 'ratings' && <RatingList />}
    </>
  );
}

// 필터 메뉴 컴포넌트 - 프로필 데이터를 가져와 카운트 표시
function FilterMenu({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: 'all' | 'reviews' | 'ratings';
  setSelectedTab: (tab: 'all' | 'reviews' | 'ratings') => void;
}) {
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

// 메인 컴포넌트
export default function Reviews() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'reviews' | 'ratings'>(
    'all'
  );

  return (
    <div>
      {/* 필터 메뉴 - 별도 컴포넌트로 분리 */}
      <FilterMenu selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* 선택된 탭에 따라 내용 표시 - Suspense로 감싸서 메뉴는 리로드되지 않도록 함 */}
      <Suspense fallback={<ReviewContentSkeleton />}>
        <ReviewContent selectedTab={selectedTab} />
      </Suspense>
    </div>
  );
}
