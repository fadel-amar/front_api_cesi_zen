import type { ActivityResponseDTO, ListActivityResponseDTO } from '../models/ActivityResponse';
import api from './api';

const activityService = {
  async getTopActivities(): Promise<ActivityResponseDTO[]> {
    const response = await api.get<ListActivityResponseDTO>('/activities/featured');
    return response.data.activities;
  },
};

export default activityService;
