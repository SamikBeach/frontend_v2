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

  // URL 쿼리스트링 처리
  const { setParam, clearParams } = useUrlParams({
    defaultValues: {
      book: '',
    },
    onParamChange: (key, value) => {
      // 필요한 경우 추가 조치 가능
      console.log(`Param changed: ${key} = ${value}`);
    },
  });

  // 다이얼로그 상태 변경 시 URL 파라미터도 함께 업데이트
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setParam('book', book.id.toString());
    } else {
      clearParams();
    }
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
          <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-lg bg-white/80 px-6 backdrop-blur-xl">
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
