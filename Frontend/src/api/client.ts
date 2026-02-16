const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'http://localhost:5000/api');

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || res.statusText || 'Request failed');
  }
  return data as T;
}

export { API_BASE };
