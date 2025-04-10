import { categoryFilterAtom, subcategoryFilterAtom } from '@/atoms/popular';
import { Button } from '@/components/ui/button';
import { useSetAtom } from 'jotai';

export function EmptyState() {
  const clearFilters = useSetAtom(categoryFilterAtom);
  const clearSubcategory = useSetAtom(subcategoryFilterAtom);

  const handleClearFilters = () => {
    clearFilters('all');
    clearSubcategory('all');
  };

  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-gray-50 py-12 text-center">
      <div className="text-3xl">📚</div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        검색 결과가 없습니다
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        다른 카테고리를 선택하거나 필터를 초기화해보세요.
      </p>
      <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
        필터 초기화
      </Button>
    </div>
  );
}
