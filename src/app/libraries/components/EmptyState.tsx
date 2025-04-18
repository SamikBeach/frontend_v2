import { Button } from '@/components/ui/button';
import { AlertCircle, Folder, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { EmptyStateProps } from '../types';

export function EmptyState({ searchQuery, selectedTag }: EmptyStateProps) {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-12 text-center">
      {searchQuery ? (
        <Search className="h-12 w-12 text-gray-400" />
      ) : selectedTag !== 'all' ? (
        <AlertCircle className="h-12 w-12 text-gray-400" />
      ) : (
        <Folder className="h-12 w-12 text-gray-400" />
      )}
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {searchQuery
          ? '검색 결과가 없습니다'
          : selectedTag !== 'all'
            ? '해당 태그의 서재가 없습니다'
            : '서재가 없습니다'}
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        {searchQuery
          ? '다른 키워드로 검색하거나 필터를 조정해보세요. 서재 이름, 설명 또는 소유자 이름으로 검색할 수 있습니다.'
          : selectedTag !== 'all'
            ? '다른 태그를 선택하거나 모든 태그에서 서재를 찾아보세요.'
            : '서재를 만들면 읽고 싶은 책이나 관심 있는 주제별로 책을 모아볼 수 있습니다.'}
      </p>

      {!searchQuery && selectedTag === 'all' && (
        <Link href="/libraries/create" className="mt-4">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>새 서재 만들기</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
