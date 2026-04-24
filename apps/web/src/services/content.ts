import type { CategoryDto, PostDetailDto, PostListItemDto, SiteSettings, TagDto } from '@rainy/shared';
import { apiGet } from './api';

export function fetchPosts() {
  return apiGet<PostListItemDto[]>('/posts');
}

export function fetchPostDetail(slug: string) {
  return apiGet<PostDetailDto>(`/posts/${slug}`);
}

export function fetchCategories() {
  return apiGet<CategoryDto[]>('/categories');
}

export function fetchTags() {
  return apiGet<TagDto[]>('/tags');
}

export function fetchSiteSettings() {
  return apiGet<SiteSettings>('/site-settings');
}

export function searchPosts(keyword: string, options?: { category?: string; tag?: string; limit?: number }) {
  const query = new URLSearchParams();
  query.set('keyword', keyword);

  if (options?.category) {
    query.set('category', options.category);
  }

  if (options?.tag) {
    query.set('tag', options.tag);
  }

  if (options?.limit) {
    query.set('limit', String(options.limit));
  }

  return apiGet<{ keyword: string; total: number; hits: PostListItemDto[] }>(
    `/search/posts?${query.toString()}`
  );
}
