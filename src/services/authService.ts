import { ApiError } from '../helper/ApiError';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function login(identifier: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur de connexion');
  localStorage.setItem('jwt_token', data.token);
  return data;
}

export async function register(login: string, email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, email, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data.message || 'Erreur', {
      status: response.status,
      data,
    });
  }
  localStorage.setItem('jwt_token', data.token);
  return data;
}

export function isAuthenticated() {
  const token = localStorage.getItem('jwt_token');
  return !!token;
}

export function logout() {
  localStorage.removeItem('auth_token');
}
