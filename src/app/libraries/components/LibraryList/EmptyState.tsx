import { AlertCircle, Folder, Search } from 'lucide-react';

export interface EmptyStateProps {
  searchQuery: string;
  selectedTag: string;
}

export function EmptyState({ searchQuery, selectedTag }: EmptyStateProps) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-8 text-center md:mt-8 md:py-12">
      {searchQuery ? (
        <Search className="h-10 w-10 text-gray-400 md:h-12 md:w-12" />
      ) : selectedTag !== 'all' ? (
        <AlertCircle className="h-10 w-10 text-gray-400 md:h-12 md:w-12" />
      ) : (
        <Folder className="h-10 w-10 text-gray-400 md:h-12 md:w-12" />
      )}
      <h3 className="mt-3 text-base font-medium text-gray-900 md:mt-4 md:text-lg">
        {searchQuery
          ? '검색 결과가 없습니다'
          : selectedTag !== 'all'
            ? '해당 태그의 서재가 없습니다'
            : '서재가 없습니다'}
      </h3>
      <p className="mt-1 px-4 text-xs text-gray-500 md:mt-2 md:text-sm">
        {searchQuery
          ? '다른 키워드로 검색하거나 필터를 조정해보세요. 서재 이름, 설명 또는 소유자 이름으로 검색할 수 있습니다.'
          : selectedTag !== 'all'
            ? '다른 태그를 선택하거나 모든 태그에서 서재를 찾아보세요.'
            : '서재를 만들면 읽고 싶은 책이나 관심 있는 주제별로 책을 모아볼 수 있습니다.'}
      </p>
    </div>
  );
}
