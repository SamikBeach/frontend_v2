import { MessageSquare, Share2, Star, ThumbsUp, X } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface BookDetails {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  category?: string;
  rating?: number;
  totalRatings?: number;
  publisher?: string;
  publishDate?: string;
  description?: string;
  toc?: string;
  authorInfo?: string;
  publisherReview?: string;
  pageCount?: number;
  isbn?: string;
  originalTitle?: string;
  translator?: string;
  dimensions?: string;
  weight?: string;
  tags?: string[];
  series?: {
    name: string;
    volume: number;
    totalVolumes: number;
  };
  awards?: Array<{
    name: string;
    year: string;
  }>;
  quotes?: Array<{
    id: number;
    content: string;
    page: number;
    likes: number;
  }>;
  reviews?: Array<{
    id: number;
    user: {
      name: string;
      avatar: string;
      readCount?: number;
    };
    rating: number;
    content: string;
    date: string;
    likes: number;
    comments: number;
  }>;
  readingStatus?: {
    currentReaders: number;
    completedReaders: number;
    averageReadingTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  similarBooks?: Array<{
    id: number;
    title: string;
    coverImage: string;
    author: string;
    rating?: number;
  }>;
}

interface BookDialogProps {
  book: BookDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDialog({ book, open, onOpenChange }: BookDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between rounded-t-lg border-b bg-white/80 px-4 backdrop-blur-xl">
          <DialogTitle className="text-lg font-medium">도서 상세</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mx-auto max-w-5xl space-y-8 p-6">
          {/* 헤더 섹션 */}
          <div className="grid gap-8 md:grid-cols-[400px_1fr]">
            {/* 왼쪽: 책 표지 및 기본 정보 */}
            <div className="space-y-6">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg border bg-gray-100 shadow-lg">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-2xl font-semibold">
                      {book.rating || 0}
                    </span>
                    {book.totalRatings && (
                      <span className="text-sm text-gray-500">
                        ({book.totalRatings}명)
                      </span>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    공유하기
                  </Button>
                </div>
                {book.tags && (
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                  <h4 className="font-medium">도서 정보</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>저자</p>
                    <p className="font-medium text-gray-900">{book.author}</p>
                    {book.translator && (
                      <>
                        <p>역자</p>
                        <p className="font-medium text-gray-900">
                          {book.translator}
                        </p>
                      </>
                    )}
                    {book.publisher && (
                      <>
                        <p>출판사</p>
                        <p className="font-medium text-gray-900">
                          {book.publisher}
                        </p>
                      </>
                    )}
                    {book.publishDate && (
                      <>
                        <p>출간일</p>
                        <p className="font-medium text-gray-900">
                          {book.publishDate}
                        </p>
                      </>
                    )}
                    {book.pageCount && (
                      <>
                        <p>페이지</p>
                        <p className="font-medium text-gray-900">
                          {book.pageCount}쪽
                        </p>
                      </>
                    )}
                    {book.isbn && (
                      <>
                        <p>ISBN</p>
                        <p className="font-medium text-gray-900">{book.isbn}</p>
                      </>
                    )}
                  </div>
                </div>
                {book.readingStatus && (
                  <div className="space-y-2 rounded-lg bg-blue-50 p-4">
                    <h4 className="font-medium">독서 현황</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>현재 읽는 중</p>
                      <p className="font-medium text-gray-900">
                        {book.readingStatus.currentReaders}명
                      </p>
                      <p>완독</p>
                      <p className="font-medium text-gray-900">
                        {book.readingStatus.completedReaders}명
                      </p>
                      <p>평균 독서 시간</p>
                      <p className="font-medium text-gray-900">
                        {book.readingStatus.averageReadingTime}
                      </p>
                      <p>난이도</p>
                      <p className="font-medium text-gray-900">
                        {book.readingStatus.difficulty === 'easy'
                          ? '쉬움'
                          : book.readingStatus.difficulty === 'medium'
                            ? '보통'
                            : '어려움'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 상세 정보 */}
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">
                  {book.title}
                </DialogTitle>
                {book.originalTitle && (
                  <p className="text-gray-500">{book.originalTitle}</p>
                )}
              </DialogHeader>

              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="description">책 소개</TabsTrigger>
                  <TabsTrigger value="toc">목차</TabsTrigger>
                  <TabsTrigger value="author">저자 소개</TabsTrigger>
                  <TabsTrigger value="quotes">인상적인 구절</TabsTrigger>
                  <TabsTrigger value="reviews">리뷰</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                  <TabsContent value="description">
                    <div className="prose prose-gray max-w-none space-y-4">
                      {book.description || '책 소개가 없습니다.'}
                      {book.awards && book.awards.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-lg font-semibold">수상 내역</h4>
                          <ul>
                            {book.awards.map(award => (
                              <li key={award.name}>
                                {award.year}년 {award.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="toc">
                    <div className="prose prose-gray max-w-none whitespace-pre-line">
                      {book.toc || '목차 정보가 없습니다.'}
                    </div>
                  </TabsContent>
                  <TabsContent value="author">
                    <div className="prose prose-gray max-w-none">
                      {book.authorInfo || '저자 소개가 없습니다.'}
                    </div>
                  </TabsContent>
                  <TabsContent value="quotes">
                    {book.quotes && book.quotes.length > 0 ? (
                      <div className="space-y-4">
                        {book.quotes.map(quote => (
                          <div
                            key={quote.id}
                            className="space-y-2 rounded-lg border bg-gray-50 p-4"
                          >
                            <p className="italic">{quote.content}</p>
                            <div className="flex items-center justify-between text-sm">
                              <p className="text-gray-500">p. {quote.page}</p>
                              <div className="flex items-center gap-3">
                                <Button variant="ghost" size="sm">
                                  <ThumbsUp className="mr-1 h-4 w-4" />
                                  {quote.likes}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="mr-1 h-4 w-4" />
                                  공유
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        등록된 인상적인 구절이 없습니다.
                      </p>
                    )}
                  </TabsContent>
                  <TabsContent value="reviews">
                    {book.reviews && book.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {book.reviews.map(review => (
                          <div
                            key={review.id}
                            className="space-y-3 rounded-lg border p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={review.user.avatar}
                                    alt={review.user.name}
                                  />
                                  <AvatarFallback>
                                    {review.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {review.user.name}
                                  </p>
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span>{review.rating.toFixed(1)}</span>
                                    </div>
                                    <span>·</span>
                                    <span>{review.date}</span>
                                    {review.user.readCount && (
                                      <>
                                        <span>·</span>
                                        <span>
                                          읽은 책 {review.user.readCount}권
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-800">{review.content}</p>
                            <div className="flex items-center gap-3 pt-1 text-sm">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="mr-1 h-4 w-4" />
                                좋아요 {review.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="mr-1 h-4 w-4" />
                                댓글 {review.comments}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">등록된 리뷰가 없습니다.</p>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* 비슷한 책 */}
          {book.similarBooks && book.similarBooks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">이런 책은 어떠세요?</h3>
              <div className="grid grid-cols-3 gap-6">
                {book.similarBooks.map(similarBook => (
                  <div
                    key={similarBook.id}
                    className="group cursor-pointer overflow-hidden"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                      <img
                        src={similarBook.coverImage}
                        alt={similarBook.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="mt-2 font-medium group-hover:text-blue-600">
                      {similarBook.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {similarBook.author}
                    </p>
                    {similarBook.rating && (
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Star className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {similarBook.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
