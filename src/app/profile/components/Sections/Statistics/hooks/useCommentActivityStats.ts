import { getCommentActivity } from '@/apis/user';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * 댓글 활동 통계를 조회하는 훅
 * @param userId 사용자 ID
 */
export const useCommentActivityStats = (userId: number) => {
  return useSuspenseQuery({
    queryKey: ['user-statistics', userId, 'comment-activity'],
    queryFn: () => getCommentActivity(userId),
  });
};
