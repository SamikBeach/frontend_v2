import { ChevronDown, ListPlus, PenLine, Share2, Star, X } from 'lucide-react';
import { useState } from 'react';

import { ReviewDialog } from '@/components/ReviewDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQueryParams } from '@/hooks/useQueryParams';

import { BookInfo } from './BookInfo';
import { BookQuotes } from './BookQuotes';
import { BookReviews } from './BookReviews';
import { BookShelves } from './BookShelves';
import { ReadingGroups } from './ReadingGroups';
import { SimilarBooks } from './SimilarBooks';
import { BookDetails } from './types';

interface BookDialogProps {
  book: BookDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ReadingStatus = '읽고 싶어요' | '읽는 중' | '읽었어요' | '선택 안함';

export function BookDialog({ book, open, onOpenChange }: BookDialogProps) {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>(
    null
  );
  const { updateQueryParams } = useQueryParams();

  // 다이얼로그 상태 변경 핸들러
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // 다이얼로그가 열릴 때 URL에 책 ID 추가
      updateQueryParams({ book: book.id.toString() });
    } else {
      // 다이얼로그가 닫힐 때 URL 파라미터 제거
      updateQueryParams({ book: undefined });
    }

    // 상위 컴포넌트에 상태 변경 알림
    onOpenChange(isOpen);
  };

  // 리뷰 제출 처리
  const handleReviewSubmit = (rating: number, content: string) => {
    // 리뷰 제출 로직 구현 (API 호출 등)
    console.log('리뷰 제출:', { rating, content, bookId: book.id });
    setReviewDialogOpen(false);
  };

  // 예시용 데이터
  const defaultBookshelves = [
    {
      id: 1,
      name: '소설 컬렉션',
      owner: '김독서',
      bookCount: 42,
      followers: 128,
      thumbnail: 'https://picsum.photos/seed/shelf1/100/100',
    },
    {
      id: 2,
      name: '인생 도서',
      owner: '책벌레',
      bookCount: 23,
      followers: 75,
      thumbnail: 'https://picsum.photos/seed/shelf2/100/100',
    },
  ];

  const defaultReadingGroups = [
    {
      id: 1,
      name: '주말 독서 모임',
      memberCount: 18,
      description: '매주 토요일 오전 함께 책을 읽어요',
      thumbnail: 'https://picsum.photos/seed/group1/100/100',
    },
    {
      id: 2,
      name: '심야 독서 클럽',
      memberCount: 12,
      description: '밤에 책을 읽는 모임입니다',
      thumbnail: 'https://picsum.photos/seed/group2/100/100',
    },
  ];

  // 읽기 상태 변경 핸들러
  const handleReadingStatusChange = (status: ReadingStatus) => {
    setReadingStatus(status);
    console.log(`읽기 상태 변경: ${status}`);
    // 여기에 API 호출 등 구현
  };

  // 서재에 담기 핸들러
  const handleAddToBookshelf = (bookshelfId: number) => {
    console.log(`서재에 담기: 책 ID ${book.id}, 서재 ID ${bookshelfId}`);
    // 여기에 API 호출 등 구현
  };

  // 읽기 상태 표시 텍스트
  const readingStatusText = readingStatus || '읽기 상태';

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl rounded-lg bg-white p-0">
          <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-t-lg bg-white/80 px-6 backdrop-blur-xl">
            <DialogTitle className="text-base font-medium">
              {book.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mx-auto max-w-5xl p-6">
            <div className="grid gap-8 md:grid-cols-[300px_1fr]">
              {/* 왼쪽: 책 표지 및 기본 정보 */}
              <div className="space-y-6">
                {/* 책 표지 이미지 */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* 책 정보(제목, 저자, 출판사, 출간일)는 이미지 아래에 배치 */}
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {book.title}
                  </h2>
                  <p className="text-gray-700">{book.author}</p>
                  {book.publisher && (
                    <p className="text-sm text-gray-500">{book.publisher}</p>
                  )}
                  {book.publishDate && (
                    <p className="text-sm text-gray-500">
                      출간일: {book.publishDate}
                    </p>
                  )}
                </div>

                {/* 별점 정보 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-semibold">
                      {book.rating || 0}
                    </span>
                    {book.totalRatings && (
                      <span className="text-sm text-gray-500">
                        ({book.totalRatings}명)
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-gray-600 hover:bg-gray-50"
                  >
                    <Share2 className="mr-1.5 h-4 w-4" />
                    공유
                  </Button>
                </div>

                {/* 태그 정보 */}
                {book.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {book.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* 읽기 상태 및 서재에 담기 버튼 - 파스텔 색상으로 변경 */}
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 justify-between rounded-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                      >
                        <span>{readingStatusText}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 rounded-xl">
                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg py-2"
                        onClick={() => handleReadingStatusChange('읽고 싶어요')}
                      >
                        읽고 싶어요
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg py-2"
                        onClick={() => handleReadingStatusChange('읽는 중')}
                      >
                        읽는 중
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg py-2"
                        onClick={() => handleReadingStatusChange('읽었어요')}
                      >
                        읽었어요
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg py-2"
                        onClick={() => handleReadingStatusChange('선택 안함')}
                      >
                        선택 안함
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-full border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
                      >
                        <ListPlus className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 rounded-xl">
                      {defaultBookshelves.map(shelf => (
                        <DropdownMenuItem
                          key={shelf.id}
                          className="cursor-pointer rounded-lg py-2"
                          onClick={() => handleAddToBookshelf(shelf.id)}
                        >
                          {shelf.name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem className="cursor-pointer rounded-lg py-2">
                        + 새 서재 만들기
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* 책 설명, 저자 소개 */}
                <BookInfo book={book} />
              </div>

              {/* 오른쪽: 리뷰 및 관련 정보 */}
              <div className="space-y-7">
                {/* 리뷰 섹션 - 리뷰 작성하기 버튼은 리뷰 타이틀과 같은 줄에 배치, 기존 스타일로 복원 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      리뷰 ({book.reviews?.length || 0})
                    </p>
                    <Button
                      className="rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200"
                      onClick={() => setReviewDialogOpen(true)}
                    >
                      <PenLine className="mr-1.5 h-4 w-4" />
                      리뷰 작성하기
                    </Button>
                  </div>

                  <BookReviews
                    book={book}
                    onOpenReviewDialog={() => setReviewDialogOpen(true)}
                  />
                </div>

                {/* 등록된 서재 섹션 */}
                <BookShelves
                  bookshelves={book.bookshelves || defaultBookshelves}
                />

                {/* 독서 모임 섹션 */}
                <ReadingGroups
                  readingGroups={book.readingGroups || defaultReadingGroups}
                />

                {/* 인상적인 구절 */}
                <BookQuotes quotes={book.quotes} />
              </div>
            </div>

            {/* 비슷한 책 */}
            <SimilarBooks similarBooks={book.similarBooks} />
          </div>
        </DialogContent>
      </Dialog>

      {/* 리뷰 작성 다이얼로그 */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        bookTitle={book.title}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
}
