import { getAllLibraryTags } from '@/apis/library/library-tag';
import { LibraryTagResponseDto } from '@/apis/library/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface UseAllLibraryTagsResult {
  tags: LibraryTagResponseDto[];
  error?: Error | null;
}

export function useAllLibraryTags(limit: number = 20): UseAllLibraryTagsResult {
  const [error, setError] = useState<Error | null>(null);

  const { data } = useSuspenseQuery({
    queryKey: ['allLibraryTags', limit],
    queryFn: async () => {
      try {
        const response = await getAllLibraryTags(1, limit);
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

  return {
    tags: data || [],
    error,
  };
}
