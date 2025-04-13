import { useCallback, useState } from 'react';

type ReadingStatus = '읽고 싶어요' | '읽는 중' | '읽었어요' | '선택 안함';

export function useReadingStatus(initialStatus: ReadingStatus | null = null) {
  const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>(
    initialStatus
  );

  // 읽기 상태 변경 핸들러
  const handleReadingStatusChange = useCallback((status: ReadingStatus) => {
    setReadingStatus(status);
    console.log(`읽기 상태 변경: ${status}`);
    // TODO: API 호출 등 구현
  }, []);

  // 읽기 상태에 따른 색상 및 스타일 결정
  const getReadingStatusStyle = useCallback((status: ReadingStatus | null) => {
    if (!status || status === '선택 안함') {
      return 'bg-gray-50 text-gray-700';
    }

    switch (status) {
      case '읽고 싶어요':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case '읽는 중':
        return 'bg-green-50 text-green-600 border-green-200';
      case '읽었어요':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  }, []);

  return {
    readingStatus,
    handleReadingStatusChange,
    getReadingStatusStyle,
  };
}
