import { EmptyStateProps } from '../types';

export function EmptyState({ searchQuery, selectedCategory }: EmptyStateProps) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-16 text-center">
      <div className="text-3xl">📚</div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        서재가 없습니다
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        {searchQuery
          ? '검색 결과가 없습니다. 다른 키워드로 검색해보세요.'
          : selectedCategory !== 'all'
            ? '선택한 카테고리에 서재가 없습니다.'
            : '서재를 만들어보세요.'}
      </p>
    </div>
  );
}
