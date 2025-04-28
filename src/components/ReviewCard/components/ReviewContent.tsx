import { ReviewType } from '@/apis/review/types';
import { SearchResult } from '@/apis/search/types';
import { ExtendedReviewResponseDto } from '../types';
import { BookPreview } from './BookPreview';
import { ReviewEditForm } from './ReviewEditForm';

interface ReviewContentProps {
  review: ExtendedReviewResponseDto;
  isEditMode: boolean;
  displayContent: string;
  isLongContent: boolean;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;

  // 편집 관련 props
  editedContent: string;
  setEditedContent: (content: string) => void;
  editedType: ReviewType;
  editedRating: number;
  selectedBook: SearchResult | null;

  // 핸들러
  onTypeChange: (type: ReviewType) => void;
  onRatingChange: (rating: number) => void;
  onSaveEdit: () => Promise<void>;
  onCancelEdit: () => void;
  onBookDialogOpen: () => void;
  onRemoveSelectedBook: () => void;
  onBookClick: () => void;
}

export function ReviewContent({
  review,
  isEditMode,
  displayContent,
  isLongContent,
  expanded,
  setExpanded,

  // 편집 관련 props
  editedContent,
  setEditedContent,
  editedType,
  editedRating,
  selectedBook,

  // 핸들러
  onTypeChange,
  onRatingChange,
  onSaveEdit,
  onCancelEdit,
  onBookDialogOpen,
  onRemoveSelectedBook,
  onBookClick,
}: ReviewContentProps) {
  if (isEditMode) {
    return (
      <ReviewEditForm
        content={editedContent}
        setContent={setEditedContent}
        type={editedType}
        setType={onTypeChange}
        selectedBook={selectedBook}
        rating={editedRating}
        setRating={onRatingChange}
        onSave={onSaveEdit}
        onCancel={onCancelEdit}
        onBookDialogOpen={onBookDialogOpen}
        onRemoveSelectedBook={onRemoveSelectedBook}
        originalType={review.type}
      />
    );
  }

  return (
    <>
      {/* 본문 내용 */}
      <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-800">
        {displayContent}
        {isLongContent && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 font-medium text-gray-500 hover:text-gray-700"
          >
            {expanded ? '접기' : '더보기'}
          </button>
        )}
      </p>

      {/* 이미지가 있는 경우 */}
      {review.images && review.images.length > 0 && (
        <div className="overflow-hidden rounded-xl">
          <img
            src={review.images[0].url}
            alt="Review image"
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      {/* 책 정보가 있는 경우 */}
      {review.books && review.books.length > 0 && (
        <BookPreview book={review.books[0] as any} onClick={onBookClick} />
      )}
    </>
  );
}
