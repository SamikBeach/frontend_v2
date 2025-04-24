import { SearchResult } from '@/apis/search/types';
import { AddBookDialog } from '@/app/library/[id]/components';
import { communityCategoryColors } from '@/atoms/community';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, SendHorizontal, Star, X } from 'lucide-react';
import { useState } from 'react';
import { useCreateReview } from '../hooks';

interface CreateReviewCardProps {
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export function CreateReviewCard({ user }: CreateReviewCardProps) {
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

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
  } = useCreateReview();

  // Safely get first letter of name for avatar fallback
  const getNameInitial = () => {
    if (!user?.name) return '?';
    return user.name.charAt(0);
  };

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

  // 태그 변경 핸들러
  const handleTypeChange = (newType: string) => {
    setType(newType as any);
    // 리뷰 태그가 아니면 책과 별점 초기화
    if (newType !== 'review') {
      setSelectedBook(null);
      setRating(0);
    }
  };

  // 태그별 이름 가져오기
  const getTagName = (tagType: string) => {
    switch (tagType) {
      case 'discussion':
        return '토론';
      case 'review':
        return '리뷰';
      case 'question':
        return '질문';
      case 'meetup':
        return '모임';
      default:
        return '일반';
    }
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
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.avatar}
                alt={user.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gray-100 text-gray-800">
                {getNameInitial()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="어떤 책에 대해 이야기하고 싶으신가요?"
                className="min-h-[100px] resize-none rounded-xl border-gray-200 bg-[#F9FAFB] text-[15px]"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Select value={type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="h-9 w-[130px] cursor-pointer rounded-xl border-gray-200 bg-white font-medium text-gray-700">
                    <SelectValue>
                      <div className="flex items-center">
                        <span
                          className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              communityCategoryColors[
                                type as keyof typeof communityCategoryColors
                              ] || '#F9FAFB',
                          }}
                        ></span>
                        {getTagName(type)}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general" className="cursor-pointer">
                      <div className="flex items-center">
                        <span
                          className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              communityCategoryColors.general || '#F9FAFB',
                          }}
                        ></span>
                        일반
                      </div>
                    </SelectItem>
                    <SelectItem value="discussion" className="cursor-pointer">
                      <div className="flex items-center">
                        <span
                          className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              communityCategoryColors.discussion || '#F9FAFB',
                          }}
                        ></span>
                        토론
                      </div>
                    </SelectItem>
                    <SelectItem value="review" className="cursor-pointer">
                      <div className="flex items-center">
                        <span
                          className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              communityCategoryColors.review || '#F9FAFB',
                          }}
                        ></span>
                        리뷰
                      </div>
                    </SelectItem>
                    <SelectItem value="question" className="cursor-pointer">
                      <div className="flex items-center">
                        <span
                          className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              communityCategoryColors.question || '#F9FAFB',
                          }}
                        ></span>
                        질문
                      </div>
                    </SelectItem>
                    <SelectItem value="meetup" className="cursor-pointer">
                      <div className="flex items-center">
                        <span
                          className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              communityCategoryColors.meetup || '#F9FAFB',
                          }}
                        ></span>
                        모임
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl border-gray-200 bg-white font-medium text-gray-700"
                  onClick={handleBookDialogOpen}
                  disabled={type !== 'review'}
                >
                  <BookOpen className="mr-1.5 h-4 w-4 text-gray-500" />책 추가
                </Button>

                <Button
                  className="ml-auto h-9 rounded-xl bg-gray-900 px-4 font-medium text-white hover:bg-gray-800"
                  onClick={handleSubmitReview}
                  disabled={!content.trim() || isLoading}
                >
                  <SendHorizontal className="mr-1.5 h-4 w-4" />
                  제출하기
                </Button>
              </div>

              {/* 선택된 책 정보 및 별점 표시 (리뷰 태그인 경우) */}
              {type === 'review' && selectedBook && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <img
                      src={selectedBook.image || selectedBook.coverImage}
                      alt={selectedBook.title}
                      className="h-16 w-12 rounded object-cover"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          {selectedBook.title}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full p-0 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          onClick={handleRemoveSelectedBook}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedBook.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2">
                    <span className="text-sm font-medium text-gray-700">
                      별점:
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`h-5 w-5 cursor-pointer ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                          onClick={() => handleRatingChange(star)}
                        />
                      ))}
                    </div>
                    {rating > 0 && (
                      <span className="ml-2 text-sm text-gray-500">
                        {rating === 1
                          ? '별로예요'
                          : rating === 2
                            ? '아쉬워요'
                            : rating === 3
                              ? '보통이에요'
                              : rating === 4
                                ? '좋아요'
                                : '최고예요'}
                      </span>
                    )}
                  </div>
                </div>
              )}
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
