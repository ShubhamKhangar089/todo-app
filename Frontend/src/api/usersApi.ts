import { apiRequest } from './client';

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const usersApi = {
  getUsers: () => apiRequest<ApiUser[]>('/users'),
};
