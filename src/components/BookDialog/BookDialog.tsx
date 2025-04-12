import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronDown, ListPlus, PenLine, Share2, Star, X } from 'lucide-react';
import { Suspense, useCallback, useMemo, useState } from 'react';

import { getBookByIsbn } from '@/apis/book';
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
import { Skeleton } from '@/components/ui/skeleton';

import { Book } from '@/apis/book/types';
import { useDialogQuery } from '@/hooks/useDialogQuery';
import { BookInfo } from './BookInfo';
import { BookQuotes } from './BookQuotes';
import { BookReviews } from './BookReviews';
import { BookShelves } from './BookShelves';
import { ReadingGroups } from './ReadingGroups';
import { SimilarBooks } from './SimilarBooks';
import { BookDetails } from './types';

type ReadingStatus = '읽고 싶어요' | '읽는 중' | '읽었어요' | '선택 안함';

// 북 데이터를 BookDetails 형식으로 보강
function enrichBookDetails(book: Book): BookDetails {
  return {
    ...book,
    coverImage:
      book.coverImage || `https://picsum.photos/seed/${book.id}/400/600`,
    toc: `제1장 도입부\n제2장 본론\n  제2.1절 첫 번째 주제\n  제2.2절 두 번째 주제\n제3장 결론`,
    authorInfo: `${book.author}는 해당 분야에서 20년 이상의 경력을 가진 저명한 작가입니다. 여러 저서를 통해 독자들에게 새로운 시각과 통찰을 제공해왔습니다.`,
    tags: ['베스트셀러', book.category?.name, book.subcategory?.name].filter(
      tag => !!tag
    ) as string[],
    reviews: [
      {
        id: 1,
        user: {
          name: '김독서',
          avatar: `https://i.pravatar.cc/150?u=user1`,
        },
        rating: 4.5,
        content:
          '정말 좋은 책이었습니다. 깊이 있는 통찰과 함께 현대적 해석이 인상적이었습니다.',
        date: '2024-03-15',
        likes: 24,
        comments: 8,
      },
      {
        id: 2,
        user: {
          name: '이책벌레',
          avatar: `https://i.pravatar.cc/150?u=user2`,
        },
        rating: 5,
        content:
          '필독서입니다. 이 분야에 관심이 있는 분들이라면 꼭 읽어보세요.',
        date: '2024-02-28',
        likes: 32,
        comments: 12,
      },
    ],
  };
}

function BookDialogContent() {
  const { isOpen, isbn, close } = useDialogQuery({ type: 'book' });
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>(
    null
  );

  // isbn이 없으면 다이얼로그를 렌더링하지 않음
  if (!isbn) return null;

  // 책 상세 정보 가져오기 (ISBN으로 API 호출)
  const { data: book } = useSuspenseQuery({
    queryKey: ['book-detail', isbn],
    queryFn: () => getBookByIsbn(isbn),
  });

  // 상세 정보와 UI에 필요한 추가 정보를 합침
  const displayBook = useMemo(() => {
    if (!book) return null;
    // API에서 가져온 데이터가 있으면 사용
    return enrichBookDetails(book);
  }, [book]);

  // 리뷰 제출 처리
  const handleReviewSubmit = useCallback(
    (rating: number, content: string) => {
      if (!isbn) return;
      // 리뷰 제출 로직 구현 (API 호출 등)
      console.log('리뷰 제출:', { rating, content, isbn });
      setReviewDialogOpen(false);
    },
    [isbn]
  );

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
    if (!isbn) return;
    console.log(`서재에 담기: 책 ISBN ${isbn}, 서재 ID ${bookshelfId}`);
    // 여기에 API 호출 등 구현
  };

  // 읽기 상태 표시 텍스트
  const readingStatusText = readingStatus || '읽기 상태';

  if (!displayBook) return null;

  return (
    <>
      <div className="mx-auto max-w-5xl p-6">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* 왼쪽: 책 표지 및 기본 정보 */}
          <div className="space-y-6">
            {/* 책 표지 이미지 */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-50">
              <img
                src={displayBook.coverImage}
                alt={displayBook.title}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>

            {/* 책 정보(제목, 저자, 출판사, 출간일)는 이미지 아래에 배치 */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">
                {displayBook.title}
              </h2>
              <p className="text-gray-700">{displayBook.author}</p>
              {displayBook.publisher && (
                <p className="text-sm text-gray-500">{displayBook.publisher}</p>
              )}
              {displayBook.publishDate && (
                <p className="text-sm text-gray-500">
                  출간일:{' '}
                  {typeof displayBook.publishDate === 'string'
                    ? displayBook.publishDate
                    : new Date(displayBook.publishDate)
                        .toISOString()
                        .split('T')[0]}
                </p>
              )}
            </div>

            {/* 별점 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-semibold">
                  {displayBook.rating || 0}
                </span>
                {displayBook.totalRatings && (
                  <span className="text-sm text-gray-500">
                    ({displayBook.totalRatings}명)
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
            {displayBook.tags && (
              <div className="flex flex-wrap gap-1.5">
                {displayBook.tags.map(tag => (
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

            {/* 읽기 상태 및 서재에 담기 버튼 */}
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
            <BookInfo book={displayBook} />
          </div>

          {/* 오른쪽: 리뷰 및 관련 정보 */}
          <div className="space-y-7">
            {/* 리뷰 섹션 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  리뷰 ({displayBook.reviews?.length || 0})
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
                book={displayBook}
                onOpenReviewDialog={() => setReviewDialogOpen(true)}
              />
            </div>

            {/* 등록된 서재 섹션 */}
            <BookShelves
              bookshelves={displayBook.bookshelves || defaultBookshelves}
            />

            {/* 독서 모임 섹션 */}
            <ReadingGroups
              readingGroups={displayBook.readingGroups || defaultReadingGroups}
            />

            {/* 인상적인 구절 */}
            <BookQuotes quotes={displayBook.quotes} />
          </div>
        </div>

        {/* 비슷한 책 */}
        <SimilarBooks similarBooks={displayBook.similarBooks} />
      </div>

      {/* 리뷰 작성 다이얼로그 */}
      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        bookTitle={displayBook.title}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
}

// 로딩 중일 때 보여줄 스켈레톤 UI
function BookDialogSkeleton() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <Skeleton className="aspect-[3/4] h-[400px] w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <div className="space-y-7">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookDialog() {
  const { isOpen, close } = useDialogQuery({ type: 'book' });

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && close()}>
      <DialogContent className="max-w-4xl rounded-lg bg-white p-0">
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-t-lg bg-white/80 px-6 backdrop-blur-xl">
          <DialogTitle className="text-base font-medium">
            도서 상세 정보
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => close()}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {isOpen && (
          <Suspense fallback={<BookDialogSkeleton />}>
            <BookDialogContent />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  );
}
