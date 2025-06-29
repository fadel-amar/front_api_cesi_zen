import type {
  ActivityResponse,
  CreateActivity,
  FullActivityResponse,
  ListActivityResponse,
} from '../models/Activity';
import api from './ApiService';

const activityService = {
  async getTopActivities(): Promise<ActivityResponse[]> {
    const response = await api.get<ListActivityResponse>(
      '/activities/featured'
    );
    return response.data.activities;
  },

  async getAll(): Promise<ListActivityResponse> {
    const response = await api.get<ListActivityResponse>('/activities');
    return response.data;
  },

  async getFiltered(params: {
    title?: string;
    category?: string;
    typeactivity?: string;
  }): Promise<ListActivityResponse> {
    const response = await api.get<ListActivityResponse>('/activities', {
      params,
    });
    return response.data;
  },

  async getById(id: number): Promise<FullActivityResponse> {
    const response = await api.get<FullActivityResponse>(`/activities/${id}`);
    return response.data;
  },

  async create(data: CreateActivity) {
    const response = await api.post('/activities', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },

  async update(id: number, data: FormData) {
    const response = await api.put(`/activities/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },

  async delete(id: number): Promise<{ status: number }> {
    const response = await api.delete(`/activities/${id}`);
    return { status: response.status };
  },
  async getTypes() {
    const response = await api.get<{ data: { id: number; name: string }[] }>(
      '/activities/types'
    );
    return response.data;
  },

  async toogleFavorite(id: number) {
    const response = await api.post(`/activities/favorites/${id}`);
    return response;
  },
  async toogleToLater(id: number) {
    const response = await api.post(`/activities/toLater/${id}`);
    return response;
  },
};

export default activityService;
