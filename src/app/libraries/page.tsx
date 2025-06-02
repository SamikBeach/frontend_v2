'use client';

import { TimeRangeOptions } from '@/apis/library/types';
import {
  librarySearchQueryAtom,
  librarySortOptionAtom,
  libraryTagFilterAtom,
  libraryTimeRangeAtom,
} from '@/atoms/library';
import { useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Libraries } from './components/Libraries';

// 기본값 상수 정의
const DEFAULT_TAG_FILTER = 'all';
const DEFAULT_SORT_OPTION = 'popular';
const DEFAULT_TIME_RANGE = TimeRangeOptions.ALL;

// 메인 페이지 컴포넌트
export default function LibrariesPage() {
  const searchParams = useSearchParams();
  const setTagFilter = useSetAtom(libraryTagFilterAtom);
  const setSortOption = useSetAtom(librarySortOptionAtom);
  const setTimeRange = useSetAtom(libraryTimeRangeAtom);
  const setSearchQuery = useSetAtom(librarySearchQueryAtom);

  // URL에서 초기 필터 상태 설정
  useEffect(() => {
    // URL에서 파라미터 읽기
    const urlTag = searchParams.get('tag');
    const urlSort = searchParams.get('sort');
    const urlTimeRange = searchParams.get(
      'timeRange'
    ) as TimeRangeOptions | null;
    const urlQuery = searchParams.get('q');

    // 파라미터가 있는 경우에만 상태 업데이트
    if (urlTag) {
      setTagFilter(urlTag);
    } else {
      setTagFilter(DEFAULT_TAG_FILTER);
    }

    if (urlSort) {
      setSortOption(urlSort);
    } else {
      setSortOption(DEFAULT_SORT_OPTION);
    }

    if (
      urlTimeRange &&
      Object.values(TimeRangeOptions).includes(urlTimeRange)
    ) {
      setTimeRange(urlTimeRange);
    } else {
      setTimeRange(DEFAULT_TIME_RANGE);
    }

    if (urlQuery) {
      setSearchQuery(urlQuery);
    } else {
      setSearchQuery('');
    }

    // 필터나 정렬이 변경되었을 때 스크롤 위치를 맨 위로 이동
    // 초기 로드가 아닌 경우에만 스크롤 이동
    const isInitialLoad = !searchParams.toString();
    if (!isInitialLoad) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [searchParams, setTagFilter, setSortOption, setTimeRange, setSearchQuery]);

  return (
    <div className="w-full bg-white pb-8">
      <Libraries />
    </div>
  );
}
