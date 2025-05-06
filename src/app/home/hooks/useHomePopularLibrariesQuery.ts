import { getPopularLibrariesForHome } from '@/apis/library/library';
import {
  HomeLibraryPreview,
  LibraryListItem,
  PaginatedLibraryResponse,
  TimeRangeOptions,
} from '@/apis/library/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * 홈 화면에 표시할 인기 서재 데이터를 가져오는 훅
 * @param limit 가져올 서재 수 (기본값: 3)
 * @param timeRange 특정 기간 데이터만 가져오는 필터 (기본값: 없음)
 */
export function useHomePopularLibrariesQuery(
  limit: number = 3,
  timeRange?: TimeRangeOptions
) {
  const { data, isLoading } = useSuspenseQuery<PaginatedLibraryResponse>({
    queryKey: ['home', 'popularLibraries', limit, timeRange],
    queryFn: () => getPopularLibrariesForHome(limit, timeRange),
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시
  });

  // LibraryListItem에서 HomeLibraryPreview 형식으로 변환
  const libraries = useMemo<HomeLibraryPreview[]>(() => {
    if (!data?.data) return [];

    console.log('Library API Response:', data);

    return data.data.map((library: LibraryListItem) => {
      console.log('Library owner:', library.owner);
      console.log('Profile Image:', library.owner?.profileImage);

      return {
        ...library, // 모든 원본 데이터 유지
        id: library.id,
        name: library.name,
        description: library.description,
        bookCount: library.bookCount || 0,
        isPublic: library.isPublic,
        subscriberCount: library.subscriberCount || 0,
        ownerName: library.owner?.username || '',
        owner: library.owner, // 전체 owner 객체 유지
        previewBooks: library.previewBooks || [], // previewBooks 필드 그대로 사용
        tags: library.tags || [],
        createdAt: library.createdAt,
        updatedAt: library.updatedAt,
      };
    });
  }, [data]);

  return {
    libraries,
    isLoading,
    totalLibraries: data?.meta?.total || 0,
  };
}
