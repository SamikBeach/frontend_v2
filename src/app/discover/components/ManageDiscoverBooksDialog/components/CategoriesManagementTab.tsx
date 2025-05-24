import { CategoriesSection } from './CategoriesSection';
import { SubCategoriesSection } from './SubCategoriesSection';

export function CategoriesManagementTab() {
  return (
    <div className="grid h-full grid-cols-2 gap-6 overflow-hidden">
      <CategoriesSection />
      <SubCategoriesSection />
    </div>
  );
}
