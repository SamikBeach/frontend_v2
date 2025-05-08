import { getAllLibraries } from '@/apis/library';
import {
  Library,
  LibrarySortOption,
  TimeRangeOptions,
} from '@/apis/library/types';
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

// 기본값 상수 정의
const DEFAULT_TAG_FILTER = 'all';
const DEFAULT_SORT_OPTION = 'popular';
const DEFAULT_TIME_RANGE = TimeRangeOptions.ALL;

interface UseLibrariesResult {
  libraries: Library[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  tagFilter: string;
  sortOption: string;
  timeRange: TimeRangeOptions;
  searchQuery: string;
  handleSortChange: (sortId: string) => void;
  handleTimeRangeChange: (timeRange: TimeRangeOptions) => void;
  handleSearchChange: (value: string) => void;
  refetch: () => void;
}

export function useLibraries(): UseLibrariesResult {
  const user = useCurrentUser();
  const [tagFilter, setTagFilter] = useAtom(libraryTagFilterAtom);
  const [sortOption, setSortOption] = useAtom(librarySortOptionAtom);
  const [timeRange, setTimeRange] = useAtom(libraryTimeRangeAtom);
  const [searchQuery, setSearchQuery] = useAtom(librarySearchQueryAtom);
  const { updateQueryParams } = useQueryParams();

  // URL 쿼리 파라미터 업데이트 - useCallback으로 메모이제이션
  const updateUrlParams = useCallback(() => {
    // 기본값과 다른 파라미터만 URL에 추가하는 객체 생성
    const params: Record<string, string | undefined> = {};

    // 기본값과 다른 경우에만 URL 파라미터에 추가
    if (tagFilter !== DEFAULT_TAG_FILTER) {
      params.tag = tagFilter;
    } else {
      params.tag = undefined;
    }

    if (sortOption !== DEFAULT_SORT_OPTION) {
      params.sort = sortOption;
    } else {
      params.sort = undefined;
    }

    if (timeRange !== DEFAULT_TIME_RANGE) {
      params.timeRange = timeRange;
    } else {
      params.timeRange = undefined;
    }

    // 검색어는 있는 경우에만 추가
    if (searchQuery) {
      params.q = searchQuery;
    } else {
      params.q = undefined;
    }

    // 파라미터가 있는 경우에만 URL 업데이트
    updateQueryParams(params);
  }, [tagFilter, sortOption, timeRange, searchQuery, updateQueryParams]);

  // 필터 상태가 변경될 때마다 URL 업데이트
  useEffect(() => {
    updateUrlParams();
  }, [tagFilter, sortOption, timeRange, searchQuery, updateUrlParams]);

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
    queryKey: ['libraries', sortOption, searchQuery, tagId, timeRange],
    queryFn: async ({ pageParam = 1 }) => {
      const apiSortOption = getApiSortOption();
      return await getAllLibraries(
        pageParam,
        9, // 한 페이지당 9개 항목
        apiSortOption,
        searchQuery,
        tagId,
        timeRange !== DEFAULT_TIME_RANGE ? timeRange : undefined
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
    (newTimeRange: TimeRangeOptions) => {
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
function getDateFromTimeRange(timeRange: TimeRangeOptions): Date | null {
  const now = new Date();

  switch (timeRange) {
    case TimeRangeOptions.TODAY:
      // 오늘 00:00:00 시간으로 설정
      now.setHours(0, 0, 0, 0);
      return now;
    case TimeRangeOptions.WEEK:
      // 이번 주 일요일로 설정 (0: 일요일, 1: 월요일, ..., 6: 토요일)
      now.setDate(now.getDate() - now.getDay());
      now.setHours(0, 0, 0, 0);
      return now;
    case TimeRangeOptions.MONTH:
      // 이번 달 1일로 설정
      now.setDate(1);
      now.setHours(0, 0, 0, 0);
      return now;
    case TimeRangeOptions.YEAR:
      // 올해 1월 1일로 설정
      now.setMonth(0, 1);
      now.setHours(0, 0, 0, 0);
      return now;
    default:
      // 'all'인 경우 null 반환
      return null;
  }
}
