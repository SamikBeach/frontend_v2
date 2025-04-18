import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Tag } from 'lucide-react';
import Link from 'next/link';
import { EmptyStateProps } from '../types';

export function EmptyState({ searchQuery, selectedTag }: EmptyStateProps) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-xl bg-gray-50 px-4 py-16 text-center shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        {searchQuery ? (
          <Search className="h-10 w-10 text-gray-400" />
        ) : selectedTag !== 'all' ? (
          <Tag className="h-10 w-10 text-gray-400" />
        ) : (
          <div className="text-5xl">📚</div>
        )}
      </div>
      <h3 className="mt-6 text-xl font-medium text-gray-900">
        {searchQuery
          ? '검색 결과가 없습니다'
          : selectedTag !== 'all'
            ? '해당 태그의 서재가 없습니다'
            : '서재가 없습니다'}
      </h3>
      <p className="mt-3 max-w-md text-sm text-gray-500">
        {searchQuery
          ? '다른 키워드로 검색하거나 필터를 조정해보세요. 서재 이름, 설명 또는 소유자 이름으로 검색할 수 있습니다.'
          : selectedTag !== 'all'
            ? '다른 태그를 선택하거나 모든 태그에서 서재를 찾아보세요.'
            : '서재를 만들면 읽고 싶은 책이나 관심 있는 주제별로 책을 모아볼 수 있습니다.'}
      </p>

      {!searchQuery && selectedTag === 'all' && (
        <Link href="/libraries/create" className="mt-6">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>새 서재 만들기</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
