import { getAllLibraries, LibrarySummary } from '@/apis/library';
import {
  libraryCategoryFilterAtom,
  librarySearchQueryAtom,
  librarySortOptionAtom,
  libraryTimeRangeAtom,
} from '@/atoms/library';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

interface UseLibrariesResult {
  libraries: LibrarySummary[];
}

export function useLibraries(): UseLibrariesResult {
  const user = useCurrentUser();
  const categoryFilter = useAtomValue(libraryCategoryFilterAtom);
  const sortOption = useAtomValue(librarySortOptionAtom);
  const timeRange = useAtomValue(libraryTimeRangeAtom);
  const searchQuery = useAtomValue(librarySearchQueryAtom);

  // 데이터 가져오기
  const { data: libraries } = useSuspenseQuery({
    queryKey: ['libraries', user?.id],
    queryFn: () => getAllLibraries(user?.id),
  });

  // 필터링 및 정렬된 서재 목록
  const filteredAndSortedLibraries = useMemo(() => {
    if (!libraries) return [];

    // 카테고리 필터링
    let filtered = libraries;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(library => {
        // 태그 목록에서 카테고리와 일치하는 태그가 있는지 확인
        return library.tags?.some(tag => tag.name === categoryFilter);
      });
    }

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        library =>
          library.name.toLowerCase().includes(query) ||
          (library.description &&
            library.description.toLowerCase().includes(query)) ||
          library.tags?.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    // 정렬
    const sorted = [...filtered];
    switch (sortOption) {
      case 'popular':
        sorted.sort((a, b) => b.subscriberCount - a.subscriberCount);
        break;
      case 'latest':
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'title':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    // 기간 필터링 (인기순 정렬일 때만)
    if (sortOption === 'popular' && timeRange !== 'all') {
      const cutoffDate = getDateFromTimeRange(timeRange);
      if (cutoffDate) {
        return sorted.filter(library => {
          const libraryDate = new Date(library.createdAt);
          return libraryDate >= cutoffDate;
        });
      }
    }

    return sorted;
  }, [libraries, categoryFilter, sortOption, timeRange, searchQuery]);

  return {
    libraries: filteredAndSortedLibraries || [],
  };
}

// 기간별 필터링을 위한 날짜 계산 함수
function getDateFromTimeRange(timeRange: string): Date | null {
  const now = new Date();

  switch (timeRange) {
    case 'today':
      // 오늘 00:00:00 시간으로 설정
      now.setHours(0, 0, 0, 0);
      return now;
    case 'week':
      // 이번 주 일요일로 설정 (0: 일요일, 1: 월요일, ..., 6: 토요일)
      now.setDate(now.getDate() - now.getDay());
      now.setHours(0, 0, 0, 0);
      return now;
    case 'month':
      // 이번 달 1일로 설정
      now.setDate(1);
      now.setHours(0, 0, 0, 0);
      return now;
    case 'year':
      // 올해 1월 1일로 설정
      now.setMonth(0, 1);
      now.setHours(0, 0, 0, 0);
      return now;
    default:
      // 'all'인 경우 null 반환
      return null;
  }
}
