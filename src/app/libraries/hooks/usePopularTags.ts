import { getPopularTags } from '@/apis/library/tag';
import { TagResponseDto } from '@/apis/library/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface UsePopularTagsResult {
  tags: TagResponseDto[];
  isLoading?: boolean;
  error?: Error | null;
}

export function usePopularTags(limit: number = 10): UsePopularTagsResult {
  const [error, setError] = useState<Error | null>(null);

  const { data, isLoading } = useSuspenseQuery({
    queryKey: ['popularTags', limit],
    queryFn: async () => {
      try {
        return await getPopularTags(limit);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Failed to fetch popular tags'));
        }
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 유지
    retry: 1, // 실패 시 1번 재시도
  });

  return {
    tags: data || [],
    isLoading,
    error,
  };
}
