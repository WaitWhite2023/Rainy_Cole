import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { AuthTokensDto } from '@rainy/shared';
import { apiPost, logoutSession } from '../services/api';
import { clearSession, loadSession, saveSession } from '../utils/storage';

export const useAuthStore = defineStore('auth', () => {
  const session = ref<AuthTokensDto | null>(loadSession());

  const isAuthenticated = computed(() => Boolean(session.value?.accessToken));
  const user = computed(() => session.value?.user ?? null);
  const accessToken = computed(() => session.value?.accessToken ?? '');

  async function login(username: string, password: string) {
    const result = await apiPost<AuthTokensDto>('/auth/login', { username, password });
    session.value = result;
    saveSession(result);
    return result;
  }

  function hydrate() {
    session.value = loadSession();
  }

  function logout() {
    session.value = null;
    clearSession();
    logoutSession();
  }

  return {
    session,
    isAuthenticated,
    user,
    accessToken,
    login,
    hydrate,
    logout
  };
});
