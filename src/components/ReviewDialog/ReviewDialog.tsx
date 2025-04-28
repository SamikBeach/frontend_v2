import { PenLine, Star, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReviewAlertDialog } from './components/ReviewAlertDialog';
import { useReviewDialogState } from './hooks/useReviewDialogState';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  onSubmit: (rating: number, content: string) => void;
  initialRating?: number;
  initialContent?: string;
  isEditMode?: boolean;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function ReviewDialog({
  open,
  onOpenChange,
  bookTitle,
  onSubmit,
  initialRating = 0,
  initialContent = '',
  isEditMode = false,
  isSubmitting = false,
  onCancel,
}: ReviewDialogProps) {
  const isMobile = useIsMobile();
  const {
    rating,
    setRating,
    content,
    setContent,
    alertDialogOpen,
    setAlertDialogOpen,
    alertMessage,
    setAlertMessage,
    isDeleteMode,
    isCreateMode,
    handleResetRating,
    getDialogTitle,
    getDialogDescription,
  } = useReviewDialogState({
    initialRating,
    initialContent,
    isEditMode,
    open,
  });

  const handleSubmit = () => {
    // 별점이 입력되지 않은 경우 경고 표시
    if (rating === 0) {
      setAlertMessage('리뷰를 등록하기 위해서는 별점을 입력해주세요.');
      setAlertDialogOpen(true);
      return;
    }

    // 유효성 검사 통과 시 제출
    onSubmit(rating, content);
  };

  // 버튼 텍스트 결정
  const getButtonText = () => {
    if (isSubmitting) {
      return '처리 중...';
    } else if (isDeleteMode) {
      return '리뷰 삭제하기';
    } else if (isCreateMode) {
      return '리뷰 등록하기';
    } else if (isEditMode) {
      return '리뷰 수정하기';
    } else {
      return '리뷰 등록하기';
    }
  };

  return (
    <>
      <ResponsiveDialog
        open={open}
        onOpenChange={isSubmitting ? undefined : onOpenChange}
        snapPoints={[1]}
        shouldScaleBackground={false}
      >
        <ResponsiveDialogContent
          className="max-w-md rounded-2xl border-none p-0"
          drawerClassName="w-full max-w-none rounded-t-[16px] border-none p-0 h-[100dvh]"
        >
          <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-t-2xl bg-white/95 px-5 backdrop-blur-xl">
            <ResponsiveDialogTitle
              className="text-base font-medium"
              drawerClassName="text-base font-medium"
            >
              {getDialogTitle()}
            </ResponsiveDialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-5 py-4">
            <ResponsiveDialogDescription
              className="mb-6 text-sm text-gray-600"
              drawerClassName="mb-6 text-sm text-gray-600"
            >
              <span className="font-medium text-gray-800">{bookTitle}</span>에
              대한 {getDialogDescription()}
            </ResponsiveDialogDescription>

            <div className="mb-6 flex flex-col items-center space-y-3">
              <div className="relative flex w-full items-center justify-center">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-9 w-9 cursor-pointer ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200 hover:text-gray-300'
                      }`}
                      onClick={() => !isSubmitting && setRating(star)}
                    />
                  ))}
                </div>
                {rating > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-10 h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    onClick={handleResetRating}
                    disabled={isSubmitting}
                    title="별점 취소"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900">
                {rating === 0
                  ? '별점 선택'
                  : rating === 1
                    ? '별로예요'
                    : rating === 2
                      ? '아쉬워요'
                      : rating === 3
                        ? '보통이에요'
                        : rating === 4
                          ? '좋아요'
                          : '최고예요'}
              </p>
            </div>

            <div className={isMobile ? 'mb-4 flex-1' : 'mb-4'}>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={
                  isDeleteMode
                    ? '내용을 비워두면 리뷰가 삭제됩니다'
                    : '이 책에 대한 리뷰를 남겨주세요'
                }
                className={`min-h-[150px] w-full resize-none rounded-2xl border-gray-200 p-4 text-sm placeholder:text-gray-400 focus:border-pink-200 focus:bg-white focus:ring-2 focus:ring-pink-100 ${
                  isDeleteMode
                    ? 'bg-red-50'
                    : isCreateMode
                      ? 'bg-green-50'
                      : 'bg-gray-50'
                }`}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <ResponsiveDialogFooter
            className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4"
            drawerClassName="flex justify-end gap-2 border-t border-gray-100 px-5 py-4"
          >
            <Button
              variant="outline"
              className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                if (onCancel) {
                  onCancel();
                } else {
                  onOpenChange(false);
                }
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className={`rounded-xl text-white ${
                isDeleteMode
                  ? 'bg-red-500 hover:bg-red-600'
                  : isCreateMode
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-900 hover:bg-gray-800'
              } disabled:bg-gray-200`}
            >
              {isDeleteMode ? (
                <Trash2 className="mr-1.5 h-4 w-4" />
              ) : (
                <PenLine className="mr-1.5 h-4 w-4" />
              )}
              {getButtonText()}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ReviewAlertDialog
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        title="별점 필요"
        message={alertMessage}
      />
    </>
  );
}
