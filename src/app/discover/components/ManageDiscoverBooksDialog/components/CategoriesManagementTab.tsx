import { CategoriesSection } from './CategoriesSection';
import { SubCategoriesSection } from './SubCategoriesSection';

export function CategoriesManagementTab() {
  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden md:grid md:grid-cols-2 md:gap-4">
      <CategoriesSection />
      <SubCategoriesSection />
    </div>
  );
}
