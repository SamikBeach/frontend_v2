import {
  ReadingStatusType,
  deleteReadingStatusByBookId,
} from '@/apis/reading-status';
import { useBookDetails } from '@/components/BookDialog/hooks';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UseReviewDialogStateProps {
  initialRating?: number;
  initialContent?: string;
  isEditMode?: boolean;
  open: boolean;
}

export function useReviewDialogState({
  initialRating = 0,
  initialContent = '',
  isEditMode = false,
  open,
}: UseReviewDialogStateProps) {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { book, userReadingStatus } = useBookDetails();

  // atom 대신 로컬 상태 사용
  const [readingStatus, setReadingStatus] = useState<ReadingStatusType | null>(
    null
  );

  // 읽기 상태 삭제 mutation
  const deleteReadingStatusMutation = useMutation({
    mutationFn: (bookId: number) => deleteReadingStatusByBookId(bookId),
    onSuccess: () => {
      toast.success('읽기 상태가 초기화되었습니다.');
    },
    onError: () => {
      toast.error('읽기 상태 초기화에 실패했습니다.');
    },
  });

  // 읽기 상태 변경 핸들러
  const handleReadingStatusChange = (status: ReadingStatusType | null) => {
    setReadingStatus(status);
  };

  // 모드 결정 로직
  const isDeleteMode = isEditMode && initialContent && !content.trim();
  const isCreateMode = !isEditMode || (isEditMode && !initialContent);

  // 모달이 열릴 때 초기 데이터 설정
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  // 수정 모드일 때 초기 콘텐츠 설정
  useEffect(() => {
    if (isEditMode && initialContent) {
      setContent(initialContent);
    }
  }, [isEditMode, initialContent, open]);

  // Dialog가 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      // 수정 모드가 아닐 때만 내용 초기화
      if (!isEditMode) {
        setContent('');
      }
    }
  }, [open, isEditMode]);

  // 모달이 열릴 때 현재 읽기 상태 설정
  useEffect(() => {
    if (open && isCreateMode) {
      // 읽기 상태 기본값 설정 - 사용자의 현재 읽기 상태 또는 READ 사용
      setReadingStatus(userReadingStatus || ReadingStatusType.READ);
    }
  }, [open, isCreateMode, userReadingStatus]);

  // 별점 취소 핸들러
  const handleResetRating = () => {
    setRating(0);
  };

  // 다이얼로그 제목 결정
  const getDialogTitle = () => {
    if (isDeleteMode) {
      return '리뷰 삭제하기';
    } else if (isCreateMode) {
      return '리뷰 작성하기';
    } else if (isEditMode) {
      return '리뷰 수정하기';
    } else {
      return '리뷰 작성하기';
    }
  };

  // 다이얼로그 설명 결정
  const getDialogDescription = () => {
    if (isDeleteMode) {
      return '리뷰를 삭제하시겠습니까?';
    } else if (isCreateMode) {
      return '리뷰를 작성해주세요';
    } else if (isEditMode) {
      return '리뷰를 수정해주세요';
    } else {
      return '리뷰를 남겨주세요';
    }
  };

  return {
    rating,
    setRating,
    content,
    setContent,
    readingStatus,
    setReadingStatus: handleReadingStatusChange,
    alertDialogOpen,
    setAlertDialogOpen,
    alertMessage,
    setAlertMessage,
    isDeleteMode,
    isCreateMode,
    handleResetRating,
    getDialogTitle,
    getDialogDescription,
  };
}
