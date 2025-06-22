
export interface AuthResponse {
  token: string;
}

export interface FullUserResponse {
  id: number;
  email: string;
  login: string;
  role: string;
  banned: boolean;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}
