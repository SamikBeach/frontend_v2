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
  discoverCategoryId?: number;
}
