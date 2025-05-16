'use client';

import { CreateLibraryDto } from '@/apis/library/types';
import { LibraryDialog } from '@/components/Library';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Clock, Flame, Library, Plus } from 'lucide-react';
import { useState } from 'react';
import { useLibraries } from '../hooks/useLibraries';
import { SortOption } from '../types';
import { Header } from './Header';
import { LibraryList, LibraryListSkeleton } from './LibraryList';
import { useCreateLibrary } from './hooks/useCreateLibrary';

// 정렬 옵션 정의
const sortOptions: SortOption[] = [
  {
    id: 'popular',
    label: '인기순',
    icon: <Flame className="h-4 w-4" />,
  },
  {
    id: 'books',
    label: '담긴 책 많은 순',
    icon: <Library className="h-4 w-4" />,
  },
  {
    id: 'latest',
    label: '최신순',
    icon: <Clock className="h-4 w-4" />,
  },
];

interface LibrariesProps {
  setSearchQuery?: (query: string) => void;
}

export function Libraries({ setSearchQuery }: LibrariesProps) {
  const currentUser = useCurrentUser();
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);

  const {
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
  } = useLibraries();

  // 현재 사용자 ID가 있는 경우 서재 생성 훅 사용
  const { createLibraryMutation } = useCreateLibrary(
    currentUser?.id || 0,
    () => {
      setShowLibraryDialog(false);
      refetch(); // 서재 목록 갱신
    }
  );

  // 새 서재 만들기 클릭 핸들러
  const handleCreateLibrary = () => {
    if (!currentUser) {
      // 로그인 필요 메시지 또는 로그인 다이얼로그 표시 로직 추가
      return;
    }
    setShowLibraryDialog(true);
  };

  // 새 서재 생성 처리 함수
  const handleCreateNewLibrary = async (libraryData: CreateLibraryDto) => {
    return createLibraryMutation(libraryData);
  };

  // 검색어 변경 핸들러 (URL 업데이트 지원)
  const onSearchChange = (value: string) => {
    // 외부에서 전달된 함수가 있으면 사용
    if (setSearchQuery) {
      setSearchQuery(value);
    } else {
      // 그렇지 않으면 내부 핸들러 사용
      handleSearchChange(value);
    }
  };

  return (
    <>
      {/* Header 컴포넌트로 필터 영역 분리 */}
      <Header
        sortOption={sortOption}
        sortOptions={sortOptions}
        searchQuery={searchQuery}
        timeRange={timeRange}
        onSortChange={handleSortChange}
        onTimeRangeChange={handleTimeRangeChange}
        onSearchChange={onSearchChange}
      />

      {/* 메인 콘텐츠 */}
      <div className="px-2 pt-2 pb-4 md:px-4 md:pt-4">
        {/* 서재 목록 */}
        {isLoading ? (
          <LibraryListSkeleton />
        ) : (
          <LibraryList
            libraries={libraries}
            tagFilter={tagFilter}
            searchQuery={searchQuery}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}
      </div>

      {/* 새 서재 만들기 다이얼로그 */}
      <LibraryDialog
        open={showLibraryDialog}
        onOpenChange={setShowLibraryDialog}
        mode="create"
        onCreateLibrary={handleCreateNewLibrary}
      />

      {/* 우측 하단 고정 플러스 버튼 (채널톡 버튼처럼) */}
      {currentUser && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleCreateLibrary}
              className="fixed right-6 bottom-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 p-0 shadow-lg transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:bg-gray-800 hover:shadow-xl"
              size="icon"
            >
              <Plus className="h-5 w-5 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="text-sm">새 서재 만들기</p>
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
