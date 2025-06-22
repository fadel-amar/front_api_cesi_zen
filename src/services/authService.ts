import axios from 'axios';
import { ApiError } from '../helper/ApiError';
import * as userService from './userService';
import type { AuthResponse } from '../models/UserResponse';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function login(
  identifier: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(`${API_BASE}/auth/login`, {
      identifier,
      password,
    });

    localStorage.setItem('jwt_token', response.data.token);
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Erreur de connexion';
    throw new ApiError(msg, {
      status: error.response?.status,
      data: error.response?.data,
    });
  }
}

export async function register(
  login: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE}/auth/register`,
      {
        login,
        email,
        password,
      }
    );

    localStorage.setItem('jwt_token', response.data.token);
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Erreur lors de l’inscription';
    throw new ApiError(msg, {
      status: error.response?.status,
      data: error.response?.data,
    });
  }
}

export async function checkAuthStatus(): Promise<boolean> {
  const token = localStorage.getItem('jwt_token');
  if (!token) return false;

  try {
    await userService.getCurrentUser();
    return true;
  } catch {
    return false;
  }
}

export function logout() {
  localStorage.removeItem('jwt_token');
}
