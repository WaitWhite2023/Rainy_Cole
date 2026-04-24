<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { PostListItemDto } from '@rainy/shared';
import { deletePost, fetchAdminPosts } from '../services/content';

const router = useRouter();
const loading = ref(false);
const posts = ref<PostListItemDto[]>([]);

function normalizeMixedText(value: string) {
  return value
    .replace(/([A-Za-z])([\u4e00-\u9fa5])/g, '$1 $2')
    .replace(/([\u4e00-\u9fa5])([A-Za-z])/g, '$1 $2');
}

function formatDate(value?: string) {
  if (!value) return '--';
  return new Date(value).toLocaleDateString('zh-CN');
}

function statusText(status: string) {
  if (status === 'published') return 'Published';
  if (status === 'archived') return 'Archived';
  return 'Draft';
}

async function loadPosts() {
  loading.value = true;
  try {
    posts.value = await fetchAdminPosts();
  } finally {
    loading.value = false;
  }
}

async function handleDelete(id: string) {
  await ElMessageBox.confirm('删除后不可恢复，是否继续？', '确认删除', {
    type: 'warning'
  });
  await deletePost(id);
  ElMessage.success('文章已删除');
  await loadPosts();
}

onMounted(() => {
  loadPosts();
});
</script>

<template>
  <section class="admin-page">
    <div class="admin-page-head">
      <div>
        <h1 class="admin-page-title">文章管理</h1>
        <p class="admin-page-copy">按标题、状态和发布时间快速管理所有文章。</p>
      </div>
      <div class="admin-head-actions">
        <div class="admin-chip">当前 {{ posts.length }} 篇文章</div>
        <el-button type="primary" @click="router.push('/posts/new')">新建文章</el-button>
      </div>
    </div>

    <div class="admin-surface">
      <el-table v-loading="loading" :data="posts" class="admin-table">
        <el-table-column label="标题" min-width="280">
          <template #default="{ row }">
            <div class="admin-table-title">{{ normalizeMixedText(row.title) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="slug" label="Slug" min-width="180" />
        <el-table-column label="状态" width="140">
          <template #default="{ row }">
            <span class="admin-status-tag" :class="`is-${row.status}`">
              {{ statusText(row.status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" min-width="140">
          <template #default="{ row }">
            <span>{{ formatDate(row.publishedAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <div class="admin-table-actions">
              <button type="button" class="admin-action-link" @click="router.push(`/posts/${row.id}/edit`)">Edit</button>
              <button type="button" class="admin-action-link is-danger" @click="handleDelete(row.id)">Delete</button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
