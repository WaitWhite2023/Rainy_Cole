import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import LoginPage from '../pages/LoginPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import PostManagePage from '../pages/PostManagePage.vue';
import SettingsPage from '../pages/SettingsPage.vue';

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes: [
    { path: '/login', component: LoginPage },
    {
      path: '/',
      component: AdminLayout,
      children: [
        { path: '', component: DashboardPage },
        { path: 'posts', component: PostManagePage },
        { path: 'settings', component: SettingsPage }
      ]
    }
  ]
});

export default router;
