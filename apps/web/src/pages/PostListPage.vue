<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { CategoryDto, PostListItemDto, TagDto } from '@rainy/shared';
import { fetchCategories, fetchPosts, fetchTags } from '../services/content';

type SortMode = 'newest' | 'oldest' | 'title';
type ViewMode = 'list' | 'grid';

const loading = ref(false);
const errorMessage = ref('');
const posts = ref<PostListItemDto[]>([]);
const categories = ref<CategoryDto[]>([]);
const tags = ref<TagDto[]>([]);

const keyword = ref('');
const activeCategory = ref('');
const activeTag = ref('');
const sortMode = ref<SortMode>('newest');
const viewMode = ref<ViewMode>('list');

const filteredPosts = computed(() =>
  posts.value.filter((post) => {
    const categoryMatched =
      !activeCategory.value || post.categories.some((category) => category === activeCategory.value);
    const tagMatched = !activeTag.value || post.tags.some((tag) => tag === activeTag.value);
    const key = keyword.value.trim().toLowerCase();
    const keywordMatched =
      !key || post.title.toLowerCase().includes(key) || post.summary.toLowerCase().includes(key);
    return categoryMatched && tagMatched && keywordMatched;
  })
);

const sortedPosts = computed(() => {
  const items = [...filteredPosts.value];
  if (sortMode.value === 'title') {
    return items.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));
  }
  return items.sort((a, b) => {
    const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return sortMode.value === 'newest' ? tb - ta : ta - tb;
  });
});

function formatDate(value?: string) {
  if (!value) return '未发布';
  return new Date(value).toLocaleDateString('zh-CN');
}

function clearFilters() {
  keyword.value = '';
  activeCategory.value = '';
  activeTag.value = '';
}

async function bootstrap() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const [postList, categoryList, tagList] = await Promise.all([
      fetchPosts(),
      fetchCategories(),
      fetchTags()
    ]);
    posts.value = postList;
    categories.value = categoryList;
    tags.value = tagList;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '文章加载失败';
  } finally {
    loading.value = false;
  }
}

onMounted(bootstrap);
</script>

<template>
  <section>
    <section class="page-hero">
      <div class="page-hero-inner">
        <p class="page-kicker">Post Archive</p>
        <h1 class="page-title">All Posts</h1>
        <p class="page-copy !max-w-none whitespace-nowrap">先搜索关键词，再通过视图模式、分类与标签逐步缩小结果范围。</p>
        <div class="page-toolbar mt-5">
          <input v-model="keyword" class="page-field lg:col-span-1" placeholder="Search title or summary..." />
          <button class="btn-secondary" :class="{ 'chip-active': viewMode === 'list' }" @click="viewMode = 'list'">List</button>
          <button class="btn-secondary" :class="{ 'chip-active': viewMode === 'grid' }" @click="viewMode = 'grid'">Grid</button>
        </div>
      </div>
    </section>

    <section class="page-band">
      <div class="content-wrap space-y-6">
        <div class="space-y-1">
          <p class="eyebrow">Filters</p>
          <h2 class="title-lg">筛选控制台</h2>
        </div>
        <div class="chip-row">
          <button class="chip-btn" :class="{ active: sortMode === 'newest' }" @click="sortMode = 'newest'">Newest</button>
          <button class="chip-btn" :class="{ active: sortMode === 'oldest' }" @click="sortMode = 'oldest'">Oldest</button>
          <button class="chip-btn" :class="{ active: sortMode === 'title' }" @click="sortMode = 'title'">Title</button>
          <button class="chip-btn" :class="{ active: activeCategory === '' }" @click="activeCategory = ''">All Categories</button>
          <button
            v-for="category in categories"
            :key="category.id"
            class="chip-btn"
            :class="{ active: activeCategory === category.name }"
            @click="activeCategory = activeCategory === category.name ? '' : category.name"
            >
              {{ category.name }}
            </button>
          <button class="chip-btn" :class="{ active: activeTag === '' }" @click="activeTag = ''">All Tags</button>
          <button
            v-for="tag in tags"
            :key="tag.id"
            class="chip-btn"
            :class="{ active: activeTag === tag.name }"
            @click="activeTag = activeTag === tag.name ? '' : tag.name"
            >
              {{ tag.name }}
            </button>
          <button class="btn-ghost" @click="clearFilters">重置</button>
        </div>

        <p class="eyebrow">{{ sortedPosts.length }} 条结果</p>
        <div v-if="loading" class="muted">正在加载文章...</div>
        <div v-else-if="errorMessage" class="muted text-red-600">{{ errorMessage }}</div>
        <div v-else-if="!sortedPosts.length" class="muted">当前筛选条件下暂无文章。</div>

        <div v-else-if="viewMode === 'list'" class="list-shell">
          <article v-for="post in sortedPosts" :key="post.id" class="list-row">
            <p class="list-date">{{ formatDate(post.publishedAt) }} · {{ post.categories[0] || '未分类' }}</p>
            <div class="list-body">
              <RouterLink :to="`/posts/${post.slug}`">
                <h2 class="list-title">{{ post.title }}</h2>
              </RouterLink>
              <p class="list-summary">{{ post.summary }}</p>
            </div>
          </article>
        </div>

        <div v-else class="tile-grid">
          <article v-for="post in sortedPosts" :key="post.id" class="tile-card">
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
