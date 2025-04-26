import { followUser, unfollowUser } from '@/apis/user/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseUserFollowResult {
  isFollowing: boolean;
  setIsFollowing: (isFollowing: boolean) => void;
  toggleFollow: (userId: number) => Promise<void>;
  isLoading: boolean;
}

/**
 * 사용자 팔로우/언팔로우 기능을 제공하는 훅
 * @param initialIsFollowing 초기 팔로우 상태
 * @returns 팔로우 관련 상태와 액션들
 */
export function useUserFollow(initialIsFollowing = false): UseUserFollowResult {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const queryClient = useQueryClient();

  // 팔로우 mutation
  const { mutateAsync: follow, isPending: isFollowLoading } = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      // 프로필 정보 업데이트
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      // 실패 시 상태 롤백
      setIsFollowing(false);
      toast.error('팔로우에 실패했습니다.');
    },
  });

  // 언팔로우 mutation
  const { mutateAsync: unfollow, isPending: isUnfollowLoading } = useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      // 프로필 정보 업데이트
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      // 실패 시 상태 롤백
      setIsFollowing(true);
      toast.error('팔로우 취소에 실패했습니다.');
    },
  });

  /**
   * 팔로우/언팔로우 토글 함수
   * @param userId 대상 사용자 ID
   */
  const toggleFollow = async (userId: number) => {
    try {
      // 낙관적 업데이트를 위해 먼저 상태 변경
      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);

      if (newFollowingState) {
        await follow(userId);
        toast.success('사용자를 팔로우했습니다.');
      } else {
        await unfollow(userId);
        toast.success('팔로우를 취소했습니다.');
      }
    } catch (error) {
      console.error('팔로우/언팔로우 처리 중 오류:', error);
      // 오류 상태는 각 mutation의 onError에서 처리됨
    }
  };

  return {
    isFollowing,
    setIsFollowing,
    toggleFollow,
    isLoading: isFollowLoading || isUnfollowLoading,
  };
}
