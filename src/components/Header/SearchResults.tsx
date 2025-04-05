'use client';

import { CommandEmpty, CommandGroup } from '@/components/ui/command';
import { Clock, Loader2, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SearchItem } from './SearchItem';

interface SearchResultsProps {
  query: string;
  view: 'recent' | 'results';
  onItemClick: () => void;
}

// 실시간 인기 검색어 (실제로는 API에서 가져와야 함)
const TRENDING_KEYWORDS = [
  { keyword: '고전문학', count: 2450 },
  { keyword: '플라톤', count: 1823 },
  { keyword: '논어', count: 1654 },
  { keyword: '니체', count: 1342 },
  { keyword: '소크라테스', count: 1265 },
  { keyword: '도스토예프스키', count: 1132 },
  { keyword: '국가', count: 987 },
  { keyword: '맹자', count: 854 },
];

export function SearchResults({
  query,
  view,
  onItemClick,
}: SearchResultsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 모의 데이터 로드 - 최근 검색 목록 (실제로는 API에서 가져와야 함)
  useEffect(() => {
    setRecentSearches([
      {
        id: 1,
        type: 'book',
        title: '논어',
        subtitle: '공자',
        image: 'https://picsum.photos/seed/book1/120/180',
        author: '공자',
      },
      {
        id: 3,
        type: 'book',
        title: '국가',
        subtitle: '플라톤',
        image: 'https://picsum.photos/seed/book2/120/180',
        author: '플라톤',
      },
      {
        id: 4,
        type: 'book',
        title: '도덕경',
        subtitle: '노자',
        image: 'https://picsum.photos/seed/book3/120/180',
        author: '노자',
      },
    ]);
  }, []);

  // 검색 결과 가져오기 (모의 검색)
  useEffect(() => {
    if (view === 'results' && query.trim()) {
      setIsLoading(true);

      // 모의 API 검색 (실제로는 API 요청으로 대체)
      const timer = setTimeout(() => {
        // 책 검색 결과
        const bookResults = [
          {
            id: 101,
            type: 'book',
            title: `${query}와 서양 고전`,
            subtitle: '김철학',
            image: 'https://picsum.photos/seed/search1/120/180',
            author: '김철학',
            highlight: query,
          },
          {
            id: 102,
            type: 'book',
            title: `${query}의 세계`,
            subtitle: '이동양',
            image: 'https://picsum.photos/seed/search2/120/180',
            author: '이동양',
            highlight: query,
          },
          {
            id: 103,
            type: 'book',
            title: `${query}에 관한 고찰`,
            subtitle: '박고전',
            image: 'https://picsum.photos/seed/search3/120/180',
            author: '박고전',
            highlight: query,
          },
        ];

        setSearchResults(bookResults);
        setIsLoading(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [query, view]);

  // 최근 검색 화면
  if (view === 'recent') {
    return (
      <div className="pb-4">
        {/* 최근 검색 목록 */}
        {recentSearches.length > 0 && (
          <CommandGroup heading="최근 검색" className="pb-2">
            <div className="mb-2 flex items-center justify-between px-4">
              <h3 className="flex items-center text-xs font-medium text-gray-500">
                <Clock className="mr-1.5 h-3.5 w-3.5" />
                최근 도서 검색
              </h3>
              <button className="text-xs text-blue-500 hover:underline">
                전체 삭제
              </button>
            </div>
            {recentSearches.map(item => (
              <SearchItem
                key={`${item.type}-${item.id}`}
                item={item}
                onClick={onItemClick}
                onDelete={() => console.log('삭제:', item.id)}
              />
            ))}
          </CommandGroup>
        )}

        {/* 실시간 인기 검색어 */}
        <CommandGroup heading="실시간 인기 검색어" className="pt-0">
          <div className="mb-2 px-4">
            <h3 className="flex items-center text-xs font-medium text-gray-500">
              <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
              지금 많이 찾는 검색어
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 p-3 pt-1 max-sm:grid-cols-1">
            {TRENDING_KEYWORDS.map((trending, index) => (
              <button
                key={trending.keyword}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-left transition-colors hover:border-blue-100 hover:bg-blue-50"
                onClick={() =>
                  console.log('인기 검색어 선택:', trending.keyword)
                }
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${index < 3 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'} `}
                  >
                    <span className="text-xs font-medium">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {trending.keyword}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>{trending.count.toLocaleString()}</span>
                </div>
              </button>
            ))}
          </div>
        </CommandGroup>
      </div>
    );
  }

  // 검색 결과 화면
  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  const hasResults = searchResults.length > 0;

  if (!hasResults) {
    return (
      <CommandEmpty className="flex flex-col items-center justify-center py-14">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">📚</span>
        </div>
        <p className="mt-4 mb-1 text-base font-medium text-gray-800">
          검색 결과가 없습니다
        </p>
        <p className="text-sm text-gray-500">다른 검색어로 시도해보세요</p>
      </CommandEmpty>
    );
  }

  return (
    <>
      {/* 책 검색 결과 */}
      <CommandGroup className="pb-2">
        <div className="mb-2 px-4">
          <h3 className="flex items-center text-xs font-medium text-gray-500">
            "{query}" 검색 결과
          </h3>
        </div>
        {searchResults.map(book => (
          <SearchItem
            key={`book-${book.id}`}
            item={book}
            onClick={onItemClick}
          />
        ))}
      </CommandGroup>
    </>
  );
}
