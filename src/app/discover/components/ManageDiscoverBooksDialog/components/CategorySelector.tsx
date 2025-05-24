import { Label } from '@/components/ui/label';
import {
  ResponsiveSelect,
  ResponsiveSelectContent,
  ResponsiveSelectItem,
  ResponsiveSelectTrigger,
  ResponsiveSelectValue,
} from '@/components/ui/responsive-select';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';
import { useDiscoverCategories } from '../../../hooks/useDiscoverCategories';
import { selectedCategoryForManagementAtom } from '../atoms';
import { useCategorySelection } from '../hooks';

export function CategorySelector() {
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
  } = useCategorySelection();

  const [, setSelectedCategoryForManagement] = useAtom(
    selectedCategoryForManagementAtom
  );
  const { categories } = useDiscoverCategories({ includeInactive: true });

  // 카테고리 변경 시 서브카테고리 처리 함수
  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      setSelectedCategoryId(categoryId);

      const category = categories.find(
        (c: any) => c.id.toString() === categoryId
      );

      if (category) {
        // 카테고리 관리 탭의 상태도 함께 업데이트
        setSelectedCategoryForManagement(category);

        if (category.subCategories && category.subCategories.length > 0) {
          setSelectedSubcategoryId(category.subCategories[0].id.toString());
        } else {
          setSelectedSubcategoryId('');
        }
      }
    },
    [
      categories,
      setSelectedCategoryId,
      setSelectedSubcategoryId,
      setSelectedCategoryForManagement,
    ]
  );

  // 초기 카테고리 선택
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      const firstCategory = categories[0];
      const categoryId = firstCategory.id.toString();
      const subcategoryId =
        firstCategory.subCategories && firstCategory.subCategories.length > 0
          ? firstCategory.subCategories[0].id.toString()
          : '';

      setSelectedCategoryId(categoryId);
      setSelectedSubcategoryId(subcategoryId);
      // 카테고리 관리 탭의 상태도 함께 업데이트
      setSelectedCategoryForManagement(firstCategory);
    }
  }, [
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    setSelectedSubcategoryId,
    setSelectedCategoryForManagement,
  ]);

  const selectedCategory = useMemo(() => {
    return categories.find((c: any) => c.id.toString() === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const selectedSubcategory = useMemo(() => {
    if (!selectedCategory || !selectedSubcategoryId) return null;
    return selectedCategory.subCategories?.find(
      (sub: any) => sub.id.toString() === selectedSubcategoryId
    );
  }, [selectedCategory, selectedSubcategoryId]);

  return (
    <div className="mb-1 flex flex-row items-end gap-2 md:mb-2 md:flex-row md:items-end md:gap-3">
      <div className="flex-1 space-y-1">
        <Label
          htmlFor="category"
          className="text-xs font-medium text-gray-700 md:text-sm"
        >
          카테고리
        </Label>
        <ResponsiveSelect
          value={selectedCategoryId}
          onValueChange={handleCategoryChange}
        >
          <ResponsiveSelectTrigger
            id="category"
            className="h-8 cursor-pointer border-gray-200 text-xs transition-all hover:border-gray-300 focus:ring-2 focus:ring-blue-100 md:h-10 md:text-sm"
          >
            <ResponsiveSelectValue>
              {selectedCategory ? selectedCategory.name : '카테고리 선택'}
            </ResponsiveSelectValue>
          </ResponsiveSelectTrigger>
          <ResponsiveSelectContent className="border border-gray-100 shadow-md">
            {categories.map(category => (
              <ResponsiveSelectItem
                key={category.id}
                value={category.id.toString()}
                className="cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={
                      category.isActive ? 'text-gray-900' : 'text-gray-500'
                    }
                  >
                    {category.name}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                      category.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {category.isActive ? '활성' : '비활성'}
                  </span>
                </div>
              </ResponsiveSelectItem>
            ))}
          </ResponsiveSelectContent>
        </ResponsiveSelect>
      </div>

      {selectedCategory && selectedCategory.subCategories.length > 0 && (
        <div className="flex-1 space-y-1">
          <Label
            htmlFor="subcategory"
            className="text-xs font-medium text-gray-700 md:text-sm"
          >
            서브카테고리
          </Label>
          <ResponsiveSelect
            value={selectedSubcategoryId}
            onValueChange={setSelectedSubcategoryId}
          >
            <ResponsiveSelectTrigger
              id="subcategory"
              className="h-8 cursor-pointer border-gray-200 text-xs transition-all hover:border-gray-300 focus:ring-2 focus:ring-blue-100 md:h-10 md:text-sm"
            >
              <ResponsiveSelectValue>
                {selectedSubcategory
                  ? selectedSubcategory.name
                  : '서브카테고리 선택'}
              </ResponsiveSelectValue>
            </ResponsiveSelectTrigger>
            <ResponsiveSelectContent className="border border-gray-100 shadow-md">
              {selectedCategory.subCategories.map(subcategory => (
                <ResponsiveSelectItem
                  key={subcategory.id}
                  value={subcategory.id.toString()}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        subcategory.isActive ? 'text-gray-900' : 'text-gray-500'
                      }
                    >
                      {subcategory.name}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                        subcategory.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {subcategory.isActive ? '활성' : '비활성'}
                    </span>
                  </div>
                </ResponsiveSelectItem>
              ))}
            </ResponsiveSelectContent>
          </ResponsiveSelect>
        </div>
      )}
    </div>
  );
}
