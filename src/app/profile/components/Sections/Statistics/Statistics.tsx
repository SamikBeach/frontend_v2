import { useParams } from 'next/navigation';
import { Suspense } from 'react';

import {
  ActivityFrequencyChart,
  AmountStatsChart,
  AuthorPublisherChart,
  BookMetadataStatsChart,
  CommentActivityChart,
  FollowerStatsChart,
  GenreAnalysisChart,
  LibraryCompositionChart,
  LibraryDiversityChart,
  LibraryPopularityChart,
  LibraryUpdatePatternChart,
  RatingStatsChart,
  ReadingStatusByPeriodChart,
  ReadingStatusChart,
  ReviewInfluenceChart,
  ReviewStatsChart,
  SearchActivityChart,
  UserInteractionChart,
} from './charts';
import { StatisticsSkeleton } from './StatisticsSkeleton';

// 기본 통계 카드 컴포넌트
interface StatsCardProps {
  children: React.ReactNode;
  className?: string;
}

const StatsCard = ({ children, className = '' }: StatsCardProps) => (
  <div className={`rounded-lg bg-white p-4 ${className}`}>{children}</div>
);

export default function Stats() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  return (
    <div className="space-y-5 bg-white">
      {/* 1. 독서 통계 섹션 */}
      <StatsCard>
        <h3 className="mb-3 text-base font-medium text-gray-700">독서 통계</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Suspense fallback={<StatisticsSkeleton />}>
            <ReadingStatusChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <ReadingStatusByPeriodChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <GenreAnalysisChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <AuthorPublisherChart userId={userId} />
          </Suspense>
        </div>
      </StatsCard>

      {/* 2. 독서 활동 통계 섹션 */}
      <StatsCard>
        <h3 className="mb-3 text-base font-medium text-gray-700">
          독서 활동 통계
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Suspense fallback={<StatisticsSkeleton />}>
            <ReviewStatsChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <RatingStatsChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <ActivityFrequencyChart userId={userId} />
          </Suspense>
        </div>
      </StatsCard>

      {/* 3. 커뮤니티 활동 통계 섹션 */}
      <StatsCard>
        <h3 className="mb-3 text-base font-medium text-gray-700">
          커뮤니티 활동 통계
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Suspense fallback={<StatisticsSkeleton />}>
            <UserInteractionChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <FollowerStatsChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <CommentActivityChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <ReviewInfluenceChart userId={userId} />
          </Suspense>
        </div>
      </StatsCard>

      {/* 4. 서재 통계 섹션 */}
      <StatsCard>
        <h3 className="mb-3 text-base font-medium text-gray-700">서재 통계</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Suspense fallback={<StatisticsSkeleton />}>
            <LibraryCompositionChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <LibraryPopularityChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <LibraryUpdatePatternChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <LibraryDiversityChart userId={userId} />
          </Suspense>
        </div>
      </StatsCard>

      {/* 5. 기타 통계 섹션 */}
      <StatsCard>
        <h3 className="mb-3 text-base font-medium text-gray-700">기타 통계</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Suspense fallback={<StatisticsSkeleton />}>
            <AmountStatsChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <SearchActivityChart userId={userId} />
          </Suspense>

          <Suspense fallback={<StatisticsSkeleton />}>
            <BookMetadataStatsChart userId={userId} />
          </Suspense>
        </div>
      </StatsCard>
    </div>
  );
}
