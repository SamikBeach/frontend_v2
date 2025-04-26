import { TimeRange } from '@/apis/book/types';
import { getAllLibraries } from '@/apis/library';
import { Library, LibrarySortOption } from '@/apis/library/types';
import {
  librarySearchQueryAtom,
  librarySortOptionAtom,
  libraryTagFilterAtom,
  libraryTimeRangeAtom,
} from '@/atoms/library';
import { useQueryParams } from '@/hooks';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';

interface UseLibrariesResult {
  libraries: Library[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  tagFilter: string;
  sortOption: string;
  timeRange: TimeRange;
  searchQuery: string;
  handleSortChange: (sortId: string) => void;
  handleTimeRangeChange: (timeRange: TimeRange) => void;
  handleSearchChange: (value: string) => void;
  refetch: () => void;
}

export function useLibraries(): UseLibrariesResult {
  const user = useCurrentUser();
  const [tagFilter] = useAtom(libraryTagFilterAtom);
  const [sortOption, setSortOption] = useAtom(librarySortOptionAtom);
  const [timeRange, setTimeRange] = useAtom(libraryTimeRangeAtom);
  const [searchQuery, setSearchQuery] = useAtom(librarySearchQueryAtom);
  const { updateQueryParams } = useQueryParams();

  // URL 쿼리 파라미터 업데이트 - useCallback으로 메모이제이션
  const updateUrlParams = useCallback(() => {
    updateQueryParams({
      tag: tagFilter,
      sort: sortOption,
      timeRange,
      q: searchQuery || undefined,
    });
  }, [tagFilter, sortOption, timeRange, searchQuery, updateQueryParams]);

  // 컴포넌트 마운트 시에만 URL 파라미터 업데이트
  useEffect(() => {
    updateUrlParams();
  }, [updateUrlParams]);

  // 정렬 옵션을 API 정렬 옵션으로 변환
  const getApiSortOption = (): LibrarySortOption | undefined => {
    switch (sortOption) {
      case 'popular':
        return LibrarySortOption.SUBSCRIBERS;
      case 'books':
        return LibrarySortOption.BOOKS;
      case 'latest':
        return LibrarySortOption.RECENT;
      default:
        return undefined;
    }
  };

  // 태그 ID 얻기 (전체가 아닌 경우에만)
  const tagId = tagFilter !== 'all' ? parseInt(tagFilter, 10) : undefined;

  // 데이터 가져오기 - 무한 스크롤 지원
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['libraries', sortOption, searchQuery, tagId],
    queryFn: async ({ pageParam = 1 }) => {
      const apiSortOption = getApiSortOption();
      return await getAllLibraries(
        pageParam,
        9, // 한 페이지당 9개 항목
        apiSortOption,
        searchQuery,
        tagId
      );
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    placeholderData: keepPreviousData,
    retry: 1, // 실패 시 1번 재시도
  });

  // 모든 페이지의 서재 데이터 병합
  const libraries = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.data);
  }, [data]);

  // 핸들러 함수들 - useCallback으로 메모이제이션
  const handleSortChange = useCallback(
    (sortId: string) => {
      setSortOption(sortId);
    },
    [setSortOption]
  );

  const handleTimeRangeChange = useCallback(
    (newTimeRange: TimeRange) => {
      setTimeRange(newTimeRange);
    },
    [setTimeRange]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
    },
    [setSearchQuery]
  );

  return {
    libraries,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    tagFilter,
    sortOption,
    timeRange,
    searchQuery,
    handleSortChange,
    handleTimeRangeChange,
    handleSearchChange,
    refetch,
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
