import { getAllLibraryTags } from '@/apis/library/library-tag';
import { LibraryTagResponseDto } from '@/apis/library/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface UseAllLibraryTagsResult {
  tags: LibraryTagResponseDto[];
  error?: Error | null;
}

// 태그를 가져오는 최대 개수
const MAX_LIMIT = 50;

export function useAllLibraryTags(limit: number = 20): UseAllLibraryTagsResult {
  const [error, setError] = useState<Error | null>(null);

  // 항상 최대 개수(50개)를 가져오고, 필요한 만큼만 사용
  const { data } = useSuspenseQuery({
    queryKey: ['allLibraryTags'], // limit 파라미터 제거
    queryFn: async () => {
      try {
        const response = await getAllLibraryTags(1, MAX_LIMIT);
        return response.tags;
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Failed to fetch all library tags'));
        }
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
    retry: 1, // 실패 시 1번 재시도
  });

  // 전체 데이터에서 요청된 limit만큼만 잘라서 반환
  const limitedTags = data ? data.slice(0, limit) : [];

  return {
    tags: limitedTags,
    error,
  };
}
