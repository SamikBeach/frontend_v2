export interface DiscoverCategory {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  subCategories: DiscoverSubCategory[];
  bookCount?: number;
}

export interface DiscoverSubCategory {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  discoverCategoryId: number;
  bookCount?: number;
}

export interface CreateDiscoverCategoryDto {
  name: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateDiscoverCategoryDto {
  name?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateDiscoverSubCategoryDto {
  name: string;
  description?: string;
  displayOrder?: number;
  discoverCategoryId: number;
}

export interface UpdateDiscoverSubCategoryDto {
  name?: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
  discoverCategoryId?: number;
}

// 카테고리 순서 변경을 위한 타입들
export interface CategoryOrderDto {
  id: number;
  displayOrder: number;
}

export interface SubCategoryOrderDto {
  id: number;
  displayOrder: number;
}

export interface ReorderCategoriesDto {
  categories: CategoryOrderDto[];
}

export interface ReorderSubCategoriesDto {
  categoryId: number;
  subCategories: SubCategoryOrderDto[];
}

// API 응답 타입
export interface ReorderResponse {
  message: string;
}
