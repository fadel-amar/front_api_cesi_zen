export interface AuthResponse {
  token: string;
}

export interface UserResponse {
  id: number;
  email: string;
  login: string;
  banned: boolean;
  disabled: boolean;
  role: string;
}

export interface FullUserResponse {
  id: number;
  email: string;
  login: string;
  banned: boolean;
  disabled: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListUserResponse {
  users: UserResponse[];
  pageNumber: number;
  pageSize: number;
  totalNumberUser: number;
  totalPages: number;
}

export interface UserShortResponse {
  id: number;
  username: string;
}
