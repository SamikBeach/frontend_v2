import { getUserFollowers, getUserFollowing } from '@/apis/user/user';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

// User 타입을 확장한 인터페이스
interface UserWithFollowStatus {
  id: number;
  username?: string;
  isFollowing: boolean;
  profileImage?: string;
  bio?: string;
}

export type FollowListType = 'followers' | 'following';

export function useUserFollowList(userId: number, type: FollowListType) {
  return useSuspenseInfiniteQuery({
    queryKey: ['user', userId, type],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        // API 호출로 실제 데이터 가져오기 (페이지네이션 적용)
        const limit = 10; // 한 번에 가져올 항목 수

        if (type === 'followers') {
          const response = await getUserFollowers(userId, pageParam, limit);
          return {
            users: response.followers.map(follower => ({
              id: follower.id,
              username: follower.username,
              isFollowing: follower.isFollowing,
              profileImage: follower.profileImage,
              bio: follower.bio,
            })) as UserWithFollowStatus[],
            nextPage: response.hasNextPage ? pageParam + 1 : undefined,
            total: response.total,
            page: response.page,
            totalPages: response.totalPages,
          };
        } else {
          const response = await getUserFollowing(userId, pageParam, limit);
          return {
            users: response.following.map(following => ({
              id: following.id,
              username: following.username,
              isFollowing: following.isFollowing,
              profileImage: following.profileImage,
              bio: following.bio,
            })) as UserWithFollowStatus[],
            nextPage: response.hasNextPage ? pageParam + 1 : undefined,
            total: response.total,
            page: response.page,
            totalPages: response.totalPages,
          };
        }
      } catch (error) {
        console.error(`Failed to fetch ${type} for user ${userId}:`, error);
        // 에러 시 빈 배열 반환
        return {
          users: [],
          total: 0,
          page: 1,
          totalPages: 1,
          nextPage: undefined,
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
