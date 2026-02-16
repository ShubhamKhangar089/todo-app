import { apiRequest } from './client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

export const authApi = {
  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload: RegisterPayload) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  me: () => apiRequest<{ id: string; name: string; email: string; role: string }>('/auth/me'),
};
