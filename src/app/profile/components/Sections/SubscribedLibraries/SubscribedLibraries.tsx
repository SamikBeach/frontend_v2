import { useParams } from 'next/navigation';
import { useIsMyProfile } from '../../../hooks';
import { EmptyState, LibraryList } from './components';
import { useLibraryTags, useUserSubscribedLibraries } from './hooks';

export default function SubscribedLibraries() {
  const { id } = useParams();
  const userId = Number(id);
  const isMyProfile = useIsMyProfile();
  const pageSize = 6;

  // 구독한 서재 목록 가져오기 (무한 스크롤)
  const {
    libraries,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserSubscribedLibraries({
    userId,
    pageSize,
  });

  // 태그 리스트 생성
  const tags = useLibraryTags(libraries);

  // 구독한 서재가 없는 경우
  if (libraries.length === 0) {
    return <EmptyState isMyProfile={isMyProfile} />;
  }

  // 구독한 서재 목록 렌더링
  return (
    <LibraryList
      libraries={libraries}
      tags={tags}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}
