export interface ApiErrorResponse {
  status: number;
  message?: string;
  errors?: string[];
}

export interface ApiResponse {
  status: number;
  message: string;
  date?: any;
}
