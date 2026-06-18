<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import {
  Grid,
  Document,
  Edit,
  EditPen,
  Setting,
  Tickets
} from '@element-plus/icons-vue';

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const navItems = computed(() => {
  const items = [
    { to: '/', label: '总览', icon: Grid },
    { to: '/posts', label: '文章管理', icon: Tickets },
    { to: '/posts/new', label: '新建文章', icon: EditPen }
  ];
  if (user.value?.role === 'admin') {
    items.push({ to: '/settings', label: '站点设置', icon: Setting });
  }
  return items;
});

function userInitials(): string {
  const name = user.value?.nickname || user.value?.username || 'U';
  return name.charAt(0).toUpperCase();
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="layout-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="sidebar-logo-dot" />
        <span class="sidebar-logo-text">Rainy Cole</span>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="sidebar-nav-item"
        >
          <el-icon :size="18">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar">{{ userInitials() }}</div>
          <div class="sidebar-user-info">
            <p class="sidebar-user-name">{{ user?.nickname || user?.username }}</p>
            <span class="sidebar-user-role">{{ user?.role }}</span>
          </div>
        </div>
        <button class="sidebar-logout" @click="handleLogout">退出登录</button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-area">
      <div class="main-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout-shell {
  height: 100vh;
  display: flex;
  overflow: hidden;
  background: var(--color-bg);
}

/* ===== Sidebar ===== */
.sidebar {
  width: 240px;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px 20px;
}

.sidebar-logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
}

.sidebar-logo-text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

/* ===== Navigation ===== */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 450;
  transition: all 140ms ease;
  text-decoration: none;
}

.sidebar-nav-item:hover {
  background: var(--color-bg);
  color: var(--color-text-primary);
}

.sidebar-nav-item:active {
  transform: scale(0.98);
}

.sidebar-nav-item.router-link-active {
  background: var(--color-accent-light);
  color: var(--color-accent);
  font-weight: 500;
}

.sidebar-nav-item :deep(.el-icon) {
  flex-shrink: 0;
}

/* ===== Footer / User ===== */
.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-accent-light);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.sidebar-user-info {
  min-width: 0;
  flex: 1;
}

.sidebar-user-name {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-user-role {
  display: inline-block;
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-top: 1px;
}

.sidebar-logout {
  border: none;
  background: transparent;
  padding: 6px 0;
  font-size: 12px;
  color: var(--color-text-muted);
  cursor: pointer;
  text-align: left;
  transition: color 140ms ease;
}

.sidebar-logout:hover {
  color: var(--color-danger);
}

/* ===== Main area ===== */
.main-area {
  min-width: 0;
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 28px 32px 40px;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
}

/* ===== Responsive ===== */
@media (max-width: 1100px) {
  .layout-shell {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }

  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    flex-direction: row;
    flex-wrap: wrap;
    padding: 12px 16px;
    align-items: center;
  }

  .sidebar-brand {
    padding: 0;
  }

  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0;
    margin: 0 16px;
    gap: 4px;
    flex: 1;
  }

  .sidebar-nav-item {
    white-space: nowrap;
    min-height: 34px;
    padding: 0 10px;
    font-size: 13px;
  }

  .sidebar-footer {
    margin-top: 0;
    border-top: none;
    padding: 0;
    flex-direction: row;
    align-items: center;
  }

  .sidebar-user {
    gap: 8px;
  }

  .sidebar-logout {
    display: none;
  }

  .main-area {
    height: auto;
    overflow: visible;
  }

  .main-content {
    overflow: visible;
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .sidebar-nav {
    display: none;
  }
}
</style>
