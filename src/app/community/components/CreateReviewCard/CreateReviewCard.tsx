import { SearchResult } from '@/apis/search/types';
import { AddBookDialog } from '@/app/library/[id]/components';
import { communityTypeFilterAtom } from '@/atoms/community';
import { AuthDialog } from '@/components/Auth/AuthDialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
} from '@/components/ui/responsive-alert-dialog';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useCreateReview } from '../../hooks';
import { ReviewForm } from './components/ReviewForm';
import { SelectedBook } from './components/SelectedBook';
import { UserAvatar } from './components/UserAvatar';

interface CreateReviewCardProps {
  user?: UserProfile;
}

export interface UserProfile {
  id: number;
  username?: string;
  profileImage?: string;
}

export function CreateReviewCard({ user: userProp }: CreateReviewCardProps) {
  const currentUser = useCurrentUser();
  const user = userProp ||
    currentUser || { id: 0, username: '게스트', profileImage: undefined };
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

  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <>
      <Card className="mb-3 overflow-hidden border-gray-200 bg-white sm:mb-4">
        <CardContent className="space-y-2 p-2.5 sm:space-y-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
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
                onTextareaFocus={() => {
                  if (!currentUser) setAuthDialogOpen(true);
                }}
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
      <ResponsiveAlertDialog
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
      >
        <ResponsiveAlertDialogContent className="max-w-md rounded-xl sm:rounded-2xl">
          <ResponsiveAlertDialogHeader>
            <ResponsiveAlertDialogTitle>
              {alertTitle}
            </ResponsiveAlertDialogTitle>
            <ResponsiveAlertDialogDescription className="mb-2 sm:mb-3">
              {alertMessage}
            </ResponsiveAlertDialogDescription>
          </ResponsiveAlertDialogHeader>
          <ResponsiveAlertDialogFooter className="mt-3 sm:mt-4">
            <ResponsiveAlertDialogAction
              className="rounded-lg bg-gray-900 text-sm hover:bg-gray-800 sm:rounded-xl"
              onClick={() => setAlertDialogOpen(false)}
            >
              확인
            </ResponsiveAlertDialogAction>
          </ResponsiveAlertDialogFooter>
        </ResponsiveAlertDialogContent>
      </ResponsiveAlertDialog>

      {/* 인증 다이얼로그 */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
}
