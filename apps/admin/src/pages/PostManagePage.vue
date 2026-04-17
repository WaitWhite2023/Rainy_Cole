<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { PostListItemDto } from '@rainy/shared';
import { deletePost, fetchAdminPosts } from '../services/content';

const router = useRouter();
const loading = ref(false);
const posts = ref<PostListItemDto[]>([]);

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
  <section class="space-y-8">
    <div class="admin-hero flex flex-col gap-5 rounded-[2rem] border border-white/8 px-7 py-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="admin-eyebrow">Posts</p>
        <h1 class="mt-4 font-['Bodoni_Moda'] text-5xl leading-[0.96] text-white">文章管理</h1>
        <p class="mt-4 max-w-2xl text-sm leading-8 text-white/58">
          当前已经接入后台文章列表、编辑和删除能力。后续这里会继续承接筛选、状态切换、搜索和分页。
        </p>
      </div>
      <el-button type="primary" size="large" @click="router.push('/posts/new')">新建文章</el-button>
    </div>

    <div class="admin-panel rounded-[1.8rem] p-4">
      <el-table v-loading="loading" :data="posts" class="admin-table" stripe>
        <el-table-column prop="title" label="标题" min-width="220" />
        <el-table-column prop="slug" label="Slug" min-width="180" />
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column prop="publishedAt" label="发布时间" min-width="180" />
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <div class="flex gap-2">
              <el-button size="small" @click="router.push(`/posts/${row.id}/edit`)">编辑</el-button>
              <el-button size="small" type="danger" plain @click="handleDelete(row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>
