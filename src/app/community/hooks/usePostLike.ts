import {
  likePost as apiLikePost,
  unlikePost as apiUnlikePost,
} from '@/apis/post';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UsePostLikeResult {
  handleLikeToggle: (postId: number, isLiked: boolean) => Promise<void>;
  isLoading: boolean;
}

export function usePostLike(): UsePostLikeResult {
  const queryClient = useQueryClient();

  // 좋아요 추가 mutation
  const { mutateAsync: addLike, isPending: isAddLikeLoading } = useMutation({
    mutationFn: (postId: number) => apiLikePost(postId),
    onSuccess: (_, postId) => {
      // 게시물 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  // 좋아요 취소 mutation
  const { mutateAsync: removeLike, isPending: isRemoveLikeLoading } =
    useMutation({
      mutationFn: (postId: number) => apiUnlikePost(postId),
      onSuccess: (_, postId) => {
        // 게시물 데이터 새로고침
        queryClient.invalidateQueries({ queryKey: ['community-posts'] });
        queryClient.invalidateQueries({ queryKey: ['post', postId] });
      },
    });

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (postId: number, isLiked: boolean) => {
    try {
      if (isLiked) {
        await removeLike(postId);
      } else {
        await addLike(postId);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return {
    handleLikeToggle,
    isLoading: isAddLikeLoading || isRemoveLikeLoading,
  };
}
