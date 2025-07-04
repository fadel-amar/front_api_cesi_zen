import axios from 'axios';
import { ApiError } from '../helper/ApiError';
import * as userService from './userService';
import type { AuthResponse } from '../models/User';
import api from './ApiService';

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
    const msg =
      error.response?.data?.message || 'Identifiants de connexion invalides';
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
  const response = await api.post<AuthResponse>('/auth/register', {
    login,
    email,
    password,
  });
  localStorage.setItem('jwt_token', response.data.token);
  return response.data;
}

export async function checkAuthStatus(): Promise<{
  isLoggedIn: boolean;
  role?: string;
}> {
  const token = localStorage.getItem('jwt_token');
  if (!token) return { isLoggedIn: false };

  try {
    const user = await userService.getCurrentUser();
    return {
      isLoggedIn: true,
      role: user.role,
    };
  } catch {
    return { isLoggedIn: false };
  }
}

export function logout() {
  localStorage.removeItem('jwt_token');
}
