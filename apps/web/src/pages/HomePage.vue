<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { PostListItemDto } from '@rainy/shared';
import { fetchPosts } from '../services/content';
import { setSeo } from '../utils/seo';

const loading = ref(false);
const errorMessage = ref('');
const posts = ref<PostListItemDto[]>([]);

const featuredPost = computed(() => posts.value[0] || null);
const featuredCoverPost = computed(() => posts.value.find((item) => item.coverUrl) || featuredPost.value);
const latestPosts = computed(() => (posts.value.length > 1 ? posts.value.slice(1, 6) : posts.value.slice(0, 1)));
const recommendedPosts = computed(() => posts.value.slice(0, 3));
const totalTagCount = computed(() => {
  const allTags = new Set<string>();
  for (const post of posts.value) {
    for (const tag of post.tags) {
      allTags.add(tag);
    }
  }
  return allTags.size;
});
const tagCloud = computed(() => {
  const counter = new Map<string, number>();

  for (const post of posts.value) {
    for (const tag of post.tags) {
      counter.set(tag, (counter.get(tag) || 0) + 1);
    }
  }

  return [...counter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16)
    .map(([name, count]) => ({ name, count }));
});

function formatDate(value?: string) {
  if (!value) return 'Draft';
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}.${month}.${day}`;
}

const fallbackImage =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80';

async function bootstrap() {
  loading.value = true;
  errorMessage.value = '';
  try {
    posts.value = await fetchPosts();
    setSeo({
      title: 'Rainy Cole - 首页',
      description: '最新文章、推荐阅读与标签云',
      path: '/'
    });
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '首页加载失败';
    setSeo({
      title: 'Rainy Cole - 首页',
      description: '内容首页',
      path: '/'
    });
  } finally {
    loading.value = false;
  }
}

onMounted(bootstrap);
</script>

<template>
  <section class="home-page">
    <section class="hero-blue">
      <div class="content-wrap home-wrap hero-grid">
        <div class="home-hero-copy-block">
          <p class="home-hero-subtitle">深度记录，长期存档</p>
          <h1 class="home-hero-title">
            <span>Deep Essays</span>
            <span>Long-Term</span>
            <span>Archive</span>
          </h1>
          <p class="home-hero-copy">
            围绕技术、写作与长期主义展开更新。先看摘要，再决定哪些内容值得你认真读完。
          </p>
          <div class="home-hero-actions">
            <RouterLink to="/posts" class="btn-secondary">浏览文章</RouterLink>
            <RouterLink to="/search" class="btn-secondary">快速搜索</RouterLink>
          </div>
        </div>

        <div class="hero-stage">
          <div class="meta-rail">
            <span class="meta-pill">已发布 {{ posts.length }} 篇</span>
            <span class="meta-pill">标签 {{ totalTagCount }} 个</span>
          </div>
          <div class="media-frame">
            <img :src="featuredCoverPost?.coverUrl || fallbackImage" :alt="featuredCoverPost?.title || 'Featured image'" />
            <div class="media-frame-overlay"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="band band-strong">
      <div class="content-wrap home-wrap home-recent-grid">
        <div class="home-recent-head">
          <p class="eyebrow">Latest updates</p>
          <h2 class="home-recent-title">最新更新</h2>
          <p class="home-recent-copy">
            先看标题和摘要，再打开值得深读的内容。
          </p>
        </div>

        <div class="home-recent-list-wrap">
          <div v-if="loading" class="muted">Loading posts...</div>
          <div v-else-if="errorMessage" class="muted text-red-600">{{ errorMessage }}</div>
          <div v-else class="home-recent-list">
            <RouterLink
              v-for="post in latestPosts"
              :key="post.id"
              :to="`/posts/${post.slug}`"
              class="card-link-reset"
            >
              <article class="home-recent-item">
                <div class="home-recent-meta">
                  <p class="home-recent-date">{{ formatDate(post.publishedAt) }}</p>
                  <img
                    v-if="post.coverUrl"
                    :src="post.coverUrl"
                    :alt="post.title"
                    class="home-recent-cover"
                  />
                </div>
                <div class="home-recent-item-body">
                  <h2 class="home-recent-item-title">{{ post.title }}</h2>
                  <p class="home-recent-item-summary">{{ post.summary }}</p>
                </div>
              </article>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="page-band">
      <div class="content-wrap home-wrap space-y-5">
        <p class="eyebrow">推荐阅读</p>
        <div class="tile-grid">
          <RouterLink
            v-for="post in recommendedPosts"
            :key="post.id"
            :to="`/posts/${post.slug}`"
            class="card-link-reset"
          >
            <article class="tile-card home-card">
              <p class="home-recommend-date">{{ formatDate(post.publishedAt) }}</p>
              <h2 class="list-title mt-3">{{ post.title }}</h2>
              <p class="list-summary">{{ post.summary }}</p>
            </article>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="page-band">
      <div class="content-wrap home-wrap space-y-5">
        <p class="eyebrow">标签</p>
        <div class="chip-row">
          <RouterLink
            v-for="item in tagCloud"
            :key="item.name"
            class="chip-btn"
            :to="`/posts?tag=${encodeURIComponent(item.name)}`"
          >
            {{ item.name }} · {{ item.count }}
          </RouterLink>
        </div>
      </div>
    </section>
  </section>
</template>
