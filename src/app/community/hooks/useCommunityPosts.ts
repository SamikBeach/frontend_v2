import { getAllPosts, PostResponseDto, PostType } from '@/apis/post';
import {
  communitySearchQueryAtom,
  communitySortOptionAtom,
  communityTypeFilterAtom,
} from '@/atoms/community';
import { useQueryParams } from '@/hooks';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

interface UseCommunityPostsResult {
  posts: PostResponseDto[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  typeFilter: PostType | 'all';
  sortOption: 'popular' | 'latest' | 'following';
  setCurrentPage: (page: number) => void;
}

export function useCommunityPosts(): UseCommunityPostsResult {
  // 상태는 atom에서 읽기만 하고 변경은 안함
  const [typeFilter] = useAtom(communityTypeFilterAtom);
  const [sortOption] = useAtom(communitySortOptionAtom);
  const [searchQuery] = useAtom(communitySearchQueryAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const { updateQueryParams } = useQueryParams();
  const currentUser = useCurrentUser();
  const userId = currentUser?.id;

  // URL 파라미터 업데이트
  useEffect(() => {
    updateQueryParams({
      type: typeFilter !== 'all' ? typeFilter : undefined,
      sort: sortOption,
      page: currentPage > 1 ? currentPage.toString() : undefined,
      q: searchQuery || undefined,
    });
  }, [typeFilter, sortOption, currentPage, searchQuery, updateQueryParams]);

  // 게시물 데이터 가져오기
  const { data } = useSuspenseQuery({
    queryKey: ['community-posts', typeFilter, sortOption, currentPage, userId],
    queryFn: async () => {
      // type이 'all'이면 백엔드에 전달하지 않음
      const type = typeFilter !== 'all' ? (typeFilter as PostType) : undefined;
      // 결과 반환
      return await getAllPosts(currentPage, 10, type);
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  // 데이터 추출 (useSuspenseQuery는 항상 data를 반환하므로 기본값 필요 없음)
  const posts = data.posts;
  const totalPosts = data.total;
  const totalPages = data.totalPages;

  return {
    posts,
    totalPosts,
    totalPages,
    currentPage,
    typeFilter,
    sortOption,
    setCurrentPage,
  };
}
