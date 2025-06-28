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

  async getAll(): Promise<ActivityResponse[]> {
    const response = await api.get<ListActivityResponse>('/activities');
    return response.data.activities;
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
};

export default activityService;
