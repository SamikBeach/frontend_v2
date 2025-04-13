import { useSuspenseQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { josa } from 'josa';
import { ChevronDown, ListPlus, PenLine, Star, X } from 'lucide-react';
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
import { toast } from 'sonner';
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
  const [userRating, setUserRating] = useState(0);
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  // 리뷰 다이얼로그로부터 받은 별점을 저장
  const [reviewRating, setReviewRating] = useState(0);

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

  // 별점 추가 핸들러
  const handleRatingClick = (rating: number) => {
    setUserRating(rating);
    // 리뷰 별점도 함께 업데이트
    setReviewRating(rating);
    // TODO: API 호출로 별점 저장
    console.log(`별점 추가: ${rating}점`);
  };

  // 별점 호버 핸들러
  const handleRatingHover = (rating: number) => {
    setHoveredRating(rating);
    setIsRatingHovered(true);
  };

  // 별점 호버 아웃 핸들러
  const handleRatingLeave = () => {
    setIsRatingHovered(false);
  };

  // 리뷰 제출 처리
  const handleReviewSubmit = useCallback(
    (rating: number, content: string) => {
      if (!isbn) return;
      // 리뷰 별점으로 BookDialog의 별점도 업데이트
      setUserRating(rating);
      // 리뷰 제출 로직 구현 (API 호출 등)
      console.log('리뷰 제출:', { rating, content, isbn });
      setReviewDialogOpen(false);
    },
    [isbn]
  );

  // 리뷰 다이얼로그 열기 핸들러
  const handleOpenReviewDialog = () => {
    // 현재 별점이 있으면 리뷰 별점으로 설정
    if (userRating > 0) {
      setReviewRating(userRating);
    }
    setReviewDialogOpen(true);
  };

  // 알라딘으로 이동하는 함수 추가
  const handleOpenAladin = useCallback(() => {
    if (!isbn) return;
    window.open(
      `https://www.aladin.co.kr/shop/wproduct.aspx?isbn=${isbn}`,
      '_blank'
    );
  }, [isbn]);

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

  // 읽기 상태에 따른 색상 및 스타일 결정
  const getReadingStatusStyle = (status: ReadingStatus | null) => {
    if (!status || status === '선택 안함') {
      return 'bg-gray-50 text-gray-700';
    }

    switch (status) {
      case '읽고 싶어요':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case '읽는 중':
        return 'bg-green-50 text-green-600 border-green-200';
      case '읽었어요':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // 서재에 담기 핸들러
  const handleAddToBookshelf = (bookshelfId: number) => {
    if (!isbn || !displayBook) return;

    // 서재 정보 찾기
    const bookshelf = defaultBookshelves.find(
      shelf => shelf.id === bookshelfId
    );

    // API 호출 등 구현
    console.log(`서재에 담기: 책 ISBN ${isbn}, 서재 ID ${bookshelfId}`);

    // 토스트 알림 표시 - josa 사용하여 조사 처리
    toast.success(
      josa(
        `${displayBook.title}#{이} ${bookshelf?.name || '서재'}에 담겼습니다`
      ),
      {
        description: '내 서재에서 확인할 수 있습니다.',
        duration: 3000,
        // 기본 스타일링 유지
        style: {
          fontWeight: 'bold',
        },
      }
    );
  };

  // 읽기 상태 표시 텍스트
  const readingStatusText = readingStatus || '읽기 상태';

  if (!displayBook) return null;

  // 출간일 포맷팅
  const formattedDate = displayBook.publishDate
    ? typeof displayBook.publishDate === 'string'
      ? format(parseISO(displayBook.publishDate), 'yyyy년 MM월 dd일', {
          locale: ko,
        })
      : format(new Date(displayBook.publishDate), 'yyyy년 MM월 dd일', {
          locale: ko,
        })
    : '';

  // 별점 출력 수정
  const displayRating = displayBook.rating
    ? typeof displayBook.rating === 'string'
      ? displayBook.rating
      : displayBook.rating.toFixed(1)
    : '0.0';

  // 리뷰 카운트 출력 수정
  const reviewCount = displayBook.reviews
    ? typeof displayBook.reviews === 'number'
      ? displayBook.reviews
      : parseInt(displayBook.reviews.toString()) || 0
    : 0;

  return (
    <>
      <div className="mx-auto w-full max-w-screen-xl p-10">
        <div className="grid gap-8 md:grid-cols-[380px_1fr]">
          {/* 왼쪽: 책 표지 및 기본 정보 */}
          <div className="space-y-6">
            {/* 책 표지 이미지 */}
            <div
              className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-gray-50"
              onClick={handleOpenAladin}
            >
              <img
                src={displayBook.coverImage}
                alt={displayBook.title}
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-[10px] text-white opacity-0 transition-opacity hover:opacity-100">
                알라딘에서 보기
              </div>
            </div>

            {/* 책 정보(제목, 저자, 출판사, 출간일)는 이미지 아래에 배치 */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <h2
                  className="cursor-pointer text-xl font-bold text-gray-900"
                  onClick={handleOpenAladin}
                >
                  {displayBook.title}
                </h2>

                {/* 카테고리 태그 - 제목 우측으로 이동 */}
                {(displayBook.category || displayBook.subcategory) && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {displayBook.category && (
                      <Badge className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-white">
                        {displayBook.category.name}
                      </Badge>
                    )}
                    {displayBook.subcategory && (
                      <Badge className="rounded-full bg-gray-600 px-2 py-0.5 text-[10px] font-medium text-white">
                        {displayBook.subcategory.name}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <p className="text-gray-700">{displayBook.author}</p>

              {displayBook.publisher && (
                <p className="text-sm text-gray-500">{displayBook.publisher}</p>
              )}
              {displayBook.publishDate && (
                <p className="text-sm text-gray-500">출간일: {formattedDate}</p>
              )}
            </div>

            {/* 별점 정보 */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-semibold">
                    {displayRating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({reviewCount}명)
                  </span>
                </div>
              </div>

              {/* 사용자 별점 선택 UI */}
              <div className="mt-3 border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-1"
                    onMouseLeave={handleRatingLeave}
                  >
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${
                          (
                            isRatingHovered
                              ? star <= hoveredRating
                              : star <= userRating
                          )
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-200 hover:text-gray-300'
                        }`}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => handleRatingHover(star)}
                      />
                    ))}
                    <span className="ml-2 text-xs text-gray-600">
                      {isRatingHovered
                        ? hoveredRating === 0
                          ? ''
                          : hoveredRating === 1
                            ? '별로예요'
                            : hoveredRating === 2
                              ? '아쉬워요'
                              : hoveredRating === 3
                                ? '보통이에요'
                                : hoveredRating === 4
                                  ? '좋아요'
                                  : '최고예요'
                        : userRating === 0
                          ? ''
                          : userRating === 1
                            ? '별로예요'
                            : userRating === 2
                              ? '아쉬워요'
                              : userRating === 3
                                ? '보통이에요'
                                : userRating === 4
                                  ? '좋아요'
                                  : '최고예요'}
                    </span>
                  </div>

                  {/* 리뷰 작성하기 버튼 - 별점 옆으로 이동 */}
                  <Button
                    className="h-8 rounded-full bg-gray-100 px-3 text-xs text-gray-700 hover:bg-gray-200"
                    onClick={handleOpenReviewDialog}
                  >
                    <PenLine className="mr-1 h-3 w-3" />
                    리뷰 쓰기
                  </Button>
                </div>
              </div>
            </div>

            {/* 기능 버튼들 */}
            <div className="flex flex-col gap-3">
              {/* 읽기 상태 및 서재에 담기 버튼 */}
              <div className="grid grid-cols-2 gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-between rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-900 ${getReadingStatusStyle(readingStatus)}`}
                    >
                      <span>{readingStatus || '책 상태 설정'}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 rounded-xl">
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg py-2 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => handleReadingStatusChange('읽고 싶어요')}
                    >
                      읽고 싶어요
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg py-2 hover:bg-green-50 hover:text-green-600"
                      onClick={() => handleReadingStatusChange('읽는 중')}
                    >
                      읽는 중
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer rounded-lg py-2 hover:bg-purple-50 hover:text-purple-600"
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
                      className="w-full rounded-full border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <ListPlus className="mr-1.5 h-4 w-4" />
                      <span className="text-sm">서재에 담기</span>
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
            </div>

            {/* 책 설명, 저자 소개 */}
            <div className="space-y-1">
              <BookInfo book={displayBook} />
              <p className="mt-2 text-right text-xs text-gray-400">
                정보제공: 알라딘
              </p>
            </div>
          </div>

          {/* 오른쪽: 리뷰 및 관련 정보 */}
          <div className="space-y-7">
            {/* 리뷰 섹션 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  리뷰 ({displayBook.reviews?.length || 0})
                </p>
              </div>

              <BookReviews
                book={displayBook}
                onOpenReviewDialog={handleOpenReviewDialog}
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
        initialRating={reviewRating}
      />
    </>
  );
}

// 로딩 중일 때 보여줄 스켈레톤 UI
function BookDialogSkeleton() {
  return (
    <div className="mx-auto w-full max-w-screen-xl p-10">
      <div className="grid gap-8 md:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <Skeleton className="aspect-[3/4] h-[420px] w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>

          {/* 별점 정보 스켈레톤 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-10" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>

          {/* 태그 스켈레톤 */}
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>

          {/* 버튼 스켈레톤 */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-full rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* 오른쪽 영역 스켈레톤 */}
        <div className="space-y-7">
          {/* 리뷰 섹션 스켈레톤 */}
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

          {/* 등록된 서재 스켈레톤 */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          </div>

          {/* 독서 모임 스켈레톤 */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-28" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          </div>

          {/* 인상적인 구절 스켈레톤 */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* 비슷한 책 스켈레톤 */}
      <div className="mt-8 space-y-4">
        <Skeleton className="h-5 w-28" />
        <div className="grid grid-cols-5 gap-4">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function BookDialog() {
  const { isOpen, isbn, close } = useDialogQuery({ type: 'book' });

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && close()}>
      <DialogContent className="w-full max-w-none rounded-lg bg-white p-0 md:max-w-screen-xl">
        {isOpen && (
          <Suspense
            fallback={
              <BookDialogHeader title="도서 로딩 중..." close={close} />
            }
          >
            <BookDialogHeader close={close} />
          </Suspense>
        )}
        {isOpen && (
          <Suspense fallback={<BookDialogSkeleton />}>
            <BookDialogContent />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  );
}

function BookDialogHeader({
  title,
  close,
}: {
  title?: string;
  close: () => void;
}) {
  const { isbn } = useDialogQuery({ type: 'book' });

  // 책 정보가 있을 때만 책 제목 가져오기
  const { data: book } = useSuspenseQuery({
    queryKey: ['book-detail', isbn],
    queryFn: () => (isbn ? getBookByIsbn(isbn) : null),
  });

  const bookTitle = title || (book ? book.title : '도서 상세 정보');

  return (
    <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-t-lg bg-white/80 px-6 backdrop-blur-xl">
      <DialogTitle className="max-w-[80%] truncate text-base font-medium">
        {bookTitle}
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
  );
}
