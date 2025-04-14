import {
  addReviewComment,
  CreateCommentDto,
  deleteComment,
  getReviewComments,
} from '@/apis/review';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export function useReviewComments(reviewId: number) {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  // 댓글 목록 조회
  const { data } = useSuspenseQuery({
    queryKey: ['review-comments', reviewId],
    queryFn: () => getReviewComments(reviewId),
  });

  // 댓글 추가 뮤테이션
  const { mutate: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: (content: string) => {
      const commentData: CreateCommentDto = { content };
      return addReviewComment(reviewId, commentData);
    },
    onSuccess: () => {
      // 댓글 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
      // 리뷰 목록의 댓글 수 갱신
      queryClient.invalidateQueries({ queryKey: ['book-reviews'] });

      // 입력창 초기화
      setCommentText('');
      toast.success('댓글이 등록되었습니다');
    },
    onError: () => {
      toast.error('댓글 등록에 실패했습니다');
    },
  });

  // 댓글 삭제 뮤테이션
  const { mutate: removeComment, isPending: isDeleting } = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      // 댓글 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
      // 리뷰 목록의 댓글 수 갱신
      queryClient.invalidateQueries({ queryKey: ['book-reviews'] });

      toast.success('댓글이 삭제되었습니다');
    },
    onError: () => {
      toast.error('댓글 삭제에 실패했습니다');
    },
  });

  // 댓글 텍스트 변경 핸들러
  const handleCommentTextChange = useCallback((text: string) => {
    setCommentText(text);
  }, []);

  // 댓글 제출 핸들러
  const handleSubmitComment = useCallback(() => {
    if (!commentText.trim()) return;
    submitComment(commentText);
  }, [commentText, submitComment]);

  // 댓글 삭제 핸들러
  const handleDeleteComment = useCallback(
    (commentId: number) => {
      removeComment(commentId);
    },
    [removeComment]
  );

  return {
    comments: data?.comments || [],
    commentText,
    isSubmitting,
    isDeleting,
    handleCommentTextChange,
    handleSubmitComment,
    handleDeleteComment,
  };
}
