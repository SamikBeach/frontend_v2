import {
  DiscoverCategory,
  DiscoverSubCategory,
} from '@/apis/discover-category/types';

export interface ManageDiscoverBooksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface BooksManagementTabProps {
  open: boolean;
}

export interface CategoryBooksListProps {
  open: boolean;
}

export interface DraggableCategoryProps {
  category: DiscoverCategory;
  index: number;
  isSelected: boolean;
  onSelect: (category: DiscoverCategory) => void;
  onEdit: (category: DiscoverCategory) => void;
  onDelete: (categoryId: number) => void;
  onToggleActive: (categoryId: number, isActive: boolean) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onDrop: (dragIndex: number, hoverIndex: number) => void;
}

export interface DraggableSubCategoryProps {
  subCategory: DiscoverSubCategory;
  index: number;
  onEdit: (subCategory: DiscoverSubCategory) => void;
  onDelete: (subCategoryId: number) => void;
  onToggleActive: (subCategoryId: number, isActive: boolean) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onDrop: (dragIndex: number, hoverIndex: number) => void;
}

export interface CategoryFormData {
  name: string;
  isActive: boolean;
}

export interface SubCategoryFormData {
  name: string;
  isActive: boolean;
}

export interface CategoryFormProps {
  categoryForm: CategoryFormData;
  setCategoryForm: React.Dispatch<React.SetStateAction<CategoryFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

export interface SubCategoryFormProps {
  subCategoryForm: SubCategoryFormData;
  setSubCategoryForm: React.Dispatch<React.SetStateAction<SubCategoryFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
}
