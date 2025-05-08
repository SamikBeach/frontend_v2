import { createOrUpdateRating } from '@/apis/rating/rating';
import {
  ReadingStatusType,
  createOrUpdateReadingStatus,
} from '@/apis/reading-status';
import { createReview, deleteReview, updateReview } from '@/apis/review/review';
import { Review } from '@/apis/review/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { invalidateUserProfileQueries } from '@/utils/query';
import { BookWithRating } from '@/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useBookDetails } from './useBookDetails';

export function useReviewDialog() {
  const { book, isbn, userRating: userRatingData } = useBookDetails();
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();
  const pathname = usePathname();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // 수정 모드 상태 추가
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [initialContent, setInitialContent] = useState('');
  const [initialRating, setInitialRating] = useState(0);

  // 리뷰 제출 뮤테이션 (생성/수정/별점 모두 처리)
  const mutation = useMutation({
    mutationFn: async (params: {
      rating: number;
      content: string;
      readingStatus?: ReadingStatusType;
    }): Promise<any> => {
      const { rating, content, readingStatus } = params;

      // 책 ID 확인
      if (!book?.id) {
        throw new Error('책 정보가 없습니다.');
      }

      // 리뷰 수정 모드
      if (isEditMode && editingReview) {
        let ratingResponse = null;
        let reviewResponse = null;

        // 별점이 변경된 경우에만 별점 API 호출
        const ratingChanged = rating !== initialRating;

        // 내용이 변경된 경우에만 리뷰 API 호출
        const contentChanged = content !== initialContent;

        // 내용이 완전히 삭제된 경우 (리뷰 삭제)
        const contentDeleted = initialContent && !content.trim();

        if (ratingChanged) {
          // 별점 업데이트 - comment 없이 rating만 전송
          ratingResponse = await createOrUpdateRating(
            book.id,
            { rating },
            book.id < 0 ? isbn : undefined
          );
        }

        if (contentDeleted) {
          // 리뷰 삭제
          await deleteReview(editingReview.id);
          reviewResponse = null;
        } else if (contentChanged) {
          // 리뷰 내용 업데이트
          reviewResponse = await updateReview(editingReview.id, {
            content,
            bookId: book.id,
            isbn: book.id < 0 ? isbn : undefined,
          });
        }

        // 별점과 리뷰 응답을 합쳐서 반환
        return {
          ...(reviewResponse || editingReview),
          rating: ratingResponse ? ratingResponse.rating : rating,
          ratingId: ratingResponse
            ? ratingResponse.id
            : editingReview.userRating?.bookId || 0,
          ratingChanged,
          contentChanged,
          contentDeleted,
        };
      }

      // 별점만 등록(또는 업데이트)하는 경우 (내용이 없는 경우)
      if (!content.trim()) {
        // 읽기 상태가 전달된 경우에도 변경해야 함
        let readingStatusResponse = null;
        let readingStatusChanged = false;

        // 먼저 별점 업데이트
        const ratingResponse = await createOrUpdateRating(
          book.id,
          { rating },
          book.id < 0 ? isbn : undefined
        );

        // 읽기 상태가 전달된 경우 읽기 상태도 업데이트
        if (readingStatus) {
          readingStatusResponse = await createOrUpdateReadingStatus(
            book.id,
            { status: readingStatus },
            book.id < 0 ? isbn : undefined
          );
          readingStatusChanged = true;
        }

        // 별점과 읽기 상태 응답을 합쳐서 반환
        return {
          ...ratingResponse,
          ratingChanged: true,
          readingStatus: readingStatusResponse
            ? readingStatusResponse.status
            : readingStatus,
          readingStatusChanged,
        };
      }

      // 새 리뷰 생성 - 별점과 리뷰를 따로 처리
      // 기존 별점과 비교하여 변경된 경우에만 별점 API 호출
      const ratingChanged = rating !== userRatingData?.rating || 0;
      let ratingResponse = null;

      if (ratingChanged) {
        // 먼저 별점 업데이트 - comment 없이 rating만 전송
        ratingResponse = await createOrUpdateRating(
          book.id,
          { rating },
          book.id < 0 ? isbn : undefined
        );
      }

      // 그 다음 리뷰 생성
      const reviewResponse = await createReview({
        content,
        type: 'review',
        bookId: book.id,
        isbn: isbn, // ISBN 항상 포함하도록 수정
      });

      // 읽기 상태가 전달된 경우 읽기 상태도 업데이트
      let readingStatusResponse = null;
      let readingStatusChanged = false;

      if (readingStatus) {
        readingStatusResponse = await createOrUpdateReadingStatus(
          book.id,
          { status: readingStatus },
          book.id < 0 ? isbn : undefined
        );
        readingStatusChanged = true;
      }

      // 별점과 리뷰 및 읽기 상태 응답을 합쳐서 반환
      return {
        ...reviewResponse,
        rating: ratingResponse ? ratingResponse.rating : rating,
        ratingId: ratingResponse ? ratingResponse.id : userRatingData?.id || 0,
        ratingChanged,
        readingStatus: readingStatusResponse
          ? readingStatusResponse.status
          : readingStatus,
        readingStatusChanged,
      };
    },
    onSuccess: data => {
      // 직접 book-detail 캐시 업데이트 (별점 즉시 반영)
      if (book && isbn) {
        // 별점 표시를 위한 userRating 데이터 구성
        const userRatingData = {
          id: data.ratingId || data.id,
          rating: data.rating,
          bookId: book.id,
          comment: data.comment || '',
        };

        // book-detail 쿼리 데이터 직접 업데이트
        queryClient.setQueryData(['book-detail', isbn], (oldData: unknown) => {
          if (!oldData) return oldData;

          const typedOldData = oldData as BookWithRating;

          // 평균 별점 업데이트 계산
          let newRatingValue = typedOldData.rating || 0;
          let newTotalRatings = typedOldData.totalRatings || 0;

          // 기존에 userRating이 있는지 확인
          const hadPreviousRating = !!typedOldData.userRating;
          const oldRating = typedOldData.userRating?.rating || 0;
          const newRating = data.rating;

          // 별점이 변경된 경우에만 평균 별점 업데이트
          if (data.ratingChanged) {
            if (!hadPreviousRating) {
              // 새 평점 추가 - 총합에 새 평점 추가하고 카운트 증가
              const totalRatingSum =
                newRatingValue * newTotalRatings + newRating;
              newTotalRatings += 1;
              newRatingValue =
                newTotalRatings > 0 ? totalRatingSum / newTotalRatings : 0;
            } else if (oldRating !== newRating) {
              // 평점 변경 - 총합에서 이전 평점 제거하고 새 평점 추가
              const totalRatingSum =
                newRatingValue * newTotalRatings - oldRating + newRating;
              newRatingValue =
                newTotalRatings > 0 ? totalRatingSum / newTotalRatings : 0;
            }
          }

          // 읽기 상태 업데이트 (읽기 상태가 변경된 경우)
          const updatedUserReadingStatus = data.readingStatus
            ? (data.readingStatus as ReadingStatusType)
            : typedOldData.userReadingStatus;

          // 읽기 상태 카운트 업데이트 (readingStats가 있는 경우)
          let updatedReadingStats = typedOldData.readingStats || {};

          // readingStats가 없는 경우도 처리하도록 if 조건 제거
          const oldStatus = typedOldData.userReadingStatus as
            | ReadingStatusType
            | undefined;
          const newStatus =
            (data.readingStatus as ReadingStatusType) ||
            updatedUserReadingStatus;

          // 읽기 상태 카운트 복사 또는 기본값 생성
          const readingStatusCounts = typedOldData.readingStats
            ?.readingStatusCounts
            ? { ...typedOldData.readingStats.readingStatusCounts }
            : {
                [ReadingStatusType.WANT_TO_READ]: 0,
                [ReadingStatusType.READING]: 0,
                [ReadingStatusType.READ]: 0,
              };

          // 이전 상태가 있으면 카운트 감소
          if (oldStatus) {
            readingStatusCounts[oldStatus] = Math.max(
              0,
              (readingStatusCounts[oldStatus] || 0) - 1
            );
          }

          // 새 상태 카운트 증가
          readingStatusCounts[newStatus] =
            (readingStatusCounts[newStatus] || 0) + 1;

          // 현재 읽는 중인 사용자와 완료한 사용자 수 업데이트
          let currentReaders = typedOldData.readingStats?.currentReaders || 0;
          let completedReaders =
            typedOldData.readingStats?.completedReaders || 0;

          // 이전 상태에 따른 조정
          if (oldStatus === ReadingStatusType.READING) {
            currentReaders = Math.max(0, currentReaders - 1);
          } else if (oldStatus === ReadingStatusType.READ) {
            completedReaders = Math.max(0, completedReaders - 1);
          }

          // 새 상태에 따른 조정
          if (newStatus === ReadingStatusType.READING) {
            currentReaders += 1;
          } else if (newStatus === ReadingStatusType.READ) {
            completedReaders += 1;
          }

          // 업데이트된 읽기 상태 통계
          updatedReadingStats = {
            ...(typedOldData.readingStats || {}),
            readingStatusCounts,
            currentReaders,
            completedReaders,
          };

          // 업데이트된 데이터 반환
          return {
            ...typedOldData,
            userRating: userRatingData,
            rating: newRatingValue,
            totalRatings: newTotalRatings,
            userReadingStatus: updatedUserReadingStatus,
            readingStats: updatedReadingStats,
          };
        });

        // user-book-rating 캐시 직접 업데이트
        if (book?.id) {
          queryClient.setQueryData(
            ['user-book-rating', book.id],
            userRatingData
          );

          // user-reading-status 캐시 항상 업데이트
          queryClient.setQueryData(['user-reading-status', book.id], {
            status: data.readingStatus || book.userReadingStatus,
          });
        }

        // 평균 별점 정보 계산 (book-reviews 업데이트에 사용)
        let updatedRating = book.rating || 0;
        let updatedTotalRatings = book.totalRatings || 0;

        // 기존에 userRating이 있는지 확인
        const hadUserRating = !!book.userRating;
        const previousRating = book.userRating?.rating || 0;
        const currentRating = data.rating;

        if (!hadUserRating) {
          // 새 평점 추가
          const sum = updatedRating * updatedTotalRatings + currentRating;
          updatedTotalRatings += 1;
          updatedRating =
            updatedTotalRatings > 0 ? sum / updatedTotalRatings : 0;
        } else if (previousRating !== currentRating) {
          // 평점 변경
          const sum =
            updatedRating * updatedTotalRatings -
            previousRating +
            currentRating;
          updatedRating =
            updatedTotalRatings > 0 ? sum / updatedTotalRatings : 0;
        }

        // 추가적으로 정렬 상태를 고려하여 무효화
        queryClient.invalidateQueries({
          queryKey: ['book-reviews', book.id, isbn],
          refetchType: 'active',
        });

        // 별점이 변경된 경우 커뮤니티 리뷰 관련 쿼리 무효화
        if (data.ratingChanged) {
          queryClient.invalidateQueries({
            queryKey: ['communityReviews'],
            refetchType: 'active',
          });
        }

        // 읽기 상태가 변경된 경우 관련 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ['reading-status'],
          refetchType: 'active',
        });

        // 독서 상태별 도서 수 통계 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: ['user-statistics', currentUser?.id, 'reading-status'],
          refetchType: 'active',
        });

        // book-reviews 쿼리 데이터 업데이트하여 별점 즉시 반영
        queryClient.setQueryData(['book-reviews', book.id], (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          // 별점이 변경된 경우에만 리뷰 데이터 업데이트
          if (data.ratingChanged) {
            // 해당 책에 대한 모든 리뷰에 새로운 별점 정보 추가
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => {
                if (!page || !page.data) return page;

                return {
                  ...page,
                  data: page.data.map((review: any) => {
                    // 리뷰 내부의 book ID가 현재 책 ID와 일치하는지 확인
                    const isMatchingBook = review.book?.id === book.id;

                    if (isMatchingBook) {
                      // 리뷰의 책 정보에도 새로운 평균 평점 반영
                      const updatedBook = review.book
                        ? {
                            ...review.book,
                            rating: updatedRating,
                            totalRatings: updatedTotalRatings,
                          }
                        : review.book;

                      return {
                        ...review,
                        userRating: userRatingData,
                        book: updatedBook,
                      };
                    }
                    return review;
                  }),
                };
              }),
            };
          }

          // 별점이 변경되지 않은 경우 원본 데이터 반환
          return oldData;
        });

        // 리뷰 내용이 변경된 경우에만 리뷰 관련 쿼리 무효화
        if (data.contentChanged || data.contentDeleted) {
          // 리뷰 내용이 변경되었거나 삭제된 경우 리뷰 관련 쿼리 무효화
          // 별점이 변경된 경우에는 이미 위에서 직접 데이터를 업데이트했으므로 무효화하지 않음
          if (!data.ratingChanged) {
            // 리뷰 내용이 변경된 경우 직접 캐시 업데이트
            if (data.contentChanged && !data.contentDeleted) {
              queryClient.setQueryData(
                ['book-reviews', book.id],
                (oldData: any) => {
                  if (!oldData || !oldData.pages) return oldData;

                  return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => {
                      if (!page || !page.data) return page;

                      return {
                        ...page,
                        data: page.data.map((review: any) => {
                          // 현재 수정 중인 리뷰인 경우 내용 업데이트
                          if (review.id === editingReview?.id) {
                            return {
                              ...review,
                              content: data.content,
                            };
                          }
                          return review;
                        }),
                      };
                    }),
                  };
                }
              );
            } else if (data.contentDeleted) {
              // 리뷰가 삭제된 경우 직접 캐시 업데이트
              queryClient.setQueryData(
                ['book-reviews', book.id],
                (oldData: any) => {
                  if (!oldData || !oldData.pages) return oldData;

                  return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => {
                      if (!page || !page.data) return page;

                      // 삭제된 리뷰를 필터링
                      return {
                        ...page,
                        data: page.data.filter(
                          (review: any) => review.id !== editingReview?.id
                        ),
                      };
                    }),
                  };
                }
              );
            }
          }

          // 리뷰가 삭제된 경우 추가 쿼리 무효화
          if (data.contentDeleted) {
            // 사용자 리뷰 관련 쿼리 무효화
            queryClient.invalidateQueries({
              queryKey: ['user-reviews'],
              refetchType: 'active',
            });

            // 커뮤니티 리뷰 관련 쿼리 무효화
            queryClient.invalidateQueries({
              queryKey: ['communityReviews'],
              refetchType: 'active',
            });
          }
        }
      }

      // 사용자 프로필 관련 쿼리 무효화 (현재 본인 프로필 페이지인 경우)
      invalidateUserProfileQueries(queryClient, pathname, currentUser?.id);

      // 다이얼로그 닫기
      setReviewDialogOpen(false);

      // 수정 모드 초기화
      resetEditMode();

      // 성공 메시지 표시 - 별점 변경 여부에 따라 다른 메시지 표시
      if (isEditMode) {
        if (data.contentDeleted) {
          toast.success('리뷰가 삭제되었습니다.');
        } else if (data.ratingChanged && data.contentChanged) {
          toast.success('리뷰와 별점이 수정되었습니다.');
        } else if (data.ratingChanged) {
          toast.success('별점이 수정되었습니다.');
        } else if (data.contentChanged) {
          toast.success('리뷰가 수정되었습니다.');
        } else {
          toast.success('변경 사항이 없습니다.');
        }
      } else {
        // 새 리뷰 생성 시 메시지 표시 (별점, 읽기 상태 변경 여부에 따라 다른 메시지)
        if (data.ratingChanged && data.readingStatusChanged) {
          toast.success('리뷰, 별점, 읽기 상태가 성공적으로 저장되었습니다.');
        } else if (data.ratingChanged) {
          toast.success('리뷰와 별점이 성공적으로 저장되었습니다.');
        } else if (data.readingStatusChanged) {
          toast.success('리뷰와 읽기 상태가 성공적으로 저장되었습니다.');
        } else {
          toast.success('리뷰가 성공적으로 저장되었습니다.');
        }
      }
    },
    onError: error => {
      console.error('리뷰 저장 오류:', error);
      toast.error(
        isEditMode ? '리뷰 수정에 실패했습니다.' : '리뷰 저장에 실패했습니다.'
      );
    },
  });

  // 리뷰 다이얼로그 열기 핸들러
  const handleOpenReviewDialog = useCallback(() => {
    // 열 때 수정 모드 초기화
    resetEditMode();
    setReviewDialogOpen(true);
  }, []);

  // 리뷰 수정 모드 초기화
  const resetEditMode = useCallback(() => {
    setIsEditMode(false);
    setEditingReview(null);
    setInitialContent('');
    setInitialRating(0);
  }, []);

  // 리뷰 수정 다이얼로그 열기 핸들러
  const handleOpenEditReviewDialog = useCallback((review: Review) => {
    setIsEditMode(true);
    setEditingReview(review);
    setInitialContent(review.content);
    setInitialRating(review.userRating?.rating || 0);
    setReviewDialogOpen(true);
  }, []);

  // 리뷰 제출 핸들러
  const handleReviewSubmit = useCallback(
    (rating: number, content: string, readingStatus?: ReadingStatusType) => {
      if (!book) {
        toast.error('책 정보가 없습니다.');
        return;
      }

      // 삭제 기능이 아니라면 별점 필수
      if (rating === 0) {
        toast.error('별점을 선택해주세요.');
        return;
      }

      mutation.mutate({ rating, content, readingStatus });
    },
    [book, mutation]
  );

  // 사용자의 현재 별점 (없으면 0)
  const userRating = userRatingData?.rating || 0;

  return {
    reviewDialogOpen,
    setReviewDialogOpen,
    userRating,
    isEditMode,
    initialContent,
    handleOpenReviewDialog,
    handleOpenEditReviewDialog,
    handleReviewSubmit,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    status: mutation.status,
    data: mutation.data,
  };
}
