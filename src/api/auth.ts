import { apiPost } from './client';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/auth/login', { username, password });
}
