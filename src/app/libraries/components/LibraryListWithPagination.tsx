import { Library as ApiLibrary } from '@/apis/library/types';
import { LibraryCard } from '@/components/LibraryCard';
import { useEffect } from 'react';
import { usePagination } from '../hooks/usePagination';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';

interface LibraryListWithPaginationProps {
  libraries: ApiLibrary[];
  searchQuery: string;
  categoryFilter: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function LibraryListWithPagination({
  libraries,
  searchQuery,
  categoryFilter,
  currentPage,
  setCurrentPage,
}: LibraryListWithPaginationProps) {
  // 페이지네이션 설정
  const ITEMS_PER_PAGE = 12;
  const pagination = usePagination({
    initialPage: currentPage,
    pageSize: ITEMS_PER_PAGE,
    totalItems: libraries.length,
  });

  // 현재 페이지 아이템만 가져오기
  const pagedLibraries = pagination.getItemsForPage(libraries);

  // currentPage가 외부에서 변경되면 pagination 상태도 업데이트
  useEffect(() => {
    pagination.setPage(currentPage);
  }, [currentPage, pagination]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    pagination.setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (libraries.length === 0) {
    return (
      <EmptyState searchQuery={searchQuery} selectedCategory={categoryFilter} />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {pagedLibraries.map(library => (
          <LibraryCard key={library.id} library={library} />
        ))}
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
