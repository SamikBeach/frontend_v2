import { getReviews } from '@/apis/review/review';
import { ReviewType } from '@/apis/review/types';
import {
  communitySortOptionAtom,
  communityTypeFilterAtom,
} from '@/atoms/community';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

export const useCommunityReviews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const typeFilter = useAtomValue(communityTypeFilterAtom);
  const sortOption = useAtomValue(communitySortOptionAtom);

  const { data } = useSuspenseQuery({
    queryKey: ['communityReviews', sortOption, currentPage, typeFilter],
    queryFn: async () => {
      // 타입이 'all'이면 백엔드에 전달하지 않음
      const type =
        typeFilter !== 'all' ? (typeFilter as ReviewType) : undefined;

      // filter 값을 백엔드에 전달 (recent, popular, following)
      const filter = sortOption as 'popular' | 'recent' | 'following';

      // getReviews 함수 사용
      return getReviews(currentPage, 10, filter, type);
    },
  });

  return {
    reviews: data?.reviews || [],
    totalReviews: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage,
    typeFilter,
    sortOption,
    setCurrentPage,
  };
};
