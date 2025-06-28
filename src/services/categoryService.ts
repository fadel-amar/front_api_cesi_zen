import api from './ApiService.ts';
import type {
  FullCategoryResponse,
  CreateCategory,
  UpdateCategory,
  ListCategoryResponse,
} from '../models/Category.ts';

const categoryService = {
  async getAll(): Promise<ListCategoryResponse> {
    const response = await api.get<ListCategoryResponse>('/categories');
    return response.data;
  },

  async getById(id: number): Promise<FullCategoryResponse> {
    const response = await api.get<FullCategoryResponse>(`/categories/${id}`);
    return response.data;
  },

  async create(data: CreateCategory) {
    const response = await api.post('/categories', data);
    return response;
  },

  async update(
    id: number,
    data: UpdateCategory
  ): Promise<{ status: number; errors?: { [key: string]: string[] } }> {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return { status: response.status };
    } catch (error: any) {
      if (error.response?.status === 400) {
        return { status: 400, errors: error.response.data.errors };
      }
      throw error;
    }
  },

  async delete(id: number): Promise<{ status: number }> {
    const response = await api.delete(`/categories/${id}`);
    return { status: response.status };
  },
};

export default categoryService;
