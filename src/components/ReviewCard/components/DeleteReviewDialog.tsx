import { ReviewAlertDialog } from './ReviewAlertDialog';

interface DeleteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteConfirm: () => void;
  isRatingActivity?: boolean;
}

export function DeleteReviewDialog({
  open,
  onOpenChange,
  onDeleteConfirm,
  isRatingActivity = false,
}: DeleteReviewDialogProps) {
  return (
    <ReviewAlertDialog
      open={open}
      onOpenChange={onOpenChange}
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
  );
}
