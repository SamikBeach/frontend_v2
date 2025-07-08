import { ReadingStatusType } from '@/apis/reading-status/types';
import {
  statusIcons,
  statusTexts,
} from '@/components/BookDialog/hooks/useReadingStatus';
import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import {
  ResponsiveDropdownMenu,
  ResponsiveDropdownMenuContent,
  ResponsiveDropdownMenuItem,
  ResponsiveDropdownMenuTrigger,
} from '@/components/ui/responsive-dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDown, PenLine, Star, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { ReviewAlertDialog } from './components/ReviewAlertDialog';
import { useReviewDialogState } from './hooks/useReviewDialogState';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  onSubmit: (
    rating: number,
    content: string,
    readingStatus?: ReadingStatusType | null
  ) => void;
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
  const [readingStatusDropdownOpen, setReadingStatusDropdownOpen] =
    useState(false);

  const {
    rating,
    setRating,
    content,
    setContent,
    readingStatus,
    setReadingStatus,
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

  const [isHovering, setIsHovering] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarHover = (star: number) => {
    setIsHovering(true);
    setHoveredRating(star);
  };

  const handleStarLeave = () => {
    setIsHovering(false);
    setHoveredRating(0);
  };

  const handleXButtonHover = () => {
    setIsHovering(false);
    setHoveredRating(0);
  };

  const handleReadingStatusChange = (status: ReadingStatusType | null) => {
    if (!isSubmitting) {
      setReadingStatus(status);
      setReadingStatusDropdownOpen(false);
    }
  };

  const handleSubmit = () => {
    if (rating === 0) {
      setAlertMessage('리뷰를 등록하기 위해서는 별점을 입력해주세요.');
      setAlertDialogOpen(true);
      return;
    }

    if (isCreateMode) {
      onSubmit(rating, content, readingStatus);
    } else {
      onSubmit(rating, content);
    }
  };

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

  const getReadingStatusStyle = (status: ReadingStatusType | null) => {
    if (!status) {
      return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
    }

    switch (status) {
      case ReadingStatusType.WANT_TO_READ:
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case ReadingStatusType.READING:
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case ReadingStatusType.READ:
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <>
      <ResponsiveDialog
        open={open}
        onOpenChange={isSubmitting ? undefined : onOpenChange}
      >
        <ResponsiveDialogContent
          className="max-w-md rounded-2xl border-none p-0"
          drawerClassName="flex min-h-0 w-full max-w-none flex-col rounded-t-[16px] border-none p-0 z-52"
          drawerOverlayClassName="z-51"
        >
          <ResponsiveDialogHeader className="flex h-14 items-center justify-between rounded-t-2xl bg-white/95 px-5 backdrop-blur-xl">
            <ResponsiveDialogTitle
              className="text-base font-medium"
              drawerClassName="text-base font-medium"
            >
              {getDialogTitle()}
            </ResponsiveDialogTitle>
          </ResponsiveDialogHeader>

          <div className="flex-1 overflow-y-auto px-5">
            <ResponsiveDialogDescription
              className="mb-6 text-sm text-gray-600"
              drawerClassName="mb-6 text-sm text-gray-600"
            >
              <span className="font-medium text-gray-800">{bookTitle}</span>에
              대한 {getDialogDescription()}
            </ResponsiveDialogDescription>

            <div className="mb-6 flex flex-col items-center space-y-3">
              <div className="relative flex w-full items-center justify-center">
                <div className="flex space-x-2" onMouseLeave={handleStarLeave}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`h-9 w-9 cursor-pointer ${
                        star <= (isHovering ? hoveredRating : rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200 hover:text-gray-300'
                      }`}
                      onClick={() => !isSubmitting && setRating(star)}
                      onMouseEnter={() => handleStarHover(star)}
                    />
                  ))}
                </div>
                {rating > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-10 h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    onClick={handleResetRating}
                    onMouseEnter={handleXButtonHover}
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

            {/* 생성 모드에서만 읽기 상태 선택 UI 표시 - 별점 아래로 이동 */}
            {isCreateMode && (
              <div className="mb-6">
                <ResponsiveDropdownMenu
                  open={readingStatusDropdownOpen}
                  onOpenChange={setReadingStatusDropdownOpen}
                >
                  <ResponsiveDropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-between rounded-xl border-gray-300 hover:bg-gray-100 hover:text-gray-900',
                        readingStatus !== null
                          ? getReadingStatusStyle(readingStatus)
                          : 'bg-gray-50 text-gray-700'
                      )}
                      disabled={isSubmitting}
                    >
                      {readingStatus !== null ? (
                        <span className="mr-1.5">
                          {statusIcons[readingStatus]}
                        </span>
                      ) : (
                        <span className="mr-1.5">{statusIcons['NONE']}</span>
                      )}
                      <span>
                        {readingStatus !== null
                          ? statusTexts[readingStatus]
                          : statusTexts['NONE']}
                      </span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </Button>
                  </ResponsiveDropdownMenuTrigger>
                  <ResponsiveDropdownMenuContent
                    className="min-w-48 rounded-xl"
                    drawerOverlayClassName="z-52"
                  >
                    {Object.values(ReadingStatusType).map(status => (
                      <ResponsiveDropdownMenuItem
                        key={status}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 text-sm',
                          readingStatus === status ? 'bg-gray-100' : '',
                          status === ReadingStatusType.WANT_TO_READ &&
                            'hover:bg-purple-50',
                          status === ReadingStatusType.READING &&
                            'hover:bg-blue-50',
                          status === ReadingStatusType.READ &&
                            'hover:bg-green-50'
                        )}
                        onSelect={() => handleReadingStatusChange(status)}
                        disabled={isSubmitting}
                      >
                        <span className="text-base">{statusIcons[status]}</span>
                        <span
                          className={cn(
                            status === ReadingStatusType.WANT_TO_READ &&
                              'text-purple-600',
                            status === ReadingStatusType.READING &&
                              'text-blue-600',
                            status === ReadingStatusType.READ &&
                              'text-green-600'
                          )}
                        >
                          {statusTexts[status]}
                        </span>
                      </ResponsiveDropdownMenuItem>
                    ))}

                    {/* 선택 안함 옵션 */}
                    <ResponsiveDropdownMenuItem
                      key="none"
                      className={cn(
                        'mt-1 flex cursor-pointer items-center gap-2 border-t text-sm',
                        readingStatus === null ? 'bg-gray-100' : '',
                        'hover:bg-red-50'
                      )}
                      onSelect={() => handleReadingStatusChange(null)}
                      disabled={isSubmitting}
                    >
                      <span className="text-base">{statusIcons['NONE']}</span>
                      <span className="text-red-600">
                        {statusTexts['NONE']}
                      </span>
                    </ResponsiveDropdownMenuItem>
                  </ResponsiveDropdownMenuContent>
                </ResponsiveDropdownMenu>
              </div>
            )}

            <div className="mb-4 flex-1 md:flex-none">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={
                  isDeleteMode
                    ? '내용을 비워두면 리뷰가 삭제됩니다'
                    : '이 책에 대한 리뷰를 남겨주세요'
                }
                className={`min-h-[150px] w-full resize-none rounded-2xl border-gray-200 p-4 text-[16px] placeholder:text-sm placeholder:text-gray-400 focus:border-pink-200 focus:bg-white focus:ring-2 focus:ring-pink-100 ${
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
            drawerClassName="flex flex-col-reverse gap-2 border-t border-gray-100 px-5 py-4 pb-safe"
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
                    : 'bg-green-600 hover:bg-green-700'
              } disabled:bg-green-200`}
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
