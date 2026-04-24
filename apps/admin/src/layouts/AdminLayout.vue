<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const navItems = computed(() => {
  const items = [
    {
      to: '/',
      label: '仪表盘',
      icon: 'M3 12h18M12 3v18'
    },
    {
      to: '/posts',
      label: '文章管理',
      icon: 'M5 4h14a1 1 0 0 1 1 1v14H4V5a1 1 0 0 1 1-1zm2 4h10M7 12h10M7 16h6'
    },
    {
      to: '/posts/new',
      label: '新建文章',
      icon: 'M12 5v14M5 12h14'
    }
  ];
  if (user.value?.role === 'admin') {
    items.push({
      to: '/settings',
      label: '站点设置',
      icon: 'M12 7.5a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9zm0-4.5v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05L5.636 5.636m12.728 0L16.95 7.05M7.05 16.95l-1.414 1.414'
    });
  }
  return items;
});

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-sidebar-card">
        <p class="admin-brand">Rainy Cole</p>
        <p class="admin-muted-copy">Content Admin Console</p>
        <p class="admin-user-meta">{{ user?.nickname }} · {{ user?.role }}</p>
      </div>

      <nav class="admin-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="admin-nav-link"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path :d="item.icon" />
          </svg>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="admin-sidebar-foot">
        <el-button class="w-full" plain @click="handleLogout">退出登录</el-button>
      </div>
    </aside>

    <main class="admin-main">
      <div class="admin-main-head">
        <div class="admin-main-wrap">
          <div class="admin-topbar">
            <div class="admin-topbar-copy">
              <p class="admin-topbar-title">内容管理后台</p>
              <p class="admin-topbar-desc">统一维护文章、发布状态与站点配置。</p>
            </div>
            <div class="admin-chip">Vue 3 · TypeScript</div>
          </div>
        </div>
      </div>

      <div class="admin-main-content">
        <div class="admin-main-wrap">
        <RouterView />
        </div>
      </div>
    </main>
  </div>
</template>
