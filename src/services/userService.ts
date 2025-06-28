import axios from 'axios';
import type {
  FullUserResponse,
  ListUserResponse,
} from '../models/User';
import { ApiError } from '../helper/ApiError';
import api from './ApiService';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getAllUsers(
  pageNumber = 1,
  pageSize = 10,
  identifier?: string
): Promise<ListUserResponse> {
  try {
    const response = await api.get<ListUserResponse>(
      `/users?pageNumber=${pageNumber}&pageSize=${pageSize}&filter=${
        identifier || ''
      }`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getCurrentUser(): Promise<FullUserResponse> {
  const token = localStorage.getItem('jwt_token');
  if (!token) throw new Error('Token manquant');

  try {
    const response = await axios.get<FullUserResponse>(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Erreur API: ${error.response.status} - ${error.response.statusText}`
      );
    }
    throw new Error('Erreur inconnue lors de la récupération de l’utilisateur');
  }
}

export async function updateUser(
  id: number,
  userData: Partial<FullUserResponse>
): Promise<FullUserResponse> {
  const token = localStorage.getItem('jwt_token');
  if (!token) throw new Error('Token manquant');

  try {
    const response = await api.put<FullUserResponse>(`/users/${id}`, userData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Erreur API: ${error.response.status} - ${error.response.statusText}`
      );
    }
    throw new Error('Erreur inconnue lors de la mise à jour de l’utilisateur');
  }
}

export async function updateLoginUser(
  login: string
): Promise<FullUserResponse> {
  try {
    const response = await api.put<FullUserResponse>('/users/me', {
      login,
    });
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message || 'Erreur lors de la mise à jour du login';
    throw new ApiError(msg, {
      status: error.response?.status,
      data: error.response?.data,
    });
  }
}
export async function resetPassword(
  oldPassword: string,
  newPassword: string
): Promise<void> {
  try {
    await api.put('/users/me/reset-password', { oldPassword, newPassword });
  } catch (error: any) {
    console.log(error);
    const msg =
      error.response?.data?.message ||
      'Erreur lors de la réinitialisation du mot de passe';
    throw new ApiError(msg, {
      status: error.response?.status,
      data: error.response?.data,
    });
  }
}

export async function deleteAccount(): Promise<void> {
  const token = localStorage.getItem('jwt_token');
  if (!token) throw new Error('Token manquant');

  try {
    await axios.delete(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem('jwt_token');
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Erreur API: ${error.response.status} - ${error.response.statusText}`
      );
    }
    throw new Error('Erreur inconnue lors de la suppression de l’utilisateur');
  }
}

export async function deleteUser(userId: number): Promise<void> {
  const token = localStorage.getItem('jwt_token');
  if (!token) throw new Error('Token manquant');

  try {
    await api.delete(`/users/${userId}`);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Erreur API: ${error.response.status} - ${error.response.statusText}`
      );
    }
    throw new Error('Erreur inconnue lors de la suppression de l’utilisateur');
  }
}
