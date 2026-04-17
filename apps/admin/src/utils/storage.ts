const SESSION_KEY = 'rainy-admin-session';

export function loadSession() {
  const value = window.localStorage.getItem(SESSION_KEY);
  return value ? JSON.parse(value) : null;
}

export function saveSession(session: unknown) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
