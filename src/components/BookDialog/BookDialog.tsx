import { X } from 'lucide-react';
import { useState } from 'react';

import { ReviewDialog } from '@/components/ReviewDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useUrlParams } from '@/hooks/useUrlParams';

import { BookCover } from './BookCover';
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

export function BookDialog({ book, open, onOpenChange }: BookDialogProps) {
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // URL 쿼리스트링 처리 - onParamChange 콜백 활용
  const { params, setParam, clearParams } = useUrlParams({
    defaultValues: {
      book: '',
    },
    onParamChange: (key, value) => {
      // book 파라미터가 변경되었고, 그 값이 현재 책의 ID와 일치하면 다이얼로그 열기
      if (key === 'book' && value && value === book.id.toString() && !open) {
        onOpenChange(true);
      }
    },
  });

  // 다이얼로그 상태 변경 핸들러
  const handleOpenChange = (isOpen: boolean) => {
    // URL 파라미터 처리
    if (isOpen) {
      // 다이얼로그가 열릴 때 URL에 책 ID 추가
      setParam('book', book.id.toString());
    } else {
      // 다이얼로그가 닫힐 때 URL 파라미터 제거
      clearParams();
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
              <BookCover book={book} />

              {/* 오른쪽: 상세 정보 */}
              <div className="space-y-7">
                {/* 책 제목, 설명, 저자 소개 */}
                <BookInfo book={book} />

                {/* 리뷰 섹션 */}
                <BookReviews
                  book={book}
                  onOpenReviewDialog={() => setReviewDialogOpen(true)}
                />

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
