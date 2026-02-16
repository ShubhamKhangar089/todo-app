export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface AuthResponse {
  user: User;
  token: string;
}
