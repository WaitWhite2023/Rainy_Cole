<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { PostListItemDto } from '@rainy/shared';
import { fetchPosts } from '../services/content';

const loading = ref(false);
const errorMessage = ref('');
const posts = ref<PostListItemDto[]>([]);

const featuredPost = computed(() => posts.value[0] || null);
const latestPosts = computed(() => posts.value.slice(1, 6));

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
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '首页加载失败';
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
          <p class="home-kicker">Editorial Archive</p>
          <p class="home-kicker-sub">内容归档</p>
          <h1 class="home-hero-title">
            Deep Essays
            <br />
            Long-term Archive
          </h1>
          <div class="mt-5 flex flex-wrap gap-3">
            <RouterLink to="/posts" class="btn-secondary">Browse Posts</RouterLink>
            <RouterLink to="/search" class="btn-secondary">Quick Search</RouterLink>
          </div>
        </div>

        <div class="hero-stage">
          <div class="meta-rail">
            <span class="meta-pill">{{ posts.length }} Posts</span>
            <span class="meta-pill">{{ featuredPost?.categories?.[0] || 'Archive' }}</span>
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
          <p class="home-kicker">Recent Posts</p>
          <h2 class="home-recent-title">Latest Updates</h2>
          <p class="home-recent-copy">
            Start with title and summary, then open only the posts worth deep reading.
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
  </section>
</template>
