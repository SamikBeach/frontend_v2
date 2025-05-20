import {
  createComment as apiCreateComment,
  deleteComment as apiDeleteComment,
  likeComment as apiLikeComment,
  unlikeComment as apiUnlikeComment,
  getReviewComments,
} from '@/apis/review/review';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

// 댓글 및 댓글 생성 타입 정의
interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    email?: string;
  };
  likeCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

interface UseReviewCommentsResult {
  comments: Comment[];
  isLoading: boolean;
  error: Error | null;
  commentText: string;
  setCommentText: (text: string) => void;
  handleAddComment: () => Promise<void>;
  handleDeleteComment: (commentId: number) => Promise<void>;
  handleLikeComment: (commentId: number, isLiked: boolean) => Promise<void>;
  replyToCommentId: number | null;
  setReplyToCommentId: (id: number | null) => void;
  refetch: () => Promise<any>;
}

export function useReviewComments(
  reviewId: number,
  showComments: boolean = false
): UseReviewCommentsResult {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);

  // 댓글 목록 조회 - showComments가 true일 때만 활성화
  const {
    data: commentsResponse = { comments: [] },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['review-comments', reviewId],
    queryFn: () => getReviewComments(reviewId),
    enabled: showComments, // 댓글이 표시될 때만 데이터 가져오기
    placeholderData: keepPreviousData, // 이전 데이터 유지
  });

  const comments = commentsResponse.comments || [];

  // 댓글 추가 mutation
  const { mutateAsync: addComment } = useMutation({
    mutationFn: async () => {
      return apiCreateComment(reviewId, {
        content: commentText,
      });
    },
    onSuccess: () => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
      // communityReviews의 모든 관련 쿼리 인스턴스의 commentCount를 직접 증가
      queryClient
        .getQueryCache()
        .findAll({ queryKey: ['communityReviews'] })
        .forEach(query => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                reviews: page.reviews.map((review: any) =>
                  review.id === reviewId
                    ? {
                        ...review,
                        commentCount: (review.commentCount || 0) + 1,
                      }
                    : review
                ),
              })),
            };
          });
        });
    },
    onError: () => {
      toast.error('댓글 작성에 실패했습니다.');
    },
  });

  // 댓글 삭제 mutation
  const { mutateAsync: deleteComment } = useMutation({
    mutationFn: async (commentId: number) => {
      return apiDeleteComment(commentId);
    },
    onSuccess: () => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
      // communityReviews의 모든 관련 쿼리 인스턴스의 commentCount를 직접 감소
      queryClient
        .getQueryCache()
        .findAll({ queryKey: ['communityReviews'] })
        .forEach(query => {
          queryClient.setQueryData(query.queryKey, (oldData: any) => {
            if (!oldData || !oldData.pages) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                reviews: page.reviews.map((review: any) =>
                  review.id === reviewId
                    ? {
                        ...review,
                        commentCount: Math.max(
                          0,
                          (review.commentCount || 0) - 1
                        ),
                      }
                    : review
                ),
              })),
            };
          });
        });
    },
    onError: () => {
      toast.error('댓글 삭제에 실패했습니다.');
    },
  });

  // 댓글 좋아요 뮤테이션
  const { mutate: likeComment } = useMutation({
    mutationFn: (commentId: number) => apiLikeComment(commentId),
    onSuccess: () => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
    },
    onError: () => {
      toast.error('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    },
  });

  // 댓글 좋아요 취소 뮤테이션
  const { mutate: unlikeComment, isPending: isUnliking } = useMutation({
    mutationFn: (commentId: number) => apiUnlikeComment(commentId),
    onSuccess: () => {
      // 댓글 목록 새로고침
      queryClient.invalidateQueries({
        queryKey: ['review-comments', reviewId],
      });
    },
    onError: () => {
      toast.error('좋아요 취소 처리에 실패했습니다. 다시 시도해주세요.');
    },
  });

  // 댓글 추가 핸들러
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment();
      // 성공 시 입력 필드 초기화
      setCommentText('');
      setReplyToCommentId(null);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  // 댓글 좋아요 핸들러
  const handleLikeComment = async (commentId: number, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
    }
  };

  return {
    comments,
    isLoading,
    error: error as Error | null,
    commentText,
    setCommentText,
    handleAddComment,
    handleDeleteComment,
    handleLikeComment,
    replyToCommentId,
    setReplyToCommentId,
    refetch,
  };
}
