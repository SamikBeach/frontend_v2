import {
  ReadingStatusDto,
  ReadingStatusResponseDto,
  ReadingStatusType,
  createOrUpdateReadingStatus,
  deleteReadingStatusByBookId,
} from '@/apis/reading-status';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { josa } from 'josa';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useBookDetails } from './useBookDetails';

// UI에 표시할 읽기 상태 매핑
export const statusTexts = {
  [ReadingStatusType.WANT_TO_READ]: '읽고 싶어요',
  [ReadingStatusType.READING]: '읽는 중',
  [ReadingStatusType.READ]: '읽었어요',
};

// UI에 표시할 읽기 상태 아이콘 매핑
export const statusIcons = {
  [ReadingStatusType.WANT_TO_READ]: '📚',
  [ReadingStatusType.READING]: '📖',
  [ReadingStatusType.READ]: '✅',
};

export function useReadingStatus() {
  const queryClient = useQueryClient();
  const { book, userReadingStatus: initialStatus } = useBookDetails();

  // 현재 책의 읽기 상태를 저장할 상태 변수 - 초기값은 책 데이터에서 가져옴
  const [readingStatus, setReadingStatus] = useState<ReadingStatusType | null>(
    initialStatus
  );

  // 읽기 상태 변경 뮤테이션
  const { mutate: updateReadingStatusMutation, isPending: isUpdatePending } =
    useMutation({
      mutationFn: async ({
        bookId,
        status,
      }: {
        bookId: number;
        status: ReadingStatusType;
      }) => {
        if (!book || !book.id) {
          throw new Error('책 정보가 없습니다.');
        }

        const readingStatusData: ReadingStatusDto = {
          status,
        };

        // bookId가 음수일 때 ISBN으로 책 등록 처리 지원
        const isbn = book.isbn13 || book.isbn;
        return createOrUpdateReadingStatus(
          bookId,
          readingStatusData,
          bookId < 0 ? isbn : undefined
        );
      },
      onSuccess: (data: ReadingStatusResponseDto) => {
        if (!data || !data.status) {
          return;
        }

        // 알 수 없는 상태인 경우
        if (
          !Object.values(ReadingStatusType).includes(
            data.status as ReadingStatusType
          )
        ) {
          return;
        }

        // 상태 업데이트
        setReadingStatus(data.status as ReadingStatusType);

        // book-detail 캐시 직접 업데이트하여 읽기 상태 통계 반영
        const isbn = book?.isbn13 || book?.isbn;
        if (isbn) {
          queryClient.setQueryData(['book-detail', isbn], (oldData: any) => {
            if (!oldData) return oldData;

            // 기존 읽기 상태와 새 읽기 상태를 비교하여 카운트 업데이트
            const newStatus = data.status as ReadingStatusType;
            const oldStatus = oldData.userReadingStatus as
              | ReadingStatusType
              | undefined;

            // 읽기 상태 카운트 복사
            const readingStatusCounts = oldData.readingStats
              ?.readingStatusCounts
              ? { ...oldData.readingStats.readingStatusCounts }
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
            let currentReaders = oldData.readingStats?.currentReaders || 0;
            let completedReaders = oldData.readingStats?.completedReaders || 0;

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

            return {
              ...oldData,
              userReadingStatus: newStatus,
              readingStats: {
                ...oldData.readingStats,
                readingStatusCounts,
                currentReaders,
                completedReaders,
              },
            };
          });
        }

        // 읽기 상태 쿼리 업데이트
        if (book?.id) {
          queryClient.setQueryData(['user-reading-status', book.id], data);
        }

        // josa 라이브러리를 사용하여 적절한 조사 적용
        const statusText = statusTexts[data.status as ReadingStatusType];
        const message = josa(
          `읽기 상태가 '${statusText}'#{로} 변경되었습니다.`
        );
        toast.success(message);
      },
      onError: () => {
        toast.error('읽기 상태 변경에 실패했습니다.');
      },
    });

  // 읽기 상태 삭제 뮤테이션
  const { mutate: deleteReadingStatusMutation, isPending: isDeletePending } =
    useMutation({
      mutationFn: (bookId: number) => deleteReadingStatusByBookId(bookId),
      onSuccess: () => {
        // book-detail 캐시 직접 업데이트하여 읽기 상태 통계 반영
        const isbn = book?.isbn13 || book?.isbn;
        if (isbn) {
          queryClient.setQueryData(['book-detail', isbn], (oldData: any) => {
            if (!oldData) return oldData;

            // 기존 읽기 상태가 있으면 해당 카운트 감소
            const oldStatus = oldData.userReadingStatus as
              | ReadingStatusType
              | undefined;

            if (!oldStatus) return oldData; // 이전 상태가 없으면 그대로 반환

            // 읽기 상태 카운트 복사
            const readingStatusCounts = oldData.readingStats
              ?.readingStatusCounts
              ? { ...oldData.readingStats.readingStatusCounts }
              : {
                  [ReadingStatusType.WANT_TO_READ]: 0,
                  [ReadingStatusType.READING]: 0,
                  [ReadingStatusType.READ]: 0,
                };

            // 이전 상태 카운트 감소
            readingStatusCounts[oldStatus] = Math.max(
              0,
              (readingStatusCounts[oldStatus] || 0) - 1
            );

            // 현재 읽는 중인 사용자와 완료한 사용자 수 업데이트
            let currentReaders = oldData.readingStats?.currentReaders || 0;
            let completedReaders = oldData.readingStats?.completedReaders || 0;

            // 이전 상태에 따른 조정
            if (oldStatus === ReadingStatusType.READING) {
              currentReaders = Math.max(0, currentReaders - 1);
            } else if (oldStatus === ReadingStatusType.READ) {
              completedReaders = Math.max(0, completedReaders - 1);
            }

            return {
              ...oldData,
              userReadingStatus: null,
              readingStats: {
                ...oldData.readingStats,
                readingStatusCounts,
                currentReaders,
                completedReaders,
              },
            };
          });
        }

        // 읽기 상태 쿼리 업데이트
        if (book?.id) {
          queryClient.setQueryData(['user-reading-status', book.id], null);
        }

        // UI 상태 업데이트
        setReadingStatus(null);
        toast.success('읽기 상태가 초기화되었습니다.');
      },
      onError: () => {
        toast.error('읽기 상태 초기화에 실패했습니다.');
      },
    });

  // 읽기 상태 변경 핸들러
  const handleReadingStatusChange = useCallback(
    (status: ReadingStatusType | null) => {
      if (!book?.id) {
        toast.error('책 정보가 없습니다.');
        return;
      }

      // 현재 상태와 같은 경우 토글 동작 (선택 해제)
      if (status === readingStatus) {
        deleteReadingStatusMutation(book.id);
        return;
      }

      // null인 경우 삭제
      if (status === null) {
        deleteReadingStatusMutation(book.id);
        return;
      }

      // 상태 변경
      updateReadingStatusMutation({
        bookId: book.id,
        status,
      });
    },
    [
      book,
      readingStatus,
      updateReadingStatusMutation,
      deleteReadingStatusMutation,
    ]
  );

  // 읽기 상태에 따른 스타일 결정
  const getReadingStatusStyle = useCallback(
    (status: ReadingStatusType | null) => {
      switch (status) {
        case ReadingStatusType.WANT_TO_READ:
          return 'bg-purple-50 text-purple-600 border-purple-200';
        case ReadingStatusType.READING:
          return 'bg-blue-50 text-blue-600 border-blue-200';
        case ReadingStatusType.READ:
          return 'bg-green-50 text-green-600 border-green-200';
        default:
          return 'bg-gray-50 text-gray-700';
      }
    },
    []
  );

  // isPending 상태 통합
  const isPending = isUpdatePending || isDeletePending;

  return {
    readingStatus,
    isPending,
    statusTexts,
    statusIcons,
    handleReadingStatusChange,
    getReadingStatusStyle,
  };
}
