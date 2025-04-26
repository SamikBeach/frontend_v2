import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

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
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePreviousPage = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  // 페이지 번호 계산 (최대 5개만 표시)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    // 총 페이지가 최대 표시 페이지 수보다 작거나 같은 경우
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 현재 페이지가 앞쪽에 있는 경우
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      }
      // 현재 페이지가 뒤쪽에 있는 경우
      else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      }
      // 현재 페이지가 중간에 있는 경우
      else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 이전 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={handlePreviousPage}
        disabled={isFirstPage}
        className="h-9 w-9 rounded-md"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">이전 페이지</span>
      </Button>

      {/* 페이지 번호 */}
      {getPageNumbers().map(page => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="icon"
          onClick={() => onPageChange(page)}
          className={`h-9 w-9 rounded-md ${
            currentPage === page ? 'bg-gray-900 text-white' : 'text-gray-700'
          }`}
        >
          {page}
        </Button>
      ))}

      {/* 다음 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextPage}
        disabled={isLastPage}
        className="h-9 w-9 rounded-md"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">다음 페이지</span>
      </Button>
    </div>
  );
}
