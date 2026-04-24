<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import type { CategoryDto, PostListItemDto, TagDto } from '@rainy/shared';
import { fetchCategories, fetchTags, searchPosts } from '../services/content';
import AppSelect from '../components/AppSelect.vue';
import { setSeo } from '../utils/seo';

const keyword = ref('');
const loading = ref(false);
const searched = ref(false);
const errorMessage = ref('');
const categories = ref<CategoryDto[]>([]);
const tags = ref<TagDto[]>([]);
const activeCategory = ref('');
const activeTag = ref('');
const result = ref<{ total: number; hits: PostListItemDto[] }>({ total: 0, hits: [] });

const categoryOptions = computed(() => [
  { label: '全部分类', value: '' },
  ...categories.value.map((item) => ({ label: item.name, value: item.name }))
]);

const tagOptions = computed(() => [
  { label: '全部标签', value: '' },
  ...tags.value.map((item) => ({ label: item.name, value: item.name }))
]);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function formatDate(value?: string) {
  if (!value) return '未发布';
  return new Date(value).toLocaleDateString('zh-CN');
}

async function executeSearch() {
  const query = keyword.value.trim();
  searched.value = true;
  errorMessage.value = '';

  if (query.length < 2) {
    result.value = { total: 0, hits: [] };
    return;
  }

  loading.value = true;
  try {
    const response = await searchPosts(query, {
      category: activeCategory.value || undefined,
      tag: activeTag.value || undefined,
      limit: 20
    });
    result.value = { total: response.total, hits: response.hits };
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '搜索失败';
  } finally {
    loading.value = false;
  }
}

watch([keyword, activeCategory, activeTag], () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => executeSearch(), 250);
});

onMounted(async () => {
  setSeo({
    title: 'Rainy Cole - 搜索',
    description: '按关键词、分类和标签搜索文章',
    path: '/search'
  });
  const [categoryList, tagList] = await Promise.all([fetchCategories(), fetchTags()]);
  categories.value = categoryList;
  tags.value = tagList;
});
</script>

<template>
  <section>
    <section class="page-hero">
      <div class="page-hero-inner space-y-5">
        <p class="page-kicker">搜索面板</p>
        <h1 class="page-title">Find Content</h1>
        <p class="page-copy !max-w-none whitespace-nowrap">输入关键词后，再结合分类和标签筛选，快速定位目标内容。</p>
        <div class="page-toolbar lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.9fr)]">
          <input v-model="keyword" class="page-field" placeholder="输入关键词..." />
          <AppSelect v-model="activeCategory" :options="categoryOptions" placeholder="全部分类" />
          <AppSelect v-model="activeTag" :options="tagOptions" placeholder="全部标签" />
        </div>
      </div>
    </section>

    <section class="page-band">
      <div class="content-wrap space-y-4">
        <p class="eyebrow">{{ result.total }} results</p>
        <div v-if="errorMessage" class="muted text-red-600">{{ errorMessage }}</div>
        <div v-else-if="loading" class="muted">Searching...</div>
        <div v-else-if="searched && !result.hits.length" class="muted">No matched result.</div>

        <div v-else class="tile-grid">
          <article v-for="post in result.hits" :key="post.id" class="tile-card">
            <p class="story-meta">{{ formatDate(post.publishedAt) }}</p>
            <RouterLink :to="`/posts/${post.slug}`">
              <h2 class="list-title mt-3">{{ post.title }}</h2>
            </RouterLink>
            <p class="list-summary">{{ post.summary }}</p>
          </article>
        </div>
      </div>
    </section>
  </section>
</template>
