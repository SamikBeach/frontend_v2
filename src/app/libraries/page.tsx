'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useUrlParams } from '@/hooks';

// 분리된 데이터와 컴포넌트 가져오기
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { LibraryCard } from './components/LibraryCard';
import { SearchBar } from './components/SearchBar';
import { SortDropdown } from './components/SortDropdown';
import { libraries, libraryCategories, sortOptions } from './data';

// 스크롤바 숨기는 CSS 추가
const noScrollbarStyles = `
  /* 스크롤바 숨김 */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// 메인 페이지 컴포넌트
export default function LibrariesPage() {
  // URL 파라미터 관리
  const { params, setParam } = useUrlParams({
    defaultValues: {
      category: 'all', // all, philosophy, literature, history, science
      sort: 'popular', // popular, latest, title
    },
  });

  const selectedCategory = params.category || 'all';
  const selectedSort = params.sort || 'popular';
  const [searchQuery, setSearchQuery] = useState('');

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (categoryId: string) => {
    setParam('category', categoryId);
  };

  // 정렬 옵션 클릭 핸들러
  const handleSortChange = (sortId: string) => {
    setParam('sort', sortId);
  };

  // 필터링 로직
  let filteredLibraries = libraries;

  // 카테고리 필터링
  if (selectedCategory !== 'all') {
    filteredLibraries = libraries.filter(
      library => library.category === selectedCategory
    );
  }

  // 검색 필터링
  if (searchQuery) {
    filteredLibraries = filteredLibraries.filter(
      library =>
        library.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        library.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        library.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }

  // 정렬 로직
  const sortedLibraries = useMemo(() => {
    const currentSortOption =
      sortOptions.find(option => option.id === selectedSort) || sortOptions[0];
    return [...filteredLibraries].sort(currentSortOption.sortFn);
  }, [filteredLibraries, selectedSort]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: noScrollbarStyles }} />
      <div className="min-h-screen w-full bg-white">
        <div className="flex w-full flex-col py-4">
          {/* 상단 검색 및 필터 영역 */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-3">
              <SearchBar
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <SortDropdown
                selectedSort={selectedSort}
                onSortChange={handleSortChange}
                sortOptions={sortOptions}
              />
            </div>
            <Button className="h-10 min-w-max rounded-xl bg-gray-900 hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />새 서재 만들기
            </Button>
          </div>

          {/* 필터 바 */}
          <div className="mb-6 px-4">
            <FilterBar
              categories={libraryCategories}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 px-4">
            {/* 서재 목록 */}
            {sortedLibraries.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {sortedLibraries.map(library => (
                  <LibraryCard key={library.id} library={library} />
                ))}
              </div>
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
