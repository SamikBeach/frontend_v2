'use client';

import { CommandEmpty } from '@/components/ui/command';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import { RecentSearchList } from './RecentSearchList';
import { SearchResultList } from './SearchResultList';

interface SearchDialogContentProps {
  keyword: string;
  onOpenChange: (open: boolean) => void;
}

function LoadingSpinner() {
  return (
    <div className="flex h-[300px] items-center justify-center">
      <Spinner size="lg" className="text-primary/50" />
    </div>
  );
}

function SearchGuide() {
  return (
    <CommandEmpty className="flex h-[300px] items-center justify-center text-sm text-gray-500">
      책이나 작가의 이름을 검색해보세요
    </CommandEmpty>
  );
}

function EmptySearchResult() {
  return (
    <CommandEmpty className="flex h-[300px] items-center justify-center text-sm text-gray-500">
      검색 결과가 없습니다
    </CommandEmpty>
  );
}

export function SearchDialogContent({
  keyword,
  onOpenChange,
}: SearchDialogContentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<{
    books: any[];
    authors: any[];
  }>({ books: [], authors: [] });

  // 키워드가 변경될 때마다 검색 수행
  useEffect(() => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      // 최근 검색 기록 로드 (데모용 목업 데이터)
      setRecentSearches([
        {
          id: 1,
          book: {
            id: 101,
            title: '플라톤 대화편',
            imageUrl: 'https://picsum.photos/seed/book1/200/300',
            authorBooks: [{ author: { nameInKor: '플라톤' } }],
            likeCount: 120,
            reviewCount: 42,
            totalTranslationCount: 5,
          },
        },
        {
          id: 2,
          author: {
            id: 201,
            nameInKor: '아리스토텔레스',
            name: 'Aristotle',
            imageUrl: 'https://picsum.photos/seed/author1/200/200',
            likeCount: 150,
            reviewCount: 65,
            bookCount: 12,
          },
        },
        {
          id: 3,
          book: {
            id: 102,
            title: '니코마코스 윤리학',
            imageUrl: 'https://picsum.photos/seed/book2/200/300',
            authorBooks: [{ author: { nameInKor: '아리스토텔레스' } }],
            likeCount: 89,
            reviewCount: 33,
            totalTranslationCount: 3,
          },
        },
      ]);
      setHasResults(true);
      return;
    }

    // 검색 시뮬레이션
    setIsLoading(true);

    // 검색 API 호출 시뮬레이션
    const timer = setTimeout(() => {
      // 예시 데이터 (실제로는 API에서 받아와야 함)
      const books = [
        {
          id: 103,
          title: `${trimmedKeyword}에 관한 책`,
          imageUrl: 'https://picsum.photos/seed/book3/200/300',
          authorBooks: [{ author: { nameInKor: '소크라테스' } }],
          likeCount: 75,
          reviewCount: 28,
          totalTranslationCount: 2,
        },
        {
          id: 104,
          title: `${trimmedKeyword}와 고전`,
          imageUrl: 'https://picsum.photos/seed/book4/200/300',
          authorBooks: [{ author: { nameInKor: '플라톤' } }],
          likeCount: 92,
          reviewCount: 37,
          totalTranslationCount: 4,
        },
      ];

      const authors = [
        {
          id: 202,
          nameInKor: `${trimmedKeyword} 작가`,
          name: 'Author',
          imageUrl: 'https://picsum.photos/seed/author2/200/200',
          likeCount: 110,
          reviewCount: 48,
          bookCount: 8,
        },
      ];

      setSearchResults({ books, authors });
      setHasResults(books.length > 0 || authors.length > 0);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  // 검색어가 비어있을 때는 최근 검색 표시
  if (!keyword.trim()) {
    return isLoading ? (
      <LoadingSpinner />
    ) : recentSearches.length > 0 ? (
      <RecentSearchList searches={recentSearches} onOpenChange={onOpenChange} />
    ) : (
      <SearchGuide />
    );
  }

  // 검색결과 표시
  return isLoading ? (
    <LoadingSpinner />
  ) : hasResults ? (
    <SearchResultList
      books={searchResults.books}
      authors={searchResults.authors}
      onOpenChange={onOpenChange}
      searchValue={keyword}
    />
  ) : (
    <EmptySearchResult />
  );
}
