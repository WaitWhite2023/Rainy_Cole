import { clearSession, loadSession, saveSession } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const session = loadSession();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth && session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 401 && session?.refreshToken && path !== '/auth/refresh') {
    const refreshed = await refreshSession(session.refreshToken);
    saveSession(refreshed);

    return request<T>(path, options);
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function refreshSession(refreshToken: string) {
  return request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  });
}

export async function apiGet<T>(path: string, auth = false) {
  return request<T>(path, { method: 'GET', auth });
}

export async function apiPost<T>(path: string, body?: unknown, auth = false) {
  return request<T>(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
    auth
  });
}

export async function apiPatch<T>(path: string, body: unknown, auth = false) {
  return request<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
    auth
  });
}

export async function apiDelete<T>(path: string, auth = false) {
  return request<T>(path, { method: 'DELETE', auth });
}

export function logoutSession() {
  clearSession();
}
