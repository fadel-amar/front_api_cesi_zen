export class ApiError extends Error {
  response: { status: number; data: any };

  constructor(message: string, response: { status: number; data: any }) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
  }
}