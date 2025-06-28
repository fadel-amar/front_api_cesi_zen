export interface CategoryResponse {
  id: number;
  name: string;
  emoji: string;
  duration: string;
  status: boolean;
}

export interface FullCategoryResponse {
  id: number;
  name: string;
  emoji: string;
  duration: string;
  status: boolean;
  login: string;
}

export interface ListCategoryResponse {
  categories: CategoryResponse[];
}

export interface CreateCategory {
  name: string;
  emoji: string;
  duration: string;
}

export interface UpdateCategory {
  name?: string;
  emoji?: string;
  duration?: string;
  status?: boolean;
}
