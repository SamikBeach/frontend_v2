import { SearchResult } from '@/apis/search/types';
import { AddBookDialog } from '@/app/library/[id]/components';
import { communityTypeFilterAtom } from '@/atoms/community';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useCreateReview } from '../../hooks';
import { ReviewForm } from './components/ReviewForm';
import { SelectedBook } from './components/SelectedBook';
import { UserAvatar } from './components/UserAvatar';

export interface UserProfile {
  id: number;
  username?: string;
  profileImage?: string;
}

interface CreateReviewCardProps {
  user: UserProfile;
}

export function CreateReviewCard({ user }: CreateReviewCardProps) {
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const typeFilter = useAtomValue(communityTypeFilterAtom);

  const {
    content,
    setContent,
    handleCreateReview,
    isLoading,
    type,
    setType,
    selectedBook,
    setSelectedBook,
    rating,
    setRating,
    readingStatus,
    setReadingStatus,
  } = useCreateReview();

  // typeFilter가 변경될 때마다 type 상태 업데이트
  useEffect(() => {
    if (typeFilter !== 'all') {
      setType(typeFilter);
    }
  }, [typeFilter, setType]);

  // 책 선택 대화상자 열기 핸들러
  const handleBookDialogOpen = () => {
    if (type === 'review') {
      setBookDialogOpen(true);
    }
  };

  // 책 선택 핸들러
  const handleBookSelect = (book: SearchResult) => {
    // 이미지 속성 통일 (coverImage와 image 둘 다 있게 함)
    const bookWithConsistentImage = {
      ...book,
      image: book.image || book.coverImage,
      coverImage: book.coverImage || book.image,
    };
    setSelectedBook(bookWithConsistentImage);
    setBookDialogOpen(false);
  };

  // 책 선택 제거 핸들러
  const handleRemoveSelectedBook = () => {
    setSelectedBook(null);
    setRating(0);
  };

  // 별점 선택 핸들러
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  // 리뷰 제출 핸들러
  const handleSubmitReview = async () => {
    // 리뷰 타입이면서 책이 선택되지 않은 경우 AlertDialog 표시
    if (type === 'review' && !selectedBook) {
      setAlertTitle('책을 선택해주세요');
      setAlertMessage('리뷰 태그를 선택한 경우, 책을 추가해야 합니다.');
      setAlertDialogOpen(true);
      return;
    }

    // 책이 선택되었는데 별점이 없는 경우 AlertDialog 표시
    if (selectedBook && rating === 0) {
      setAlertTitle('별점을 입력해주세요');
      setAlertMessage('책을 추가한 경우, 별점을 입력해야 합니다.');
      setAlertDialogOpen(true);
      return;
    }

    // 유효성 검사 후 리뷰 생성 요청
    const result = await handleCreateReview();
    if (!result.valid && result.message) {
      setAlertTitle('제출 오류');
      setAlertMessage(result.message);
      setAlertDialogOpen(true);
    }
  };

  return (
    <>
      <Card className="mb-6 overflow-hidden border-gray-200 bg-white shadow-none">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start gap-3">
            <UserAvatar user={user} />
            <div className="flex-1">
              <ReviewForm
                content={content}
                setContent={setContent}
                type={type}
                setType={setType}
                handleBookDialogOpen={handleBookDialogOpen}
                handleSubmitReview={handleSubmitReview}
                isLoading={isLoading}
              >
                {/* 선택된 책 정보 및 별점 표시 (리뷰 태그인 경우) */}
                {type === 'review' && selectedBook && (
                  <SelectedBook
                    selectedBook={selectedBook}
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                    handleRemoveSelectedBook={handleRemoveSelectedBook}
                    readingStatus={readingStatus}
                    setReadingStatus={setReadingStatus}
                  />
                )}
              </ReviewForm>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 책 선택 대화상자 */}
      <AddBookDialog
        isOpen={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
        libraryId={0} // Dummy value since we're just using for book selection
        onBookSelect={handleBookSelect}
      />

      {/* 알림 다이얼로그 */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="rounded-xl bg-gray-900 hover:bg-gray-800">
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
