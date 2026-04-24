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
const latestPosts = computed(() => posts.value.slice(1, 6));
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
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
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
  <section>
    <section class="hero-blue">
      <div class="content-wrap hero-grid">
        <div>
          <p class="home-kicker">深度论述、长期存档</p>
          <h1 class="home-hero-title">
            Deep Essays
            <br />
            Long-term Archive
          </h1>
          <div class="mt-5 flex flex-wrap gap-3">
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
            <img :src="featuredPost?.coverUrl || fallbackImage" :alt="featuredPost?.title || 'Featured image'" />
          </div>
        </div>
      </div>
    </section>

    <section class="band band-strong">
      <div class="content-wrap home-recent-grid">
        <div class="home-recent-head">
          <p class="home-kicker home-kicker--recent">最新文章</p>
          <h2 class="home-recent-title">最新更新</h2>
          <p class="home-recent-copy">
            先看标题和摘要，再打开真正值得深读的内容。
          </p>
        </div>

        <div class="home-recent-list-wrap">
          <div v-if="loading" class="muted">Loading posts...</div>
          <div v-else-if="errorMessage" class="muted text-red-600">{{ errorMessage }}</div>
          <div v-else class="home-recent-list">
            <article v-for="post in latestPosts" :key="post.id" class="home-recent-item">
              <p class="home-recent-date">{{ formatDate(post.publishedAt) }}</p>
              <div class="home-recent-item-body">
                <RouterLink :to="`/posts/${post.slug}`">
                  <h2 class="home-recent-item-title">{{ post.title }}</h2>
                </RouterLink>
                <p class="home-recent-item-summary">{{ post.summary }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="page-band">
      <div class="content-wrap space-y-5">
        <p class="eyebrow">推荐阅读</p>
        <div class="tile-grid">
          <article v-for="post in recommendedPosts" :key="post.id" class="tile-card">
            <p class="home-recommend-date">{{ formatDate(post.publishedAt) }}</p>
            <RouterLink :to="`/posts/${post.slug}`">
              <h2 class="list-title mt-3">{{ post.title }}</h2>
            </RouterLink>
            <p class="list-summary">{{ post.summary }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="page-band">
      <div class="content-wrap space-y-5">
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
