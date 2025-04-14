import {
  ReadingStatusDto,
  ReadingStatusResponseDto,
  ReadingStatusType,
  createOrUpdateReadingStatus,
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
  const { mutate: updateReadingStatus, isPending } = useMutation({
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
      return createOrUpdateReadingStatus(bookId, readingStatusData);
    },
    onSuccess: (data: ReadingStatusResponseDto) => {
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['book-detail'] });

      // 상태 업데이트
      if (data.status) {
        const status = data.status as keyof typeof ReadingStatusType;
        const statusEnum =
          ReadingStatusType[status as keyof typeof ReadingStatusType];

        if (statusEnum) {
          setReadingStatus(statusEnum);

          // josa 라이브러리를 사용하여 적절한 조사 적용
          const statusText = statusTexts[statusEnum];
          const message = josa(
            `읽기 상태가 '${statusText}'#{로} 변경되었습니다.`
          );
          toast.success(message);
        } else {
          // 알 수 없는 상태인 경우
          console.error('Unknown reading status:', data.status);
          toast.success('읽기 상태가 변경되었습니다.');
        }
      }
    },
    onError: error => {
      console.error('Reading status update error:', error);
      toast.error('읽기 상태 변경에 실패했습니다.');
    },
  });

  // 읽기 상태 변경 핸들러
  const handleReadingStatusChange = useCallback(
    (status: ReadingStatusType) => {
      if (!book?.id) {
        toast.error('책 정보가 없습니다.');
        return;
      }

      if (readingStatus === status) {
        // 이미 같은 상태면 변경하지 않음
        return;
      }

      updateReadingStatus({
        bookId: book.id,
        status,
      });
    },
    [book, readingStatus, updateReadingStatus]
  );

  // 읽기 상태에 따른 스타일 결정
  const getReadingStatusStyle = useCallback(
    (status: ReadingStatusType | null) => {
      switch (status) {
        case ReadingStatusType.WANT_TO_READ:
          return 'bg-blue-50 text-blue-600 border-blue-200';
        case ReadingStatusType.READING:
          return 'bg-green-50 text-green-600 border-green-200';
        case ReadingStatusType.READ:
          return 'bg-purple-50 text-purple-600 border-purple-200';
        default:
          return 'bg-gray-50 text-gray-700';
      }
    },
    []
  );

  return {
    readingStatus,
    isPending,
    statusTexts,
    statusIcons,
    handleReadingStatusChange,
    getReadingStatusStyle,
  };
}
