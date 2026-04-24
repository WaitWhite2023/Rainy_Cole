<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { apiGet } from '../services/api';
import { fetchAdminPosts, fetchTags } from '../services/content';

const authStore = useAuthStore();
const cards = ref([
  { key: 'posts', label: 'Posts', value: 0 },
  { key: 'published', label: 'Published', value: 0 },
  { key: 'drafts', label: 'Drafts', value: 0 },
  { key: 'users', label: 'Users', value: 0 }
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
    { key: 'posts', label: 'Posts', value: posts.length },
    { key: 'published', label: 'Published', value: publishedCount },
    { key: 'drafts', label: 'Drafts', value: draftCount },
    { key: 'users', label: 'Users', value: usersCount }
  ];
  totalTags.value = tags.length;
});
</script>

<template>
  <section class="admin-page">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">后台总览</h1>
        <p class="admin-page-copy">快速查看内容规模、发布状态和账号使用情况。</p>
      </div>
    </div>

    <div class="admin-metrics">
      <article v-for="card in cards" :key="card.key" class="admin-metric">
        <p class="admin-metric-label">{{ card.label }}</p>
        <p class="admin-metric-value">{{ card.value }}</p>
      </article>
    </div>

    <div class="admin-grid-two">
      <article class="admin-surface">
        <h2 class="admin-section-title">内容状态</h2>
        <p class="admin-section-copy">当前共有 {{ totalTags }} 个标签，建议优先检查草稿积压与未发布内容。</p>
        <div class="admin-rows">
          <div class="admin-row">
            <span class="admin-row-index">01</span>
            <p>优先确保“新建、编辑、发布、删除”四条主路径稳定可用。</p>
          </div>
          <div class="admin-row">
            <span class="admin-row-index">02</span>
            <p>站点设置应作为前台标题、副标题和 SEO 的唯一配置入口。</p>
          </div>
        </div>
      </article>

      <article class="admin-surface">
        <h2 class="admin-section-title">今日建议</h2>
        <p class="admin-section-copy">按优先级处理可提升后台维护效率。</p>
        <div class="admin-rows">
          <div class="admin-row">
            <span class="admin-row-index">01</span>
            <p>检查文章列表是否存在空摘要或重复 Slug。</p>
          </div>
          <div class="admin-row">
            <span class="admin-row-index">02</span>
            <p>为草稿补充发布时间，避免发布后排序异常。</p>
          </div>
          <div class="admin-row">
            <span class="admin-row-index">03</span>
            <p>确认管理员账号权限，非管理员不应进入系统设置页。</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
