<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import type { PostDetailDto } from '@rainy/shared';
import { fetchPostDetail } from '../services/content';

const route = useRoute();
const loading = ref(false);
const errorMessage = ref('');
const post = ref<PostDetailDto | null>(null);

const slug = computed(() => String(route.params.slug || ''));
const contentParagraphs = computed(() =>
  (post.value?.content || '')
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
);

const readingMinutes = computed(() => {
  const chars = (post.value?.content || '').length;
  return Math.max(1, Math.ceil(chars / 420));
});

function formatDate(value?: string) {
  if (!value) return '未发布';
  return new Date(value).toLocaleDateString('zh-CN');
}

async function loadPost() {
  if (!slug.value) return;
  loading.value = true;
  errorMessage.value = '';
  post.value = null;
  try {
    post.value = await fetchPostDetail(slug.value);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '文章加载失败';
  } finally {
    loading.value = false;
  }
}

onMounted(loadPost);
watch(slug, loadPost);
</script>

<template>
  <article>
    <section class="page-hero">
      <div class="page-hero-inner space-y-4">
        <RouterLink to="/posts" class="btn-secondary">返回文章列表</RouterLink>
        <template v-if="loading">
          <p class="page-kicker">Loading</p>
          <h1 class="page-title">Loading Post</h1>
        </template>
        <template v-else-if="errorMessage">
          <p class="page-kicker">Error</p>
          <h1 class="page-title">Load Failed</h1>
          <p class="page-copy">{{ errorMessage }}</p>
        </template>
        <template v-else-if="post">
          <p class="page-kicker">{{ formatDate(post.publishedAt) }} · {{ post.categories[0] || '未分类' }}</p>
          <h1 class="page-title">{{ post.title }}</h1>
          <p class="page-copy">{{ post.summary }}</p>
        </template>
      </div>
    </section>

    <section v-if="post && !loading" class="page-band">
      <div class="content-wrap detail-grid">
        <aside class="meta-panel">
          <p class="eyebrow">Meta</p>
          <p class="muted mt-3">作者：{{ post.authorName }}</p>
          <p class="muted">发布时间：{{ formatDate(post.publishedAt) }}</p>
          <p class="muted">阅读时长：约 {{ readingMinutes }} 分钟</p>
          <p class="muted">标签：{{ post.tags.join('、') || '无' }}</p>
        </aside>

        <section class="reading-panel">
          <p v-for="(line, index) in contentParagraphs" :key="`${post.id}-${index}`">{{ line }}</p>
        </section>
      </div>
    </section>
  </article>
</template>
