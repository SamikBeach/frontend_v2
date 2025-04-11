import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // 표시할 페이지 숫자 결정
  const getPageNumbers = () => {
    const pages = [];

    // 항상 첫 페이지는 보여준다
    if (currentPage > 3) {
      pages.push(1);
      // 현재 페이지가 4보다 크면 ... 표시
      if (currentPage > 4) {
        pages.push(-1); // -1은 ... 표시를 의미
      }
    }

    // 현재 페이지 주변 페이지 표시
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // 항상 마지막 페이지는 보여준다
    if (currentPage < totalPages - 2) {
      // 현재 페이지가 마지막에서 3페이지 이상 떨어져 있으면 ... 표시
      if (currentPage < totalPages - 3) {
        pages.push(-1);
      }
      pages.push(totalPages);
    }

    return pages;
  };

  // 페이지 숫자 클릭 핸들러
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // 이전 페이지로 이동
  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 페이지 수가 1보다 작거나 같으면 페이지네이션 숨김
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      {/* 이전 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={goToPrevPage}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">이전 페이지</span>
      </Button>

      {/* 페이지 숫자 버튼 */}
      {getPageNumbers().map((page, index) =>
        page === -1 ? (
          // ... 표시
          <div key={`ellipsis-${index}`} className="px-2 text-gray-500">
            ...
          </div>
        ) : (
          // 페이지 번호 버튼
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePageClick(page)}
          >
            {page}
          </Button>
        )
      )}

      {/* 다음 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">다음 페이지</span>
      </Button>
    </nav>
  );
}
