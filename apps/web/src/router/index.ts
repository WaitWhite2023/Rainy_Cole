import { createRouter, createWebHistory } from 'vue-router';
import PublicLayout from '../layouts/PublicLayout.vue';
import HomePage from '../pages/HomePage.vue';
import PostListPage from '../pages/PostListPage.vue';
import PostDetailPage from '../pages/PostDetailPage.vue';
import SearchPage from '../pages/SearchPage.vue';
import AboutPage from '../pages/AboutPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', component: HomePage },
        { path: 'posts', component: PostListPage },
        { path: 'posts/:slug', component: PostDetailPage },
        { path: 'search', component: SearchPage },
        { path: 'about', component: AboutPage }
      ]
    }
  ]
});

export default router;
