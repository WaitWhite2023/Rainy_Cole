import { createRouter, createWebHistory } from 'vue-router';
import { storeToRefs } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import LoginPage from '../pages/LoginPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import PostManagePage from '../pages/PostManagePage.vue';
import PostEditorPage from '../pages/PostEditorPage.vue';
import SettingsPage from '../pages/SettingsPage.vue';
import { useAuthStore } from '../stores/auth';
import type { UserRole } from '@rainy/shared';

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes: [
    { path: '/login', component: LoginPage, meta: { guestOnly: true } },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', component: DashboardPage },
        { path: 'posts', component: PostManagePage },
        { path: 'posts/new', component: PostEditorPage },
        { path: 'posts/:id/edit', component: PostEditorPage },
        { path: 'settings', component: SettingsPage, meta: { roles: ['admin'] as UserRole[] } }
      ]
    }
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const { isAuthenticated } = storeToRefs(authStore);

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return '/login';
  }

  const requiredRoles = to.meta.roles as UserRole[] | undefined;
  const currentRole = authStore.user?.role;

  if (requiredRoles?.length && (!currentRole || !requiredRoles.includes(currentRole))) {
    return '/';
  }

  if (to.meta.guestOnly && isAuthenticated.value) {
    return '/';
  }

  return true;
});

export default router;
