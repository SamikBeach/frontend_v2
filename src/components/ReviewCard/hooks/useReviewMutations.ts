import { createOrUpdateRating, deleteRating } from '@/apis/rating/rating';
import { createReview, deleteReview, updateReview } from '@/apis/review/review';
import { ReviewType } from '@/apis/review/types';
import { SearchResult } from '@/apis/search/types';
import {
  invalidateReviewAndRatingQueries,
  invalidateUserProfileQueries,
  invalidateUserRatingQueries,
  isCurrentUserProfilePage,
} from '@/utils/query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { ExtendedReviewResponseDto } from '../types';

interface UseReviewMutationsProps {
  review: ExtendedReviewResponseDto;
  currentUserId?: number;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onCreateSuccess?: () => void;
}

export function useReviewMutations({
  review,
  currentUserId,
  onUpdateSuccess,
  onDeleteSuccess,
  onCreateSuccess,
}: UseReviewMutationsProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // 별점 업데이트 mutation
  const updateRatingMutation = useMutation({
    mutationFn: ({
      bookId,
      rating,
      isbn,
    }: {
      bookId: number;
      rating: number;
      isbn?: string;
      skipInvalidate?: boolean;
    }) => {
      return createOrUpdateRating(bookId, { rating }, isbn);
    },
    onSuccess: (_, variables) => {
      // skipInvalidate가 true인 경우 무효화를 건너뜀 (리뷰와 함께 업데이트하는 경우)
      if (variables.skipInvalidate === true) {
        return;
      }

      // 프로필 페이지에서 필요한 쿼리 무효화
      if (isCurrentUserProfilePage(pathname, currentUserId)) {
        // 사용자 별점 관련 쿼리만 무효화
        invalidateUserRatingQueries(queryClient, pathname, currentUserId);
      }

      // 커뮤니티 페이지 리뷰 목록 무효화 (프로필 페이지가 아닌 경우에도 실행)
      queryClient.invalidateQueries({
        queryKey: ['communityReviews'],
        exact: false,
      });
      // 홈 인기글 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['home', 'popularReviews'],
      });
    },
    onError: (error: any) => {
      console.error('별점 업데이트 실패:', error);
      const errorMessage =
        error.response?.data?.message || '별점 수정 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    },
  });

  // 리뷰 생성 mutation
  const createReviewMutation = useMutation({
    mutationFn: ({
      content,
      type,
      bookId,
      isbn,
    }: {
      content: string;
      type: ReviewType;
      bookId?: number;
      isbn?: string;
      skipInvalidate?: boolean;
    }) => {
      return createReview({
        content,
        type,
        bookId,
        isbn,
      });
    },
    onSuccess: (_, variables) => {
      // skipInvalidate가 true인 경우 무효화를 건너뜀 (별점과 함께 생성하는 경우)
      if ((variables as any).skipInvalidate === true) {
        return;
      }

      // 모든 리뷰 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['communityReviews'],
        exact: false,
      });
      // 홈 인기글 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['home', 'popularReviews'],
      });

      // 프로필 페이지 관련 쿼리 선택적 무효화
      if (isCurrentUserProfilePage(pathname, currentUserId)) {
        // 유저 프로필 관련 쿼리 일괄 무효화
        invalidateUserProfileQueries(queryClient, pathname, currentUserId);
      }

      toast.success('리뷰가 등록되었습니다.');

      if (onCreateSuccess) {
        onCreateSuccess();
      }
    },
    onError: (error: any) => {
      console.error('리뷰 생성 실패:', error);
      const errorMessage =
        error.response?.data?.message || '리뷰 등록 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    },
  });

  // 리뷰 수정 mutation
  const updateReviewMutation = useMutation<any, any, any>({
    mutationFn: ({
      id,
      content,
      type,
      bookId,
      isbn,
    }: {
      id: number;
      content: string;
      type: ReviewType;
      bookId?: number;
      isbn?: string;
      skipInvalidate?: boolean;
    }) => {
      return updateReview(id, {
        content,
        type,
        ...(bookId ? { bookId } : {}),
        ...(isbn ? { isbn } : {}),
      });
    },
    onSuccess: (_, variables) => {
      // 별점과 함께 업데이트된 경우 여기서는 무효화를 건너뜀
      // handleEditReview에서 skipInvalidate context가 true로 설정된 경우
      if (variables.skipInvalidate === true) {
        return;
      }

      // 모든 리뷰 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['communityReviews'],
        exact: false,
      });
      // 홈 인기글 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['home', 'popularReviews'],
      });

      // 원본 타입과 수정된 타입이 다른 경우 두 타입 모두 무효화
      if (review.type !== variables.type) {
        queryClient.invalidateQueries({
          queryKey: ['review', review.type],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ['review', variables.type],
          exact: false,
        });
      }

      // 단일 리뷰 데이터도 무효화
      queryClient.invalidateQueries({
        queryKey: ['review', review.id],
      });
      // 홈 인기글 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['home', 'popularReviews'],
      });

      // 책 관련 데이터가 변경된 경우 책 데이터도 무효화
      if (variables.isbn) {
        queryClient.invalidateQueries({
          queryKey: ['book-detail', variables.isbn],
        });
      }

      // 프로필 페이지 관련 쿼리 선택적 무효화
      if (isCurrentUserProfilePage(pathname, currentUserId)) {
        // 유저 프로필 관련 쿼리 일괄 무효화
        invalidateUserProfileQueries(queryClient, pathname, currentUserId);
      }

      toast.success('리뷰가 수정되었습니다.');

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    },
    onError: (error: any) => {
      console.error('리뷰 업데이트 실패:', error);
      const errorMessage =
        error.response?.data?.message || '리뷰 수정 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    },
  });

  // 리뷰 삭제 mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => {
      // 커뮤니티 리뷰 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['communityReviews'],
        exact: false,
      });
      // 홈 인기글 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['home', 'popularReviews'],
      });

      // 프로필 페이지에서 필요한 쿼리 무효화
      if (isCurrentUserProfilePage(pathname, currentUserId)) {
        // 유저 프로필 관련 쿼리 일괄 무효화
        invalidateUserProfileQueries(queryClient, pathname, currentUserId);
      }

      toast.success('리뷰가 삭제되었습니다.');

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    },
    onError: () => {
      toast.error('리뷰 삭제 중 오류가 발생했습니다.');
    },
  });

  // 별점 삭제 mutation
  const deleteRatingMutation = useMutation({
    mutationFn: (id: number) => deleteRating(id),
    onSuccess: () => {
      // 커뮤니티 리뷰 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['communityReviews'],
        exact: false,
      });
      // 홈 인기글 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['home', 'popularReviews'],
      });

      // 프로필 페이지에서 필요한 쿼리 무효화
      if (isCurrentUserProfilePage(pathname, currentUserId)) {
        // 유저 프로필 관련 쿼리 일괄 무효화
        invalidateUserProfileQueries(queryClient, pathname, currentUserId);
      }

      toast.success('별점이 삭제되었습니다.');

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    },
    onError: () => {
      toast.error('별점 삭제 중 오류가 발생했습니다.');
    },
  });

  // 리뷰 생성 핸들러
  const handleCreateReview = async (params: {
    content: string;
    type: ReviewType;
    rating?: number;
    selectedBook?: SearchResult | null;
  }) => {
    const { content, type, rating, selectedBook } = params;
    const hasRating = rating !== undefined && rating > 0;

    // 리뷰와 별점 둘 다 생성하는지 여부
    const createBoth = content.trim() && hasRating;

    try {
      // 리뷰 타입이 'review'인 경우 및 책이 선택된 경우
      if (type === 'review' && selectedBook) {
        const bookId =
          typeof selectedBook.id === 'number'
            ? selectedBook.id
            : parseInt(String(selectedBook.id), 10);
        const bookIsbn = selectedBook.isbn || selectedBook.isbn13 || '';

        // bookId가 없거나 음수인 경우 -1로 설정하고 반드시 ISBN 전달
        const isNegativeBookId = bookId < 0;
        const finalBookId = isNegativeBookId ? -1 : bookId;

        if (createBoth) {
          // 별점과 리뷰를 함께 생성하는 경우

          // 1. 먼저 평점 업데이트하되 무효화는 건너뜀
          await createOrUpdateRating(
            finalBookId,
            { rating },
            isNegativeBookId ? bookIsbn : undefined
          );

          // 2. 그 다음 리뷰 생성 - skipInvalidate 설정
          await createReview({
            content,
            type,
            bookId: finalBookId,
            isbn: isNegativeBookId ? bookIsbn : undefined,
          });

          // 3. 한 번에 무효화 처리
          if (isCurrentUserProfilePage(pathname, currentUserId)) {
            // 커뮤니티 리뷰 쿼리 무효화
            queryClient.invalidateQueries({
              queryKey: ['communityReviews'],
              exact: false,
            });
            // 홈 인기글 쿼리 무효화
            queryClient.invalidateQueries({
              queryKey: ['home', 'popularReviews'],
            });
            // 유저 프로필 관련 쿼리 일괄 무효화
            invalidateReviewAndRatingQueries(
              queryClient,
              pathname,
              currentUserId
            );

            toast.success('리뷰가 등록되었습니다.');

            if (onCreateSuccess) {
              onCreateSuccess();
            }
          }
        } else if (hasRating && !content.trim()) {
          // 별점만 있는 경우 - 별점 API만 호출
          await updateRatingMutation.mutateAsync({
            bookId: finalBookId,
            rating,
            isbn: isNegativeBookId ? bookIsbn : undefined,
          });
        } else if (content.trim()) {
          // 리뷰 내용만 있는 경우 - 리뷰 API만 호출 (rating API 호출 안함)
          await createReviewMutation.mutateAsync({
            content,
            type,
            bookId: finalBookId,
            isbn: isNegativeBookId ? bookIsbn : undefined,
          });
        }
      } else {
        // 리뷰 타입이 'review'가 아닌 경우 일반 리뷰 생성만 수행
        await createReviewMutation.mutateAsync({
          content,
          type,
        });
      }
      return true;
    } catch (error) {
      console.error('리뷰 생성 실패:', error);
      toast.error('리뷰 등록 중 오류가 발생했습니다.');
      return false;
    }
  };

  // 리뷰 수정 핸들러
  const handleEditReview = async (params: {
    content: string;
    type: ReviewType;
    rating?: number;
    selectedBook?: SearchResult | null;
  }) => {
    if (!review || !currentUserId) return;

    const { content, type, rating, selectedBook } = params;

    // 1. 변경된 내용이 있는지 확인
    const contentChanged = content !== review.content;
    const ratingChanged = rating !== undefined && rating !== review.rating;
    const typeChanged = type !== review.type;

    // 2. 변경된 내용이 없으면 early return
    if (!contentChanged && !ratingChanged && !typeChanged) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    // books 배열에서 첫 번째 책 정보 가져오기 (없으면 기본값 설정)
    const firstBook =
      review.books && review.books.length > 0 ? review.books[0] : null;
    const bookId = firstBook ? Number(firstBook.id) : -1;
    const bookIsbn = firstBook?.isbn || firstBook?.isbn13 || '';
    const isNegativeBookId = bookId < 0;

    // 별점과 리뷰 둘 다 변경되었는지 여부
    const updateBoth =
      (contentChanged || typeChanged) && ratingChanged && rating !== undefined;

    try {
      // 3. 컨텐츠와 별점 모두 변경된 경우
      if (updateBoth) {
        // 리뷰 내용 업데이트
        await updateReviewMutation.mutateAsync({
          id: review.id,
          content,
          type,
          bookId: selectedBook ? Number(selectedBook.id) : bookId,
          // bookId가 음수일 때만 isbn 포함
          ...((selectedBook && Number(selectedBook.id) < 0) ||
          (!selectedBook && isNegativeBookId)
            ? {
                isbn: selectedBook?.isbn || selectedBook?.isbn13 || bookIsbn,
              }
            : {}),
          skipInvalidate: true, // 별점과 함께 업데이트하는 경우 개별 무효화 건너뜀
        });

        // 별점 업데이트 - skipInvalidate 플래그 추가
        await updateRatingMutation.mutateAsync({
          bookId: selectedBook ? Number(selectedBook.id) : bookId,
          rating,
          isbn: isNegativeBookId
            ? selectedBook?.isbn || selectedBook?.isbn13 || bookIsbn
            : undefined,
          skipInvalidate: true, // 별점도 개별 무효화 건너뜀
        });

        // 한 번에 무효화 처리
        invalidateReviewAndRatingQueries(queryClient, pathname, currentUserId);
        // 홈 인기글 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ['home', 'popularReviews'],
        });

        // 책 상세 정보 쿼리 무효화 (필요한 경우)
        if (bookIsbn || selectedBook?.isbn || selectedBook?.isbn13) {
          queryClient.invalidateQueries({
            queryKey: [
              'book-detail',
              selectedBook?.isbn || selectedBook?.isbn13 || bookIsbn,
            ],
          });
        }

        toast.success('리뷰와 별점이 수정되었습니다.');
      }
      // 4. 리뷰 내용만 변경된 경우
      else if (contentChanged || typeChanged) {
        await updateReviewMutation.mutateAsync({
          id: review.id,
          content,
          type,
          bookId: selectedBook ? Number(selectedBook.id) : bookId,
          // bookId가 음수일 때만 isbn 포함
          ...((selectedBook && Number(selectedBook.id) < 0) ||
          (!selectedBook && isNegativeBookId)
            ? {
                isbn: selectedBook?.isbn || selectedBook?.isbn13 || bookIsbn,
              }
            : {}),
        });

        toast.success('리뷰가 수정되었습니다.');
      }
      // 5. 별점만 변경된 경우
      else if (ratingChanged && rating !== undefined) {
        await updateRatingMutation.mutateAsync({
          bookId: selectedBook ? Number(selectedBook.id) : bookId,
          rating,
          isbn: isNegativeBookId
            ? selectedBook?.isbn || selectedBook?.isbn13 || bookIsbn
            : undefined,
        });

        toast.success('별점이 수정되었습니다.');
      }

      // 6. 성공 callback 호출
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      console.error('리뷰 수정 중 오류 발생:', error);
      toast.error('리뷰 수정에 실패했습니다.');
    }
  };

  // 리뷰 삭제 핸들러
  const handleDeleteReview = async () => {
    try {
      if (review.activityType === 'rating') {
        // 별점인 경우 deleteRating API 호출
        await deleteRatingMutation.mutateAsync(review.id);
      } else {
        // 일반 리뷰인 경우 deleteReview API 호출
        await deleteReviewMutation.mutateAsync(review.id);
      }
      return true;
    } catch (error) {
      console.error('리뷰/별점 삭제 실패:', error);
      const errorMessage = '삭제 중 오류가 발생했습니다.';
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    updateRatingMutation,
    createReviewMutation,
    updateReviewMutation,
    deleteReviewMutation,
    deleteRatingMutation,
    handleCreateReview,
    handleEditReview,
    handleDeleteReview,
  };
}
