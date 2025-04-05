'use client';

import { userAtom } from '@/atoms/auth';
import { Book, BookCard } from '@/components/BookCard';
import { BookDialog } from '@/components/BookDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParams } from '@/hooks';
import { useAtomValue } from 'jotai';
import { BookOpen, Grid, List, PlusCircle, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// 예시 데이터: 사용자 책장 컬렉션
const collections = [
  {
    id: 1,
    name: '읽은 책',
    books: [
      {
        id: 1,
        title: '소크라테스의 변명',
        author: '플라톤',
        coverImage: `https://picsum.photos/seed/book1/240/360`,
        category: '철학',
        subcategory: 'ancient-philosophy',
        rating: 4.8,
        reviews: 128,
        description: '플라톤의 대화편으로, 진정한 지혜의 의미를 탐구하는 고전',
        publishDate: '2024-01-15',
        publisher: '고전출판사',
      },
      {
        id: 3,
        title: '로마제국 쇠망사',
        author: '에드워드 기번',
        coverImage: `https://picsum.photos/seed/book3/240/360`,
        category: '역사',
        subcategory: 'ancient-history',
        rating: 4.7,
        reviews: 96,
        description: '로마 제국의 번영과 쇠락을 다룬 역사서',
        publishDate: '2023-09-05',
        publisher: '역사연구소',
      },
    ],
  },
  {
    id: 2,
    name: '읽고 싶은 책',
    books: [
      {
        id: 2,
        title: '죄와 벌',
        author: '표도르 도스토예프스키',
        coverImage: `https://picsum.photos/seed/book2/240/360`,
        category: '문학',
        subcategory: 'russian-literature',
        rating: 4.9,
        reviews: 245,
        description: '인간의 죄의식과 구원을 탐구하는 도스토예프스키의 대표작',
        publishDate: '2023-11-20',
        publisher: '세계문학사',
      },
      {
        id: 4,
        title: '국부론',
        author: '애덤 스미스',
        coverImage: `https://picsum.photos/seed/book7/240/360`,
        category: '경제',
        subcategory: 'economics',
        rating: 4.6,
        reviews: 156,
        description: '근대 경제학의 기초를 세운 애덤 스미스의 대표작',
        publishDate: '2023-08-12',
        publisher: '경제연구소',
      },
      {
        id: 5,
        title: '프로테스탄트 윤리와 자본주의 정신',
        author: '막스 베버',
        coverImage: `https://picsum.photos/seed/book8/240/360`,
        category: '사회학',
        subcategory: 'sociology',
        rating: 4.5,
        reviews: 110,
        description: '자본주의 발전에 종교가 미친 영향을 분석한 사회학 고전',
        publishDate: '2023-10-08',
        publisher: '사회과학출판',
      },
    ],
  },
  {
    id: 3,
    name: '좋아하는 책',
    books: [
      {
        id: 1,
        title: '소크라테스의 변명',
        author: '플라톤',
        coverImage: `https://picsum.photos/seed/book1/240/360`,
        category: '철학',
        subcategory: 'ancient-philosophy',
        rating: 4.8,
        reviews: 128,
        description: '플라톤의 대화편으로, 진정한 지혜의 의미를 탐구하는 고전',
        publishDate: '2024-01-15',
        publisher: '고전출판사',
      },
    ],
  },
];

export default function ProfileLibraryPage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const { getQueryParam, updateQueryParams } = useQueryParams();

  // URL에서 선택된 컬렉션 ID 및 책 ID 가져오기
  const collectionId = parseInt(getQueryParam('collection') || '1');
  const bookIdParam = getQueryParam('book');

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');

  // 뷰 모드 상태 (그리드 또는 리스트)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 사용자가 로그인하지 않았으면 홈으로 리다이렉트
  if (!user) {
    router.push('/');
    return null;
  }

  // 현재 선택된 컬렉션 찾기
  const selectedCollection =
    collections.find(c => c.id === collectionId) || collections[0];

  // URL의 book ID에 해당하는 책 찾기
  const bookFromUrl = bookIdParam
    ? collections
        .flatMap(c => c.books)
        .find(b => b.id === parseInt(bookIdParam))
    : null;

  // 검색 필터링된 책 목록
  const filteredBooks = searchQuery
    ? selectedCollection.books.filter(
        book =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedCollection.books;

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    updateQueryParams({
      collection: value,
      book: undefined,
    });
  };

  // 책 선택 핸들러
  const handleBookSelect = (book: Book) => {
    updateQueryParams({ book: book.id.toString() });
  };

  // 다이얼로그 상태 변경 핸들러
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      updateQueryParams({ book: undefined });
    }
  };

  return (
    <div className="bg-white pb-12">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="flex items-center text-2xl font-bold text-gray-900">
                <BookOpen className="mr-2 h-6 w-6 text-blue-600" />내 서재
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                나만의 책 컬렉션을 관리하고 다양한 책을 발견해보세요.
              </p>
            </div>
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />새 컬렉션 만들기
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-6">
        <Tabs
          defaultValue={collectionId.toString()}
          value={collectionId.toString()}
          onValueChange={handleTabChange}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TabsList className="h-9 bg-gray-100 p-1">
              {collections.map(collection => (
                <TabsTrigger
                  key={collection.id}
                  value={collection.id.toString()}
                  className="rounded-md px-3 py-1.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {collection.name} ({collection.books.length})
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="책 검색..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-9 w-48 rounded-md border-gray-200 bg-white pl-9 text-sm"
                />
              </div>

              <div className="flex rounded-md border border-gray-200 p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 rounded-sm ${
                    viewMode === 'grid' ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                  <span className="sr-only">그리드 보기</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 rounded-sm ${
                    viewMode === 'list' ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                  <span className="sr-only">리스트 보기</span>
                </Button>
              </div>
            </div>
          </div>

          {collections.map(collection => (
            <TabsContent
              key={collection.id}
              value={collection.id.toString()}
              className="mt-6"
            >
              {filteredBooks.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                      : 'space-y-4'
                  }
                >
                  {filteredBooks.map(book => (
                    <div key={book.id} className="group cursor-pointer">
                      {viewMode === 'grid' ? (
                        <BookCard book={book} onClick={handleBookSelect} />
                      ) : (
                        <div className="flex gap-4 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50">
                          <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col">
                            <h3 className="text-[15px] font-medium text-gray-900 group-hover:text-blue-600">
                              {book.title}
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {book.author}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                              {book.description}
                            </p>
                            <div className="mt-auto flex items-center pt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>평점: {book.rating.toFixed(1)}</span>
                                <span>•</span>
                                <span>리뷰: {book.reviews}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-40 flex-col items-center justify-center rounded-lg bg-gray-50 p-8 text-center">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                  <h3 className="mt-4 text-base font-medium text-gray-900">
                    검색 결과가 없습니다
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    다른 검색어를 입력하거나 다른 컬렉션을 선택해보세요.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* 책 상세 정보 Dialog */}
      {bookFromUrl && (
        <BookDialog
          book={{
            ...bookFromUrl,
            coverImage: `https://picsum.photos/seed/${bookFromUrl.id}/400/600`,
            toc: `제1장 도입부\n제2장 본론\n  제2.1절 첫 번째 주제\n  제2.2절 두 번째 주제\n제3장 결론`,
            authorInfo: `${bookFromUrl.author}는 해당 분야에서 20년 이상의 경력을 가진 저명한 작가입니다. 여러 저서를 통해 독자들에게 새로운 시각과 통찰을 제공해왔습니다.`,
            tags: ['베스트셀러', bookFromUrl.category, bookFromUrl.subcategory],
            publisher: bookFromUrl.publisher,
            publishDate: bookFromUrl.publishDate,
            description: bookFromUrl.description,
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
            ],
            similarBooks: collections
              .flatMap(c => c.books)
              .slice(0, 3)
              .map(book => ({
                ...book,
                coverImage: `https://picsum.photos/seed/${book.id}/240/360`,
              })),
          }}
          open={!!bookFromUrl}
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </div>
  );
}
