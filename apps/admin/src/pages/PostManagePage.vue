<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { PostListItemDto } from '@rainy/shared';
import { deletePost, fetchAdminPosts } from '../services/content';
import {
  Plus,
  Search,
  EditPen,
  Delete
} from '@element-plus/icons-vue';

const router = useRouter();
const loading = ref(false);
const posts = ref<PostListItemDto[]>([]);

// Search & Filter
const searchQuery = ref('');
const statusFilter = ref('');

const filteredPosts = computed(() => {
  let result = posts.value;
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(q));
  }
  if (statusFilter.value) {
    result = result.filter((p) => p.status === statusFilter.value);
  }
  return result;
});

const currentPage = ref(1);
const pageSize = ref(10);

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredPosts.value.slice(start, start + pageSize.value);
});

function normalizeMixedText(value: string) {
  return value
    .replace(/([A-Za-z])([一-龥])/g, '$1 $2')
    .replace(/([一-龥])([A-Za-z])/g, '$1 $2');
}

function formatDate(value?: string) {
  if (!value) return '--';
  return new Date(value).toLocaleDateString('zh-CN');
}

function statusMeta(status: string) {
  if (status === 'published') return { label: '已发布', cls: 'pub' };
  if (status === 'archived') return { label: '已归档', cls: 'arch' };
  return { label: '草稿', cls: 'draft' };
}

function handleSearchReset() {
  searchQuery.value = '';
  statusFilter.value = '';
  currentPage.value = 1;
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
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
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
  <section class="page">
    <!-- Header -->
    <div class="page-head">
      <div>
        <h1 class="page-title">文章管理</h1>
        <p class="page-desc">按标题、状态和发布时间快速管理所有文章。</p>
      </div>
      <div class="page-actions">
        <span class="page-count">{{ filteredPosts.length }} 篇</span>
        <el-button type="primary" :icon="Plus" @click="router.push('/posts/new')">
          新建文章
        </el-button>
      </div>
    </div>

    <!-- Search & Filter Toolbar -->
    <div class="toolbar">
      <div class="toolbar-group">
        <el-input
          v-model="searchQuery"
          placeholder="搜索标题…"
          :prefix-icon="Search"
          clearable
          class="toolbar-search"
        />
        <el-select
          v-model="statusFilter"
          placeholder="全部状态"
          clearable
          class="toolbar-select"
        >
          <el-option label="全部状态" value="" />
          <el-option label="已发布" value="published" />
          <el-option label="草稿" value="draft" />
          <el-option label="已归档" value="archived" />
        </el-select>
      </div>
      <el-button plain @click="handleSearchReset">重置</el-button>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <el-table
        v-loading="loading"
        :data="paginatedPosts"
        class="post-table"
        stripe
      >
        <el-table-column label="标题" min-width="280">
          <template #default="{ row }">
            <span class="post-title">{{ normalizeMixedText(row.title) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="slug" label="Slug" min-width="180" />

        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <span class="status-dot" :class="statusMeta(row.status).cls">
              <span class="status-dot-indicator" />
              {{ statusMeta(row.status).label }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="发布时间" width="130">
          <template #default="{ row }">
            <span class="post-date">{{ formatDate(row.publishedAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" align="right">
          <template #default="{ row }">
            <div class="action-btns">
              <el-button
                text
                size="small"
                :icon="EditPen"
                @click="router.push(`/posts/${row.id}/edit`)"
              >
                编辑
              </el-button>
              <el-button
                text
                size="small"
                type="danger"
                :icon="Delete"
                @click="handleDelete(row.id)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Pagination -->
    <div v-if="filteredPosts.length > pageSize" class="pagination-wrap">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filteredPosts.length"
        layout="prev, pager, next"
        small
      />
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ===== Header ===== */
.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
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

.page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.page-count {
  font-size: 13px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

/* ===== Toolbar ===== */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.toolbar-search {
  max-width: 280px;
}

.toolbar-select {
  max-width: 150px;
}

/* ===== Table ===== */
.table-wrap {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.post-table {
  --el-table-border-color: transparent;
  --el-table-header-bg-color: transparent;
}

.post-table :deep(th.el-table__cell) {
  height: 44px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border) !important;
}

.post-table :deep(td.el-table__cell) {
  height: 52px;
  padding: 0 14px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f0f1f5;
}

.post-table :deep(.el-table__row:last-child td) {
  border-bottom: none !important;
}

.post-title {
  font-weight: 500;
  color: var(--color-text-primary);
}

.post-date {
  color: var(--color-text-secondary);
  font-size: 13px;
}

/* ===== Status Dots ===== */
.status-dot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
}

.status-dot-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-text-muted);
  flex-shrink: 0;
}

.status-dot.pub .status-dot-indicator {
  background: var(--color-success);
}

.status-dot.pub {
  color: var(--color-success-text);
}

.status-dot.draft .status-dot-indicator {
  background: var(--color-warning);
}

.status-dot.draft {
  color: var(--color-warning-text);
}

.status-dot.arch .status-dot-indicator {
  background: var(--color-text-muted);
}

.status-dot.arch {
  color: var(--color-text-secondary);
}

/* ===== Actions ===== */
.action-btns {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ===== Pagination ===== */
.pagination-wrap {
  display: flex;
  justify-content: center;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .page-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar {
    flex-wrap: wrap;
  }

  .toolbar-group {
    flex-wrap: wrap;
  }

  .toolbar-search {
    max-width: 100%;
    flex: 1;
  }
}
</style>
