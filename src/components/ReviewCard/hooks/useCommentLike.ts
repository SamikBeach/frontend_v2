import {
  likeComment as apiLikeComment,
  unlikeComment as apiUnlikeComment,
} from '@/apis/review/review';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UseCommentLikeResult {
  handleLikeToggle: (commentId: number, isLiked: boolean) => Promise<void>;
  isLoading: boolean;
}

// Comment type definition
interface Comment {
  id: number;
  isLiked?: boolean;
  likeCount?: number;
  replies?: Comment[];
  [key: string]: any;
}

export function useCommentLike(): UseCommentLikeResult {
  const queryClient = useQueryClient();

  // 좋아요 추가 mutation
  const { mutateAsync: addLike, isPending: isAddLikeLoading } = useMutation({
    mutationFn: (commentId: number) => apiLikeComment(commentId),
    onMutate: async commentId => {
      // 낙관적 업데이트를 위해 기존 데이터 저장
      await queryClient.cancelQueries({
        queryKey: ['review-comments'],
        exact: false,
      });

      // 모든 review-comments 쿼리 데이터를 찾아서 업데이트
      const queryKeys = queryClient.getQueryCache().findAll({
        queryKey: ['review-comments'],
      });

      // 각 쿼리 키에 대해 중첩 댓글 검색 및 업데이트
      const previousDatas: Record<string, unknown> = {};

      queryKeys.forEach(query => {
        const previousData = queryClient.getQueryData(query.queryKey);
        previousDatas[query.queryKey.join('/')] = previousData;

        // 댓글 데이터 업데이트
        queryClient.setQueryData(query.queryKey, (old: any) => {
          if (!old || !old.comments) return old;

          return {
            ...old,
            comments: updateCommentsLikeStatus(old.comments, commentId, true),
          };
        });
      });

      return { previousDatas };
    },
    onSuccess: () => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ['review-comments'],
        exact: false,
      });
    },
    onError: (_, __, context) => {
      // 에러 발생 시 이전 상태로 복원
      if (context?.previousDatas) {
        Object.entries(context.previousDatas).forEach(([key, data]) => {
          const queryKey = key.split('/');
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });

  // 좋아요 취소 mutation
  const { mutateAsync: removeLike, isPending: isRemoveLikeLoading } =
    useMutation({
      mutationFn: (commentId: number) => apiUnlikeComment(commentId),
      onMutate: async commentId => {
        // 낙관적 업데이트를 위해 기존 데이터 저장
        await queryClient.cancelQueries({
          queryKey: ['review-comments'],
          exact: false,
        });

        // 모든 review-comments 쿼리 데이터를 찾아서 업데이트
        const queryKeys = queryClient.getQueryCache().findAll({
          queryKey: ['review-comments'],
        });

        // 각 쿼리 키에 대해 중첩 댓글 검색 및 업데이트
        const previousDatas: Record<string, unknown> = {};

        queryKeys.forEach(query => {
          const previousData = queryClient.getQueryData(query.queryKey);
          previousDatas[query.queryKey.join('/')] = previousData;

          // 댓글 데이터 업데이트
          queryClient.setQueryData(query.queryKey, (old: any) => {
            if (!old || !old.comments) return old;

            return {
              ...old,
              comments: updateCommentsLikeStatus(
                old.comments,
                commentId,
                false
              ),
            };
          });
        });

        return { previousDatas };
      },
      onSuccess: () => {
        // 댓글 목록 새로고침
        queryClient.invalidateQueries({
          queryKey: ['review-comments'],
          exact: false,
        });
      },
      onError: (_, __, context) => {
        // 에러 발생 시 이전 상태로 복원
        if (context?.previousDatas) {
          Object.entries(context.previousDatas).forEach(([key, data]) => {
            const queryKey = key.split('/');
            queryClient.setQueryData(queryKey, data);
          });
        }
      },
    });

  // 중첩된 댓글의 좋아요 상태를 재귀적으로 업데이트하는 헬퍼 함수
  const updateCommentsLikeStatus = (
    comments: Comment[],
    targetId: number,
    liked: boolean
  ): Comment[] => {
    return comments.map((comment): Comment => {
      if (comment.id === targetId) {
        return {
          ...comment,
          isLiked: liked,
          likeCount: liked
            ? (comment.likeCount || 0) + 1
            : Math.max(0, (comment.likeCount || 0) - 1),
        };
      }

      // 대댓글이 있는 경우 재귀적으로 처리
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentsLikeStatus(comment.replies, targetId, liked),
        };
      }

      return comment;
    });
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (commentId: number, isLiked: boolean) => {
    try {
      if (isLiked) {
        await removeLike(commentId);
      } else {
        await addLike(commentId);
      }
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
      throw error;
    }
  };

  return {
    handleLikeToggle,
    isLoading: isAddLikeLoading || isRemoveLikeLoading,
  };
}
