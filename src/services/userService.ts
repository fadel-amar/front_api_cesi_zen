import axios from 'axios';
import type { FullUserResponse } from '../models/UserResponse';
import api from './api';
import { ApiError } from '../helper/ApiError';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
  userData: Partial<FullUserResponse>
): Promise<FullUserResponse> {
  const token = localStorage.getItem('jwt_token');
  if (!token) throw new Error('Token manquant');

  try {
    const response = await axios.put<FullUserResponse>(
      `${API_BASE}/users/me`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
