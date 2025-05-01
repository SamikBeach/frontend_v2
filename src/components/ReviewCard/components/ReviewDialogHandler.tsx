import { SearchResult } from '@/apis/search/types';
import { AddBookDialog } from '@/app/library/[id]/components';
import { ReviewDialog } from '@/components/ReviewDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ReviewAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  isDanger?: boolean;
}

export function ReviewAlertDialog({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
  confirmText = '확인',
  isDanger = false,
}: ReviewAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={`max-w-md rounded-2xl ${isDanger ? '' : ''}`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {isDanger && (
            <AlertDialogCancel className="cursor-pointer rounded-xl">
              취소
            </AlertDialogCancel>
          )}
          <AlertDialogAction
            className={`cursor-pointer rounded-xl ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ReviewDialogHandlerProps {
  // 알림 다이얼로그
  alertDialogOpen: boolean;
  setAlertDialogOpen: (open: boolean) => void;
  alertTitle: string;
  alertMessage: string;

  // 삭제 다이얼로그
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  onDeleteConfirm: () => void;
  isRatingActivity?: boolean;

  // 책 선택 다이얼로그
  bookDialogOpen: boolean;
  setBookDialogOpen: (open: boolean) => void;
  onBookSelect: (book: SearchResult) => void;

  // 리뷰 편집 다이얼로그
  reviewDialogOpen: boolean;
  setReviewDialogOpen: (open: boolean) => void;
  selectedBookTitle?: string;
  initialContent: string;
  initialRating: number;
  isSubmitting: boolean;
  onReviewSubmit: (rating: number, content: string) => Promise<void>;
}

export function ReviewDialogHandler({
  // 알림 다이얼로그
  alertDialogOpen,
  setAlertDialogOpen,
  alertTitle,
  alertMessage,

  // 삭제 다이얼로그
  deleteDialogOpen,
  setDeleteDialogOpen,
  onDeleteConfirm,
  isRatingActivity = false,

  // 책 선택 다이얼로그
  bookDialogOpen,
  setBookDialogOpen,
  onBookSelect,

  // 리뷰 편집 다이얼로그
  reviewDialogOpen,
  setReviewDialogOpen,
  selectedBookTitle = '리뷰 수정',
  initialContent,
  initialRating,
  isSubmitting,
  onReviewSubmit,
}: ReviewDialogHandlerProps) {
  return (
    <>
      {/* Book search dialog */}
      <AddBookDialog
        isOpen={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
        libraryId={0} // Dummy value since we're just using for book selection
        onBookSelect={onBookSelect}
      />

      {/* ReviewDialog for editing reviews of type 'review' */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        bookTitle={selectedBookTitle}
        initialRating={initialRating}
        initialContent={initialContent}
        isEditMode={true}
        isSubmitting={isSubmitting}
        onSubmit={onReviewSubmit}
        onCancel={() => setReviewDialogOpen(false)}
      />

      {/* 리뷰 삭제 확인 다이얼로그 */}
      <ReviewAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={isRatingActivity ? '별점 삭제' : '리뷰 삭제'}
        message={
          isRatingActivity
            ? '이 별점을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
            : '이 리뷰를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
        }
        onConfirm={onDeleteConfirm}
        confirmText="삭제"
        isDanger={true}
      />

      {/* Alert Dialog for validation */}
      <ReviewAlertDialog
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        title={alertTitle}
        message={alertMessage}
      />
    </>
  );
}
