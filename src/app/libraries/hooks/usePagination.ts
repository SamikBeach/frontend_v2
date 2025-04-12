import { useState } from 'react';

interface PaginationOptions {
  initialPage?: number;
  pageSize?: number;
  totalItems?: number;
}

interface UsePaginationResult {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  getItemsForPage: <T>(items: T[]) => T[];
}

export function usePagination({
  initialPage = 1,
  pageSize = 12,
  totalItems = 0,
}: PaginationOptions = {}): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // 총 페이지 수 계산
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // 현재 페이지가 유효한 범위 내에 있도록 조정
  const validatedCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // 페이지 설정
  const setPage = (page: number) => {
    const newPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(newPage);
  };

  // 다음 페이지
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // 이전 페이지
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // 현재 페이지에 해당하는 아이템들을 가져오는 함수
  const getItemsForPage = <T>(items: T[]): T[] => {
    const start = (validatedCurrentPage - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  };

  return {
    currentPage: validatedCurrentPage,
    pageSize,
    totalPages,
    setPage,
    nextPage,
    prevPage,
    getItemsForPage,
  };
}
