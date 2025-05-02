import { useParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import {
  ActivityFrequencyChart,
  AuthorPublisherChart,
  CommunityActivityChart,
  CommunityInfluenceChart,
  FollowerStatsChart,
  GenreAnalysisChart,
  LibraryCompositionChart,
  LibraryPopularityChart,
  LibraryUpdatePatternChart,
  RatingStatsChart,
  ReadingStatusByPeriodChart,
  ReadingStatusChart,
  ReviewStatsChart,
  SearchActivityChart,
  UserInteractionChart,
} from './charts';
import { ProfileTabs, TabsSkeleton } from './components';
import { ProfileSkeleton } from './ProfileSkeleton';

// Content by section
function SectionContent({
  selectedSection,
  userId,
}: {
  selectedSection: string;
  userId: number;
}) {
  switch (selectedSection) {
    case 'reading':
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Suspense fallback={<ProfileSkeleton />}>
            <ReadingStatusChart userId={userId} />
          </Suspense>

          <Suspense fallback={<ProfileSkeleton />}>
            <ReadingStatusByPeriodChart userId={userId} />
          </Suspense>

          <Suspense fallback={<ProfileSkeleton />}>
            <GenreAnalysisChart userId={userId} />
          </Suspense>

          <Suspense fallback={<ProfileSkeleton />}>
            <AuthorPublisherChart userId={userId} />
          </Suspense>
        </div>
      );

    case 'activity':
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Suspense fallback={<ProfileSkeleton />}>
            <ReviewStatsChart userId={userId} />
          </Suspense>

          <Suspense fallback={<ProfileSkeleton />}>
            <RatingStatsChart userId={userId} />
          </Suspense>

          <Suspense fallback={<ProfileSkeleton />}>
            <ActivityFrequencyChart userId={userId} />
          </Suspense>
        </div>
      );

    case 'community':
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Suspense fallback={<ProfileSkeleton />}>
            <UserInteractionChart userId={userId} />
          </Suspense>

          <Suspense fallback={<ProfileSkeleton />}>
            <FollowerStatsChart userId={userId} />
          </Suspense>

          <Suspense fallback={<ProfileSkeleton />}>
            <CommunityActivityChart userId={userId} />
          </Suspense>

          <Suspense fallback={<ProfileSkeleton />}>
            <CommunityInfluenceChart userId={userId} />
          </Suspense>
        </div>
      );

    case 'library':
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Suspense fallback={<ProfileSkeleton />}>
            <LibraryCompositionChart userId={userId} />
          </Suspense>

          <Suspense fallback={<ProfileSkeleton />}>
            <LibraryPopularityChart userId={userId} />
          </Suspense>

          <Suspense fallback={<ProfileSkeleton />}>
            <LibraryUpdatePatternChart userId={userId} />
          </Suspense>
        </div>
      );

    case 'etc':
      return (
        <div className="grid grid-cols-1 gap-3">
          <Suspense fallback={<ProfileSkeleton />}>
            <SearchActivityChart userId={userId} />
          </Suspense>
        </div>
      );

    default:
      return null;
  }
}

// Main section loader
function ProfileStatsLoader() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const [selectedSection, setSelectedSection] = useState('reading');

  return (
    <div className="space-y-5 bg-white">
      {/* 탭 메뉴 */}
      <Suspense fallback={<TabsSkeleton />}>
        <ProfileTabs
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
        />
      </Suspense>

      {/* 선택된 콘텐츠 */}
      <SectionContent selectedSection={selectedSection} userId={userId} />
    </div>
  );
}

// Main export component
export default function ProfileStats() {
  return <ProfileStatsLoader />;
}
