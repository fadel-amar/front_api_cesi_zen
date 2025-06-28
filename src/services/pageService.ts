import type {
  CreatePage,
  FullPageResponse,
  ListPageResponse,
  PageResponse,
  UpdatePage,
} from '../models/Page';
import api from './ApiService';

const pageService = {
  async getAll(): Promise<PageResponse[]> {
    const response = await api.get<ListPageResponse>('/pages');
    return response.data.pages;
  },

  async getById(id: number): Promise<FullPageResponse> {
    const response = await api.get<FullPageResponse>(`/pages/${id}`);
    return response.data;
  },

  async create(data: CreatePage | Partial<CreatePage>) {
    const response = await api.post('/pages', data);
    return response;
  },

  async update(id: number, data: UpdatePage ){
    const response = await api.put(`/pages/${id}`, data);
    return response;
  },

  async delete(id: number) {
    const response = await api.delete(`/pages/${id}`);
    return response;
  },
};

export default pageService;
