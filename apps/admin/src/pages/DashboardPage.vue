<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { apiGet } from '../services/api';
import { fetchAdminPosts, fetchTags } from '../services/content';
import {
  Document,
  Promotion,
  Edit,
  User,
  CollectionTag,
  CircleCheck,
  Warning,
  InfoFilled
} from '@element-plus/icons-vue';

const authStore = useAuthStore();

interface StatCard {
  label: string;
  value: number;
  icon: object;
  color: string;
  bg: string;
}

const cards = ref<StatCard[]>([
  { label: '全部文章', value: 0, icon: Document, color: '#4f6ef7', bg: '#eef2ff' },
  { label: '已发布', value: 0, icon: Promotion, color: '#10b981', bg: '#d1fae5' },
  { label: '草稿', value: 0, icon: Edit, color: '#f59e0b', bg: '#fef3c7' },
  { label: '用户', value: 0, icon: User, color: '#8b5cf6', bg: '#ede9fe' }
]);

const totalTags = ref(0);

onMounted(async () => {
  const [posts, tags] = await Promise.all([fetchAdminPosts(), fetchTags()]);
  const publishedCount = posts.filter((item) => item.status === 'published').length;
  const draftCount = posts.filter((item) => item.status === 'draft').length;
  const usersCount =
    authStore.user?.role === 'admin'
      ? (await apiGet<Array<unknown>>('/admin/users', true)).length
      : 0;

  cards.value = [
    { label: '全部文章', value: posts.length, icon: Document, color: '#4f6ef7', bg: '#eef2ff' },
    { label: '已发布', value: publishedCount, icon: Promotion, color: '#10b981', bg: '#d1fae5' },
    { label: '草稿', value: draftCount, icon: Edit, color: '#f59e0b', bg: '#fef3c7' },
    { label: '用户', value: usersCount, icon: User, color: '#8b5cf6', bg: '#ede9fe' }
  ];
  totalTags.value = tags.length;
});
</script>

<template>
  <section class="page">
    <!-- Page Header -->
    <div class="page-head">
      <div>
        <h1 class="page-title">总览</h1>
        <p class="page-desc">快速查看内容规模、发布状态和账号使用情况。</p>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="stat-grid">
      <div
        v-for="card in cards"
        :key="card.label"
        class="stat-card"
      >
        <div class="stat-card-icon" :style="{ background: card.bg, color: card.color }">
          <el-icon :size="18">
            <component :is="card.icon" />
          </el-icon>
        </div>
        <div class="stat-card-body">
          <p class="stat-card-label">{{ card.label }}</p>
          <p class="stat-card-value">{{ card.value }}</p>
        </div>
      </div>
    </div>

    <!-- Insight Panels -->
    <div class="panel-grid">
      <!-- Content Status -->
      <div class="panel">
        <div class="panel-head">
          <div class="panel-head-left">
            <el-icon :size="18" color="#4f6ef7"><CircleCheck /></el-icon>
            <h2 class="panel-title">内容状态</h2>
          </div>
          <span class="panel-badge">{{ totalTags }} 个标签</span>
        </div>
        <p class="panel-desc">建议优先检查草稿积压与未发布内容，保持发布节奏。</p>
        <div class="panel-list">
          <div class="panel-list-item">
            <span class="panel-step">01</span>
            <span>优先确保"新建、编辑、发布、删除"四条主路径稳定可用。</span>
          </div>
          <div class="panel-list-item">
            <span class="panel-step">02</span>
            <span>站点设置应作为前台标题、副标题和 SEO 的唯一配置入口。</span>
          </div>
        </div>
      </div>

      <!-- Today's Tips -->
      <div class="panel">
        <div class="panel-head">
          <div class="panel-head-left">
            <el-icon :size="18" color="#f59e0b"><Warning /></el-icon>
            <h2 class="panel-title">今日建议</h2>
          </div>
          <span class="panel-badge">按优先级</span>
        </div>
        <p class="panel-desc">按优先级处理，可提升后台维护效率。</p>
        <div class="panel-list">
          <div class="panel-list-item">
            <span class="panel-step">01</span>
            <span>检查文章列表是否存在空摘要或重复 Slug。</span>
          </div>
          <div class="panel-list-item">
            <span class="panel-step">02</span>
            <span>为草稿补充发布时间，避免发布后排序异常。</span>
          </div>
          <div class="panel-list-item">
            <span class="panel-step">03</span>
            <span>确认管理员账号权限，非管理员不应进入系统设置页。</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-head {
  padding: 0;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.page-desc {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* ===== Stat Cards ===== */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: all 180ms ease;
}

.stat-card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-card-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card-body {
  min-width: 0;
}

.stat-card-label {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.stat-card-value {
  margin: 4px 0 0;
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* ===== Panels ===== */
.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.panel-head-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.panel-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.panel-desc {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.panel-list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
}

.panel-list-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  border-top: 1px solid var(--color-border);
}

.panel-list-item:first-child {
  padding-top: 0;
  border-top: none;
}

.panel-step {
  font-size: 12px;
  color: var(--color-text-muted);
  flex-shrink: 0;
  padding-top: 2px;
  font-weight: 500;
}

/* ===== Responsive ===== */
@media (max-width: 1100px) {
  .stat-grid,
  .panel-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stat-grid,
  .panel-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 16px;
  }
}
</style>
