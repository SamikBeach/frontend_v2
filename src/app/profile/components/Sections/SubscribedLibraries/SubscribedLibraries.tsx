import api from '@/apis/axios';
import { LibraryPreviewDto } from '@/apis/user/types';
import { LibraryCard } from '@/components/LibraryCard';
import { Tag, getTagColor } from '@/utils/tags';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useIsMyProfile } from '../../../hooks';

// 구독한 서재 목록을 가져오는 훅 (무한 스크롤 지원)
function useSubscribedLibraries(userId: number, limit: number = 6) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['subscribed-libraries-infinite', userId, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get(`/user/${userId}/subscriptions`, {
        params: { page: pageParam, limit },
      });

      // 응답 데이터에 페이지 정보 추가
      const data = response.data;
      const total = data.total || 0;
      const totalPages = Math.ceil(total / limit) || 1;

      return {
        ...data,
        hasNextPage: pageParam < totalPages,
        page: pageParam,
        totalPages,
      };
    },
    getNextPageParam: lastPage => {
      // 다음 페이지가 있는 경우 페이지 번호 반환, 없는 경우 undefined
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // 모든 페이지의 서재 목록을 하나의 배열로 병합
  const libraries = data?.pages.flatMap(page => page.items || []) || [];

  // 총 서재 수는 첫 페이지의 total 값을 사용
  const total = data?.pages[0]?.total || 0;

  return {
    libraries,
    total,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading: status === 'pending',
    error: error,
  };
}

// 태그에 색상을 추가하는 함수
function formatLibraryTags(libraries: LibraryPreviewDto[]): Tag[] {
  // 모든 라이브러리에서 태그를 추출해 중복을 제거한 후 색상 추가
  const tagMap = new Map<string, Tag>();

  libraries.forEach(library => {
    if (!library.tags) return;

    library.tags.forEach((tag, index) => {
      if (!tagMap.has(String(tag.tagId))) {
        tagMap.set(String(tag.tagId), {
          id: String(tag.tagId),
          name: tag.tagName,
          color: getTagColor(index),
        });
      }
    });
  });

  return Array.from(tagMap.values());
}

export default function SubscribedLibraries() {
  const { id } = useParams();
  const userId = Number(id);
  const isMyProfile = useIsMyProfile();
  const pageSize = 6;

  // 구독 서재 목록 가져오기 (무한 스크롤)
  const {
    libraries,
    total,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSubscribedLibraries(userId, pageSize);

  // 태그 리스트 생성
  const tags = formatLibraryTags(libraries);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 w-full animate-pulse rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>
    );
  }

  if (libraries.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
        <div className="text-center">
          <p className="mb-1 text-sm font-medium text-gray-900">
            {isMyProfile
              ? '아직 구독한 서재가 없습니다'
              : '이 사용자가 구독한 서재가 없습니다'}
          </p>
          <p className="text-xs text-gray-500">
            {isMyProfile
              ? '다른 사용자의 서재를 구독해보세요'
              : '다른 사용자를 확인해보세요'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <InfiniteScroll
      dataLength={libraries.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={
        <div className="mt-6 flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      }
      scrollThreshold={0.9}
      className="flex w-full flex-col pb-4"
      style={{ overflow: 'visible' }} // 스크롤바 숨기기
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {libraries.map((library: LibraryPreviewDto) => (
          <LibraryCard key={library.id} library={library} tags={tags} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
