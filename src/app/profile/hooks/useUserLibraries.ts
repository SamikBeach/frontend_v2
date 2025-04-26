import api from '@/apis/axios';
import { LibraryPreviewDto } from '@/apis/user/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface UseUserLibrariesProps {
  userId: number;
  initialPage?: number;
  pageSize?: number;
}

interface UseUserLibrariesResult {
  libraries: LibraryPreviewDto[];
  totalLibraries: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 사용자의 서재 목록을 가져오는 훅
 */
export function useUserLibraries({
  userId,
  initialPage = 1,
  pageSize = 6,
}: UseUserLibrariesProps): UseUserLibrariesResult {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetchUserLibraries = async () => {
    const response = await api.get(`/user/${userId}/libraries`, {
      params: { page: currentPage, limit: pageSize },
    });
    return response.data;
  };

  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ['user-libraries', userId, currentPage, pageSize],
    queryFn: fetchUserLibraries,
  });

  // 변경된 응답 구조에 맞게 데이터 처리
  const libraries = data?.items || [];
  const totalLibraries = data?.total || 0;

  // 백엔드가 totalPages를 직접 반환하지 않으므로 계산
  const totalPages = Math.ceil(totalLibraries / pageSize) || 1;

  return {
    libraries,
    totalLibraries,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoading,
    error,
  };
}
